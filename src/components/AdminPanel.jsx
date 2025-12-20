import React, { useState, useEffect } from 'react';
import { PlusCircle, Lock, Upload, Loader, Edit } from 'lucide-react';
import { supabase } from '../supabase';

export function AdminPanel({ onAddProduct, onUpdateProduct, editingProduct, onCancelEdit }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [loginError, setLoginError] = useState('');
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        discount: '0',
        category: 'Poshak',
        imageFile: null, // Store file object instead of base64
        preview: '',     // Store preview URL
        description: '',
        product_code: ''
    });

    // Populate form when editing
    useEffect(() => {
        if (editingProduct) {
            setFormData({
                name: editingProduct.name || '',
                price: editingProduct.price?.toString() || '',
                discount: editingProduct.discount?.toString() || '0',
                category: editingProduct.category || 'Poshak',
                imageFile: null,
                preview: editingProduct.image || '',
                description: editingProduct.description || '',
                product_code: editingProduct.product_code || ''
            });
        }
    }, [editingProduct]);

    const handleLogin = (e) => {
        e.preventDefault();
        // Hardcoded password for demonstration
        if (passwordInput === 'admin123') {
            setIsAuthenticated(true);
            setLoginError('');
        } else {
            setLoginError('Invalid access code');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                imageFile: file,
                preview: URL.createObjectURL(file)
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price) return;

        setUploading(true);
        try {
            let imageUrl = editingProduct ? editingProduct.image : 'https://images.unsplash.com/photo-1628882835978-29938b823b16?w=500&auto=format&fit=crop&q=60';

            // 1. Upload Image if exists
            if (formData.imageFile) {
                const fileExt = formData.imageFile.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(fileName, formData.imageFile);

                if (uploadError) throw uploadError;

                // 2. Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(fileName);

                imageUrl = publicUrl;
            }

            const productData = {
                name: formData.name,
                price: parseFloat(formData.price),
                discount: parseInt(formData.discount) || 0,
                category: formData.category,
                description: formData.description,
                image: imageUrl,
                product_code: formData.product_code
            };

            if (editingProduct) {
                // UPDATE existing product
                const { data, error: dbError } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', editingProduct.id)
                    .select();

                if (dbError) throw dbError;

                if (data && data.length > 0) {
                    onUpdateProduct(data[0]);
                    setFormData({ name: '', price: '', discount: '0', category: 'Poshak', imageFile: null, preview: '', description: '', product_code: '' });
                    alert('Success! Product updated.');
                    if (onCancelEdit) onCancelEdit();
                }
            } else {
                // INSERT new product
                const { data, error: dbError } = await supabase
                    .from('products')
                    .insert([productData])
                    .select();

                if (dbError) throw dbError;

                if (data && data.length > 0) {
                    onAddProduct(data[0]);
                    setFormData({ name: '', price: '', discount: '0', category: 'Poshak', imageFile: null, preview: '', description: '', product_code: '' });
                    alert('Success! Product added to Kanha Poshak Bhandar database.');
                }
            }

        } catch (error) {
            console.error('Error saving product:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-panel">
                <div className="container">
                    <div className="admin-card login-card">
                        <div className="admin-header">
                            <Lock size={24} color="white" />
                            <h3>Admin Access</h3>
                        </div>
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label>Enter Security Code</label>
                                <input
                                    type="password"
                                    placeholder="Enter passcode"
                                    value={passwordInput}
                                    onChange={e => setPasswordInput(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            {loginError && <p className="error-msg">{loginError}</p>}
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                Login
                            </button>
                        </form>
                    </div>
                </div>
                <style>{`
                    .admin-panel {
                        background-color: var(--color-text-main);
                        padding: 2rem 0;
                        color: white;
                        margin-bottom: 2rem;
                    }
                    .admin-card {
                        background: rgba(255,255,255,0.1);
                        padding: 2rem;
                        border-radius: var(--radius-lg);
                        max-width: 600px;
                        margin: 0 auto;
                        backdrop-filter: blur(5px);
                    }
                    .login-card {
                        max-width: 400px;
                    }
                    .admin-header {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        margin-bottom: 2rem;
                        border-bottom: 1px solid rgba(255,255,255,0.2);
                        padding-bottom: 1rem;
                    }
                    .form-group {
                        margin-bottom: 1rem;
                    }
                    .error-msg {
                        color: #ff6b6b;
                        font-size: 0.9rem;
                        margin-bottom: 1rem;
                        text-align: center;
                    }
                    label {
                        display: block;
                        margin-bottom: 0.5rem;
                        font-size: 0.9rem;
                        color: #ddd;
                    }
                    input, select, textarea {
                        width: 100%;
                        padding: 0.75rem;
                        border-radius: var(--radius-md);
                        border: 1px solid rgba(255,255,255,0.2);
                        background: rgba(0,0,0,0.2);
                        color: white;
                        font-family: inherit;
                    }
                    input:focus {
                        outline: 2px solid var(--color-primary);
                        border-color: transparent;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="admin-panel">
            <div className="container">
                <div className="admin-card">
                    <div className="admin-header">
                        {editingProduct ? <Edit size={24} color="white" /> : <PlusCircle size={24} color="white" />}
                        <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Product Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Blue Velvet Poshak"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Unique Item Code / SKU</label>
                            <input
                                type="text"
                                placeholder="e.g. KPB-001"
                                value={formData.product_code}
                                onChange={e => setFormData({ ...formData, product_code: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Price (₹)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 500"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Discount (%)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 10"
                                    min="0"
                                    max="99"
                                    value={formData.discount}
                                    onChange={e => setFormData({ ...formData, discount: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option>Poshak</option>
                                    <option>Accessories</option>
                                    <option>Idols</option>
                                    <option>Tasveer</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>

                        {/* File Upload Section */}
                        <div className="form-group">
                            <label>Product Image</label>
                            <div className="file-upload-wrapper">
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="imageUpload"
                                    onChange={handleImageChange}
                                    className="file-input"
                                />
                                <label htmlFor="imageUpload" className="file-label">
                                    <Upload size={20} />
                                    <span>{formData.preview ? 'Image Selected (Click to change)' : 'Upload from Device'}</span>
                                </label>
                            </div>

                            {formData.preview && (
                                <div className="image-preview">
                                    <img src={formData.preview} alt="Preview" />
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                rows="3"
                                placeholder="Product details..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={uploading}>
                                {uploading ? (
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <Loader className="spin" size={20} /> {editingProduct ? 'Updating...' : 'Uploading...'}
                                    </span>
                                ) : (
                                    editingProduct ? 'Update Product' : 'Add Product to Shop'
                                )}
                            </button>
                            {editingProduct && onCancelEdit && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onCancelEdit}
                                    style={{ flex: 0.5 }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div >
            <style>{`
        .admin-panel {
          background-color: var(--color-text-main);
          padding: 2rem 0;
          color: white;
          margin-bottom: 2rem;
        }
        .admin-card {
          background: rgba(255,255,255,0.1);
          padding: 2rem;
          border-radius: var(--radius-lg);
          max-width: 600px;
          margin: 0 auto;
          backdrop-filter: blur(5px);
        }
        .admin-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          padding-bottom: 1rem;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: #ddd;
        }
        input, select, textarea {
          width: 100%;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(0,0,0,0.2);
          color: white;
          font-family: inherit;
        }
        input:focus {
          outline: 2px solid var(--color-primary);
          border-color: transparent;
        }
        
        /* File Upload Styles */
        .file-input {
            display: none;
        }
        .file-label {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 1rem;
            background: rgba(255,255,255,0.1);
            border: 2px dashed rgba(255,255,255,0.3);
            border-radius: var(--radius-md);
            cursor: pointer;
            transition: all 0.2s;
        }
        .file-label:hover {
            background: rgba(255,255,255,0.15);
            border-color: var(--color-primary);
        }
        .image-preview {
            margin-top: 1rem;
            width: 100%;
            height: 200px;
            border-radius: var(--radius-md);
            overflow: hidden;
            background: rgba(0,0,0,0.2);
            object-fit: contain;
        }
        .image-preview img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .spin {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .form-actions {
            display: flex;
            gap: 1rem;
            width: 100%;
        }
        .btn-secondary {
            background: rgba(255,255,255,0.2);
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
        }
        .btn-secondary:hover {
            background: rgba(255,255,255,0.3);
        }
      `}</style>
        </div >
    );
}
