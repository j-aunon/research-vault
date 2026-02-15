import { useState } from 'react';

export default function AddProjectModal({ open, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('bg-blue-500');
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onCreate({ name, color });
      setName('');
      setColor('bg-blue-500');
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <form onSubmit={submit} className="bg-gray-900 border border-cyan-500/50 rounded-2xl max-w-md w-full p-6">
        <h2 className="text-lg font-semibold text-cyan-300 mb-4">Add Project</h2>
        <input className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 text-gray-100 rounded-lg mb-4" placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} required />
        <select className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 text-gray-100 rounded-lg mb-4" value={color} onChange={(e) => setColor(e.target.value)}>
          <option value="bg-blue-500">Blue</option>
          <option value="bg-cyan-500">Cyan</option>
          <option value="bg-purple-500">Purple</option>
          <option value="bg-green-500">Green</option>
        </select>
        <div className="flex gap-3">
          <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg" disabled={saving}>
            {saving ? 'Saving...' : 'Create'}
          </button>
          <button type="button" className="px-4 border border-purple-500/30 rounded-lg" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
