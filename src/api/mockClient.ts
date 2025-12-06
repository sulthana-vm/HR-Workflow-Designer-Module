import type {
  AutomationAction,
  SimulationRequest,
  SimulationResponse,
  WorkflowDefinition,
  NodeStatus,
  TaskNodeConfig,
  ApprovalReviewPayload,
} from "../types/workflow";

const AUTOMATIONS: AutomationAction[] = [
  { id: "send_email", label: "Send Email", params: ["to", "subject"] },
  {
    id: "generate_doc",
    label: "Generate Document",
    params: ["template", "recipient"],
  },
];

function validateTask(cfg: TaskNodeConfig) {
  const context: Record<string, any> = {};
  const docs = cfg.documents || [];

  context.fullName = cfg.form?.fullName || "";
  context.email = cfg.form?.email || "";
  context.project = cfg.form?.project || "";
  context.employeeId = cfg.form?.employeeId || "";

  context.__documents = docs.map((d) => ({
    id: d.id,
    name: d.name,
    required: d.required,
    fileName: d.file?.name || "",
    fileType: d.file?.type || "",
  }));

  return { missing: [], context };
}

function validateApprovalNode(cfg: any, documentContext: Record<string, any>) {
  const issues: string[] = [];

  const hasFormData = !!(
    documentContext.fullName?.trim() ||
    documentContext.email?.trim() ||
    documentContext.project?.trim() ||
    documentContext.employeeId?.trim()
  );

  const docs = documentContext.__documents || [];
  const hasDocuments = docs.some((doc: any) => doc.fileName);

  if (!hasFormData && !hasDocuments) {
    issues.push("Employee must provide either form data or upload documents");
    return { ok: false, issues };
  }

  if (hasFormData) {
    const requiredFields: string[] = cfg.requiredFields?.length
      ? cfg.requiredFields
      : ["fullName", "email", "project", "employeeId"];

    requiredFields.forEach((field) => {
      const value = documentContext[field];
      if (!value || !value.trim()) {
        issues.push(`Missing required field: ${field}`);
      }
    });

    if (documentContext.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(documentContext.email)) {
        issues.push("Email format is invalid");
      }
    }
  }

  if (hasDocuments) {
    docs.forEach((doc: any) => {
      if (doc.required && !doc.fileName) {
        issues.push(`Missing required document: ${doc.name}`);
      }

      if (doc.fileName && !doc.fileName.toLowerCase().endsWith(".pdf")) {
        issues.push(`"${doc.fileName}" must be a PDF file`);
      }
    });
  }

  return { ok: issues.length === 0, issues };
}

export const api = {
  async getAutomations(): Promise<AutomationAction[]> {
    await delay(200);
    return AUTOMATIONS;
  },

  async simulate(req: SimulationRequest): Promise<SimulationResponse> {
    await delay(400);

    const { workflow, options } = req;
    const structuralErrors = validateStructure(workflow);
    if (structuralErrors.length > 0)
      return { ok: false, steps: [], errors: structuralErrors };

    const ordered = order(workflow);
    const steps: SimulationResponse["steps"] = [];
    let context: Record<string, any> = {};

    for (let i = 0; i < ordered.length; i++) {
      const node = ordered[i];
      const cfg = node.config;
      let status: NodeStatus = "completed";
      let message = "";

      const forceApprove = options?.autoApproveNodeId === node.id;

      switch (node.type) {
        case "start": {
          message = "Workflow started.";
          break;
        }

        case "task": {
          const taskCfg = cfg as TaskNodeConfig;
          const employeeHasSubmitted =
            taskCfg.form?.fullName?.trim() ||
            taskCfg.form?.email?.trim() ||
            taskCfg.form?.project?.trim() ||
            taskCfg.form?.employeeId?.trim() ||
            (taskCfg.documents || []).some((d) => d.file);

          if (!employeeHasSubmitted) {
            return {
              ok: true,
              steps: [
                ...steps,
                {
                  nodeId: node.id,
                  nodeLabel: cfg.title,
                  order: i + 1,
                  status: "in-progress",
                  message: "Waiting for employee to complete the task.",
                },
              ],
              pendingTask: {
                nodeId: node.id,
                nodeLabel: cfg.title,
              },
            };
          }

          const { context: newCtx } = validateTask(cfg as TaskNodeConfig);
          context = newCtx;

          message = "Task completed by employee.";
          status = "completed";
          break;
        }

        case "approval": {
          if (forceApprove) {
            message = "Manually approved by manager.";
            status = "completed";
            break;
          }

          const { ok, issues } = validateApprovalNode(cfg, context);

          if (!ok) {
            const reviewPayload: ApprovalReviewPayload = {
              nodeId: node.id,
              nodeLabel: cfg.title,
              issues,
              payload: {
                form: {
                  fullName: context.fullName || "",
                  email: context.email || "",
                  project: context.project || "",
                  employeeId: context.employeeId || "",
                },
                documents: (context.__documents || []).map((d: any) => ({
                  id: d.id,
                  name: d.name,
                  required: d.required,
                  fileName: d.fileName,
                })),
              },
            };

            return {
              ok: false,
              steps: [
                ...steps,
                {
                  nodeId: node.id,
                  nodeLabel: cfg.title,
                  order: i + 1,
                  status: "in-progress",
                  message: "Approval required.",
                },
              ],
              errors: issues,
              approvalReview: reviewPayload,
            };
          }

          message = "Approval validation passed.";
          status = "completed";
          break;
        }

        case "automated": {
          const auto = await runAutomation(cfg);
          if (!auto.ok) status = "error";
          message = auto.message;
          break;
        }

        case "end": {
          message = "Workflow completed.";
          break;
        }
      }

      steps.push({
        nodeId: node.id,
        nodeLabel: cfg.title,
        order: i + 1,
        status,
        message,
      });

      if (status === "error") {
        return { ok: false, steps, errors: [message] };
      }
    }

    return { ok: true, steps };
  },
};

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function validateStructure(wf: WorkflowDefinition): string[] {
  const errors: string[] = [];

  const startNodes = wf.nodes.filter((n) => n.type === "start");
  const endNodes = wf.nodes.filter((n) => n.type === "end");

  if (startNodes.length === 0) {
    errors.push("Workflow must contain a Start node.");
  } else if (startNodes.length > 1) {
    errors.push(
      `Workflow must contain exactly one Start node, but found ${startNodes.length}.`
    );
  }

  if (endNodes.length === 0) {
    errors.push("Workflow must contain an End node.");
  } else if (endNodes.length > 1) {
    errors.push(
      `Workflow must contain exactly one End node, but found ${endNodes.length}.`
    );
  }
  if (wf.nodes.length === 0) {
    errors.push("Workflow is empty. Add at least Start and End nodes.");
    return errors;
  }
  const incoming: Record<string, number> = {};
  const outgoing: Record<string, number> = {};

  wf.edges.forEach((e) => {
    incoming[e.target] = (incoming[e.target] || 0) + 1;
    outgoing[e.source] = (outgoing[e.source] || 0) + 1;
  });

  wf.nodes.forEach((n) => {
    if (n.type !== "start" && !incoming[n.id]) {
      errors.push(`Node "${n.label}" has no incoming connection.`);
    }

    if (n.type !== "end" && !outgoing[n.id]) {
      errors.push(`Node "${n.label}" has no outgoing connection.`);
    }
  });

  if (startNodes.length === 1) {
    const start = startNodes[0];
    const graph: Record<string, string[]> = {};
    wf.edges.forEach((e) => {
      if (!graph[e.source]) graph[e.source] = [];
      graph[e.source].push(e.target);
    });

    const visited = new Set<string>();
    const stack = [start.id];

    while (stack.length) {
      const id = stack.pop()!;
      if (visited.has(id)) continue;
      visited.add(id);
      (graph[id] || []).forEach((next) => stack.push(next));
    }

    wf.nodes.forEach((n) => {
      if (!visited.has(n.id)) {
        errors.push(`Node "${n.label}" is not reachable from Start.`);
      }
    });
  }

  return errors;
}

function order(wf: WorkflowDefinition) {
  const map = new Map<string, any>();
  wf.nodes.forEach((n) => map.set(n.id, n));

  const tree: Record<string, string[]> = {};
  wf.edges.forEach((e) => {
    if (!tree[e.source]) tree[e.source] = [];
    tree[e.source].push(e.target);
  });

  const start = wf.nodes.find((n) => n.type === "start");
  if (!start) return wf.nodes;

  const visited = new Set<string>();
  const ordered: any[] = [];

  function walk(id: string) {
    if (visited.has(id)) return;
    visited.add(id);
    const node = map.get(id);
    if (!node) return;
    ordered.push(node);
    (tree[id] || []).forEach(walk);
  }

  walk(start.id);
  return ordered;
}

async function runAutomation(cfg: any) {
  const params = cfg.params || {};

  if (cfg.actionId === "send_email") {
    if (!params.to || !params.subject)
      return { ok: false, message: "Missing email 'to' or 'subject'." };
    return { ok: true, message: `Email sent to ${params.to} (mocked)` };
  }

  if (cfg.actionId === "generate_doc") {
    if (!params.template || !params.recipient)
      return { ok: false, message: "Missing template or recipient." };
    return { ok: true, message: `Document generated (mocked)` };
  }

  return { ok: true, message: "Automation executed." };
}
