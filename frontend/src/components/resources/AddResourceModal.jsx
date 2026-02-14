import { useMemo, useState } from 'react';

export default function AddResourceModal({ open, onClose, projects, selectedProject, onCreate }) {
  const [form, setForm] = useState({
    title: '',
    url: '',
    type: 'paper',
    projectId: selectedProject || '',
    folderId: '',
    notes: '',
    tags: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  const folders = useMemo(() => {
    const project = projects.find((p) => p.id === form.projectId);
    return project?.folders || [];
  }, [projects, form.projectId]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await onCreate({
        title: form.title,
        type: form.type,
        projectId: form.projectId,
        folderId: form.folderId || undefined,
        url: form.url || undefined,
        notes: form.notes || undefined,
        file: file || undefined,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      });

      onClose();
      setForm({ title: '', url: '', type: 'paper', projectId: selectedProject || '', folderId: '', notes: '', tags: '' });
      setFile(null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create resource');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="bg-gray-900 border border-blue-500/50 shadow-2xl shadow-blue-500/20 rounded-2xl max-w-2xl w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Add New Resource</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-blue-400 transition-colors">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input type="text" required value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
            <input type="url" value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {(form.type === 'paper' || form.type === 'book') ? (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">PDF File (optional)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 text-gray-200 rounded-lg file:mr-4 file:px-3 file:py-1 file:border-0 file:rounded-md file:bg-blue-600/30 file:text-blue-300"
              />
              <p className="text-xs text-gray-500 mt-1">Max 100MB. Se abrirá en visor al hacer click en el recurso.</p>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="paper">Paper</option>
                <option value="book">Book</option>
                <option value="website">Website</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Project</label>
              <select required value={form.projectId} onChange={(e) => setForm((p) => ({ ...p, projectId: e.target.value, folderId: '' }))} className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Folder</label>
            <select value={form.folderId} onChange={(e) => setForm((p) => ({ ...p, folderId: e.target.value }))} className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">No Folder</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
            <textarea rows={3} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma separated)</label>
            <input type="text" value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <div className="flex gap-3 mt-6">
            <button disabled={saving} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/50 disabled:opacity-60">
              {saving ? 'Adding...' : 'Add Resource'}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-3 border border-purple-500/30 text-gray-300 rounded-lg hover:bg-gray-800/50 transition-all">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
