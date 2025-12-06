import styled from "styled-components";

export const SidebarWrapper = styled.aside`
  height: 100%;
  background: #111827;
  color: #f9fafb;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-sizing: border-box;

  .sidebar-title {
    font-size: 1.1rem;
    font-weight: 600;
  }

  .sidebar-subtitle {
    font-size: 0.85rem;
    color: #9ca3af;
  }

  .sidebar-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .sidebar-node {
    border-radius: 0.5rem;
    padding: 0.6rem 0.7rem;
    background: #1f2937;
    border: 1px solid #374151;
    cursor: grab;
  }

  .sidebar-node:hover {
    background: #374151;
  }

  .sidebar-node-label {
    font-weight: 600;
    font-size: 0.9rem;
  }

  .sidebar-node-desc {
    font-size: 0.75rem;
    color: #9ca3af;
  }
`;
