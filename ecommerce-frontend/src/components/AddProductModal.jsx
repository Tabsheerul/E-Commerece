import React, { useState, useEffect } from 'react';

// Categories matching our new art themes
const CATEGORY_OPTIONS = ['Anime', 'Automotive', 'Superheroes', 'Sports'];

const AddProductModal = ({ isOpen, onClose, onProductSaved, productToEdit }) => {

  // Form state — includes the new 'device' field
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: '',
    isNew: true,
    device: '',  // NEW: which phone model this fits
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // When editing, pre-fill the form with existing product data
  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit);
    } else {
      // Reset form when opening for a new product
      setFormData({ name: '', category: '', price: '', description: '', image: '', isNew: true, device: '' });
    }
  }, [productToEdit]);

  // Don't render the modal at all if it's closed
  if (!isOpen) return null;

  // Generic handler for all text/select inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Parse price to a float before sending to Java
    const productToSend = { ...formData, price: parseFloat(formData.price) };

    // Decide: are we creating (POST) or updating (PUT)?
    const isUpdating = Boolean(productToEdit);
    const url = isUpdating
      ? `http://localhost:8080/api/products/${productToEdit.id}`
      : 'http://localhost:8080/api/products';
    const method = isUpdating ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productToSend),
    })
      .then(response => response.json())
      .then(data => {
        onProductSaved(data, isUpdating); // Notify AdminDashboard
        setIsSubmitting(false);
        onClose();
      })
      .catch(error => {
        console.error('Error saving product:', error);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {productToEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              required
              type="text"
              name="name"
              placeholder='e.g. "Matte Black Skin for iPhone 15 Pro"'
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category — now a dropdown instead of free text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand / Category</label>
              <select
                required
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              >
                <option value="">Select brand...</option>
                {CATEGORY_OPTIONS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                name="price"
                placeholder="e.g. 14.99"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Device Compatibility — NEW FIELD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Compatible Device
            </label>
            <input
              type="text"
              name="device"
              placeholder='e.g. "iPhone 15 Pro" or "Galaxy S24 Ultra"'
              value={formData.device || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              required
              type="url"
              name="image"
              placeholder="https://..."
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              name="description"
              rows="3"
              placeholder="Describe the material, protection level, special features..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition disabled:opacity-70"
            >
              {isSubmitting ? 'Saving...' : (productToEdit ? 'Update Product' : 'Save Product')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProductModal;