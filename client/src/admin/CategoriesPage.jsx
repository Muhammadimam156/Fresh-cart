import { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory, uploadImage } from '../api/client';

export function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', image: '' });
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState({ name: '', description: '', image: '' });

  async function load() {
    const cats = await getCategories();
    if (cats) setCategories(cats);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      let imageUrl = form.image;
      if (file) {
        const uploaded = await uploadImage(file);
        imageUrl = uploaded.url || uploaded.secure_url || imageUrl;
      }
      await createCategory({ name: form.name, description: form.description, image: imageUrl });
      setForm({ name: '', description: '', image: '' });
      setFile(null);
      await load();
    } catch (err) {
      // ignore for now
      console.error(err);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this category?')) return;
    await deleteCategory(id);
    await load();
  }

  function startEdit(category) {
    setEditingId(category._id);
    setEditingForm({ name: category.name, description: category.description || '', image: category.image || '' });
  }

  async function handleUpdate(id) {
    try {
      let imageUrl = editingForm.image;
      if (file) {
        const uploaded = await uploadImage(file);
        imageUrl = uploaded.url || uploaded.secure_url || editingForm.image;
      }
      await updateCategory(id, { name: editingForm.name, description: editingForm.description, image: imageUrl });
      setEditingId(null);
      setFile(null);
      await load();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Categories</h1>

      <form onSubmit={handleCreate} className="mt-4 grid gap-3 max-w-md">
        <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Name" className="rounded-2xl border border-slate-200 px-4 py-3" required />
        <input value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} placeholder="Description" className="rounded-2xl border border-slate-200 px-4 py-3" />
        <input value={form.image} onChange={(e) => setForm((s) => ({ ...s, image: e.target.value }))} placeholder="Image URL (or upload)" className="rounded-2xl border border-slate-200 px-4 py-3" />
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <div>
          <button className="rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white">Create category</button>
        </div>
      </form>

      <ul className="mt-6 grid gap-3">
        {categories.map((c) => (
          <li key={c._id} className="rounded-2xl border border-slate-200 bg-white p-4">
            {editingId === c._id ? (
              <div className="grid gap-3">
                <input value={editingForm.name} onChange={(e) => setEditingForm((s) => ({ ...s, name: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3" />
                <input value={editingForm.description} onChange={(e) => setEditingForm((s) => ({ ...s, description: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3" />
                <input value={editingForm.image} onChange={(e) => setEditingForm((s) => ({ ...s, image: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3" />
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(c._id)} className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Save</button>
                  <button onClick={() => { setEditingId(null); setFile(null); }} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-sm text-slate-500">{c.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(c)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Edit</button>
                  <button onClick={() => handleDelete(c._id)} className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600">Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
