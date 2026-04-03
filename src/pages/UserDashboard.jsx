import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserAuth } from '../context/UserAuthContext';
import config from '../config';
import './UserDashboard.css';

const TABS = [
  { key: 'orders',  label: 'My Orders',  icon: '📦' },
  { key: 'profile', label: 'Profile',     icon: '👤' },
  { key: 'products',label: 'Products',    icon: '🛍️' },
];

const STATUS_COLORS = {
  pending:    '#f0a54b',
  confirmed:  '#4ade80',
  dispatched: '#60a5fa',
  delivered:  '#a78bfa',
  cancelled:  '#f87171',
};

const UserDashboard = () => {
  const { customer, logoutCustomer } = useUserAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    if (!customer) { navigate('/customer-login'); return; }
    if (tab === 'orders') fetchOrders();
    if (tab === 'products') { navigate('/products'); return; }
  }, [tab, customer]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await axios.post(`${config.API_URL}/api/orders/customer/orders`, {
        email: customer.email,
        phone: customer.phone,
      });
      const orders = res.data.success ? res.data.orders : [];
      setOrders(orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch { setOrders([]); }
    finally { setLoadingOrders(false); }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await axios.get(`${config.API_URL}/api/products`);
      setProducts(res.data.products || res.data || []);
    } catch { setProducts([]); }
    finally { setLoadingProducts(false); }
  };

  const handleLogout = () => {
    logoutCustomer();
    navigate('/');
  };

  const formatDate = (o) => {
    if (o.createdAt) return new Date(o.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' });
    return o.date || '—';
  };

  return (
    <div className="ud-page">
      <div className="ud-container">

        {/* Sidebar */}
        <aside className="ud-sidebar">
          <div className="ud-profile-card">
            <div className="ud-avatar">{customer?.name?.[0]?.toUpperCase() || '?'}</div>
            <h3>{customer?.name}</h3>
            <p>{customer?.email}</p>
            <span className="ud-phone">📱 {customer?.phone}</span>
          </div>

          <nav className="ud-nav">
            {TABS.map(t => (
              <button
                key={t.key}
                className={`ud-nav-btn ${tab === t.key ? 'active' : ''}`}
                onClick={() => setTab(t.key)}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
            <button className="ud-nav-btn ud-logout" onClick={handleLogout}>
              <span>🚪</span> Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ud-main">

          {/* ── My Orders ── */}
          {tab === 'orders' && (
            <div className="ud-section">
              <h2>📦 My Orders</h2>
              {loadingOrders ? (
                <div className="ud-loading"><div className="ud-spinner" /></div>
              ) : orders.length === 0 ? (
                <div className="ud-empty">
                  <span>🛒</span>
                  <p>No orders found for your account.</p>
                  <button onClick={() => navigate('/products')}>Start Shopping →</button>
                </div>
              ) : (
                <div className="ud-orders-list">
                  {orders.map((o, i) => {
                    const status = o.orderStatus || 'pending';
                    return (
                      <div key={o._id || i} className="ud-order-card">
                        <div className="ud-order-top">
                          <div>
                            <span className="ud-order-num">Order #{String(i + 1).padStart(3, '0')}</span>
                            <span className="ud-order-date">{formatDate(o)}</span>
                          </div>
                          <span className="ud-status-badge" style={{ color: STATUS_COLORS[status] || '#f0a54b' }}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </div>
                        <div className="ud-order-items">
                          {(o.items || []).map((item, j) => (
                            <div key={j} className="ud-order-item">
                              <img src={item.image} alt={item.name} />
                              <div>
                                <strong>{item.name}</strong>
                                <span>{item.size || item.selectedWeight} × {item.quantity}</span>
                              </div>
                              <strong>₹{item.total || item.price * item.quantity}</strong>
                            </div>
                          ))}
                        </div>
                        <div className="ud-order-footer">
                          <span>Payment: <strong style={{ color: o.paymentStatus === 'paid' ? '#4ade80' : '#f0a54b' }}>{o.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}</strong></span>
                          <span className="ud-order-total">Total: <strong>₹{Number(o.subtotal || 0).toLocaleString()}</strong></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Profile ── */}
          {tab === 'profile' && (
            <div className="ud-section">
              <h2>👤 My Profile</h2>
              <div className="ud-profile-detail">
                <div className="ud-profile-avatar-lg">{customer?.name?.[0]?.toUpperCase() || '?'}</div>
                <div className="ud-profile-fields">
                  <div className="ud-field">
                    <label>Name</label>
                    <div className="ud-field-val">{customer?.name}</div>
                  </div>
                  <div className="ud-field">
                    <label>Email Address</label>
                    <div className="ud-field-val">{customer?.email}</div>
                  </div>
                  <div className="ud-field">
                    <label>Phone Number</label>
                    <div className="ud-field-val">📱 {customer?.phone}</div>
                  </div>
                  <div className="ud-field">
                    <label>Account Type</label>
                    <div className="ud-field-val">🛍️ Customer</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Products ── */}
          {tab === 'products' && (
            <div className="ud-section">
              <h2>🛍️ Products</h2>
              {loadingProducts ? (
                <div className="ud-loading"><div className="ud-spinner" /></div>
              ) : (
                <div className="ud-products-grid">
                  {products.map((p, i) => {
                    const firstWeight = Array.isArray(p.grams) ? p.grams[0] : p.grams;
                    const price = p.prices?.[firstWeight] || p.price || 0;
                    const origPrice = p.originalPrices?.[firstWeight];
                    const disc = origPrice && Number(origPrice) > Number(price)
                      ? Math.round(((Number(origPrice) - Number(price)) / Number(origPrice)) * 100)
                      : null;
                    return (
                      <div key={p._id || i} className="ud-product-card" onClick={() => navigate(`/products/${p.slug || p._id}`)}>
                        <div className="ud-product-img-wrap">
                          <img src={p.images?.[0] || p.image} alt={p.name} />
                          {disc && <span className="ud-disc-badge">-{disc}%</span>}
                        </div>
                        <div className="ud-product-info">
                          <span className="ud-product-cat">{p.category}</span>
                          <h4>{p.name}</h4>
                          <div className="ud-product-price">
                            {origPrice && Number(origPrice) > Number(price) && (
                              <span className="ud-orig-price">₹{origPrice}</span>
                            )}
                            <span className="ud-price">₹{price}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
