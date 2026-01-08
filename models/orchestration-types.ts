// FENIX Project Manager - Orchestration Types
// Type definitions for multi-agent coordination
// Created: January 6, 2026

/**
 * Agent Types
 */
export type AgentType = 'powerpoint' | 'excel' | 'word' | 'visual-design';

/**
 * Workflow Status
 */
export type WorkflowStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

/**
 * Step Status
 */
export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

/**
 * Document Format
 */
export type DocumentFormat = 'powerpoint' | 'excel' | 'word' | 'pdf' | 'image';

/**
 * Workflow Step
 */
export interface WorkflowStep {
  id: string;
  name: string;
  agent: AgentType;
  task: string;
  inputs: Record<string, any>;
  outputs?: Record<string, any>;
  status: StepStatus;
  dependencies: string[]; // Step IDs that must complete first
  error?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // milliseconds
}

/**
 * Workflow Dependency
 */
export interface WorkflowDependency {
  fromStep: string;
  toStep: string;
  dataMapping: Record<string, string>; // Map output from fromStep to input of toStep
}

/**
 * Workflow Definition
 */
export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  dependencies: WorkflowDependency[];
  context?: ProjectContext;
  status: WorkflowStatus;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  results?: WorkflowResult;
}

/**
 * Workflow Result
 */
export interface WorkflowResult {
  workflowId: string;
  status: WorkflowStatus;
  steps: StepResult[];
  outputs: Record<string, any>;
  duration: number; // milliseconds
  error?: string;
}

/**
 * Step Result
 */
export interface StepResult {
  stepId: string;
  status: StepStatus;
  outputs?: Record<string, any>;
  error?: string;
  duration: number; // milliseconds
}

/**
 * Task Definition
 */
export interface Task {
  id: string;
  agent: AgentType;
  action: string;
  inputs: Record<string, any>;
  priority?: number;
  timeout?: number; // milliseconds
}

/**
 * Task Result
 */
export interface TaskResult {
  taskId: string;
  success: boolean;
  outputs?: Record<string, any>;
  error?: string;
  duration: number; // milliseconds
}

/**
 * Project Context
 */
export interface ProjectContext {
  projectId: string;
  projectName: string;
  description?: string;
  team?: TeamMember[];
  timeline?: ProjectTimeline;
  documents?: DocumentReference[];
  metrics?: ProjectMetric[];
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Team Member
 */
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
}

/**
 * Project Timeline
 */
export interface ProjectTimeline {
  startDate: Date;
  endDate?: Date;
  milestones?: Milestone[];
}

/**
 * Milestone
 */
export interface Milestone {
  id: string;
  name: string;
  date: Date;
  completed: boolean;
}

/**
 * Document Reference
 */
export interface DocumentReference {
  id: string;
  name: string;
  type: DocumentFormat;
  path: string;
  createdAt: Date;
  createdBy?: string;
  version?: string;
}

/**
 * Project Metric
 */
export interface ProjectMetric {
  id: string;
  name: string;
  value: number;
  unit?: string;
  target?: number;
  timestamp: Date;
}

/**
 * Agent Capability
 */
export interface AgentCapability {
  agent: AgentType;
  actions: string[];
  formats: DocumentFormat[];
  features: string[];
}

/**
 * Execution Mode
 */
export type ExecutionMode = 'sequential' | 'parallel' | 'mixed';

/**
 * Workflow Options
 */
export interface WorkflowOptions {
  executionMode?: ExecutionMode;
  maxParallelSteps?: number;
  timeout?: number; // milliseconds
  retryOnFailure?: boolean;
  maxRetries?: number;
  continueOnError?: boolean;
}

/**
 * Agent Status
 */
export interface AgentStatus {
  agent: AgentType;
  available: boolean;
  busy: boolean;
  currentTask?: string;
  queueLength: number;
}

/**
 * Orchestrator Status
 */
export interface OrchestratorStatus {
  activeWorkflows: number;
  completedWorkflows: number;
  failedWorkflows: number;
  agents: AgentStatus[];
  uptime: number; // milliseconds
}

/**
 * Workflow Template
 */
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: Omit<WorkflowStep, 'status' | 'outputs'>[];
  dependencies: WorkflowDependency[];
  requiredInputs: string[];
  expectedOutputs: string[];
  estimatedDuration: number; // milliseconds
}

/**
 * Document Request
 */
export interface DocumentRequest {
  type: 'single' | 'multi' | 'workflow';
  format?: DocumentFormat;
  template?: string;
  content: any;
  options?: any;
  context?: ProjectContext;
}

/**
 * Format Recommendation
 */
export interface FormatRecommendation {
  primaryFormat: DocumentFormat;
  template: string;
  confidence: number; // 0-1
  rationale: string;
  supportingDocs?: {
    format: DocumentFormat;
    template: string;
    rationale: string;
  }[];
}

/**
 * Workflow Creation Request
 */
export interface WorkflowCreationRequest {
  name: string;
  description?: string;
  template?: string;
  inputs: Record<string, any>;
  context?: ProjectContext;
  options?: WorkflowOptions;
}

/**
 * Error Recovery Strategy
 */
export type ErrorRecoveryStrategy = 'retry' | 'skip' | 'fallback' | 'abort';

/**
 * Error Recovery Options
 */
export interface ErrorRecoveryOptions {
  strategy: ErrorRecoveryStrategy;
  maxRetries?: number;
  retryDelay?: number; // milliseconds
  fallbackAgent?: AgentType;
  fallbackAction?: string;
}
