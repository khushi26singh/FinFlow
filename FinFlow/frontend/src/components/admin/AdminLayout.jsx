import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/applications', label: 'Applications' },
  { to: '/admin/loan-products', label: 'Loan Products' },
  { to: '/admin/users', label: 'Users' },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#08111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.16),_transparent_28%),linear-gradient(180deg,_#0f172a_0%,_#08111f_50%,_#03060d_100%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl gap-6 px-4 py-4 lg:px-6 lg:py-6">
        <aside className="hidden w-72 shrink-0 flex-col rounded-3xl border border-white/10 bg-white/6 p-4 backdrop-blur xl:flex">
          <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">FinFlow Admin</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Operations Hub</h1>
            <p className="mt-2 text-sm text-slate-300">Loan origination management</p>
          </div>

          <nav className="mt-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    'flex items-center rounded-2xl border px-4 py-3 text-sm font-medium transition',
                    isActive
                      ? 'border-cyan-300/30 bg-cyan-400/10 text-cyan-100'
                      : 'border-transparent bg-white/0 text-slate-300 hover:border-white/10 hover:bg-white/8 hover:text-white',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="rounded-3xl border border-white/10 bg-white/6 px-5 py-4 backdrop-blur lg:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Admin Dashboard</p>
                <h2 className="mt-1 text-xl font-semibold text-white">FinFlow</h2>
              </div>
              <div className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100">
                Secure admin access
              </div>
            </div>
          </header>

          <main className="flex-1 pb-6 pt-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}