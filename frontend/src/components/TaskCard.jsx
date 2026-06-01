
import { useSortable } from '@dnd-kit/sortable';
import { CSS }         from '@dnd-kit/utilities';

const STAGE_META = {
  TODO:        { label: 'Todo',        cls: 'badge-todo' },
  IN_PROGRESS: { label: 'In Progress', cls: 'badge-prog' },
  DONE:        { label: 'Done',        cls: 'badge-done' },
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TaskCard({ task, onEdit, onDelete }) {
  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform:  CSS.Transform.toString(transform),
    transition,
    opacity:    isDragging ? 0.45 : 1,
    zIndex:     isDragging ? 999 : 'auto',
  };

  const meta = STAGE_META[task.stage] || STAGE_META.TODO;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="card p-4 space-y-3 group hover:shadow-lift transition-shadow duration-200 cursor-grab active:cursor-grabbing select-none"
      {...attributes}
      {...listeners}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display font-semibold text-sm text-ink leading-snug line-clamp-2 flex-1">
          {task.title}
        </h3>
        {/* Action buttons - visible on hover */}
        <div
          className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          onPointerDown={e => e.stopPropagation()} // don't trigger drag on button click
        >
          <button
            onClick={() => onEdit(task)}
            className="w-6 h-6 flex items-center justify-center rounded-md text-smoke hover:text-ink hover:bg-mist transition-colors"
            title="Edit"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button
            onClick={() => onDelete(task)}
            className="w-6 h-6 flex items-center justify-center rounded-md text-smoke hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-smoke text-xs leading-relaxed line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider border ${meta.cls}`}>
          {meta.label}
        </span>
        <span className="text-ash text-[10px] font-mono">{formatDate(task.created_at)}</span>
      </div>
    </div>
  );
}
