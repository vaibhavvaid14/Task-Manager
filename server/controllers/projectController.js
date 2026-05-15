const { Project, User, Task } = require('../models');

// @desc    Get all projects
const getProjects = async (req, res) => {
  try {
    let projects;
    const include = [
      { model: User, as: 'teamMembers', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'creator', attributes: ['name'] }
    ];

    if (req.user.role === 'Admin') {
      projects = await Project.findAll({ include });
    } else {
      // Find projects where user is a team member
      const user = await User.findByPk(req.user.id);
      projects = await user.getMemberProjects({ include });
    }
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'teamMembers', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'creator', attributes: ['name'] },
        { model: Task, as: 'tasks' }
      ]
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = await project.hasTeamMembers(req.user.id);
    if (req.user.role !== 'Admin' && !isMember) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a project
const createProject = async (req, res) => {
  const { title, description, teamMembers, deadline, priority } = req.body;

  try {
    const project = await Project.create({
      title,
      description,
      deadline,
      priority,
      createdBy: req.user.id,
    });

    if (teamMembers && teamMembers.length > 0) {
      await project.setTeamMembers(teamMembers);
    }

    const createdProject = await Project.findByPk(project.id, {
      include: [{ model: User, as: 'teamMembers', attributes: ['id', 'name', 'email'] }]
    });

    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.update(req.body);

    if (req.body.teamMembers) {
      await project.setTeamMembers(req.body.teamMembers);
    }

    const updatedProject = await Project.findByPk(req.params.id, {
      include: [{ model: User, as: 'teamMembers', attributes: ['id', 'name', 'email'] }]
    });

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.destroy();
    res.status(200).json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
