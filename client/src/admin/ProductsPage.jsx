import { useEffect, useState } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  getCategories,
  uploadImage,
  deleteProduct,
} from '../api/client';

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function createEmptyVariant() {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    weight: '',
    unit: 'kg',
    price: '',
    stock: '',
    label: '',
  };
}

const emptyForm = {
  name: '',
  category: '',
  description: '',
  price: '',
  stock: '',
  featured: false,
  latest: false,
  variants: [],
};

function getImage(product) {
  return product?.images?.[0] || product?.image || '';
}

function prepareVariants(variants = []) {
  return variants
    .filter((variant) => {
      const weight = Number(variant.weight);
      const price = Number(variant.price);

      return (
        Number.isFinite(weight) &&
        weight > 0 &&
        Number.isFinite(price) &&
        price >= 0
      );
    })
    .map((variant, index) => ({
      id:
        variant.id ||
        `${Date.now()}-${index}-${Math.random()
          .toString(36)
          .slice(2)}`,

      label:
        variant.label?.trim() ||
        `${variant.weight} ${variant.unit || 'kg'}`,

      weight: Number(variant.weight),

      unit: variant.unit || 'kg',

      price: Number(variant.price),

      stock: Math.max(
        0,
        Number(variant.stock || 0)
      ),
    }));
}

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Create form
  |--------------------------------------------------------------------------
  */

  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Edit form
  |--------------------------------------------------------------------------
  */

  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState(emptyForm);
  const [editingFile, setEditingFile] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Load products + categories
  |--------------------------------------------------------------------------
  */

  async function load() {
    try {
      setLoading(true);

      const [productData, categoryData] =
        await Promise.all([
          getProducts(),
          getCategories(),
        ]);

      setProducts(productData || []);
      setCategories(categoryData || []);
    } catch (error) {
      console.error(
        'Failed to load products:',
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Create form helpers
  |--------------------------------------------------------------------------
  */

  function updateForm(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateVariant(
    index,
    field,
    value
  ) {
    setForm((previous) => ({
      ...previous,

      variants: previous.variants.map(
        (variant, variantIndex) =>
          variantIndex === index
            ? {
                ...variant,
                [field]: value,
              }
            : variant
      ),
    }));
  }

  function addVariant() {
    setForm((previous) => ({
      ...previous,

      variants: [
        ...previous.variants,
        createEmptyVariant(),
      ],
    }));
  }

  function removeVariant(index) {
    setForm((previous) => ({
      ...previous,

      variants: previous.variants.filter(
        (_, variantIndex) =>
          variantIndex !== index
      ),
    }));
  }

  /*
  |--------------------------------------------------------------------------
  | Edit form helpers
  |--------------------------------------------------------------------------
  */

  function updateEditingForm(
    field,
    value
  ) {
    setEditingForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateEditingVariant(
    index,
    field,
    value
  ) {
    setEditingForm((previous) => ({
      ...previous,

      variants:
        previous.variants.map(
          (variant, variantIndex) =>
            variantIndex === index
              ? {
                  ...variant,
                  [field]: value,
                }
              : variant
        ),
    }));
  }

  function addEditingVariant() {
    setEditingForm((previous) => ({
      ...previous,

      variants: [
        ...previous.variants,
        createEmptyVariant(),
      ],
    }));
  }

  function removeEditingVariant(
    index
  ) {
    setEditingForm((previous) => ({
      ...previous,

      variants:
        previous.variants.filter(
          (_, variantIndex) =>
            variantIndex !== index
        ),
    }));
  }

  /*
  |--------------------------------------------------------------------------
  | CREATE PRODUCT
  |--------------------------------------------------------------------------
  */

  async function handleCreate(event) {
    event.preventDefault();

    if (saving) return;

    try {
      setSaving(true);

      /*
      |----------------------------------------------------------------------
      | Upload image
      |----------------------------------------------------------------------
      */

      let imageUrl = '';

      if (file) {
        const uploaded =
          await uploadImage(file);

        imageUrl =
          uploaded?.url ||
          uploaded?.secure_url ||
          '';
      }

      /*
      |----------------------------------------------------------------------
      | Prepare variants
      |----------------------------------------------------------------------
      */

      const variants =
        prepareVariants(form.variants);

      /*
      |----------------------------------------------------------------------
      | Main product price
      |----------------------------------------------------------------------
      |
      | Important:
      | Main product price remains separate.
      |
      | Agar variants hain:
      | first variant ki price default display price hogi.
      |
      */

      const mainPrice =
        variants.length > 0
          ? variants[0].price
          : Number(form.price || 0);

      /*
      |----------------------------------------------------------------------
      | Main product stock
      |----------------------------------------------------------------------
      */

      const mainStock =
        variants.length > 0
          ? variants.reduce(
              (total, variant) =>
                total + variant.stock,
              0
            )
          : Number(form.stock || 0);

      /*
      |----------------------------------------------------------------------
      | Create API request
      |----------------------------------------------------------------------
      */

      await createProduct({
        name: form.name.trim(),

        category: form.category,

        description:
          form.description.trim(),

        price: mainPrice,

        stock: mainStock,

        images: imageUrl
          ? [imageUrl]
          : [],

        variants,

        featured: Boolean(
          form.featured
        ),

        latest: Boolean(
          form.latest
        ),

        isActive: true,
      });

      /*
      |----------------------------------------------------------------------
      | Reset
      |----------------------------------------------------------------------
      */

      setForm({
        ...emptyForm,
        variants: [],
      });

      setFile(null);

      await load();
    } catch (error) {
      console.error(
        'Failed to create product:',
        error
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to create product'
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | START EDIT
  |--------------------------------------------------------------------------
  */

  function startEdit(product) {
    const productVariants =
      Array.isArray(product.variants)
        ? product.variants.map(
            (variant, index) => ({
              id:
                variant.id ||
                `${Date.now()}-${index}-${Math.random()
                  .toString(36)
                  .slice(2)}`,

              weight:
                variant.weight ?? '',

              unit:
                variant.unit || 'kg',

              price:
                variant.price ?? '',

              stock:
                variant.stock ?? '',

              label:
                variant.label || '',
            })
          )
        : [];

    setEditingId(product._id);

    setEditingForm({
      name: product.name || '',

      category:
        product.category?._id ||
        product.category ||
        '',

      description:
        product.description || '',

      /*
      |----------------------------------------------------------------------
      | Main product price
      |----------------------------------------------------------------------
      */

      price:
        product.price ?? '',

      /*
      |----------------------------------------------------------------------
      | Main product stock
      |----------------------------------------------------------------------
      */

      stock:
        product.stock ?? '',

      featured:
        Boolean(product.featured),

      latest:
        Boolean(product.latest),

      /*
      |----------------------------------------------------------------------
      | Existing variants
      |----------------------------------------------------------------------
      */

      variants: productVariants,
    });

    setEditingFile(null);
  }

  /*
  |--------------------------------------------------------------------------
  | UPDATE PRODUCT
  |--------------------------------------------------------------------------
  */

  async function handleUpdate(id) {
    if (saving) return;

    try {
      setSaving(true);

      /*
      |----------------------------------------------------------------------
      | Existing image
      |----------------------------------------------------------------------
      */

      const currentProduct =
        products.find(
          (product) =>
            product._id === id
        );

      let imageUrl =
        currentProduct?.images?.[0] ||
        currentProduct?.image ||
        '';

      /*
      |----------------------------------------------------------------------
      | New image
      |----------------------------------------------------------------------
      */

      if (editingFile) {
        const uploaded =
          await uploadImage(
            editingFile
          );

        imageUrl =
          uploaded?.url ||
          uploaded?.secure_url ||
          imageUrl;
      }

      /*
      |----------------------------------------------------------------------
      | Prepare variants
      |----------------------------------------------------------------------
      */

      const variants =
        prepareVariants(
          editingForm.variants
        );

      /*
      |----------------------------------------------------------------------
      | Main product price
      |----------------------------------------------------------------------
      */

      const mainPrice =
        variants.length > 0
          ? variants[0].price
          : Number(
              editingForm.price || 0
            );

      /*
      |----------------------------------------------------------------------
      | Main stock
      |----------------------------------------------------------------------
      */

      const mainStock =
        variants.length > 0
          ? variants.reduce(
              (total, variant) =>
                total + variant.stock,
              0
            )
          : Number(
              editingForm.stock || 0
            );

      /*
      |----------------------------------------------------------------------
      | Update
      |----------------------------------------------------------------------
      */

      await updateProduct(id, {
        name:
          editingForm.name.trim(),

        category:
          editingForm.category,

        description:
          editingForm.description.trim(),

        price: mainPrice,

        stock: mainStock,

        images: imageUrl
          ? [imageUrl]
          : [],

        variants,

        featured: Boolean(
          editingForm.featured
        ),

        latest: Boolean(
          editingForm.latest
        ),

        isActive: true,
      });

      /*
      |----------------------------------------------------------------------
      | Reset edit
      |----------------------------------------------------------------------
      */

      setEditingId(null);
      setEditingFile(null);

      await load();
    } catch (error) {
      console.error(
        'Failed to update product:',
        error
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to update product'
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | DELETE PRODUCT
  |--------------------------------------------------------------------------
  */

  async function handleDelete(id) {
    if (deletingId) return;

    const confirmed =
      window.confirm(
        'Are you sure you want to delete this product?'
      );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteProduct(id);

      await load();
    } catch (error) {
      console.error(
        'Failed to delete product:',
        error
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to delete product'
      );
    } finally {
      setDeletingId(null);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | VARIANT EDITOR
  |--------------------------------------------------------------------------
  */

  function renderVariantEditor({
    variants,
    updateVariantFn,
    removeVariantFn,
    addVariantFn,
  }) {
    return (
      <div className="rounded-3xl border border-[#dde3d8] bg-[#fafaf6] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-brand-900">
              Product Weights / Sizes
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Product ki main details yahan
              change nahi hongi. Sirf different
              weights, prices aur stock add karein.
            </p>
          </div>

          <button
            type="button"
            onClick={addVariantFn}
            className="rounded-full bg-brand-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-800 active:scale-95"
          >
            + Add Weight
          </button>
        </div>

        {variants.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center text-sm text-slate-500">
            Abhi koi weight/size add nahi hai.
            <br />
            Agar product ke different sizes hain
            to <strong>+ Add Weight</strong> par
            click karein.
          </div>
        ) : (
          <div className="mt-4 grid gap-4">
            {variants.map(
              (variant, index) => (
                <div
                  key={
                    variant.id || index
                  }
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                    {/* Weight */}

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-500">
                        Weight / Size
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.001"
                        value={
                          variant.weight
                        }
                        onChange={(event) =>
                          updateVariantFn(
                            index,
                            'weight',
                            event.target.value
                          )
                        }
                        placeholder="1"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                      />
                    </div>

                    {/* Unit */}

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-500">
                        Unit
                      </label>

                      <select
                        value={
                          variant.unit
                        }
                        onChange={(event) =>
                          updateVariantFn(
                            index,
                            'unit',
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-brand-600"
                      >
                        <option value="g">
                          Gram
                        </option>

                        <option value="kg">
                          Kilogram
                        </option>

                        <option value="ml">
                          Milliliter
                        </option>

                        <option value="L">
                          Liter
                        </option>

                        <option value="pack">
                          Pack
                        </option>

                        <option value="piece">
                          Piece
                        </option>
                      </select>
                    </div>

                    {/* Price */}

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-500">
                        Price (Rs.)
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={
                          variant.price
                        }
                        onChange={(event) =>
                          updateVariantFn(
                            index,
                            'price',
                            event.target.value
                          )
                        }
                        placeholder="300"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                      />
                    </div>

                    {/* Stock */}

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-500">
                        Stock
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={
                          variant.stock
                        }
                        onChange={(event) =>
                          updateVariantFn(
                            index,
                            'stock',
                            event.target.value
                          )
                        }
                        placeholder="20"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                      />
                    </div>

                    {/* Remove */}

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() =>
                          removeVariantFn(
                            index
                          )
                        }
                        className="w-full rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50 active:scale-95"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Label */}

                  <div className="mt-3">
                    <label className="mb-1 block text-xs font-bold text-slate-500">
                      Label (optional)
                    </label>

                    <input
                      value={
                        variant.label
                      }
                      onChange={(event) =>
                        updateVariantFn(
                          index,
                          'label',
                          event.target.value
                        )
                      }
                      placeholder="Example: 1kg Premium"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                    />

                    <p className="mt-1 text-xs text-slate-400">
                      Agar blank chhor dein to
                      automatic label ban jayega.
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b9862f]">
          Admin
        </p>

        <h1 className="mt-1 text-3xl font-bold text-brand-900">
          Products
        </h1>

        <p className="mt-2 text-slate-500">
          Products, images, prices, weights
          aur stock manage karein.
        </p>
      </div>

      {/* ================================================================= */}
      {/* CREATE PRODUCT */}
      {/* ================================================================= */}

      <form
        onSubmit={handleCreate}
        className="rounded-3xl border border-[#dde3d8] bg-white p-5 shadow-soft md:p-7"
      >
        <h2 className="text-2xl font-bold text-brand-900">
          Add New Product
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Pehle product ki main information
          enter karein.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {/* Name */}

          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              Product Name
            </label>

            <input
              value={form.name}
              onChange={(event) =>
                updateForm(
                  'name',
                  event.target.value
                )
              }
              placeholder="Example: Premium Honey"
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {/* Category */}

          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              Category
            </label>

            <select
              value={form.category}
              onChange={(event) =>
                updateForm(
                  'category',
                  event.target.value
                )
              }
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-600"
            >
              <option value="">
                Select category
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Description */}

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-bold text-slate-700">
              Product Description
            </label>

            <textarea
              value={form.description}
              onChange={(event) =>
                updateForm(
                  'description',
                  event.target.value
                )
              }
              placeholder="Product description..."
              required
              rows={4}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {/* Default Price */}

          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              Default Price
            </label>

            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(event) =>
                updateForm(
                  'price',
                  event.target.value
                )
              }
              placeholder="Price"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600"
            />

            <p className="mt-1 text-xs text-slate-400">
              Agar variants add karein to first
              variant ki price default price banegi.
            </p>
          </div>

          {/* Default Stock */}

          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              Default Stock
            </label>

            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(event) =>
                updateForm(
                  'stock',
                  event.target.value
                )
              }
              placeholder="Stock"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600"
            />

            <p className="mt-1 text-xs text-slate-400">
              Variants hon to total stock automatically
              calculate hoga.
            </p>
          </div>

          {/* Image */}

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setFile(
                  event.target.files?.[0] ||
                    null
                )
              }
              className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm"
            />
          </div>
        </div>

        {/* =============================================================== */}
        {/* VARIANTS */}
        {/* =============================================================== */}

        <div className="mt-6">
          {renderVariantEditor({
            variants: form.variants,
            updateVariantFn:
              updateVariant,
            removeVariantFn:
              removeVariant,
            addVariantFn:
              addVariant,
          })}
        </div>

        {/* Flags */}

        <div className="mt-5 flex flex-wrap gap-5">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) =>
                updateForm(
                  'featured',
                  event.target.checked
                )
              }
              className="h-4 w-4 accent-green-700"
            />

            Featured Product
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={form.latest}
              onChange={(event) =>
                updateForm(
                  'latest',
                  event.target.checked
                )
              }
              className="h-4 w-4 accent-green-700"
            />

            Latest Product
          </label>
        </div>

        {/* Create */}

        <button
          type="submit"
          disabled={saving}
          className="mt-6 inline-flex min-w-[180px] items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-3 font-bold text-white transition hover:bg-brand-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}

          {saving
            ? 'Creating...'
            : 'Create Product'}
        </button>
      </form>

      {/* ================================================================= */}
      {/* ALL PRODUCTS */}
      {/* ================================================================= */}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-brand-900">
            All Products
          </h2>

          <span className="rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700">
            {products.length} Products
          </span>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5"
                >
                  <div className="h-48 rounded-2xl bg-slate-200" />

                  <div className="mt-4 h-5 w-2/3 rounded bg-slate-200" />

                  <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />
                </div>
              )
            )}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="text-xl font-bold text-slate-700">
              No products yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Create your first product above.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map(
              (product) => (
                <article
                  key={product._id}
                  className="group overflow-hidden rounded-3xl border border-[#dde3d8] bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image */}

                  <div className="relative h-52 overflow-hidden bg-[#f5f5ef]">
                    {getImage(product) ? (
                      <img
                        src={getImage(
                          product
                        )}
                        alt={
                          product.name
                        }
                        className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        No Image
                      </div>
                    )}

                    {product.featured && (
                      <span className="absolute left-3 top-3 rounded-full bg-[#b9862f] px-3 py-1 text-xs font-bold text-white">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Product information */}

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-brand-900">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {product.category
                        ?.name ||
                        'No category'}
                    </p>

                    <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                      {
                        product.description
                      }
                    </p>

                    {/* Main price */}

                    <div className="mt-4 rounded-xl bg-brand-50 p-3">
                      <div className="text-xs font-semibold uppercase text-slate-500">
                        Starting Price
                      </div>

                      <div className="mt-1 text-lg font-bold text-brand-700">
                        Rs.{' '}
                        {
                          product.price
                        }
                      </div>
                    </div>

                    {/* Variants */}

                    {product.variants
                      ?.length >
                      0 && (
                      <div className="mt-4">
                        <p className="mb-2 text-sm font-bold text-brand-900">
                          Available Weights
                        </p>

                        <div className="space-y-2">
                          {product.variants.map(
                            (
                              variant
                            ) => (
                              <div
                                key={
                                  variant.id
                                }
                                className="flex items-center justify-between rounded-xl bg-[#f7f6ef] px-3 py-2"
                              >
                                <div>
                                  <div className="text-sm font-bold text-brand-900">
                                    {variant.label ||
                                      `${variant.weight} ${variant.unit}`}
                                  </div>

                                  <div className="text-xs text-slate-500">
                                    Stock:{' '}
                                    {
                                      variant.stock
                                    }
                                  </div>
                                </div>

                                <div className="text-sm font-bold text-brand-700">
                                  Rs.{' '}
                                  {
                                    variant.price
                                  }
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Buttons */}

                    <div className="mt-5 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          startEdit(
                            product
                          )
                        }
                        className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-brand-600 hover:bg-brand-50 active:scale-95"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={
                          deletingId ===
                          product._id
                        }
                        onClick={() =>
                          handleDelete(
                            product._id
                          )
                        }
                        className="flex-1 rounded-full border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50 active:scale-95 disabled:opacity-50"
                      >
                        {deletingId ===
                        product._id
                          ? 'Deleting...'
                          : 'Delete'}
                      </button>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>

      {/* ================================================================= */}
      {/* EDIT MODAL */}
      {/* ================================================================= */}

      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl md:p-8">
            {/* Modal header */}

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b9862f]">
                  Admin
                </p>

                <h2 className="text-2xl font-bold text-brand-900">
                  Edit Product
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Product ki main details aur
                  variants separately manage karein.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingId(null)
                }
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            {/* Main information */}

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {/* Name */}

              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">
                  Product Name
                </label>

                <input
                  value={
                    editingForm.name
                  }
                  onChange={(event) =>
                    updateEditingForm(
                      'name',
                      event.target.value
                    )
                  }
                  placeholder="Product name"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600"
                />
              </div>

              {/* Category */}

              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">
                  Category
                </label>

                <select
                  value={
                    editingForm.category
                  }
                  onChange={(event) =>
                    updateEditingForm(
                      'category',
                      event.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-600"
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={
                          category._id
                        }
                        value={
                          category._id
                        }
                      >
                        {
                          category.name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Description */}

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-bold text-slate-700">
                  Description
                </label>

                <textarea
                  value={
                    editingForm.description
                  }
                  onChange={(event) =>
                    updateEditingForm(
                      'description',
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Description"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600"
                />
              </div>

              {/* Default price */}

              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">
                  Default Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={
                    editingForm.price
                  }
                  onChange={(event) =>
                    updateEditingForm(
                      'price',
                      event.target.value
                    )
                  }
                  placeholder="Default price"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                />
              </div>

              {/* Default stock */}

              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">
                  Default Stock
                </label>

                <input
                  type="number"
                  min="0"
                  value={
                    editingForm.stock
                  }
                  onChange={(event) =>
                    updateEditingForm(
                      'stock',
                      event.target.value
                    )
                  }
                  placeholder="Default stock"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                />
              </div>

              {/* Image */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Replace Product Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setEditingFile(
                      event.target.files?.[0] ||
                        null
                    )
                  }
                  className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm"
                />
              </div>
            </div>

            {/* Variants */}

            <div className="mt-6">
              {renderVariantEditor({
                variants:
                  editingForm.variants,

                updateVariantFn:
                  updateEditingVariant,

                removeVariantFn:
                  removeEditingVariant,

                addVariantFn:
                  addEditingVariant,
              })}
            </div>

            {/* Flags */}

            <div className="mt-5 flex flex-wrap gap-5">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={
                    editingForm.featured
                  }
                  onChange={(event) =>
                    updateEditingForm(
                      'featured',
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 accent-green-700"
                />

                Featured
              </label>

              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={
                    editingForm.latest
                  }
                  onChange={(event) =>
                    updateEditingForm(
                      'latest',
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 accent-green-700"
                />

                Latest
              </label>
            </div>

            {/* Modal buttons */}

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setEditingFile(null);
                }}
                className="rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 active:scale-95"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  handleUpdate(
                    editingId
                  )
                }
                className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-800 active:scale-95 disabled:opacity-60"
              >
                {saving && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}

                {saving
                  ? 'Saving...'
                  : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}