const { Task, User, Project } = require('../models');

// @desc    Get tasks
const getTasks = async (req, res) => {
  try {
    let tasks;
    const include = [
      { model: User, as: 'assignedUser', attributes: ['id', 'name', 'email'] },
      { model: Project, as: 'project', attributes: ['id', 'title'] }
    ];

    if (req.user.role === 'Admin') {
      tasks = await Task.findAll({ include });
    } else {
      tasks = await Task.findAll({
        where: { assignedUserId: req.user.id },
        include
      });
    }
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a task
const createTask = async (req, res) => {
  const { title, description, assignedUser, project, dueDate, priority } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      assignedUserId: assignedUser,
      projectId: project,
      dueDate,
      priority,
      createdBy: req.user.id,
    });

    const createdTask = await Task.findByPk(task.id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'name', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'title'] }
      ]
    });

    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'Admin' && task.assignedUserId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    let updatedFields = req.body;
    if (req.user.role !== 'Admin') {
      updatedFields = { status: req.body.status };
    }

    // Map frontend field names to SQL field names if necessary
    if (updatedFields.assignedUser) {
      updatedFields.assignedUserId = updatedFields.assignedUser;
      delete updatedFields.assignedUser;
    }
    if (updatedFields.project) {
      updatedFields.projectId = updatedFields.project;
      delete updatedFields.project;
    }

    await task.update(updatedFields);

    const updatedTask = await Task.findByPk(req.params.id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'name', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'title'] }
      ]
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.destroy();
    res.status(200).json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
