"use strict";
// FENIX Project Manager - Agent Orchestrator
// Central coordination service for multi-agent workflows
// Created: January 6, 2026
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentOrchestrator = void 0;
exports.createAgentOrchestrator = createAgentOrchestrator;
/**
 * Agent Orchestrator
 * Coordinates multiple agents to execute complex workflows
 */
class AgentOrchestrator {
    workflows;
    activeWorkflows;
    agentQueues;
    agentBusy;
    startTime;
    completedWorkflowCount;
    failedWorkflowCount;
    constructor() {
        this.workflows = new Map();
        this.activeWorkflows = new Set();
        this.agentQueues = new Map();
        this.agentBusy = new Map();
        this.startTime = new Date();
        this.completedWorkflowCount = 0;
        this.failedWorkflowCount = 0;
        // Initialize agent queues
        const agents = ['powerpoint', 'excel', 'word', 'visual-design'];
        agents.forEach(agent => {
            this.agentQueues.set(agent, []);
            this.agentBusy.set(agent, false);
        });
    }
    /**
     * Execute a workflow
     */
    async executeWorkflow(workflow, options) {
        const workflowId = workflow.id;
        // Store workflow
        this.workflows.set(workflowId, workflow);
        this.activeWorkflows.add(workflowId);
        // Update workflow status
        workflow.status = 'running';
        workflow.startedAt = new Date();
        try {
            // Determine execution mode
            const mode = options?.executionMode || this.determineExecutionMode(workflow);
            // Execute based on mode
            let stepResults;
            if (mode === 'sequential') {
                stepResults = await this.executeSequential(workflow, options);
            }
            else if (mode === 'parallel') {
                stepResults = await this.executeParallel(workflow, options);
            }
            else {
                stepResults = await this.executeMixed(workflow, options);
            }
            // Calculate duration
            const duration = Date.now() - workflow.startedAt.getTime();
            // Collect outputs
            const outputs = this.collectOutputs(stepResults);
            // Update workflow status
            workflow.status = 'completed';
            workflow.completedAt = new Date();
            this.completedWorkflowCount++;
            const result = {
                workflowId,
                status: 'completed',
                steps: stepResults,
                outputs,
                duration
            };
            workflow.results = result;
            return result;
        }
        catch (error) {
            // Handle workflow failure
            const duration = Date.now() - (workflow.startedAt?.getTime() || Date.now());
            workflow.status = 'failed';
            workflow.error = error instanceof Error ? error.message : String(error);
            workflow.completedAt = new Date();
            this.failedWorkflowCount++;
            const result = {
                workflowId,
                status: 'failed',
                steps: workflow.steps.map(step => ({
                    stepId: step.id,
                    status: step.status,
                    outputs: step.outputs,
                    error: step.error,
                    duration: step.duration || 0
                })),
                outputs: {},
                duration,
                error: workflow.error
            };
            workflow.results = result;
            return result;
        }
        finally {
            // Cleanup
            this.activeWorkflows.delete(workflowId);
        }
    }
    /**
     * Execute steps sequentially
     */
    async executeSequential(workflow, options) {
        const results = [];
        for (const step of workflow.steps) {
            try {
                const result = await this.executeStep(step, workflow, options);
                results.push(result);
                // Check if we should continue on error
                if (result.status === 'failed' && !options?.continueOnError) {
                    throw new Error(`Step ${step.id} failed: ${result.error}`);
                }
            }
            catch (error) {
                if (!options?.continueOnError) {
                    throw error;
                }
            }
        }
        return results;
    }
    /**
     * Execute steps in parallel
     */
    async executeParallel(workflow, options) {
        const maxParallel = options?.maxParallelSteps || workflow.steps.length;
        const results = [];
        const executing = [];
        for (const step of workflow.steps) {
            // Wait if we've reached max parallel limit
            if (executing.length >= maxParallel) {
                const result = await Promise.race(executing);
                results.push(result);
                executing.splice(executing.findIndex(p => p === Promise.resolve(result)), 1);
            }
            // Start executing step
            const promise = this.executeStep(step, workflow, options);
            executing.push(promise);
        }
        // Wait for remaining steps
        const remaining = await Promise.all(executing);
        results.push(...remaining);
        return results;
    }
    /**
     * Execute steps in mixed mode (respecting dependencies)
     */
    async executeMixed(workflow, options) {
        const results = [];
        const completed = new Set();
        const executing = new Map();
        // Build dependency graph (for future use)
        // const dependencyMap = this.buildDependencyMap(workflow);
        // Execute steps as dependencies are satisfied
        while (completed.size < workflow.steps.length) {
            // Find steps ready to execute
            const readySteps = workflow.steps.filter(step => !completed.has(step.id) &&
                !executing.has(step.id) &&
                this.areDependenciesSatisfied(step, completed));
            if (readySteps.length === 0 && executing.size === 0) {
                throw new Error('Workflow deadlock detected - circular dependencies');
            }
            // Start executing ready steps
            for (const step of readySteps) {
                const promise = this.executeStep(step, workflow, options);
                executing.set(step.id, promise);
                // Handle completion
                promise.then(result => {
                    results.push(result);
                    completed.add(step.id);
                    executing.delete(step.id);
                }).catch(error => {
                    if (!options?.continueOnError) {
                        throw error;
                    }
                    completed.add(step.id);
                    executing.delete(step.id);
                });
            }
            // Wait for at least one to complete
            if (executing.size > 0) {
                await Promise.race(Array.from(executing.values()));
            }
        }
        return results;
    }
    /**
     * Execute a single step
     */
    async executeStep(step, workflow, options) {
        step.status = 'running';
        step.startTime = new Date();
        try {
            // Apply data mappings from dependencies
            const inputs = this.applyDataMappings(step, workflow);
            // Create task
            const task = {
                id: step.id,
                agent: step.agent,
                action: step.task,
                inputs,
                timeout: options?.timeout
            };
            // Delegate to agent
            const taskResult = await this.delegateTask(task, options);
            // Calculate duration
            const duration = Date.now() - step.startTime.getTime();
            // Update step
            step.status = taskResult.success ? 'completed' : 'failed';
            step.outputs = taskResult.outputs;
            step.error = taskResult.error;
            step.endTime = new Date();
            step.duration = duration;
            return {
                stepId: step.id,
                status: step.status,
                outputs: step.outputs,
                error: step.error,
                duration
            };
        }
        catch (error) {
            const duration = Date.now() - (step.startTime?.getTime() || Date.now());
            step.status = 'failed';
            step.error = error instanceof Error ? error.message : String(error);
            step.endTime = new Date();
            step.duration = duration;
            // Attempt recovery if enabled
            if (options?.retryOnFailure) {
                return await this.recoverFromFailure(step, workflow, error, options);
            }
            return {
                stepId: step.id,
                status: 'failed',
                error: step.error,
                duration
            };
        }
    }
    /**
     * Delegate task to specific agent
     */
    async delegateTask(task, _options) {
        const startTime = Date.now();
        try {
            // Mark agent as busy
            this.agentBusy.set(task.agent, true);
            // Execute task based on agent type
            let outputs;
            switch (task.agent) {
                case 'powerpoint':
                    outputs = await this.executePowerPointTask(task);
                    break;
                case 'excel':
                    outputs = await this.executeExcelTask(task);
                    break;
                case 'word':
                    outputs = await this.executeWordTask(task);
                    break;
                case 'visual-design':
                    outputs = await this.executeVisualDesignTask(task);
                    break;
                default:
                    throw new Error(`Unknown agent type: ${task.agent}`);
            }
            const duration = Date.now() - startTime;
            return {
                taskId: task.id,
                success: true,
                outputs,
                duration
            };
        }
        catch (error) {
            const duration = Date.now() - startTime;
            return {
                taskId: task.id,
                success: false,
                error: error instanceof Error ? error.message : String(error),
                duration
            };
        }
        finally {
            // Mark agent as available
            this.agentBusy.set(task.agent, false);
        }
    }
    /**
     * Execute PowerPoint task
     */
    async executePowerPointTask(task) {
        // Import PowerPoint agent dynamically
        const { PowerPointAgent } = await Promise.resolve().then(() => __importStar(require('../agents/PowerPointAgent')));
        const agent = new PowerPointAgent();
        // Execute based on action
        if (task.action === 'generate' || task.action === 'Create status presentation') {
            return await agent.generatePresentation(task.inputs);
        }
        throw new Error(`Unknown PowerPoint action: ${task.action}`);
    }
    /**
     * Execute Excel task
     */
    async executeExcelTask(task) {
        // Import Excel agent dynamically
        const { ExcelAgent } = await Promise.resolve().then(() => __importStar(require('../agents/ExcelAgent')));
        const agent = new ExcelAgent();
        // Execute based on action
        if (task.action === 'generate' || task.action.includes('dashboard') || task.action.includes('analysis')) {
            return await agent.generateWorkbook(task.inputs);
        }
        throw new Error(`Unknown Excel action: ${task.action}`);
    }
    /**
     * Execute Word task
     */
    async executeWordTask(task) {
        // Import Word agent dynamically
        const { WordAgent } = await Promise.resolve().then(() => __importStar(require('../agents/WordAgent')));
        const agent = new WordAgent();
        // Execute based on action
        if (task.action === 'generate' || task.action.includes('summary') || task.action.includes('document')) {
            return await agent.generateDocument(task.inputs);
        }
        throw new Error(`Unknown Word action: ${task.action}`);
    }
    /**
     * Execute Visual Design task
     */
    async executeVisualDesignTask(task) {
        // Import Visual Design agent dynamically
        const { VisualDesignAgent } = await Promise.resolve().then(() => __importStar(require('../agents/VisualDesignAgent')));
        new VisualDesignAgent(); // Agent instantiated for future use
        // Execute based on action
        if (task.action.includes('chart') || task.action.includes('graphic') || task.action.includes('diagram')) {
            // For now, return placeholder
            return {
                charts: task.inputs.data ? ['chart1.svg', 'chart2.svg'] : [],
                message: 'Visual design task completed'
            };
        }
        throw new Error(`Unknown Visual Design action: ${task.action}`);
    }
    /**
     * Recover from step failure
     */
    async recoverFromFailure(step, workflow, error, options) {
        const maxRetries = options?.maxRetries || 3;
        let retryCount = 0;
        while (retryCount < maxRetries) {
            retryCount++;
            try {
                // Wait before retry (exponential backoff)
                await this.delay(Math.pow(2, retryCount) * 1000);
                // Retry the step
                const inputs = this.applyDataMappings(step, workflow);
                const task = {
                    id: `${step.id}-retry-${retryCount}`,
                    agent: step.agent,
                    action: step.task,
                    inputs
                };
                const taskResult = await this.delegateTask(task, options);
                if (taskResult.success) {
                    step.status = 'completed';
                    step.outputs = taskResult.outputs;
                    return {
                        stepId: step.id,
                        status: 'completed',
                        outputs: taskResult.outputs,
                        duration: taskResult.duration
                    };
                }
            }
            catch (retryError) {
                // Continue to next retry
            }
        }
        // All retries failed
        return {
            stepId: step.id,
            status: 'failed',
            error: `Failed after ${maxRetries} retries: ${error.message}`,
            duration: 0
        };
    }
    /**
     * Determine optimal execution mode
     */
    determineExecutionMode(workflow) {
        // If no dependencies, use parallel
        if (workflow.dependencies.length === 0) {
            return 'parallel';
        }
        // If all steps have dependencies, use sequential
        const stepsWithDeps = workflow.steps.filter(step => step.dependencies.length > 0);
        if (stepsWithDeps.length === workflow.steps.length) {
            return 'sequential';
        }
        // Otherwise use mixed mode
        return 'mixed';
    }
    /**
     * Build dependency map
     */
    buildDependencyMap(workflow) {
        const map = new Map();
        workflow.steps.forEach(step => {
            map.set(step.id, new Set(step.dependencies));
        });
        return map;
    }
    /**
     * Check if step dependencies are satisfied
     */
    areDependenciesSatisfied(step, completed) {
        return step.dependencies.every(depId => completed.has(depId));
    }
    /**
     * Apply data mappings from dependencies
     */
    applyDataMappings(step, workflow) {
        const inputs = { ...step.inputs };
        // Find dependencies for this step
        const deps = workflow.dependencies.filter(dep => dep.toStep === step.id);
        deps.forEach(dep => {
            const sourceStep = workflow.steps.find(s => s.id === dep.fromStep);
            if (sourceStep && sourceStep.outputs) {
                // Apply data mappings
                Object.entries(dep.dataMapping).forEach(([targetKey, sourceKey]) => {
                    const value = this.getNestedValue(sourceStep.outputs, sourceKey);
                    if (value !== undefined) {
                        inputs[targetKey] = value;
                    }
                });
            }
        });
        return inputs;
    }
    /**
     * Get nested value from object
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    /**
     * Collect outputs from step results
     */
    collectOutputs(stepResults) {
        const outputs = {};
        stepResults.forEach(result => {
            if (result.outputs) {
                outputs[result.stepId] = result.outputs;
            }
        });
        return outputs;
    }
    /**
     * Get workflow status
     */
    getWorkflow(workflowId) {
        return this.workflows.get(workflowId);
    }
    /**
     * Get all workflows
     */
    getAllWorkflows() {
        return Array.from(this.workflows.values());
    }
    /**
     * Get active workflows
     */
    getActiveWorkflows() {
        return Array.from(this.activeWorkflows)
            .map(id => this.workflows.get(id))
            .filter((w) => w !== undefined);
    }
    /**
     * Get orchestrator status
     */
    getStatus() {
        const agents = ['powerpoint', 'excel', 'word', 'visual-design'];
        return {
            activeWorkflows: this.activeWorkflows.size,
            completedWorkflows: this.completedWorkflowCount,
            failedWorkflows: this.failedWorkflowCount,
            agents: agents.map(agent => ({
                agent,
                available: !this.agentBusy.get(agent),
                busy: this.agentBusy.get(agent),
                queueLength: this.agentQueues.get(agent).length
            })),
            uptime: Date.now() - this.startTime.getTime()
        };
    }
    /**
     * Cancel workflow
     */
    async cancelWorkflow(workflowId) {
        const workflow = this.workflows.get(workflowId);
        if (!workflow) {
            return false;
        }
        workflow.status = 'cancelled';
        workflow.completedAt = new Date();
        this.activeWorkflows.delete(workflowId);
        return true;
    }
    /**
     * Utility: Delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.AgentOrchestrator = AgentOrchestrator;
/**
 * Create Agent Orchestrator instance
 */
function createAgentOrchestrator() {
    return new AgentOrchestrator();
}
//# sourceMappingURL=AgentOrchestrator.js.map