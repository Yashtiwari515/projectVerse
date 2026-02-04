import { prisma } from "../lib/prisma.js";
export const getUserWorkspaces = async (req, res) => {
  try {
    const {userId} = await req.auth();
    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        members: { include: { user: true } },
        projects: {
          include: {
            tasks: {
              include: {
                assignee: true,
                comments: { include: { user: true } },
              },
            },
            members: { include: { user: true } },
          },
        },
        owner: true,
      },
    });

    res.json({ workspaces });
  } catch (error) {
    console.error("Error fetching user workspaces:", error);
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
