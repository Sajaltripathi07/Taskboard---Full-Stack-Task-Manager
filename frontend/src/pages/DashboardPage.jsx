
import { useEffect, useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';

import { useTasks }           from '../context/TaskContext';
import { useAuth }            from '../context/AuthContext';
import KanbanColumn           from '../components/KanbanColumn';
import TaskCard               from '../components/TaskCard';
import TaskModal              from '../components/TaskModal';
import DeleteConfirmModal     from '../components/DeleteConfirmModal';

const STAGES = ['TODO', 'IN_PROGRESS', 'DONE'];

export default function DashboardPage() {
  const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask, moveTask } = useTasks();
  const { user } = useAuth();

  // ── UI state ───────────────────────────────────────────────────────
  const [search,       setSearch]       = useState('');
  const [stageFilter,  setStageFilter]  = useState('ALL');
  const [showCreate,   setShowCreate]   = useState(false);
  const [editTask,     setEditTask]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving,       setSaving]       = useState(false);
  const [activeTask,   setActiveTask]   = useState(null);  // DnD overlay

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // ── Sensors (pointer with 8px activation distance) ─────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // ── Filtered tasks ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tasks.filter(t => {
      const matchSearch = !q || t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q);
      const matchStage  = stageFilter === 'ALL' || t.stage === stageFilter;
      return matchSearch && matchStage;
    });
  }, [tasks, search, stageFilter]);

  const byStage = (stage) => filtered.filter(t => t.stage === stage);

  // ── DnD handlers ───────────────────────────────────────────────────
  const handleDragStart = ({ active }) => {
    setActiveTask(tasks.find(t => t.id === active.id) || null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;
    const targetStage = STAGES.includes(over.id)
      ? over.id
      : tasks.find(t => t.id === over.id)?.stage;
    if (targetStage && active.id !== over.id) {
      const task = tasks.find(t => t.id === active.id);
      if (task && task.stage !== targetStage) moveTask(active.id, targetStage);
    }
  };

  // ── CRUD handlers ──────────────────────────────────────────────────
  const handleCreate = async (data) => {
    setSaving(true);
    const res = await createTask(data);
    setSaving(false);
    if (res.success) setShowCreate(false);
  };

  const handleEdit = async (data) => {
    setSaving(true);
    const res = await updateTask(editTask.id, data);
    setSaving(false);
    if (res.success) setEditTask(null);
  };

  const handleDelete = async () => {
    setSaving(true);
    const res = await deleteTask(deleteTarget.id);
    setSaving(false);
    if (res.success) setDeleteTarget(null);
  };

  // ── Stats ──────────────────────────────────────────────────────────
  const total    = tasks.length;
  const doneCount = tasks.filter(t => t.stage === 'DONE').length;
  const pct       = total ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 fade-in">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
        <div className="space-y-0.5">
          <h1 className="font-display font-extrabold text-2xl text-ink tracking-tight">
            Good {getTimeOfDay()}, {user?.name?.split(' ')[0]}.
          </h1>
          <p className="text-smoke text-sm">
            {total === 0
              ? 'No tasks yet — create your first one.'
              : `${doneCount} of ${total} tasks complete (${pct}%)`}
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New task
        </button>
      </div>

      {/* ── Progress bar ────────────────────────────────────────────── */}
      {total > 0 && (
        <div className="space-y-1.5">
          <div className="w-full h-1.5 bg-mist rounded-full overflow-hidden">
            <div
              className="h-full bg-done rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Filters ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-ash" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="input pl-8"
            placeholder="Search tasks…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Stage filter pills */}
        <div className="flex gap-1.5 flex-wrap">
          {[['ALL','All'], ['TODO','Todo'], ['IN_PROGRESS','In Progress'], ['DONE','Done']].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setStageFilter(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-display font-semibold border transition-all duration-150 ${
                stageFilter === v
                  ? 'bg-ink text-paper border-ink'
                  : 'border-mist text-smoke hover:border-ash hover:text-ink'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* ── Kanban board ────────────────────────────────────────────── */}
      {loading ? (
        <BoardSkeleton />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STAGES.map(stage => (
              <KanbanColumn
                key={stage}
                stage={stage}
                tasks={byStage(stage)}
                onEdit={setEditTask}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>

          {/* Drag overlay (ghost card while dragging) */}
          <DragOverlay>
            {activeTask && (
              <div className="rotate-2 opacity-90 shadow-lift">
                <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}

      {/* ── Modals ──────────────────────────────────────────────────── */}
      {showCreate && (
        <TaskModal
          onClose={() => setShowCreate(false)}
          onSave={handleCreate}
          loading={saving}
        />
      )}
      {editTask && (
        <TaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onSave={handleEdit}
          loading={saving}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          task={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={saving}
        />
      )}
    </div>
  );
}

/* Skeleton while loading */
function BoardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[0,1,2].map(i => (
        <div key={i} className="kanban-col space-y-3">
          <div className="h-4 w-20 bg-mist rounded animate-pulse" />
          {Array.from({ length: 2 + i }).map((_, j) => (
            <div key={j} className="card p-4 space-y-2.5 animate-pulse">
              <div className="h-4 bg-mist rounded w-3/4" />
              <div className="h-3 bg-mist rounded w-full" />
              <div className="h-3 bg-mist rounded w-1/2" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
