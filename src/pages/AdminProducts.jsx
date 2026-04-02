import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../config';
import AdminHeader from '../components/AdminHeader';
import './AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    gender: '',
    grams: [],
    prices: {},
    originalPrices: {},
    description: '',
    images: ['', '', ''],
    tag: ''
  });
  const [showWeightDropdown, setShowWeightDropdown] = useState(false);

  const CATEGORIES = ['Sandals', 'Shoes', 'Slippers', 'T-Shirts', 'Track Pants'];
  const TAGS = [
    { value: 'bestseller', label: '🔥 Best Seller' },
    { value: 'popular',    label: '⭐ Popular' },
    { value: 'new',        label: '🆕 New Arrival' },
    { value: 'offer',      label: '💰 Offer' },
    { value: 'trending',   label: '📈 Trending' },
    { value: 'limited',    label: '⏳ Limited Edition' },
  ];
  const FOOTWEAR_CATS = ['Sandals', 'Shoes', 'Slippers'];
  const APPAREL_CATS  = ['T-Shirts', 'Track Pants'];

  const FOOTWEAR_SIZES = ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];
  const APPAREL_SIZES  = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  const weightOptions = FOOTWEAR_CATS.includes(formData.category)
    ? FOOTWEAR_SIZES
    : APPAREL_CATS.includes(formData.category)
    ? APPAREL_SIZES
    : [];
  const navigate = useNavigate();

  useEffect(() => {
    verifyToken();
  }, [navigate]);

  const verifyToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(`${config.API_URL}/api/users/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        fetchProducts();
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      if (error.response?.status === 404) {
        fetchProducts();
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setProducts(response.data.products);
      } else if (Array.isArray(response.data)) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const numericPrices = {};
      Object.keys(formData.prices).forEach(key => {
        numericPrices[key] = Number(formData.prices[key]);
      });

      const numericOriginalPrices = {};
      Object.keys(formData.originalPrices).forEach(key => {
        numericOriginalPrices[key] = Number(formData.originalPrices[key]);
      });

      const productData = {
        ...formData,
        prices: numericPrices,
        originalPrices: numericOriginalPrices,
        price: Object.values(numericPrices)[0] || 0
      };
      
      if (editingProduct) {
        await axios.put(`${config.API_URL}/api/products/${editingProduct.id}`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product updated successfully!', { autoClose: 1500 });
      } else {
        await axios.post(`${config.API_URL}/api/products`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product added successfully!', { autoClose: 1500 });
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        toast.error('Error saving product: ' + (error.response?.data?.message || error.message), { autoClose: 1500 });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${config.API_URL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product deleted successfully!', { autoClose: 1500 });
        fetchProducts();
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          toast.error('Error deleting product: ' + error.message, { autoClose: 1500 });
        }
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      gender: product.gender || '',
      grams: product.grams || [],
      prices: product.prices || {},
      originalPrices: product.originalPrices || {},
      description: product.description,
      images: product.images,
      tag: product.tag || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      gender: '',
      grams: [],
      prices: {},
      originalPrices: {},
      description: '',
      images: ['', '', ''],
      tag: ''
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleWeightToggle = (weight) => {
    setFormData(prev => {
      const newGrams = prev.grams.includes(weight)
        ? prev.grams.filter(w => w !== weight)
        : [...prev.grams, weight];
      
      const newPrices = { ...prev.prices };
      const newOriginalPrices = { ...prev.originalPrices };
      if (!newGrams.includes(weight)) {
        delete newPrices[weight];
        delete newOriginalPrices[weight];
      }
      return { ...prev, grams: newGrams, prices: newPrices, originalPrices: newOriginalPrices };
    });
  };

  const handlePriceChange = (weight, price) => {
    setFormData(prev => ({
      ...prev,
      prices: { ...prev.prices, [weight]: price }
    }));
  };

  const handleOriginalPriceChange = (weight, price) => {
    setFormData(prev => ({
      ...prev,
      originalPrices: { ...prev.originalPrices, [weight]: price }
    }));
  };

  const calcDiscount = (original, sale) => {
    const o = Number(original), s = Number(sale);
    if (!o || !s || o <= s) return null;
    return Math.round(((o - s) / o) * 100);
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  return (
    <>
      <AdminHeader />
      <ToastContainer position="top-right" autoClose={1500} />
      <div className="admin-page">
        <div className="admin-content">
        <div className="admin-actions-bar">
          <h1 className="admin-page-title">📦 Products</h1>
          <button className="admin-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Product'}
          </button>
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <span className="stat-icon">📦</span>
            <h3>{products.length}</h3>
            <p>Total Products</p>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🏷️</span>
            <h3>{new Set(products.map(p => p.category)).size}</h3>
            <p>Categories</p>
          </div>
          <div className="stat-card">
            <span className="stat-icon">💰</span>
            <h3>₹{products.reduce((sum, p) => {
              if (p.prices && typeof p.prices === 'object') {
                return sum + Object.values(p.prices).reduce((s, price) => s + Number(price), 0);
              }
              return sum + (p.price || 0);
            }, 0).toLocaleString()}</h3>
            <p>Inventory Value</p>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-field">
              <label>Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-field">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value, grams: [], prices: {} })}
                required
              >
                <option value="">Select category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>Gender *</label>
              <div className="gender-options">
                {['Men', 'Women', 'Children'].map(g => (
                  <label key={g} className={`gender-option ${formData.gender === g ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={() => setFormData({ ...formData, gender: g })}
                      required
                    />
                    <span>{g === 'Men' ? '👨' : g === 'Women' ? '👩' : '👦'}</span>
                    {g}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-field">
              <label>
                {FOOTWEAR_CATS.includes(formData.category) ? 'Sizes (UK Inches) *' : 'Sizes *'}
              </label>
              {!formData.category ? (
                <div className="size-hint">Select a category first</div>
              ) : (
                <div className="custom-dropdown">
                  <div
                    className="dropdown-header"
                    onClick={() => setShowWeightDropdown(!showWeightDropdown)}
                  >
                    {formData.grams.length > 0 ? formData.grams.join(', ') : `Select ${FOOTWEAR_CATS.includes(formData.category) ? 'UK sizes' : 'sizes'}`}
                  </div>
                  {showWeightDropdown && (
                    <div className="dropdown-list">
                      {weightOptions.map(size => (
                        <label key={size} className="dropdown-item">
                          <input
                            type="checkbox"
                            checked={formData.grams.includes(size)}
                            onChange={() => handleWeightToggle(size)}
                          />
                          {size}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="form-field full-width">
              <label>Prices (₹) *</label>
              <div className="price-inputs">
                {formData.grams.length === 0 && <p style={{color:'rgba(255,255,255,0.3)',margin:0,fontSize:'0.88rem'}}>Select sizes first</p>}
                {formData.grams.map(size => {
                  const disc = calcDiscount(formData.originalPrices[size], formData.prices[size]);
                  return (
                    <div key={size} className="price-input-row">
                      <span>{size}</span>
                      <div className="price-input-group">
                        <input
                          type="number"
                          value={formData.originalPrices[size] || ''}
                          onChange={(e) => handleOriginalPriceChange(size, e.target.value)}
                          placeholder="MRP"
                        />
                        <input
                          type="number"
                          value={formData.prices[size] || ''}
                          onChange={(e) => handlePriceChange(size, e.target.value)}
                          placeholder="Sale Price"
                          required
                        />
                        {disc && <span className="discount-pill">-{disc}%</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="form-field full-width">
              <label>Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className="form-field">
              <label>Tag</label>
              <select
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              >
                <option value="">— No Tag —</option>
                {TAGS.map(tag => (
                  <option key={tag.value} value={tag.value}>{tag.label}</option>
                ))}
              </select>
            </div>
            <div className="form-field full-width">
              <label>Product Images (URLs) *</label>
              <div className="image-inputs">
                <input
                  type="url"
                  value={formData.images[0]}
                  onChange={(e) => handleImageChange(0, e.target.value)}
                  placeholder="Image 1 URL"
                  required
                />
                <input
                  type="url"
                  value={formData.images[1]}
                  onChange={(e) => handleImageChange(1, e.target.value)}
                  placeholder="Image 2 URL"
                  required
                />
                <input
                  type="url"
                  value={formData.images[2]}
                  onChange={(e) => handleImageChange(2, e.target.value)}
                  placeholder="Image 3 URL"
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="admin-btn cancel-btn" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="admin-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    {editingProduct ? 'Updating...' : 'Adding...'}
                  </>
                ) : (editingProduct ? 'Update Product' : 'Add Product')}
              </button>
            </div>
          </form>
        )}

        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Gender</th>
              <th>Weight</th>
              <th>Price</th>
              <th>Tag</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="8">
                <div className="empty-state">
                  <span>📦</span>
                  <p>No products yet. Add your first product!</p>
                </div>
              </td></tr>
            ) : products.map(product => (
              <tr key={product.id}>
                <td><img src={product.images[0]} alt={product.name} /></td>
                <td className="product-name-cell">{product.name}</td>
                <td><span className="category-badge">{product.category}</span></td>
                <td><span className={`gender-badge gender-${(product.gender || 'men').toLowerCase()}`}>{product.gender === 'Men' ? '👨' : product.gender === 'Women' ? '👩' : product.gender === 'Children' ? '👦' : '—'} {product.gender || '—'}</span></td>
                <td>{Array.isArray(product.grams) ? product.grams.join(', ') : product.grams}</td>
                <td>
                  <div className="price-list">
                  {product.prices && typeof product.prices === 'object'
                    ? Object.entries(product.prices).map(([size, price]) => {
                        const orig = product.originalPrices?.[size];
                        const disc = calcDiscount(orig, price);
                        return (
                          <div key={size} className="price-list-row">
                            <span className="price-size">{size}</span>
                            {orig && Number(orig) > Number(price) && (
                              <span className="price-original">₹{orig}</span>
                            )}
                            <strong className="price-sale">₹{price}</strong>
                            {disc && <span className="discount-pill">-{disc}%</span>}
                          </div>
                        );
                      })
                    : <strong className="price-sale">₹{product.price || 0}</strong>
                  }
                  </div>
                </td>
                <td>{product.tag ? <span className="tag-badge">{TAGS.find(t => t.value === product.tag)?.label || product.tag}</span> : <span style={{color:'rgba(255,255,255,0.3)'}}>—</span>}</td>
                <td>
                  <div className="action-btns">
                    <button className="edit-btn" onClick={() => handleEdit(product)}>✏️ Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(product.id)}>🗑️ Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default AdminProducts;
