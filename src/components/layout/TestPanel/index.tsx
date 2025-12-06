import type {
  RFNode,
  RFEdge,
  SimulationResponse,
} from "../../../types/workflow";
import { TestPanelWrapper } from "./styled";

type Props = {
  nodes: RFNode[];
  edges: RFEdge[];
  role: "manager" | "employee";
  loading: boolean;
  result: SimulationResponse | null;
  onRunSimulation: () => void;
  onViewTasks: () => void;
};

export default function TestPanel({
  nodes,
  role,
  loading,
  result,
  onRunSimulation,
  onViewTasks,
}: Props) {
  const isManager = role === "manager";

  return (
    <TestPanelWrapper>
      <section className="test-panel">
        <div className="test-header">
          <h3>{isManager ? "Workflow Sandbox" : "Task Submission"}</h3>

          {isManager ? (
            <button
              className="btn btn-primary"
              disabled={loading || nodes.length === 0}
              onClick={onRunSimulation}
            >
              {loading ? "Running..." : "Run Simulation"}
            </button>
          ) : (
            <button
              className="btn btn-primary"
              disabled={nodes.length === 0}
              onClick={onViewTasks}
            >
              View Tasks
            </button>
          )}
        </div>

        {!result && isManager && (
          <p className="test-hint">
            Create a workflow and click <b>Run Simulation</b>.
          </p>
        )}

        {!result && !isManager && (
          <p className="test-hint">
            Click <b>View Tasks</b> to begin completing tasks. Then select a
            Task node to complete it.
          </p>
        )}

        {result && (
          <div className="test-log">
            <h4>Execution Log</h4>
            <ol>
              {result.steps.map((s) => (
                <li key={s.order}>
                  <strong>
                    {s.order}. {s.nodeLabel}
                  </strong>
                  <span className={`status status-${s.status}`}>
                    [{s.status}]
                  </span>
                  <div className="test-log-message">{s.message}</div>
                </li>
              ))}
            </ol>
          </div>
        )}
        {result && (result.errors?.length ?? 0) > 0 && (
          <div className="test-errors">
            <h4>Validation Issues</h4>
            <ul>
              {result.errors!.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </TestPanelWrapper>
  );
}
