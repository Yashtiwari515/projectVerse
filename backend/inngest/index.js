import { Inngest } from "inngest";
import { prisma } from "../lib/prisma.js";
import sendEmail from "../configs/nodemailer.js";

export const inngest = new Inngest({ id: "project-management" });

export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.create({
      data: {
        id: data.id,
        email: data.email_addresses?.[0]?.email_address || "",
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        image: data.image_url || "",
      },
    });
  }
);

export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { data } = event; 
    await prisma.user.deleteMany({
      where: {
        id: data.id,    
        },
    });
  }
);

export const syncUserUpdate = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { data } = event; 
    await prisma.user.updateMany({
      where: {
        id: data.id,
        },  
        data: {
            email: data.email_addresses?.[0]?.email_address || "",
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            image: data.image_url || "",
        },
    });
  } 
);

export const syncWorkspaceCreation = inngest.createFunction(
  { id: "sync-workspace-from-clerk" },
  { event: "clerk/organization.created" },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspace.create({
      data: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        ownerId: data.created_by,
        image_url: data.image_url || "",
      },
    });
    await prisma.workspaceMember.create({
      data: {
        userId: data.created_by,
        workspaceId: data.id,
        role: "ADMIN",
      },
    });
  }
);

export const syncWorkspaceDeletion = inngest.createFunction(
  { id: "delete-workspace-from-clerk" },
  { event: "clerk/organization.deleted" },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspace.deleteMany({
      where: {
        id: data.id,
      },
    });
  } 
);

export const syncWorkspaceUpdate = inngest.createFunction(
  { id: "update-workspace-from-clerk" },
  { event: "clerk/organization.updated" },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspace.updateMany({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        slug: data.slug,
        image_url: data.image_url || "",
      },
    });
  }
);

export const syncWorkspaceMemberCreation = inngest.createFunction(
  { id: "sync-workspace-member-from-clerk" },
  { event: "clerk/organizationInvitation.created" },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspaceMember.create({
      data: {
        userId: data.user_id,
        workspaceId: data.organization_id,
        role: String(data.role_name).toUpperCase(),
      },
    });
  }
);


export const sendTaskAssignmentEmail = inngest.createFunction(
  { id: "send-task-assignment-email" },
  { event: "app/task.assigned" },
  async ({ event, step }) => {
    const { taskId, origin } = event.data;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { assignee: true },
    });

    if (!task || !task.assignee) return;

    await sendEmail({
      to: task.assignee.email,
      subject: `New Task Assigned: ${task.title}`,
      body: `
        <h1>You have been assigned a new task!</h1>
        <p><strong>Title:</strong> ${task.title}</p>
        <p><strong>Description:</strong> ${task.description || "No description provided."}</p>
        <p><strong>Due Date:</strong> ${
          task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date set."
        }</p>
        <p>View the task <a href="${origin}">here</a>.</p>
      `,
    });

    if (!task.due_date) return;

    const dueDate = new Date(task.due_date);

    if (dueDate <= new Date()) return;

    await step.sleepUntil("wait-for-due-date", dueDate);

    await step.run("check-if-task-completed", async () => {
      const latestTask = await prisma.task.findUnique({
        where: { id: taskId },
        include: { assignee: true },
      });

      if (!latestTask || !latestTask.assignee) return;

      if (latestTask.status !== "DONE") {
        await sendEmail({
          to: latestTask.assignee.email,
          subject: `Task Due Today: ${latestTask.title}`,
          body: `
            <h1>Reminder: Task Due Today!</h1>
            <p><strong>Title:</strong> ${latestTask.title}</p>
            <p><strong>Description:</strong> ${latestTask.description || "No description provided."}</p>
            <p>Please make sure to complete the task by the end of the day.</p>
          `,
        });
      }
    });
  }
);


// IMPORTANT — export function here
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdate, syncWorkspaceCreation, syncWorkspaceDeletion, syncWorkspaceUpdate, syncWorkspaceMemberCreation, sendTaskAssignmentEmail];