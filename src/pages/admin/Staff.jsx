import { useEffect, useState } from 'react';
import { cafeApi } from '../../services/api-client';
import { formatDate } from '../../lib/date';

const FETCH_ERROR = 'Something went wrong. Please try again.';
const ROLE_ERROR = 'Could not update role. Please try again.';
const ASSIGNABLE_ROLES = ['shopper', 'admin'];



export default function Staff() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  // Which row currently has a role update in flight, so its select disables.
  const [savingId, setSavingId] = useState(null);
  const [roleError, setRoleError] = useState('');

  useEffect(() => {
    let cancelled = false;
    cafeApi
      .listUsers()
      .then(({ data }) => {
        if (cancelled) return;
        setUsers(data.data.users);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.response?.data?.error?.message || FETCH_ERROR);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Not optimistic — the select's value stays bound to `users` state, so a
  // failed request naturally leaves the visible role unchanged (no revert
  // logic needed) instead of flashing a role that didn't actually save.
  const handleRoleChange = async (id, role) => {
    setSavingId(id);
    setRoleError('');
    try {
      const { data } = await cafeApi.updateUserRole(id, role);
      const updated = data.data.user;
      setUsers((prev) => prev.map((u) => (u._id === id ? updated : u)));
    } catch (err) {
      setRoleError(err?.response?.data?.error?.message || ROLE_ERROR);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="text-3xl font-bold">Staff</h1>
      <div className="mt-8 rounded border-2 border-black bg-white">
        <div className="px-6 py-5">
          <h2 className="font-bold">Users</h2>
        </div>

        {roleError && (
          <div className="mx-6 mb-4 rounded border-2 border-red-500 bg-white px-4 py-3">
            <p role="alert" className="text-sm text-red-600">
              {roleError}
            </p>
          </div>
        )}

        {status === 'loading' && (
          <p className="px-6 pb-6 text-sm text-neutral-500">Loading staff…</p>
        )}

        {status === 'error' && (
          <div className="mx-6 mb-6 rounded border-2 border-red-500 bg-white px-4 py-3">
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {status === 'success' && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-black/20 bg-brand-grey text-left">
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Created</th>
                <th className="px-6 py-3 font-medium">Edit role</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-neutral-500">
                    No staff yet
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="border-b border-dashed border-black/20 last:border-b-0">
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4 capitalize">{u.role}</td>
                    <td className="px-6 py-4 text-neutral-500">{formatDate(u.createdAt)}</td>
                    <td className="px-6 py-4">
                      {u.role === 'owner' ? (
                        <span className="text-neutral-400">—</span>
                      ) : (
                        <select
                          value={u.role}
                          disabled={savingId === u._id}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="rounded border-2 border-black bg-white px-3 py-1.5 text-sm capitalize disabled:opacity-50"
                        >
                          {ASSIGNABLE_ROLES.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

      </div>
      
      <div className="mt-8 flex h-32 items-center justify-center rounded border-2 border-dashed border-black/20 bg-white text-sm text-neutral-500">
        Stats coming soon
      </div>
    </div>
  );
}
