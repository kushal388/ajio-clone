//vendor/src/vendor/ProductForm.jsx
import React, { useEffect, useState } from "react";

export default function ProductForm({ open, onClose, onSaved, initial = {}, api }) {
  const [form, setForm] = useState({
    productId: "",
    title: "",
    brand: "",
    price: "",
    mrp: "",
    discountPercent: "",
    gender: "Unisex",
    category: "",
    section: "",
    subcategory: "",
    image: "",
    images: "",
    colors: "",
    sizes: "",
    stock: 0,
    tags: "",
    ...initial,
    imagesText: (initial.images && initial.images.join(", ")) || "",
    colorsText: (initial.colors && initial.colors.join(", ")) || "",
    sizesText: (initial.sizes && initial.sizes.join(", ")) || "",
    tagsText: (initial.tags && initial.tags.join(", ")) || "",
  });
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(initial && (initial._id || initial.id));

  useEffect(() => {
    setForm((f) => ({
      ...f,
      ...initial,
      imagesText: (initial.images && initial.images.join(", ")) || "",
      colorsText: (initial.colors && initial.colors.join(", ")) || "",
      sizesText: (initial.sizes && initial.sizes.join(", ")) || "",
      tagsText: (initial.tags && initial.tags.join(", ")) || "",
    }));
  }, [initial]);

  if (!open) return null;

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        productId: form.productId,
        title: form.title,
        brand: form.brand,
        price: Number(form.price),
        mrp: form.mrp ? Number(form.mrp) : undefined,
        discountPercent: form.discountPercent ? Number(form.discountPercent) : undefined,
        gender: form.gender,
        category: form.category,
        section: form.section,
        subcategory: form.subcategory,
        image: form.image, // single URL
        images: form.imagesText ? form.imagesText.split(",").map(s => s.trim()).filter(Boolean) : [],
        colors: form.colorsText ? form.colorsText.split(",").map(s => s.trim()).filter(Boolean) : [],
        sizes: form.sizesText ? form.sizesText.split(",").map(s => s.trim()).filter(Boolean) : [],
        stock: Number(form.stock || 0),
        tags: form.tagsText ? form.tagsText.split(",").map(s => s.trim()).filter(Boolean) : [],
      };

      let res;
      if (isEdit) {
        res = await api.put(`/api/vendor/products/${initial._id || initial.id}`, payload);
      } else {
        res = await api.post("/api/vendor/products", payload);
      }

      onSaved(res.data);
      onClose();
    } catch (err) {
      console.error("Save product error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error saving product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={submit} className="relative bg-white rounded-lg w-full max-w-2xl p-6 shadow-lg z-10">
        <h3 className="text-xl font-bold mb-4">{isEdit ? "Edit Product" : "Add Product"}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="productId" value={form.productId || ""} onChange={onChange} placeholder="Product ID (SKU)" className="border p-2 rounded" required />
          <input name="title" value={form.title || ""} onChange={onChange} placeholder="Title" className="border p-2 rounded" required />
          <input name="brand" value={form.brand || ""} onChange={onChange} placeholder="Brand" className="border p-2 rounded" required />
          <input name="price" value={form.price || ""} onChange={onChange} type="number" placeholder="Price" className="border p-2 rounded" required />
          <input name="mrp" value={form.mrp || ""} onChange={onChange} type="number" placeholder="MRP" className="border p-2 rounded" />
          <input name="discountPercent" value={form.discountPercent || ""} onChange={onChange} type="number" placeholder="Discount %" className="border p-2 rounded" />
          <select name="gender" value={form.gender || "Unisex"} onChange={onChange} className="border p-2 rounded">
            <option>Unisex</option>
            <option>Men</option>
            <option>Women</option>
            <option>Boys</option>
            <option>Girls</option>
          </select>
          <input name="category" value={form.category || ""} onChange={onChange} placeholder="Category" className="border p-2 rounded" required />
          <input name="section" value={form.section || ""} onChange={onChange} placeholder="Section" className="border p-2 rounded" />
          <input name="subcategory" value={form.subcategory || ""} onChange={onChange} placeholder="Subcategory" className="border p-2 rounded" required />
          <input name="image" value={form.image || ""} onChange={onChange} placeholder="Main Image URL" className="border p-2 rounded col-span-1 md:col-span-2" />
          <textarea name="imagesText" value={form.imagesText || ""} onChange={onChange} placeholder="Other image URLs (comma separated)" className="border p-2 rounded col-span-1 md:col-span-2" rows={2} />
          <input name="colorsText" value={form.colorsText || ""} onChange={onChange} placeholder="Colors (comma separated)" className="border p-2 rounded" />
          <input name="sizesText" value={form.sizesText || ""} onChange={onChange} placeholder="Sizes (comma separated)" className="border p-2 rounded" />
          <input name="stock" value={form.stock || 0} onChange={onChange} type="number" placeholder="Stock" className="border p-2 rounded" />
          <input name="tagsText" value={form.tagsText || ""} onChange={onChange} placeholder="Tags (comma separated)" className="border p-2 rounded" />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white" disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save" : "Add product"}
          </button>
        </div>
      </form>
    </div>
  );
}
