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


// IMPORTANT — export function here
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdate];