import { prisma } from "../lib/prisma.js";


//add comment
export const addComment = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { taskId } = req.params; // URL seTaskId lega
    const { content } = req.body;

    // Safety Check: Agar ID nahi aayi toh Prisma tak mat jao
    if (!taskId || taskId === "undefined") {
      return res.status(400).json({ message: "Task ID is missing in request params" });
    }

    if (!content) {
      return res.status(400).json({ message: "Comment content required" });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: { include: { members: true } },
      },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    const isMember = task.project.members.some((m) => m.userId === userId);
    if (!isMember) return res.status(403).json({ message: "Not a project member" });

    const comment = await prisma.comment.create({
      data: {
        content,
        taskId,
        userId,
      },
      include: {
        user: true,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//get comments for a task
export const getTaskComments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};