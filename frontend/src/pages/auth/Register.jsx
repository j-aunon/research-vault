import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-black/70 border border-purple-500/30 rounded-2xl p-8 shadow-xl shadow-purple-500/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">Create Account</h1>
        </div>

        <label className="block text-sm text-gray-300 mb-2">Name</label>
        <input
          type="text"
          className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        />

        <label className="block text-sm text-gray-300 mb-2">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          required
        />

        <label className="block text-sm text-gray-300 mb-2">Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.password}
          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          required
          minLength={8}
        />

        {error ? <p className="text-red-400 text-sm mt-4">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 rounded-lg shadow-lg shadow-blue-500/40 disabled:opacity-60"
        >
          {submitting ? 'Creating...' : 'Register'}
        </button>

        <p className="text-sm text-gray-400 mt-4">
          Already have an account?{' '}
          <Link className="text-cyan-400 hover:text-cyan-300" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
