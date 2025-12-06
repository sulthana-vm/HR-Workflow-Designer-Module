import type { RFNode, RFEdge, WorkflowDefinition } from "../types/workflow";

export function serializeWorkflow(nodes: RFNode[], edges: RFEdge[]): WorkflowDefinition {
  return {
    nodes: nodes.map((n) => ({
      id: n.id,
      type: n.data.type,
      label: n.data.label,
      config: n.data.config,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
    })),
  };
}
