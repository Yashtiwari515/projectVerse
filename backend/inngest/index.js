import { Inngest } from "inngest";
import { prisma } from "../lib/prisma.js";

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

// IMPORTANT — export function here
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdate, syncWorkspaceCreation, syncWorkspaceDeletion, syncWorkspaceUpdate, syncWorkspaceMemberCreation ];