import HttpError from "../middleware/ErrorHandler.js";
import Task from "../model/Task.js";

// ADD TASK 

export const addTask = async (req, res, next) => {
  try {
    const { title, description, priority,status } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      status,  
      user: req.user._id
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });

  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};



// GET MY TASKS
// ADMIN sees ALL tasks

export const getMyTasks = async (req, res, next) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      // admin can see all tasks
      tasks = await Task.find()
        .populate("user", "name email role")
        .sort({ createdAt: -1 });
    } else {
      // normal user sees own tasks
      tasks = await Task.find({ user: req.user._id })
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      message: "Tasks retrieved successfully",
      total: tasks.length,
      tasks
    });

  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};



// user can update ONLY their own task
// admin can update ANY task
export const updateTask = async (req, res, next) => {
  try {
    const { status, priority, title, description} = req.body;

    const task = await Task.findById(req.params.id).populate(
      "user",
      "name email role"
    );

    if (!task) {
      return next(new HttpError("Task not found", 404));
    }

    // USER 
    if (req.user.role === "user") {
      if (task.user._id.toString() !== req.user._id.toString()) {
        return next(
          new HttpError("You are not authorized to update this task", 403)
        );
      }
    }


    // Update fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (priority) task.priority = priority;
    if (status) task.status = status;


    await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task
    });

  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};



// ADMIN 

export const taskStats = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(new HttpError("Access denied", 403));
    }

    const totalTasks = await Task.countDocuments();
    const todo = await Task.countDocuments({ status: "todo" });
    const inProgress = await Task.countDocuments({ status: "in-progress" });
    const completed = await Task.countDocuments({ status: "completed" });

    res.status(200).json({
      message: "Task statistics retrieved successfully",
      stats: {
        totalTasks,
        todo,
        inProgress,
        completed
      }
    });

  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


export default {
  addTask,
  getMyTasks,
  updateTask,
  taskStats
};
