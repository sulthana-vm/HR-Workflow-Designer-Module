import type { Node, Edge } from "reactflow";

export type NodeKind = "start" | "task" | "approval" | "automated" | "end";

export interface KeyValue {
  id: string;
  key: string;
  value: string;
}

export interface BaseNodeConfig {
  title: string;
}

export interface TaskFormData {
  fullName: string;
  email: string;
  employeeId: string;
  project?: string;
}

export interface TaskDocument {
  id: string;
  name: string;
  required: boolean;
  fields: Record<string, string>;
  file: File | null;
}

export interface StartNodeConfig extends BaseNodeConfig {
  metadata: KeyValue[];
}

export interface TaskNodeConfig extends BaseNodeConfig {
  description?: string;
  assignee?: string;
  dueDate?: string;
  customFields: KeyValue[];
  form: TaskFormData;
  documents: TaskDocument[];
}

export interface ApprovalNodeConfig extends BaseNodeConfig {
  approverRole: string;
  autoApproveThreshold?: number;
  requiredFields: string[];
}

export interface AutomatedStepNodeConfig extends BaseNodeConfig {
  actionId?: string;
  params: Record<string, string>;
}

export interface EndNodeConfig {
  endMessage: string;
  summaryFlag: boolean;
}

export type NodeStatus = "idle" | "in-progress" | "completed" | "error";

export interface WorkflowNodeData {
  id: string;
  type: NodeKind;
  label: string;
  status?: NodeStatus;
  readyForSubmission?: boolean;
  needsResubmission?: boolean;
  config:
    | StartNodeConfig
    | TaskNodeConfig
    | ApprovalNodeConfig
    | AutomatedStepNodeConfig
    | EndNodeConfig;
}

export type RFNode = Node<WorkflowNodeData>;
export type RFEdge = Edge;

export interface WorkflowDefinition {
  nodes: Array<{
    id: string;
    type: NodeKind;
    label: string;
    config: any;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
  }>;
}

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationStep {
  nodeId: string;
  nodeLabel: string;
  status: NodeStatus;
  message: string;
  order: number;
}

export interface SimulationRequest {
  workflow: WorkflowDefinition;
  options?: {
    autoApproveNodeId?: string;
  };
}

export interface ApprovalReviewPayload {
  nodeId: string;
  nodeLabel: string;
  issues: string[];
  payload: {
    form: Record<string, any>;
    documents: Array<{
      id: string;
      name: string;
      required: boolean;
      fileName?: string;
    }>;
  };
}

export interface SimulationResponse {
  ok: boolean;
  steps: SimulationStep[];
  errors?: string[];
  pendingTask?: {
    nodeId: string;
    nodeLabel: string;
  };

  approvalReview?: ApprovalReviewPayload;
}
