import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, getCategories, uploadImage, deleteProduct } from '../api/client';

export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', slug: '', category: '', price: '', stock: '', description: '' });
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState({ name: '', slug: '', category: '', price: '', stock: '', description: '', image: '' });

  async function load() {
    const res = await getProducts();
    if (res) setProducts(res);
    const cats = await getCategories();
    if (cats) setCategories(cats);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      let imageUrl = '';
      if (file) {
        const uploaded = await uploadImage(file);
        imageUrl = uploaded.url || uploaded.secure_url || '';
      }

      await createProduct({
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: form.category,
        description: form.description,
        price: Number(form.price || 0),
        stock: Number(form.stock || 0),
        images: imageUrl ? [imageUrl] : [],
      });

      setForm({ name: '', slug: '', category: '', price: '', stock: '', description: '' });
      setFile(null);
      await load();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id);
    await load();
  }

  function startEdit(product) {
    setEditingId(product._id);
    setEditingForm({
      name: product.name,
      slug: product.slug || '',
      category: product.category?._id || product.category || '',
      price: product.price ?? '',
      stock: product.stock ?? '',
      description: product.description || '',
      image: product.images?.[0] || '',
    });
  }

  async function handleUpdate(id) {
    try {
      let imageUrl = editingForm.image;
      if (file) {
        const uploaded = await uploadImage(file);
        imageUrl = uploaded.url || uploaded.secure_url || editingForm.image;
      }
      await updateProduct(id, {
        name: editingForm.name,
        slug: editingForm.slug || editingForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: editingForm.category,
        description: editingForm.description,
        price: Number(editingForm.price || 0),
        stock: Number(editingForm.stock || 0),
        images: imageUrl ? [imageUrl] : [],
      });
      setEditingId(null);
      setFile(null);
      await load();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Products</h1>

      <form onSubmit={handleCreate} className="mt-4 grid gap-3 max-w-lg">
        <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Name" className="rounded-2xl border border-slate-200 px-4 py-3" required />
        <input value={form.slug} onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))} placeholder="Slug (optional)" className="rounded-2xl border border-slate-200 px-4 py-3" />
        <select value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3">
          <option value="">Select category</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input value={form.price} onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))} placeholder="Price" type="number" className="rounded-2xl border border-slate-200 px-4 py-3" />
        <input value={form.stock} onChange={(e) => setForm((s) => ({ ...s, stock: e.target.value }))} placeholder="Stock" type="number" className="rounded-2xl border border-slate-200 px-4 py-3" />
        <textarea value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} placeholder="Description" className="rounded-2xl border border-slate-200 px-4 py-3" />
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <div>
          <button className="rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white">Create product</button>
        </div>
      </form>

      <ul className="mt-6 grid gap-3">
        {products.map((p) => (
          <li key={p._id} className="rounded-2xl border border-slate-200 bg-white p-4">
            {editingId === p._id ? (
              <div className="grid gap-3">
                <input value={editingForm.name} onChange={(e) => setEditingForm((s) => ({ ...s, name: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3" />
                <input value={editingForm.slug} onChange={(e) => setEditingForm((s) => ({ ...s, slug: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3" />
                <select value={editingForm.category} onChange={(e) => setEditingForm((s) => ({ ...s, category: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <input value={editingForm.price} onChange={(e) => setEditingForm((s) => ({ ...s, price: e.target.value }))} type="number" className="rounded-2xl border border-slate-200 px-4 py-3" />
                <input value={editingForm.stock} onChange={(e) => setEditingForm((s) => ({ ...s, stock: e.target.value }))} type="number" className="rounded-2xl border border-slate-200 px-4 py-3" />
                <textarea value={editingForm.description} onChange={(e) => setEditingForm((s) => ({ ...s, description: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3" />
                <input value={editingForm.image} onChange={(e) => setEditingForm((s) => ({ ...s, image: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3" />
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(p._id)} className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Save</button>
                  <button onClick={() => { setEditingId(null); setFile(null); }} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-slate-500">Rs. {p.price}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(p)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600">Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
