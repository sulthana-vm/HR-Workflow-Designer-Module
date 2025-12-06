import styled from "styled-components";

export const TestPanelWrapper = styled.div`
  .test-panel {
    border-top: 1px solid #e5e7eb;
    padding: 0.75rem 1rem;
    background: white;
    font-size: 0.8rem;
    box-sizing: border-box;
  }

  .test-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .test-header h3 {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .btn {
    border-radius: 0.45rem;
    border: none;
    padding: 0.35rem 0.7rem;
    font-size: 0.78rem;
    cursor: pointer;
  }

  .btn-primary {
    background: #2563eb;
    color: white;
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: default;
  }

  .test-hint {
    margin-top: 0.5rem;
    color: #6b7280;
  }

  .test-errors {
    background: #fef2f2;
    border-radius: 0.5rem;
    padding: 0.5rem 0.7rem;
    margin-top: 0.6rem;
  }

  .test-errors h4 {
    margin: 0 0 0.35rem;
    font-size: 0.85rem;
    color: #b91c1c;
  }

  .test-log {
    margin-top: 0.6rem;
  }

  .test-log h4 {
    margin: 0 0 0.35rem;
    font-size: 0.85rem;
  }

  .test-log ol {
    padding-left: 1.2rem;
    margin: 0;
  }

  .test-log-message {
    color: #4b5563;
    margin-top: 0.1rem;
  }

  .status {
    font-size: 0.7rem;
  }

  .status-completed {
    color: #16a34a;
  }

  .status-error {
    color: #dc2626;
  }

  .status-idle {
    color: #6b7280;
  }
`;
