import React, { useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import type { RFNode, RFEdge, NodeKind } from "../../types/workflow";
import WorkflowNode from "./Node/index";
import { CanvasWrapper } from "./styled";

const nodeTypes = {
  "workflow-node": WorkflowNode,
};

type InnerProps = {
  nodes: RFNode[];
  edges: RFEdge[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  onSelectNode: (id: string | null) => void;
  addNodeAt: (kind: NodeKind, pos: { x: number; y: number }) => void;
  deleteNode: (id: string) => void;
  isReadOnly?: boolean;
};

function WorkflowCanvasInner({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onSelectNode,
  addNodeAt,
  deleteNode,
  isReadOnly = false,
}: InnerProps) {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const { project } = useReactFlow();

  const onPaneClick = () => {
    if (!isReadOnly) {
      onSelectNode(null);
    }
  };

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      if (isReadOnly) return;
      
      event.preventDefault();
      const kind = event.dataTransfer.getData("application/hr-node-kind") as NodeKind;
      if (!kind) return;

      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!bounds) return;

      const position = project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      addNodeAt(kind, position);
    },
    [project, addNodeAt, isReadOnly]
  );

  const onDragOver = (event: React.DragEvent) => {
    if (isReadOnly) return;
    
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  return (
    <CanvasWrapper>
      <div className="workflow-canvas-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes.map(n => ({
            ...n,
            data: {
              ...n.data,
              onEditClick: isReadOnly ? undefined : () => onSelectNode(n.id),
              onDeleteClick: isReadOnly ? undefined : () => deleteNode(n.id),
            },
            draggable: !isReadOnly,
            selectable: !isReadOnly,
          }))}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          onPaneClick={onPaneClick}
          onNodeClick={(_, node) => onSelectNode(node.id)}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodesDraggable={!isReadOnly}
          nodesConnectable={!isReadOnly}
          elementsSelectable={true}
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </CanvasWrapper>
  );
}

type Props = Omit<InnerProps, "">;

export default function WorkflowCanvas(props: Props) {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner {...props} />
    </ReactFlowProvider>
  );
}