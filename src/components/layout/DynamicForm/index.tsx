import { nodeFormSchema } from "./schema";
import type {
  WorkflowNodeData,
  AutomatedStepNodeConfig,
  AutomationAction,
} from "../../../types/workflow";
import { DynamicFormWrapper } from "./styled";

interface Props {
  nodeId: string;
  data: WorkflowNodeData;
  updateNodeData: (
    id: string,
    updater: (d: WorkflowNodeData) => WorkflowNodeData
  ) => void;
  automations: AutomationAction[];
}

export default function DynamicNodeForm({
  nodeId,
  data,
  updateNodeData,
  automations,
}: Props) {
  const schema = nodeFormSchema[data.type];
  const cfg = data.config as any;

  const update = (key: string, value: any) => {
    updateNodeData(nodeId, (d) => ({
      ...d,
      config: { ...d.config, [key]: value },
    }));
  };

  return (
    <DynamicFormWrapper>
      <div className="form-section">
        {/* Render schema-based fields */}
        {schema.map((field) => {
          switch (field.type) {
            case "text":
            case "number":
            case "date":
              return (
                <label key={field.key}>
                  {field.label}
                  <input
                    type={field.type}
                    value={cfg[field.key] ?? ""}
                    onChange={(e) => update(field.key, e.target.value)}
                  />
                </label>
              );

            case "textarea":
              return (
                <label key={field.key}>
                  {field.label}
                  <textarea
                    rows={3}
                    value={cfg[field.key] ?? ""}
                    onChange={(e) => update(field.key, e.target.value)}
                  />
                </label>
              );

            case "checkbox":
              return (
                <label key={field.key} className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={cfg[field.key] ?? false}
                    onChange={(e) => update(field.key, e.target.checked)}
                  />
                  {field.label}
                </label>
              );

            case "select":
              return (
                <label key={field.key}>
                  {field.label}
                  <select
                    value={cfg[field.key]}
                    onChange={(e) => update(field.key, e.target.value)}
                  >
                    {field.options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
              );

            case "kv-list":
              return (
                <KVListField
                  key={field.key}
                  label={field.label}
                  value={cfg[field.key] || []}
                  onChange={(val) => update(field.key, val)}
                />
              );

            default:
              return null;
          }
        })}

        {/* AUTOMATED NODE SPECIAL UI */}
        {data.type === "automated" && (
          <AutomatedActionFields
            cfg={cfg as AutomatedStepNodeConfig}
            update={update}
            automations={automations}
          />
        )}
      </div>
    </DynamicFormWrapper>
  );
}

/* ---------------- KV LIST FIELD ---------------- */
function KVListField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: any[];
  onChange: (v: any[]) => void;
}) {
  const handleChange = (i: number, key: "key" | "value", val: string) => {
    const next = value.map((v, idx) => (idx === i ? { ...v, [key]: val } : v));
    onChange(next);
  };

  const add = () =>
    onChange([...value, { id: Date.now().toString(), key: "", value: "" }]);

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="form-subsection">
      <div className="form-subsection-header">
        <span>{label}</span>
        <button className="btn btn-secondary" type="button" onClick={add}>
          + Add
        </button>
      </div>

      {value.map((v, i) => (
        <div key={v.id} className="kv-row">
          <input
            value={v.key}
            placeholder="Key"
            onChange={(e) => handleChange(i, "key", e.target.value)}
          />
          <input
            value={v.value}
            placeholder="Value"
            onChange={(e) => handleChange(i, "value", e.target.value)}
          />
          <button
            type="button"
            className="btn btn-icon"
            onClick={() => remove(i)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

/* ---------------- AUTOMATION FIELDS BLOCK ---------------- */
function AutomatedActionFields({
  cfg,
  update,
  automations,
}: {
  cfg: AutomatedStepNodeConfig;
  update: (key: string, value: any) => void;
  automations: AutomationAction[];
}) {
  const selectedAction = automations.find((a) => a.id === cfg.actionId);

  const handleActionChange = (id: string) => {
    const action = automations.find((a) => a.id === id);

    const newParams: Record<string, string> = {};

    action?.params.forEach((p) => {
      newParams[p] = cfg.params?.[p] ?? "";
    });

    update("actionId", id);
    update("params", newParams);
  };

  return (
    <>
      <label>
        Action
        <select
          value={cfg.actionId ?? ""}
          onChange={(e) => handleActionChange(e.target.value)}
        >
          <option value="">Select Action</option>
          {automations.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>
      </label>

      {selectedAction && (
        <div className="form-subsection">
          <strong>Parameters</strong>

          {selectedAction.params.map((paramKey) => (
            <label key={paramKey}>
              {paramKey}
              <input
                type="text"
                value={cfg.params?.[paramKey] ?? ""}
                onChange={(e) =>
                  update("params", {
                    ...cfg.params,
                    [paramKey]: e.target.value,
                  })
                }
              />
            </label>
          ))}
        </div>
      )}
    </>
  );
}
