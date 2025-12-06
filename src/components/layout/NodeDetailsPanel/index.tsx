import type {
  WorkflowNodeData,
  AutomationAction,
  TaskNodeConfig,
  ApprovalReviewPayload,
} from "../../../types/workflow";

import DynamicNodeForm from "../DynamicForm";
import { NodeDetailsPanelWrapper } from "./styled";
import TaskDocumentModal from "../../Modal/TaskModal";
import { useState } from "react";

type Props = {
  selectedNode: { id: string; data: WorkflowNodeData } | null;
  updateNodeData: (
    id: string,
    updater: (d: WorkflowNodeData) => WorkflowNodeData
  ) => void;
  automations: AutomationAction[];
  role: "manager" | "employee";
  setApprovalReview: (r: ApprovalReviewPayload | null) => void;
};

export default function NodeDetailsPanel({
  selectedNode,
  updateNodeData,
  automations,
  role,
  setApprovalReview,
}: Props) {
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const isManager = role === "manager";
  const isEmployee = role === "employee";

  if (!selectedNode) {
    return (
      <NodeDetailsPanelWrapper>
        <aside className="details-panel">
          <h3>Details</h3>
          <p>Select a node to view details</p>
        </aside>
      </NodeDetailsPanelWrapper>
    );
  }

  const isTask = selectedNode.data.type === "task";
  const nodeConfig = selectedNode.data.config as TaskNodeConfig;

  const employeeSubmitted =
    nodeConfig.form?.fullName ||
    nodeConfig.form?.email ||
    nodeConfig.form?.project ||
    nodeConfig.form?.employeeId ||
    nodeConfig.documents?.some((d) => d.file);

  const modalReadOnlyForEmployee = false;
  const modalReadOnlyForManager = employeeSubmitted;

  return (
    <NodeDetailsPanelWrapper>
      <aside className="details-panel">
        <div className="details-header">
          <div>
            <h3>{selectedNode.data.label}</h3>
            <span className="details-type-tag">
              {selectedNode.data.type.toUpperCase()}
            </span>
          </div>
        </div>

        {/* MANAGER VIEW */}
        {isManager && (
          <>
            <DynamicNodeForm
              nodeId={selectedNode.id}
              data={selectedNode.data}
              updateNodeData={updateNodeData}
              automations={automations}
            />

            {isTask && employeeSubmitted && (
              <div className="task-actions">
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    setApprovalReview({
                      nodeId: selectedNode.id,
                      nodeLabel: selectedNode.data.label,
                      issues: [],
                      payload: {
                        form: {
                          fullName: nodeConfig.form?.fullName || "",
                          email: nodeConfig.form?.email || "",
                          project: nodeConfig.form?.project || "",
                          employeeId: nodeConfig.form?.employeeId || "",
                        },
                        documents: (nodeConfig.documents || []).map((d) => ({
                          id: d.id,
                          name: d.name,
                          required: d.required,
                          fileName: d.file?.name || "",
                        })),
                      },
                    })
                  }
                >
                  Review Submission
                </button>
              </div>
            )}

            {isTask && !employeeSubmitted && (
              <p className="muted">
                Waiting for employee to complete this task.
              </p>
            )}
          </>
        )}

        {/* EMPLOYEE VIEW */}
        {isEmployee && isTask && (
          <>
            {(selectedNode.data as any).readyForSubmission ? (
              <div className="task-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => setTaskModalOpen(true)}
                >
                  Complete Task
                </button>
                {(selectedNode.data as any).needsResubmission && (
                  <p className="muted">
                    Your previous submission was rejected. Please update and
                    resubmit.
                  </p>
                )}
              </div>
            ) : (
              <p className="muted">
                Click <b>View Tasks</b> in the panel below to start completing
                tasks.
              </p>
            )}
          </>
        )}
      </aside>

      {/* TASK MODAL */}
      {isTask && (
        <TaskDocumentModal
          open={taskModalOpen}
          onClose={() => setTaskModalOpen(false)}
          config={nodeConfig}
          onSave={(next) =>
            updateNodeData(selectedNode.id, (d) => ({
              ...d,
              config: next,
              readyForSubmission: false,
              needsResubmission: false,
            }))
          }
          readOnly={
            isManager ? !!modalReadOnlyForManager : !!modalReadOnlyForEmployee
          }
        />
      )}
    </NodeDetailsPanelWrapper>
  );
}
