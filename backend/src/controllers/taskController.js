import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, assignee } = req.body;
    const { projectId } = req.params;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignee,
      project: projectId,
      creator: req.user.id
    });

    // Add task to project
    project.tasks.push(task._id);
    await project.save();

    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { status, priority } = req.query;

    let query = { project: projectId };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .populate('assignee')
      .populate('creator')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);

    // Remove from project
    await Project.findByIdAndUpdate(task.project, {
      $pull: { tasks: task._id }
    });

    res.status(200).json({
      success: true,
      message: 'Task deleted'
    });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.comments.push({
      user: req.user.id,
      text
    });

    await task.save();

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    next(error);
  }
};
