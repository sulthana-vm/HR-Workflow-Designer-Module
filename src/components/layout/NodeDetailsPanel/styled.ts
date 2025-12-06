import styled from "styled-components";

export const NodeDetailsPanelWrapper = styled.aside`
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  border-left: 1px solid #e5e7eb;
  background: linear-gradient(180deg, #f3f4f6 0%, #eceef0 100%);
  overflow: hidden;
  display: flex;
  padding-top: 60px;

  .details-panel {
    height: 100%;
    width: 100%;
    padding: 1rem 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
    box-sizing: border-box;
  }

  .details-panel > h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
  }

  .details-panel > p {
    margin: 0;
    font-size: 0.82rem;
    color: #6b7280;
  }

  .details-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: inherit;
    backdrop-filter: blur(3px);
    padding-bottom: 0.65rem;
    margin-bottom: 0.6rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .details-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
  }

  .details-type-tag {
    background: #e5e7eb;
    border-radius: 999px;
    padding: 0.15rem 0.55rem;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #4b5563;
  }

  .btn-danger {
    background: #dc2626;
    color: #fff;
    border-radius: 0.45rem;
    border: none;
    padding: 0.35rem 0.8rem;
    font-size: 0.75rem;
    cursor: pointer;
    transition: background 0.15s ease, transform 0.05s ease;
  }

  .btn-danger:hover {
    background: #b91c1c;
  }

  .btn-danger:active {
    transform: translateY(1px);
  }

  .task-actions {
    margin-top: 0.75rem;
  }
`;