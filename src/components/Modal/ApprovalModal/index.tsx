import type { ApprovalReviewPayload } from "../../../types/workflow";
import { ApprovalModalWrapper, ApprovalBackdrop } from "./styled";

type Props = {
  open: boolean;
  review: ApprovalReviewPayload;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
};

export default function ApprovalReviewModal({
  open,
  review,
  onApprove,
  onReject,
  onClose,
}: Props) {
  if (!open) return null;

  const { issues, payload } = review;
  const { form, documents } = payload;

  return (
    <>
      <ApprovalBackdrop onClick={onClose} />

      <ApprovalModalWrapper role="dialog" aria-modal="true">
        <header className="modal-header">
          <div>
            <h2>Approval Required: {review.nodeLabel}</h2>
            <p>Please review submitted data before approving.</p>
          </div>

          <button className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        <div className="modal-body">
          {(() => {
            const hasFormData =
              form.fullName?.trim() ||
              form.email?.trim() ||
              form.project?.trim() ||
              form.employeeId?.trim();

            const hasDocuments = documents.some((d) => d.fileName);
            if (hasFormData) {
              return (
                <section className="section">
                  <h3>Form Data</h3>
                  {Object.entries(form).map(([k, v]) => (
                    <div key={k} className="kv-row">
                      <span className="kv-key">{k}</span>
                      <span className="kv-value">{String(v)}</span>
                    </div>
                  ))}
                </section>
              );
            }
            if (hasDocuments) {
              return (
                <section className="section">
                  <h3>Uploaded Documents</h3>
                  {documents.map((doc) => (
                    <div key={doc.id} className="doc-row">
                      <div className="doc-main">
                        <span className="doc-name">{doc.name}</span>
                        {doc.required && (
                          <span className="badge-required">Required</span>
                        )}
                      </div>

                      <div className="doc-file">
                        {doc.fileName ? (
                          <span>{doc.fileName}</span>
                        ) : (
                          <span className="muted">No file uploaded</span>
                        )}
                      </div>
                    </div>
                  ))}
                </section>
              );
            }

            return (
              <section className="section">
                <p className="muted">No form data or documents submitted.</p>
              </section>
            );
          })()}

          <section className="section">
            <h3>Validation Issues</h3>

            {issues.length === 0 ? (
              <p className="ok-text">No validation issues found.</p>
            ) : (
              <ul className="issue-list">
                {issues.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <footer className="modal-footer">
          <button className="btn btn-secondary" onClick={onReject}>
            Reject
          </button>
          <button className="btn btn-primary" onClick={onApprove}>
            Approve
          </button>
        </footer>
      </ApprovalModalWrapper>
    </>
  );
}
