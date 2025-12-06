How to Run on the HR Workflow Designer Module 

There are two options

Option A: Run with Node/npm (dev mode)

Option B: Run with Docker (no need to install Node)


Option A: Run using Node + npm
1. Clone the repository
git clone https://github.com/sulthana-vm/HR-Workflow-Designer-Module.git
cd hr-workflow-designer

2.Install dependencies
Note: Vite requires Node.js 20.19+ or 22.12+.
Requirements:
- Node.js 20.19+ or 22.12+
- npm 9+
npm install

3. Run dev server
npm run dev


Vite will print something like:
Local: http://localhost:5173/


Option B: Run using Docker (no Node install needed)


1. Clone the repo
git clone https://github.com/sulthana-vm/HR-Workflow-Designer-Module.git
cd hr-workflow-designer

2. Build the Docker image
docker build -t hr-workflow-designer .

Here:
hr-workflow-designer is just the image name

3. Run the container
docker run -p 5173:80 hr-workflow-designer

4.open:

http://localhost:5173

and the app will be able to see.



// Features
👤 Role Switch (Manager / Employee)

A dropdown in the top-right corner lets you switch roles:

Manager Mode

Create workflow using Start → Task → Approval → Automated → End nodes

Configure task metadata (assignee, due date, description, etc.)

Configure automated node (email, subject...)

Run simulation

Review & approve employee submissions

Employee Mode

Complete tasks assigned to them

Submit either Form Data OR Upload Documents

Resubmit if manager rejects

// Architecture Overview

src/
 ├── components/
 │    ├── Canvas/
          └── Node/              # React Flow Canvas
 │    ├── Modal/               # Task modal + Approval review modal
 │    ├── layout/              # Node details panel, role switcher
 │                   # Custom node UI
 ├── api/
 │    └── mockClient.ts        # Full workflow engine + simulation logic
 ├── types/
 │    └── workflow.ts          # Workflow, nodes, tasks, automation interfaces
 ├── styles/
 |__ hooks/
 └── App.tsx

Key Modules

React Flow → canvas, node linking, drag/drop

mockClient.ts → contains workflow execution engine:

Validates structure (start/end nodes, reachability)

Processes task nodes

Validates approval nodes

Generates approval payload

Handles automated email step


// 🏗️ Design Decisions
1. React Flow as Graph Engine

React Flow provides a stable draggable canvas, edge handling, and custom nodes—perfect for a workflow builder.

2. Simulation Instead of Real Backend

The workflow engine in mockClient.ts acts like a backend:

Ensures workflows are valid

Pauses at task/approval nodes

Produces error messages

Returns payload for manager review

This makes the app runnable entirely on frontend.

3. Single Modal for Task Submission

Employees can submit:

Form fields (fullName, email, employeeId, project)

OR upload documents (PDF only)

Manager sees exactly what employee submitted.

4. Role Switching

Allows simulated collaboration between manager ↔ employee in one UI

Helps visualize real-world HR processes


//📘 Workflow Walkthrough

1. Manager Creates Workflow

Switch to Manager mode (top right dropdown)

Drag:

Start → Task → Approval → Automated → End

Configure:

Task Node → assignee, due date, metadata, required documents

Automated Node → action: Send Email, set to & subject

2. Manager Runs Simulation

Click Run Simulation:

Start node completes

Workflow pauses at the first Task node

3. Employee Completes Task

Switch to Employee mode

Click the task node

In the details panel → Click View Tasks

Click Complete Task

In the modal:

Enter form fields OR

Upload documents

Click Save & Continue

4. Manager Reviews Submission

Switch back to Manager → click Review Submission

Manager may:

Approve

Reject → workflow pauses → employee resubmits

Once approved, workflow continues until End node.



// ✔️ Completed Functionality

Workflow graph builder (React Flow)

Drag/drop nodes

Task modal with form + file upload

Validation (PDF-only, required fields, etc.)

Approval modal with dynamic display

Simulation engine with:

Structural validation

Task pause

Approval flow

Automated node emulator

Role switching

Document vs. form-based submission logic

Resubmission logic on rejection

// ➕ What Could Be Added With More Time
🔹 1. True Backend Integration

Save workflows to DB

Assign tasks to real users

Store uploaded files

Maintain workflow history

🔹 2. More Node Types

Parallel gateway

Conditional branch

Multi-level approvals

🔹 3. User Authentication

Real login + role-based access.

🔹 4. Version Control for Workflows

Ability to publish & track changes.

🔹 5. Notifications (Email/SMS/Websocket)

