import { prisma } from "../lib/prisma.js";


export const createProject = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const {
      workspaceId,
      name,
      description,
      status,
      start_date,
      end_date,
      team_members,
      team_lead,
      progress,
      priority,
    } = req.body;

    if (!workspaceId || !name) {
      return res.status(400).json({ message: "workspaceId and name required" });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: { include: { user: true } } },
    });

    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    if (!workspace.members.some((m) => m.userId === userId && m.role === "ADMIN")) {
      return res.status(403).json({ message: "Only admins can create projects" });
    }

    const lead = team_lead
      ? await prisma.user.findUnique({ where: { email: team_lead } })
      : null;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        status,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
        team_lead: lead?.id || userId,
        workspaceId,
        progress,
        priority,
      },
    });

    if (team_members?.length) {
      const members = workspace.members.filter((m) =>
        team_members.includes(m.user.email)
      );

      await prisma.projectMember.createMany({
        data: members.map((m) => ({
          projectId: project.id,
          userId: m.userId,
        })),
        skipDuplicates: true,
      });
    }

    const result = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        members: { include: { user: true } },
        tasks: { include: { assignee: true, comments: { include: { user: true } } } },
        owner: true,
      },
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const updateProject = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { projectId } = req.params;
    const { name, description, status, start_date, end_date, team_lead, progress, priority } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { workspace: { include: { members: true } } },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    const isAdmin = project.workspace.members.some(
      (m) => m.userId === userId && m.role === "ADMIN"
    );

    if (!isAdmin && project.team_lead !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const lead = team_lead
      ? await prisma.user.findUnique({ where: { email: team_lead } })
      : null;

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        description,
        status,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
        team_lead: lead?.id,
        progress,
        priority,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const addProjectMember = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { projectId } = req.params;
    const { email, role } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: true,
        workspace: { include: { members: true } },
      },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.team_lead !== userId) {
      return res.status(403).json({ message: "Only team lead can add members" });
    }

    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) return res.status(404).json({ message: "User not found" });

    const exists = await prisma.projectMember.findFirst({
      where: { projectId, userId: userToAdd.id },
    });

    if (exists) return res.status(400).json({ message: "Already member" });

    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId: userToAdd.id,
        role,
      },
    });

    res.status(201).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
