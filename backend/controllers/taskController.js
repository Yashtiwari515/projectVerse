import { inngest } from "../inngest/index.js";
import { prisma } from "../lib/prisma.js";


//create task
export const createTask = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { projectId, title, description, type, status, assigneeId, due_date, priority } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({ message: "ProjectId and title are required" });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: true,
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.team_lead !== userId) {
      return res.status(403).json({ message: "Only team lead can create tasks" });
    }

    if (assigneeId && !project.members.some((m) => m.userId === assigneeId)) {
      return res.status(403).json({ message: "Assignee must be project member" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        type,
        status,
        priority,
        due_date: due_date ? new Date(due_date) : null,
        projectId,
        assigneeId,
      },
      include: {
        assignee: true,
      },
    });

    await inngest.send({
      name: "app/task.assigned",
      data: {
        taskId: task.id,
        origin
      }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


//update task
export const updateTask = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { taskId } = req.params;
    const { title, description, type, status, assigneeId, due_date, priority } = req.body;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: { include: { members: true } },
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.project.team_lead !== userId) {
      return res.status(403).json({ message: "Only team lead can update tasks" });
    }

    if (assigneeId && !task.project.members.some((m) => m.userId === assigneeId)) {
      return res.status(403).json({ message: "Assignee must be project member" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        type,
        status,
        assigneeId,
        priority,
        due_date: due_date ? new Date(due_date) : null,
      },
      include: {
        assignee: true,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


//delete task
export const deleteTask = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { taskId } = req.params;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: { include: { members: true } },
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAdmin = task.project.members.some(
      (m) => m.userId === userId && m.role === "ADMIN"
    );

    if (!isAdmin && task.project.team_lead !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.task.delete({ where: { id: taskId } });

    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
