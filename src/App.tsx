import { useEffect, useMemo, useState } from "react";
import "./App.css";

import Sidebar from "./components/layout/Sidebar";
import NodeDetailsPanel from "./components/layout/NodeDetailsPanel";
import TestPanel from "./components/layout/TestPanel";
import WorkflowCanvas from "./components/canvas/WorkflowCanvas";
import { useWorkflow } from "./hooks/useWorkflow";
import { api } from "./api/mockClient";
import { serializeWorkflow } from "./utils/serializer";
import type {
  AutomationAction,
  ApprovalReviewPayload,
  SimulationResponse,
  NodeStatus,
} from "./types/workflow";
import ApprovalReviewModal from "./components/Modal/ApprovalModal";

type UserRole = "manager" | "employee";

function App() {
  const {
    nodes,
    edges,
    selectedNode,
    setSelectedNodeId,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNodeAt,
    deleteNode,
    updateNodeData,
    updateNodes,
  } = useWorkflow();

  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [currentRole, setCurrentRole] = useState<UserRole>("manager");

  const [loading, setLoading] = useState(false);
  const [simulationResult, setSimulationResult] =
    useState<SimulationResponse | null>(null);
  const [approvalReview, setApprovalReview] =
    useState<ApprovalReviewPayload | null>(null);

  useEffect(() => {
    api.getAutomations().then(setAutomations);
  }, []);

  const selectedNodeWithData = useMemo(
    () =>
      selectedNode
        ? {
            id: selectedNode.id,
            data: selectedNode.data,
          }
        : null,
    [selectedNode]
  );

  const isManager = currentRole === "manager";

  const markStatuses = (res: SimulationResponse) => {
    updateNodes((nds) =>
      nds.map((n) => {
        const step = res.steps.find((s) => s.nodeId === n.id);
        if (!step) return n;
        return {
          ...n,
          data: {
            ...n.data,
            status: step.status as NodeStatus,
          },
        };
      })
    );
  };

  const resetStatuses = () => {
    updateNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          status: "idle" as NodeStatus,
        },
      }))
    );
  };

  const handleRunSimulation = async () => {
    if (!isManager) return;

    resetStatuses();
    setLoading(true);

    try {
      const wf = serializeWorkflow(nodes, edges);
      const res = await api.simulate({ workflow: wf });

      setSimulationResult(res);
      markStatuses(res);

      if (res.approvalReview) {
        setApprovalReview(res.approvalReview);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewTasks = () => {
    if (isManager) return;

    const taskNodes = nodes.filter((n) => n.data.type === "task");

    if (taskNodes.length === 0) {
      alert("No task nodes found.");
      return;
    }

    updateNodes((nds) =>
      nds.map((n) =>
        n.data.type === "task"
          ? {
              ...n,
              data: {
                ...n.data,
                readyForSubmission: true,
                status: "in-progress" as NodeStatus,
              },
            }
          : n
      )
    );

    setSimulationResult({
      ok: true,
      steps: taskNodes.map((node, idx) => ({
        nodeId: node.id,
        nodeLabel: node.data.label,
        status: "in-progress" as NodeStatus,
        message: "Task ready for employee submission.",
        order: idx + 1,
      })),
    });
  };

  const handleApprove = async () => {
    if (!approvalReview || !isManager) return;

    setLoading(true);
    try {
      const wf = serializeWorkflow(nodes, edges);

      const res = await api.simulate({
        workflow: wf,
        options: { autoApproveNodeId: approvalReview.nodeId },
      });

      setSimulationResult(res);
      markStatuses(res);
      setApprovalReview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = () => {
    if (!approvalReview || !isManager) return;

    updateNodes((nds) =>
      nds.map((n) =>
        n.id === approvalReview.nodeId
          ? {
              ...n,
              data: {
                ...n.data,
                status: "error" as NodeStatus,
                needsResubmission: true,
              },
            }
          : n
      )
    );

    setSimulationResult((prev) => ({
      ok: false,
      steps: [
        ...(prev?.steps ?? []),
        {
          nodeId: approvalReview.nodeId,
          nodeLabel: approvalReview.nodeLabel,
          status: "error" as NodeStatus,
          order: (prev?.steps.length ?? 0) + 1,
          message: "Approval rejected. Employee must resubmit.",
        },
      ],
      errors: ["Approval rejected. Employee must resubmit."],
    }));

    setApprovalReview(null);
  };

  return (
    <div className="app-root">
      <div className="role-switcher">
        <span className="role-label">Role</span>
        <select
          id="role-select"
          value={currentRole}
          onChange={(e) => setCurrentRole(e.target.value as UserRole)}
          className="role-dropdown modern"
        >
          <option value="manager">Manager</option>
          <option value="employee">Employee</option>
        </select>
      </div>

      {isManager ? <Sidebar /> : <div className="sidebar-placeholder" />}

      <div className="canvas-column">
        <WorkflowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={isManager ? onNodesChange : () => {}}
          onEdgesChange={isManager ? onEdgesChange : () => {}}
          onConnect={isManager ? onConnect : () => {}}
          onSelectNode={setSelectedNodeId}
          addNodeAt={isManager ? addNodeAt : () => {}}
          deleteNode={isManager ? deleteNode : () => {}}
          isReadOnly={!isManager}
        />

        <TestPanel
          nodes={nodes}
          edges={edges}
          role={currentRole}
          loading={loading}
          result={simulationResult}
          onRunSimulation={handleRunSimulation}
          onViewTasks={handleViewTasks}
        />
      </div>

      <div className="right-panel">
        <NodeDetailsPanel
          selectedNode={selectedNodeWithData}
          updateNodeData={updateNodeData}
          automations={automations}
          role={currentRole}
          setApprovalReview={setApprovalReview}
        />
      </div>

      {isManager && approvalReview && (
        <ApprovalReviewModal
          open={true}
          review={approvalReview}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={() => setApprovalReview(null)}
        />
      )}
    </div>
  );
}

export default App;
