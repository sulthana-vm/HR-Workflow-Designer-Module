import React from "react";
import type { NodeKind } from "../../../types/workflow";
import { SidebarWrapper } from "./styled";

const NODE_ITEMS: { kind: NodeKind; label: string; desc: string }[] = [
  { kind: "start", label: "Start", desc: "Workflow entry point" },
  { kind: "task", label: "Task", desc: "Human task for HR/employee" },
  { kind: "approval", label: "Approval", desc: "Manager/HR approval" },
  { kind: "automated", label: "Automated", desc: "System action" },
  { kind: "end", label: "End", desc: "Workflow completion" },
];

export default function Sidebar() {
  const onDragStart = (event: React.DragEvent, kind: NodeKind) => {
    event.dataTransfer.setData("application/hr-node-kind", kind);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <SidebarWrapper>
      <h3 className="sidebar-title">Node Palette</h3>
      <p className="sidebar-subtitle">Drag nodes onto the canvas</p>
      <div className="sidebar-list">
        {NODE_ITEMS.map((item) => (
          <div
            key={item.kind}
            className={`sidebar-node sidebar-node-${item.kind}`}
            draggable
            onDragStart={(e) => onDragStart(e, item.kind)}
          >
            <div className="sidebar-node-label">{item.label}</div>
            <div className="sidebar-node-desc">{item.desc}</div>
          </div>
        ))}
      </div>
    </SidebarWrapper>
  );
}
