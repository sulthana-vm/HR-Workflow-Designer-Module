import { useEffect, useState } from "react";
import type {
  TaskNodeConfig,
  TaskDocument,
  TaskFormData,
} from "../../../types/workflow";
import { TaskModalWrapper, Backdrop } from "./styled";

type Props = {
  open: boolean;
  onClose: () => void;
  config: TaskNodeConfig;
  onSave: (next: TaskNodeConfig) => void;
  readOnly?: boolean;
};

type Tab = "data" | "file";

const emptyForm: TaskFormData = {
  fullName: "",
  email: "",
  project: "",
  employeeId: "",
};

export default function TaskDocumentModal({
  open,
  onClose,
  config,
  onSave,
  readOnly = false,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("data");
  const [form, setForm] = useState<TaskFormData>(config.form || emptyForm);
  const [docs, setDocs] = useState<TaskDocument[]>(config.documents || []);

  const isReviewMode =
    readOnly &&
    (() => {
      const hasFormData =
        config.form &&
        (config.form.fullName?.trim() ||
          config.form.email?.trim() ||
          config.form.project?.trim() ||
          config.form.employeeId?.trim());

      const hasDocuments =
        config.documents && config.documents.some((doc) => doc.file);

      return hasFormData || hasDocuments;
    })();

  useEffect(() => {
    if (open) {
      setForm(config.form || emptyForm);
      setDocs(config.documents || []);
      setActiveTab("data");
    }
  }, [open, config]);

  if (!open) return null;

  const handleSave = () => {
    onSave({
      ...config,
      form,
      documents: docs,
    });
    onClose();
  };

  const handleSubmit = () => {
    const hasFormData =
      form.fullName?.trim() ||
      form.email?.trim() ||
      form.project?.trim() ||
      form.employeeId?.trim();

    const hasDocuments = docs.some((doc) => doc.file);

    if (!hasFormData && !hasDocuments) {
      alert("Please provide either form data OR upload documents.");
      return;
    }

    onSave({
      ...config,
      form,
      documents: docs,
    });
    onClose();
  };

  const addDocument = () => {
    if (readOnly) return;
    setDocs((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        required: false,
        fields: {},
        file: null,
      },
    ]);
  };

  const updateDoc = (i: number, key: keyof TaskDocument, value: any) => {
    setDocs((prev) =>
      prev.map((d, idx) => (idx === i ? { ...d, [key]: value } : d))
    );
  };

  const removeDoc = (i: number) => {
    if (readOnly) return;
    setDocs((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <>
      <Backdrop onClick={onClose} />

      <TaskModalWrapper>
        <header className="modal-header">
          <div>
            <h2>
              {isReviewMode
                ? "Review Employee Submission"
                : readOnly
                ? "Complete Task"
                : "Task Document Details"}
            </h2>

            <p>
              {isReviewMode
                ? "Review the employee's submitted form and uploaded documents."
                : readOnly
                ? "Fill the required details or upload documents."
                : "Configure task fields and documents."}
            </p>
          </div>

          <button className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        {!isReviewMode && (
          <div className="modal-tabs">
            <button
              className={`tab-btn ${activeTab === "data" ? "active" : ""}`}
              onClick={() => setActiveTab("data")}
            >
              Enter Data
            </button>

            <button
              className={`tab-btn ${activeTab === "file" ? "active" : ""}`}
              onClick={() => setActiveTab("file")}
            >
              Upload File
            </button>
          </div>
        )}

        <div className="modal-body">
          {isReviewMode && (
            <div className="review-box">
              <h3 className="section-title">Employee Submission</h3>

              {(config.form?.fullName ||
                config.form?.email ||
                config.form?.project ||
                config.form?.employeeId) && (
                <div className="review-section">
                  <h4 className="section-subtitle">Form Data</h4>

                  {config.form.fullName && (
                    <div className="review-item">
                      <span className="label">Full Name</span>
                      <div className="value">{config.form.fullName}</div>
                    </div>
                  )}

                  {config.form.email && (
                    <div className="review-item">
                      <span className="label">Email</span>
                      <div className="value">{config.form.email}</div>
                    </div>
                  )}
                  {config.form.project && (
                    <div className="review-item">
                      <span className="label">Project</span>
                      <div className="value">{config.form.project}</div>
                    </div>
                  )}

                  {config.form.employeeId && (
                    <div className="review-item">
                      <span className="label">Employee ID</span>
                      <div className="value">{config.form.employeeId}</div>
                    </div>
                  )}
                </div>
              )}

              {docs.some((d) => d.file) && (
                <div className="review-section">
                  <h4 className="section-subtitle">Uploaded Documents</h4>

                  {docs
                    .filter((d) => d.file)
                    .map((doc, idx) => (
                      <div key={idx} className="doc-item">
                        <span className="doc-name">
                          {doc.name || `Document ${idx + 1}`}
                          {doc.required && <span className="req">*</span>}
                        </span>

                        <div className="doc-file">✓ {doc.file!.name}</div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {!isReviewMode && activeTab === "data" && (
            <div className="tab-panel">
              <label>
                Full Name<span className="required">*</span>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fullName: e.target.value }))
                  }
                />
              </label>

              <label>
                Email<span className="required">*</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </label>
              <label>
                Project<span className="required">*</span>
                <input
                  type="text"
                  value={form.project}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, project: e.target.value }))
                  }
                />
              </label>

              <label>
                Employee ID<span className="required">*</span>
                <input
                  type="text"
                  value={form.employeeId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, employeeId: e.target.value }))
                  }
                />
              </label>
            </div>
          )}

          {!isReviewMode && activeTab === "file" && (
            <div className="tab-panel">
              {!readOnly && (
                <div className="docs-header">
                  <span>Documents</span>
                  <button className="btn btn-secondary" onClick={addDocument}>
                    + Add Document
                  </button>
                </div>
              )}

              {docs.length === 0 && (
                <p className="hint">
                  {readOnly
                    ? "No documents required."
                    : "No documents added yet."}
                </p>
              )}

              {docs.map((doc, i) => (
                <div className="doc-row" key={doc.id}>
                  <div className="doc-row-main">
                    <label>
                      Name
                      <input
                        type="text"
                        value={doc.name}
                        onChange={(e) => updateDoc(i, "name", e.target.value)}
                        disabled={readOnly}
                      />
                    </label>

                    {!readOnly && (
                      <label className="checkbox-row">
                        <input
                          type="checkbox"
                          checked={doc.required}
                          onChange={(e) =>
                            updateDoc(i, "required", e.target.checked)
                          }
                        />
                        Required
                      </label>
                    )}
                  </div>

                  <label className="file-label">
                    {readOnly ? "Uploaded File" : "Upload PDF"}
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) =>
                        updateDoc(i, "file", e.target.files?.[0] ?? null)
                      }
                    />
                  </label>

                  <div className="doc-footer">
                    <span className="file-name">
                      {doc.file ? doc.file.name : "No file selected"}
                    </span>

                    {!readOnly && (
                      <button
                        className="icon-btn small"
                        onClick={() => removeDoc(i)}
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            {isReviewMode ? "Close" : "Cancel"}
          </button>

          {!isReviewMode &&
            (readOnly ? (
              <button className="btn btn-primary" onClick={handleSubmit}>
                Submit Task
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleSave}>
                Save & Continue
              </button>
            ))}
        </footer>
      </TaskModalWrapper>
    </>
  );
}
