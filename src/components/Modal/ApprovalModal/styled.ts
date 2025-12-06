import styled from "styled-components";

export const ApprovalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.45); /* slate-900/45 */
  backdrop-filter: blur(2px);
  z-index: 999;
`;

export const ApprovalModalWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 650px;
  max-height: 85vh;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1000;

  /* Header */
  .modal-header {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    background: #f8fafc;

    h2 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 600;
    }

    p {
      margin: 0.25rem 0 0;
      font-size: 0.9rem;
      color: #64748b;
    }

    .icon-btn {
      border: none;
      background: transparent;
      font-size: 1.2rem;
      cursor: pointer;
      opacity: 0.6;
    }
    .icon-btn:hover {
      opacity: 1;
    }
  }

  /* Modal Body */
  .modal-body {
    padding: 1rem 1.25rem;
    overflow-y: auto;
    flex: 1;
  }

  .section {
    margin-bottom: 1.5rem;
  }

  .section h3 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: #0f172a;
  }

  .muted {
    color: #6b7280;
    font-size: 0.85rem;
  }

  /* Key-value row */
  .kv-row {
    display: flex;
    justify-content: space-between;
    background: #f8fafc;
    padding: 0.5rem;
    border-radius: 6px;
    margin-bottom: 0.35rem;

    .kv-key {
      font-weight: 600;
      color: #475569;
    }

    .kv-value {
      color: #334155;
      max-width: 65%;
      word-break: break-word;
      text-align: right;
    }
  }

  /* Document rows */
  .doc-row {
    padding: 0.7rem;
    background: #f9fafb;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    margin-bottom: 0.5rem;

    .doc-main {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .doc-name {
        font-weight: 600;
        color: #0f172a;
      }

      .badge-required {
        background: #fee2e2;
        color: #b91c1c;
        font-size: 0.7rem;
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-weight: 600;
      }
    }

    .doc-file {
      margin-top: 0.5rem;
      font-size: 0.85rem;
      color: #334155;
    }
  }

  /* Issues list */
  .issue-list {
    margin: 0.25rem 0 0;
    padding-left: 1.2rem;
    color: #dc2626;

    li {
      margin-bottom: 0.25rem;
      font-size: 0.9rem;
    }
  }

  .ok-text {
    color: #15803d;
    font-weight: 600;
  }

  /* Footer */
  .modal-footer {
    padding: 1rem 1.25rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    background: #f8fafc;

    .btn {
      padding: 0.55rem 1.1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      border: none;
      font-weight: 600;
    }

    .btn-secondary {
      background: #e2e8f0;
      color: #1e293b;
    }

    .btn-secondary:hover {
      background: #cbd5e1;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background: #2563eb;
    }
  }
`;
