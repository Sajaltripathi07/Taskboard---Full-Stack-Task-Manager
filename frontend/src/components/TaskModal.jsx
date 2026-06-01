
import { useState, useEffect, useRef } from 'react';

const STAGES = [
  { value: 'TODO',        label: 'Todo'        },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE',        label: 'Done'        },
];

export default function TaskModal({ task, onClose, onSave, loading }) {
  const isEdit = Boolean(task?.id);
  const [form,   setForm]   = useState({
    title:       task?.title       ?? '',
    description: task?.description ?? '',
    stage:       task?.stage       ?? 'TODO',
  });
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);

  useEffect(() => { titleRef.current?.focus(); }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const validate = () => {
    const e = {};
    if (!form.title.trim())        e.title = 'Title is required.';
    else if (form.title.length > 200) e.title = 'Max 200 characters.';
    if (form.description.length > 2000) e.description = 'Max 2000 characters.';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    await onSave(form);
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel */}
      <div className="card w-full max-w-md p-6 space-y-5 slide-up shadow-modal">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-ink">
            {isEdit ? 'Edit task' : 'New task'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-mist text-smoke hover:text-ink transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-display font-semibold text-smoke uppercase tracking-wider">Title *</label>
            <input
              ref={titleRef}
              type="text"
              className={`input ${errors.title ? 'input-error' : ''}`}
              placeholder="What needs to be done?"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            />
            {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-display font-semibold text-smoke uppercase tracking-wider">Description</label>
            <textarea
              rows={3}
              className={`input resize-none ${errors.description ? 'input-error' : ''}`}
              placeholder="Add more detail (optional)"
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            />
            {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
          </div>

          {/* Stage */}
          <div className="space-y-1.5">
            <label className="text-xs font-display font-semibold text-smoke uppercase tracking-wider">Stage</label>
            <div className="flex gap-2">
              {STAGES.map(s => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, stage: s.value }))}
                  className={`flex-1 py-2 rounded-lg text-xs font-display font-semibold border transition-all duration-150 ${
                    form.stage === s.value
                      ? 'bg-ink text-paper border-ink'
                      : 'border-mist text-smoke hover:border-ash hover:text-ink'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/>
                  </svg>
                  Saving…
                </span>
              ) : isEdit ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
