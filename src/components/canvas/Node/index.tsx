import { Handle, Position, type NodeProps } from "reactflow";
import type {
  WorkflowNodeData,
  StartNodeConfig,
  TaskNodeConfig,
  ApprovalNodeConfig,
  AutomatedStepNodeConfig,
  EndNodeConfig,
  NodeStatus,
} from "../../../types/workflow";
import { NodeWrapper } from "./styled";

type ExtraData = WorkflowNodeData & {
  onEditClick?: (id: string) => void;
  onDeleteClick?: (id: string) => void;
};

const WorkflowNode = ({ id, data }: NodeProps<ExtraData>) => {
  const status: NodeStatus = data.status || "idle";

  const hasTargetHandle = data.type !== "start";
  const hasSourceHandle = data.type !== "end";

  let header = "";
  let icon = "";
  let bodyTitle = "";
  let bodySub: string | null = null;
  let nodeClass = "";

  switch (data.type) {
    case "start": {
      const cfg = data.config as StartNodeConfig;
      header = "Start";
      icon = "●";
      bodyTitle = cfg.title;
      nodeClass = "start-node";
      break;
    }
    case "task": {
      const cfg = data.config as TaskNodeConfig;
      header = "Task";
      icon = "📝";
      bodyTitle = cfg.title;
      bodySub = cfg.assignee ? `Assignee: ${cfg.assignee}` : null;
      nodeClass = "task-node";
      break;
    }
    case "approval": {
      const cfg = data.config as ApprovalNodeConfig;
      header = "Approval";
      icon = "✅";
      bodyTitle = cfg.title;
      bodySub = `Role: ${cfg.approverRole}`;
      nodeClass = "approval-node";
      break;
    }
    case "automated": {
      const cfg = data.config as AutomatedStepNodeConfig;
      header = "Automated";
      icon = "⚙️";
      bodyTitle = cfg.title;
      bodySub = cfg.actionId ? `Action: ${cfg.actionId}` : null;
      nodeClass = "automated-node";
      break;
    }
    case "end": {
      const cfg = data.config as EndNodeConfig;
      header = "End";
      icon = "■";
      bodyTitle = cfg.endMessage;
      nodeClass = "end-node";
      break;
    }
  }

  return (
    <NodeWrapper className={`${nodeClass} node-status-${status}`}>
      <div className="node-top">
        <div className="node-header">
          <span className="node-icon">{icon}</span>
          <span>{header}</span>
        </div>

        <div className="node-actions">
          {/* EDIT NODE */}
          {data.onEditClick && (
            <button
              className="node-action-btn"
              title="Edit Node"
              onClick={(e) => {
                e.stopPropagation();
                data.onEditClick?.(id);
              }}
            >
              ✎
            </button>
          )}

          {/* DELETE NODE */}
          {data.onDeleteClick && (
            <button
              className="node-action-btn danger"
              title="Delete Node"
              onClick={(e) => {
                e.stopPropagation();
                data.onDeleteClick?.(id);
              }}
            >
              <img src="/delete.png" alt="Delete" />
            </button>
          )}
        </div>
      </div>

      <div className="node-body">
        <div className="node-title">{bodyTitle}</div>
        {bodySub && <div className="node-sub">{bodySub}</div>}
      </div>

      <div className={`node-status-badge status-${status}`}>
        {status === "idle" && "Idle"}
        {status === "in-progress" && "In Progress"}
        {status === "completed" && "Completed"}
        {status === "error" && "Error"}
      </div>

      {hasTargetHandle && <Handle type="target" position={Position.Top} />}
      {hasSourceHandle && <Handle type="source" position={Position.Bottom} />}
    </NodeWrapper>
  );
};

export default WorkflowNode;
