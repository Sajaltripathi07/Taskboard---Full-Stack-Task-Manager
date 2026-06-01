
const taskService               = require('../services/taskService');
const { sendSuccess, sendError } = require('../utils/response');

/* GET /api/tasks */
function getAll(req, res) {
  try {
    const tasks = taskService.getAllTasks(req.user.id);
    return sendSuccess(res, { tasks });
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
}

/* POST /api/tasks */
function create(req, res) {
  try {
    const { title, description, stage } = req.body;
    const task = taskService.createTask({ title, description, stage }, req.user.id);
    return sendSuccess(res, { task }, 201);
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
}

/* PUT /api/tasks/:id */
function update(req, res) {
  try {
    const { id }                        = req.params;
    const { title, description, stage } = req.body;
    const task = taskService.updateTask(id, { title, description, stage }, req.user.id);
    return sendSuccess(res, { task });
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
}

/* DELETE /api/tasks/:id */
function remove(req, res) {
  try {
    taskService.deleteTask(req.params.id, req.user.id);
    return sendSuccess(res, { message: 'Task deleted successfully.' });
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
}

module.exports = { getAll, create, update, remove };
