import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../services/api';

const ROLE_OPTIONS = ['applicant', 'underwriter', 'admin'];

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(value))
    : '—';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const { data } = await API.get('/users');
      setUsers(data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);  

  const updateRole = async (id, nextRole) => {
    try {
      setSavingId(id);
      setUsers((current) => current.map((user) => (user._id === id ? { ...user, role: nextRole } : user)));

      const { data } = await API.patch(`/users/${id}/role`, { role: nextRole });
      setUsers((current) => current.map((user) => (user._id === id ? data.data : user)));
      toast.success('User role updated');
    } catch (err) {
      await loadUsers();
      toast.error(err?.response?.data?.message || 'Failed to update role');
    } finally {
      setSavingId('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Users</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Role Management</h1>
            <p className="mt-2 text-sm text-slate-300">Review all users and update roles inline.</p>
          </div>
        </div>
      </div>

      {error && <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-4 text-rose-100 backdrop-blur">{error}</div>}

      <div className="rounded-3xl border border-white/10 bg-white/6 backdrop-blur">
        <div className="border-b border-white/10 px-5 py-4 text-sm text-slate-300">Showing {users.length} users</div>

        {loading ? (
          <div className="p-6 text-slate-300">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-slate-300">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-slate-950/25">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Name</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Email</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Role</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Join Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((user) => (
                  <tr key={user._id} className="bg-white/0 transition hover:bg-white/5">
                    <td className="px-5 py-4 align-top text-sm font-medium text-white">{user.name}</td>
                    <td className="px-5 py-4 align-top text-sm text-slate-200">{user.email}</td>
                    <td className="px-5 py-4 align-top">
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user._id, e.target.value)}
                        disabled={savingId === user._id}
                        className="w-full max-w-44 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm capitalize text-white outline-none transition focus:border-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {ROLE_OPTIONS.map((option) => (
                          <option key={option} value={option} className="bg-slate-900">
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 align-top text-sm text-slate-200">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}