import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { getPostLoginRedirect } from '../lib/redirect';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { user } = await login(email, password);
      navigate(getPostLoginRedirect(user.role), { replace: true });
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded border-2 border-black bg-white">
      <div className="space-y-6 px-8 py-8">
        <h1 className="text-center text-2xl font-bold">Sign in</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-neutral-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border-2 border-black px-4 py-3 text-sm"
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="password" className="text-sm text-neutral-700">
                Password
              </label>
              <span className="cursor-not-allowed text-sm text-brand-blue" title="Coming soon">
                Forgot password?
              </span>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border-2 border-black px-4 py-3 text-sm"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-black py-3 text-sm font-semibold tracking-widest text-white hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'SIGNING IN…' : 'SIGN IN'}
          </Button>
        </form>

        <p className="text-center text-xs text-neutral-500">🔒 Secure sign-in</p>
      </div>

      <div className="border-t border-dashed border-black/40 px-8 py-5 text-center">
        <Link to="/" className="text-sm text-neutral-600 hover:text-black">
          ← Back to storefront
        </Link>
      </div>
    </div>
  );
}
