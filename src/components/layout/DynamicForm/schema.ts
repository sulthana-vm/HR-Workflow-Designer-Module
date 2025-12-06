import type { NodeKind } from "../../../types/workflow";

export type Field =
  | {
      type: "text" | "textarea" | "number" | "date";
      label: string;
      key: string;
    }
  | {
      type: "select";
      label: string;
      key: string;
      options: string[];
    }
  | {
      type: "checkbox";
      label: string;
      key: string;
    }
  | {
      type: "kv-list";
      label: string;
      key: string;
    };

export const nodeFormSchema: Record<NodeKind, Field[]> = {
  start: [
    { type: "text", label: "Start Title", key: "title" },
    { type: "kv-list", label: "Metadata", key: "metadata" },
  ],

  task: [
    { type: "text", label: "Title", key: "title" },
    { type: "textarea", label: "Description", key: "description" },
    { type: "text", label: "Assignee", key: "assignee" },
    { type: "date", label: "Due Date", key: "dueDate" },
    { type: "kv-list", label: "Custom Fields", key: "customFields" },
  ],

  approval: [
    { type: "text", label: "Title", key: "title" },
    {
      type: "select",
      label: "Approver Role",
      key: "approverRole",
      options: ["Manager", "HRBP", "Director"],
    },
    {
      type: "number",
      label: "Auto-Approve Threshold",
      key: "autoApproveThreshold",
    },
    { type: "kv-list", label: "Required Document Fields", key: "requiredFields" },
  ],

  automated: [{ type: "text", label: "Title", key: "title" }],

  end: [
    { type: "text", label: "End Message", key: "endMessage" },
    { type: "checkbox", label: "Include Summary", key: "summaryFlag" },
  ],
};
