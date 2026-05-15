const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');
const { sequelize } = require('../config/db');

// User <-> Project (Team Members - Many-to-Many)
User.belongsToMany(Project, { through: 'UserProjects', as: 'memberProjects' });
Project.belongsToMany(User, { through: 'UserProjects', as: 'teamMembers' });

// User <-> Project (Creator - One-to-Many)
User.hasMany(Project, { foreignKey: 'createdBy', as: 'createdProjects' });
Project.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Project <-> Task (One-to-Many)
Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// User <-> Task (Assigned - One-to-Many)
User.hasMany(Task, { foreignKey: 'assignedUserId', as: 'assignedTasks' });
Task.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });

// User <-> Task (Creator - One-to-Many)
User.hasMany(Task, { foreignKey: 'createdBy', as: 'createdTasks' });
Task.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

module.exports = {
  User,
  Project,
  Task,
  sequelize
};
