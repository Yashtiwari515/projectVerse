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

    const origin = req.headers.origin || "http://localhost:5173";

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
    const body = req.body; // Poora body object le lo

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: { include: { members: true } },
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check authorization
    if (task.project.team_lead !== userId) {
      return res.status(403).json({ message: "Only team lead can update tasks" });
    }

    // Validate assignee if it's being updated
    if (body.assigneeId && !task.project.members.some((m) => m.userId === body.assigneeId)) {
      return res.status(403).json({ message: "Assignee must be project member" });
    }

    // --- FIX: Dynamic Data Object ---
    // Hum sirf wahi fields update karenge jo request body mein aayi hain
    const updateData = {};
    
    const fields = ['title', 'description', 'type', 'status', 'assigneeId', 'priority'];
    
    fields.forEach(field => {
        if (body[field] !== undefined) {
            updateData[field] = body[field];
        }
    });

    // Handle due_date specifically
    if (body.due_date !== undefined) {
        // Agar null bhej rahe ho toh null, warna Date object
        updateData.due_date = body.due_date ? new Date(body.due_date) : null;
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData, // Sirf valid fields jayengi
      include: {
        assignee: true,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("Prisma Update Error:", error);
    res.status(500).json({ message: error.message });
  }
};


//delete task
export const deleteTask = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { taskIds } = req.body; // Frontend se array lein

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ message: "No task IDs provided" });
    }

    // Pehle check karein ki user authorized hai ya nahi (optional but recommended)
    // Direct deleteMany use karein
    await prisma.task.deleteMany({
      where: {
        id: { in: taskIds },
        // Security: Ensure user sirf apne project ke tasks delete kare
        project: { team_lead: userId } 
      },
    });

    res.json({ message: "Tasks deleted successfully", taskIds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
