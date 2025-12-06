import styled from "styled-components";

export const NodeWrapper = styled.div`
  background: white;
  padding: 0.6rem 0.75rem 1.2rem;
  min-width: 150px;
  border-radius: 0.75rem;
  border: 2px solid #d1d5db;
  font-size: 0.75rem;
  box-shadow: 0px 1px 3px rgba(15, 23, 42, 0.12);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  .node-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .node-header {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b7280;
    flex-shrink: 0;
  }

  .node-icon {
    font-size: 0.85rem;
  }
  .node-actions {
    display: flex;
    gap: 0.2rem;
  }

  .node-action-btn {
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 50%;
    padding: 0.15rem;
    font-size: 11px;
    color: #475569;
  }

  .node-action-btn:hover {
    background: rgb(245, 145, 78);
  }

  .node-action-btn.danger {
    color: #dc2626;
    size: 12px;
  }
  .node-action-btn.danger:hover {
    background: rgb(253, 59, 59);
  }

  /* --- Node Body --- */
  .node-body {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .node-title {
    font-weight: 600;
    color: #111827;
    font-size: 0.85rem;
    line-height: 1.2;
    word-break: break-word;
  }

  .node-sub {
    font-size: 0.7rem;
    color: #6b7280;
    line-height: 1.2;
    word-break: break-word;
  }
  .node-status-badge {
    position: absolute;
    bottom: 0.25rem;
    right: 0.35rem;
    border-radius: 8px;
    padding: 0.18rem 0.45rem;
    font-size: 0.6rem;
    font-weight: 600;
    background: #f3f4f6;
    color: #4b5563;
    pointer-events: none; /* prevent click issues */
  }

  &.start-node {
    border-color: #22c55e;
  }
  &.task-node {
    border-color: #3b82f6;
  }
  &.approval-node {
    border-color: #8b5cf6;
  }
  &.automated-node {
    border-color: #0ea5e9;
  }
  &.end-node {
    border-color: #f97316;
  }

  &.node-status-idle {
    opacity: 0.95;
  }

  &.node-status-in-progress {
    border-color: #3b82f6;
    .node-status-badge {
      background: #dbeafe;
      color: #1d4ed8;
    }
  }

  &.node-status-completed {
    border-color: #16a34a;
    .node-status-badge {
      background: #dcfce7;
      color: #15803d;
    }
  }

  &.node-status-error {
    border-color: #dc2626;
    .node-status-badge {
      background: #fee2e2;
      color: #b91c1c;
    }
  }
`;
