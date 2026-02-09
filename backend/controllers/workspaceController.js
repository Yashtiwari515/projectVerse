import { prisma } from "../lib/prisma.js";
export const getUserWorkspaces = async (req, res) => {
  try {
    const { userId, orgId } = await req.auth(); // Clerk se details mili

    // 1. Pehle normal membership check karo
    let workspaces = await prisma.workspace.findMany({
      where: {
        members: { some: { userId } },
      },
      include: {
        members: { include: { user: true } },
        projects: { include: {
        members: {
          include: {
            user: true 
          }
        },
        tasks: {include: { assignee: true }}
      } },
        owner: true,
      },
    });

    // 2. AGAR naya user hai aur memberships 0 hain
    if (workspaces.length === 0 && orgId) {
      // console.log("DEBUG: New user detected, finding workspace by Org ID");
      
      // Kyunki schema mein clerkOrgId nahi hai, hum 'owner' ke basis par 
      // us organization ka workspace dhoondenge. 
      // (Yahan aap workspace 'id' ko Clerk Org ID ke barabar rakhte ho ya slug se match karte ho)
      workspaces = await prisma.workspace.findMany({
        where: {
          // Logic: Agar aapne workspace create karte waqt uski ID = Clerk Org ID rakhi hai
          id: orgId 
        },
        include: {
          members: { include: { user: true } },
          projects: { /* ... same include ... */ },
          owner: true,
        },
      });
      
      // 3. Agar mil gaya, toh user ko automatically member table mein add kardo (Auto-Join)
      if (workspaces.length > 0) {
        await prisma.workspaceMember.upsert({
          where: {
            userId_workspaceId: { userId, workspaceId: workspaces[0].id }
          },
          update: {},
          create: {
            userId: userId,
            workspaceId: workspaces[0].id,
            role: "MEMBER"
          }
        });
      }
    }

    res.json({ workspaces });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


export const addMember = async (req, res) => {
    try{
        const {userId} = await req.auth();
        const {email, role, workspaceId, message} = req.body;

        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if(!user){
            return res.status(404).json({ error: "User not found" });
        }
        if(!workspaceId || !role){
            return res.status(400).json({ error: "Workspace ID and role are required" });
        }
        if(!["ADMIN", "MEMBER"].includes(role)){
            return res.status(400).json({ error: "Invalid role" });
        }
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            include: { members: true },
        });
        if(!workspace){
            return res.status(404).json({ error: "Workspace not found" });
        }
        if(!workspace.members.find((member) => member.userId === userId && member.role === "ADMIN")){
            return res.status(403).json({ error: "Only admins can add members" });
        }
        const existingMember = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: workspaceId,
                    userId: user.id
                }
            }
        });
        if(existingMember){
            return res.status(400).json({ error: "User is already a member of this workspace" });
        }
        const member = await prisma.workspaceMember.create({
            data: {
                userId: user.id,
                workspaceId: workspaceId,
                role: role,
            },
        });
        res.json(member);
    } catch (error) {
        console.error("Error adding member to workspace:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}; 
