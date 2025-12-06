import { useCallback, useState } from "react";
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "reactflow";

import type {
  RFNode,
  RFEdge,
  NodeKind,
  WorkflowNodeData,
  StartNodeConfig,
  TaskNodeConfig,
  ApprovalNodeConfig,
  AutomatedStepNodeConfig,
  EndNodeConfig,
  SimulationResponse,
  NodeStatus,
} from "../types/workflow";

let idCounter = 1;
const genId = () => `node_${idCounter++}`;

export function useWorkflow() {
  const [nodes, setNodes] = useState<RFNode[]>([]);
  const [edges, setEdges] = useState<RFEdge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((conn: Connection) => {
    setEdges((eds) => addEdge({ ...conn, type: "smoothstep" }, eds));
  }, []);

  const addNodeAt = useCallback(
    (kind: NodeKind, pos: { x: number; y: number }) => {
      const id = genId();
      const config = createDefaultConfig(kind);

      const data: WorkflowNodeData = {
        id,
        type: kind,
        label: defaultLabel(kind),
        status: "idle",
        config,
      };

      const rfNode: RFNode = {
        id,
        type: "workflow-node",
        position: pos,
        data,
      };

      setNodes((nds) => nds.concat(rfNode));
    },
    []
  );

  const deleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setSelectedNodeId((prev) => (prev === id ? null : prev));
  }, []);

  const updateNodeData = useCallback(
    (id: string, updater: (d: WorkflowNodeData) => WorkflowNodeData) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id
            ? {
                ...n,
                data: updater(n.data),
              }
            : n
        )
      );
    },
    []
  );

  const updateNodes = useCallback((updater: (nodes: RFNode[]) => RFNode[]) => {
    setNodes((nds) => updater(nds));
  }, []);

  const updateEdges = useCallback((updater: (edges: RFEdge[]) => RFEdge[]) => {
    setEdges((eds) => updater(eds));
  }, []);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  const applySimulationStatus = useCallback((sim: SimulationResponse) => {
    setNodes((prev) =>
      prev.map((n) => {
        const step = sim.steps.find((s) => s.nodeId === n.id);
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

    setEdges((prev) =>
      prev.map((e) => {
        const sourceStep = sim.steps.find((s) => s.nodeId === e.source);
        if (!sourceStep) return e;

        let stroke = "#d1d5db";
        if (sourceStep.status === "completed") stroke = "#16a34a";
        if (sourceStep.status === "error") stroke = "#dc2626";

        return {
          ...e,
          style: {
            ...e.style,
            stroke,
            strokeWidth: 2,
          },
        };
      })
    );
  }, []);

  const resetSimulationStatus = useCallback(() => {
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        data: {
          ...n.data,
          status: "idle",
        },
      }))
    );

    setEdges((prev) =>
      prev.map((e) => ({
        ...e,
        style: { stroke: "#d1d5db", strokeWidth: 1 },
      }))
    );
  }, []);

  return {
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
    updateEdges,

    applySimulationStatus,
    resetSimulationStatus,
  };
}

function defaultLabel(kind: NodeKind): string {
  switch (kind) {
    case "start":
      return "Start";
    case "task":
      return "Task";
    case "approval":
      return "Approval";
    case "automated":
      return "Automated Step";
    case "end":
      return "End";
  }
}

function createDefaultConfig(
  kind: NodeKind
):
  | StartNodeConfig
  | TaskNodeConfig
  | ApprovalNodeConfig
  | AutomatedStepNodeConfig
  | EndNodeConfig {
  switch (kind) {
    case "start":
      return {
        title: "Start",
        metadata: [],
      };

    case "task":
      return {
        title: "Task",
        description: "",
        assignee: "",
        dueDate: "",
        customFields: [],
        form: {
          fullName: "",
          email: "",
          project: "",
          employeeId: "",
        },
        documents: [],
      };

    case "approval":
      return {
        title: "Approval",
        approverRole: "Manager",
        autoApproveThreshold: undefined,
        requiredFields: [],
      };

    case "automated":
      return {
        title: "Automated Step",
        actionId: "",
        params: {},
      };

    case "end":
      return {
        endMessage: "Workflow Complete",
        summaryFlag: true,
      };
  }
}
