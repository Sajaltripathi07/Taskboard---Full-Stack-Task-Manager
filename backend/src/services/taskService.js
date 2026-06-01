

const { v4: uuidv4 }         = require('uuid');
const { queryAll, queryOne, run } = require('../database/helpers');

const VALID_STAGES = ['TODO', 'IN_PROGRESS', 'DONE'];


function getAllTasks(userId) {
  return queryAll(
    `SELECT id, title, description, stage, user_id, created_at, updated_at
     FROM tasks
     WHERE user_id = :userId
     ORDER BY created_at DESC`,
    { ':userId': userId }
  );
}

function createTask({ title, description = '', stage = 'TODO' }, userId) {
  if (!VALID_STAGES.includes(stage)) {
    const err = new Error(`Stage must be one of: ${VALID_STAGES.join(', ')}`);
    err.status = 422;
    throw err;
  }

  const id  = uuidv4();
  const now = new Date().toISOString();

  run(
    `INSERT INTO tasks (id, title, description, stage, user_id, created_at, updated_at)
     VALUES (:id, :title, :description, :stage, :userId, :created_at, :updated_at)`,
    {
      ':id':          id,
      ':title':       title.trim(),
      ':description': description.trim(),
      ':stage':       stage,
      ':userId':      userId,
      ':created_at':  now,
      ':updated_at':  now,
    }
  );

  return queryOne('SELECT * FROM tasks WHERE id = :id', { ':id': id });
}


function updateTask(taskId, { title, description, stage }, userId) {
  // Ownership check – single query handles both "not found" and "wrong user".
  const existing = queryOne(
    'SELECT * FROM tasks WHERE id = :id AND user_id = :userId',
    { ':id': taskId, ':userId': userId }
  );
  if (!existing) {
    const err = new Error('Task not found.');
    err.status = 404;
    throw err;
  }

  if (stage && !VALID_STAGES.includes(stage)) {
    const err = new Error(`Stage must be one of: ${VALID_STAGES.join(', ')}`);
    err.status = 422;
    throw err;
  }

  const updatedTitle       = title       !== undefined ? title.trim()       : existing.title;
  const updatedDescription = description !== undefined ? description.trim() : existing.description;
  const updatedStage       = stage       !== undefined ? stage              : existing.stage;
  const now                = new Date().toISOString();

  run(
    `UPDATE tasks
     SET title = :title, description = :description, stage = :stage, updated_at = :updated_at
     WHERE id = :id AND user_id = :userId`,
    {
      ':title':       updatedTitle,
      ':description': updatedDescription,
      ':stage':       updatedStage,
      ':updated_at':  now,
      ':id':          taskId,
      ':userId':      userId,
    }
  );

  return queryOne('SELECT * FROM tasks WHERE id = :id', { ':id': taskId });
}


function deleteTask(taskId, userId) {
  const existing = queryOne(
    'SELECT id FROM tasks WHERE id = :id AND user_id = :userId',
    { ':id': taskId, ':userId': userId }
  );
  if (!existing) {
    const err = new Error('Task not found.');
    err.status = 404;
    throw err;
  }

  run(
    'DELETE FROM tasks WHERE id = :id AND user_id = :userId',
    { ':id': taskId, ':userId': userId }
  );
}

module.exports = { getAllTasks, createTask, updateTask, deleteTask };
