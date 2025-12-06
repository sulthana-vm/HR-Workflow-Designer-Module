import styled from "styled-components";

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1000;
`;

export const TaskModalWrapper = styled.div`
  position: fixed;
  z-index: 1001;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 550px;
  max-height: 85vh;
  overflow-y: auto;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -48%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }

  /* HEADER */
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: start;

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }

    p {
      margin: 4px 0 0;
      font-size: 13px;
      color: #666;
    }

    .icon-btn {
      border: none;
      background: transparent;
      font-size: 20px;
      cursor: pointer;
      color: #444;

      &:hover {
        color: #e11d48;
      }
    }
  }

  /* TABS */
  .modal-tabs {
    display: flex;
    gap: 10px;
    margin-top: 5px;

    .tab-btn {
      flex: 1;
      padding: 10px;
      background: #f3f4f6;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: 0.2s;

      &.active {
        background: #2563eb;
        color: white;
      }
    }
  }

  /* BODY */
  .modal-body {
    padding: 10px 5px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* LABELS */
  label {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    font-weight: 500;
    position: relative;
    margin-bottom: 14px;
  }

  .field-label {
    display: flex;
    align-items: center;
    gap: 4px; /* tiny spacing */
  }

  .required {
    color: #dc2626;
    font-weight: bold;
  }

  label span.required {
    position: absolute;
    right: -12px;
    top: 2px;
  }

  /* INPUTS */
  input[type="text"],
  input[type="email"],
  input[type="file"],
  select {
    padding: 8px 10px;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    font-size: 14px;
    background: #f9fafb; /* LIGHT GRAY BG */
    color: #111827;

    &:focus {
      border-color: #2563eb;
      outline: none;
    }

    &:disabled {
      background: #f3f4f6;
      cursor: not-allowed;
    }
  }

  /* CHECKBOX ROW */
  .checkbox-row {
    flex-direction: row !important;
    align-items: center;
    gap: 8px;
  }

  /* DOCUMENT LIST */
  .docs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;

    .btn-secondary {
      padding: 5px 10px;
      border-radius: 6px;
      background: #e5e7eb;
      border: 1px solid #d1d5db;
      cursor: pointer;

      &:hover {
        background: #d1d5db;
      }
    }
  }

  .doc-row {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .doc-row-main {
      display: flex;
      justify-content: space-between;
      gap: 15px;

      label {
        flex: 1;
      }
    }

    .file-label input {
      margin-top: 6px;
    }

    .doc-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .file-name {
        font-size: 13px;
        color: #555;
      }

      .icon-btn.small {
        padding: 4px 6px;
        background: #fee2e2;
        border-radius: 6px;
        border: 1px solid #fecaca;
        cursor: pointer;
        font-size: 12px;

        &:hover {
          background: #fca5a5;
        }
      }
    }
  }

  /* REVIEW MODE PANEL */
  .review-box {
    background: #f0fdf4;
    border: 2px solid #22c55e;
    border-radius: 0.5rem;
    padding: 1.5rem;

    .section-title {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
      color: #166534;
    }

    .review-item {
      margin-bottom: 1rem;

      .label {
        font-size: 0.75rem;
        font-weight: 600;
        color: #166534;
        margin-bottom: 0.25rem;
      }

      .value {
        padding: 0.5rem;
        background: white;
        border: 1px solid #bbf7d0;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        color: #14532d;
      }
    }

    .doc-item {
      background: white;
      border: 1px solid #bbf7d0;
      border-radius: 0.375rem;
      padding: 0.75rem;
      margin-bottom: 0.5rem;

      .doc-name {
        font-weight: 600;
        color: #14532d;
      }

      .doc-file {
        font-size: 0.75rem;
        color: #166534;
        margin-top: 4px;
      }
    }
  }

  /* FOOTER */
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    .btn {
      padding: 8px 16px;
      font-size: 14px;
      border-radius: 8px;
      cursor: pointer;
      border: none;

      &.btn-primary {
        background: #2563eb;
        color: white;

        &:hover {
          background: #1e40af;
        }
      }

      &.btn-secondary {
        background: #e5e7eb;
        color: black;

        &:hover {
          background: #d1d5db;
        }
      }
    }
  }
`;
