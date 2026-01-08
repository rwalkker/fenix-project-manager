import type { Workflow, WorkflowResult, Task, TaskResult, WorkflowOptions, OrchestratorStatus } from '../models/orchestration-types';
/**
 * Agent Orchestrator
 * Coordinates multiple agents to execute complex workflows
 */
export declare class AgentOrchestrator {
    private workflows;
    private activeWorkflows;
    private agentQueues;
    private agentBusy;
    private startTime;
    private completedWorkflowCount;
    private failedWorkflowCount;
    constructor();
    /**
     * Execute a workflow
     */
    executeWorkflow(workflow: Workflow, options?: WorkflowOptions): Promise<WorkflowResult>;
    /**
     * Execute steps sequentially
     */
    private executeSequential;
    /**
     * Execute steps in parallel
     */
    private executeParallel;
    /**
     * Execute steps in mixed mode (respecting dependencies)
     */
    private executeMixed;
    /**
     * Execute a single step
     */
    private executeStep;
    /**
     * Delegate task to specific agent
     */
    delegateTask(task: Task, _options?: WorkflowOptions): Promise<TaskResult>;
    /**
     * Execute PowerPoint task
     */
    private executePowerPointTask;
    /**
     * Execute Excel task
     */
    private executeExcelTask;
    /**
     * Execute Word task
     */
    private executeWordTask;
    /**
     * Execute Visual Design task
     */
    private executeVisualDesignTask;
    /**
     * Recover from step failure
     */
    private recoverFromFailure;
    /**
     * Determine optimal execution mode
     */
    private determineExecutionMode;
    /**
     * Build dependency map
     */
    private buildDependencyMap;
    /**
     * Check if step dependencies are satisfied
     */
    private areDependenciesSatisfied;
    /**
     * Apply data mappings from dependencies
     */
    private applyDataMappings;
    /**
     * Get nested value from object
     */
    private getNestedValue;
    /**
     * Collect outputs from step results
     */
    private collectOutputs;
    /**
     * Get workflow status
     */
    getWorkflow(workflowId: string): Workflow | undefined;
    /**
     * Get all workflows
     */
    getAllWorkflows(): Workflow[];
    /**
     * Get active workflows
     */
    getActiveWorkflows(): Workflow[];
    /**
     * Get orchestrator status
     */
    getStatus(): OrchestratorStatus;
    /**
     * Cancel workflow
     */
    cancelWorkflow(workflowId: string): Promise<boolean>;
    /**
     * Utility: Delay
     */
    private delay;
}
/**
 * Create Agent Orchestrator instance
 */
export declare function createAgentOrchestrator(): AgentOrchestrator;
//# sourceMappingURL=AgentOrchestrator.d.ts.map