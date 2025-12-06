import styled from "styled-components";

export const DynamicFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  height: 100%;
  overflow-y: auto;
  padding-right: 4px;
  box-sizing: border-box;

  label {
    font-size: 0.85rem;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    color: #374151;
  }

  input,
  textarea,
  select {
    border-radius: 0.45rem;
    border: 1px solid #d1d5db;
    padding: 0.45rem 0.55rem;
    font-size: 0.82rem;
    background: #f9fafb;
    color: #111827 !important;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  input[type="date"]::-webkit-calendar-picker-indicator {
    opacity: 1 !important;
    filter: invert(60%) sepia(40%) saturate(600%) hue-rotate(180deg);
  }
  input[type="date"]::-webkit-datetime-edit-fields-wrapper {
    color: #4b5563;
    opacity: 1 !important;
  }

  select {
    color: #111827 !important;
    background: #f9fafb;
  }

  select option {
    background: #ffffff;
    color: #111827 !important;
  }

  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: #2563eb;
    background: white;
    box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.25);
  }

  textarea {
    min-height: 60px;
    resize: vertical;
  }

  .checkbox-row {
    flex-direction: row !important;
    align-items: center;
    gap: 0.5rem;
  }

  .form-subsection {
    margin-top: 0.6rem;
    border-top: 1px dashed #e5e7eb;
    padding-top: 0.6rem;
  }

  .form-subsection-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    margin-bottom: 0.35rem;
    color: #4b5563;
    font-weight: 500;
  }

  .kv-row {
    display: grid;
    grid-template-columns: 1fr 1fr 32px;
    gap: 0.4rem;
    align-items: center;
  }

  .btn {
    border-radius: 0.45rem;
    border: 1px solid transparent;
    padding: 0.35rem 0.65rem;
    font-size: 0.75rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    transition: background-color 0.15s ease, box-shadow 0.15s ease,
      transform 0.05s ease;
  }

  .btn-secondary {
    background: #e5e7eb;
    color: #111827;
  }

  .btn-secondary:hover {
    background: #d1d5db;
  }

  .btn-icon {
    padding: 0.28rem;
    min-width: auto;
    font-size: 0.8rem;
  }
`;
