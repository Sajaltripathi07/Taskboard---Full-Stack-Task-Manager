
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const COLUMN_META = {
  TODO:        { label: 'Todo',        dot: 'bg-todo',  headerCls: 'text-todo'  },
  IN_PROGRESS: { label: 'In Progress', dot: 'bg-prog',  headerCls: 'text-prog'  },
  DONE:        { label: 'Done',        dot: 'bg-done',  headerCls: 'text-done'  },
};

export default function KanbanColumn({ stage, tasks, onEdit, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const meta = COLUMN_META[stage];

  return (
    <div
      ref={setNodeRef}
      className={`kanban-col transition-colors duration-200 ${isOver ? 'bg-ink/4 border-ink/20' : ''}`}
    >
      {/* Column header */}
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-2 h-2 rounded-full ${meta.dot}`} />
        <h2 className={`font-display font-bold text-xs uppercase tracking-widest ${meta.headerCls}`}>
          {meta.label}
        </h2>
        <span className="ml-auto font-mono text-xs text-ash bg-mist rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3 flex-1">
          {tasks.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-12">
              <div className="text-center space-y-1">
                <div className="w-8 h-8 rounded-full bg-mist flex items-center justify-center mx-auto">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ash">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <p className="text-ash text-xs">No tasks here</p>
              </div>
            </div>
          ) : (
            tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}
