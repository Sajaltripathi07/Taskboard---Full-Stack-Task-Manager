
import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="grain min-h-screen flex">
      {/* ── Brand panel ─────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[42%] bg-ink flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border border-white/5" />
        <div className="absolute top-1/3 -right-32 w-64 h-64 rounded-full border border-white/5" />
        <div className="absolute -bottom-16 left-16 w-48 h-48 rounded-full border border-white/5" />

        <div>
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3.5 3.5L13 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">Taskboard</span>
          </Link>
        </div>

        <div className="space-y-6">
          <div className="space-y-1">
            {['TODO', 'IN PROGRESS', 'DONE'].map((s, i) => (
              <div
                key={s}
                className="flex items-center gap-3 p-3 rounded-lg border border-white/8 bg-white/4"
                style={{ opacity: 1 - i * 0.15 }}
              >
                <div className={`w-2 h-2 rounded-full ${
                  i === 0 ? 'bg-blue-400' : i === 1 ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />
                <span className="font-mono text-xs text-white/50 tracking-widest">{s}</span>
                <div className="ml-auto flex gap-1">
                  {Array.from({ length: 3 - i }).map((_, j) => (
                    <div key={j} className="w-8 h-1.5 rounded-full bg-white/15" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <p className="font-display text-3xl font-bold text-white leading-tight">
              Your work,<br />beautifully organised.
            </p>
            <p className="text-white/40 text-sm leading-relaxed">
              A minimal Kanban board that keeps you focused on what matters — shipping.
            </p>
          </div>
        </div>

        <p className="text-white/20 text-xs font-mono">© {new Date().getFullYear()} Taskboard</p>
      </div>

      {/* ── Form panel ──────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm fade-in">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-7 h-7 bg-ink rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3.5 3.5L13 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-ink text-lg tracking-tight">Taskboard</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
