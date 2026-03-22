import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { MdArrowBack, MdLocalShipping, MdVerified, MdLock, MdDelete } from 'react-icons/md';
import config from '../config';
import './Checkout.css';

const Checkout = () => {
  const { cart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    axios.get(`${config.API_URL}/api/products`)
      .then(res => setAllProducts(res.data.success ? res.data.products : Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, []);

  const cartItems = Object.values(cart).map(item => {
    const product = allProducts.find(p => String(p.id) === String(item.productId));
    if (!product) return null;
    const price = product.prices?.[item.weight] || product.price || 0;
    const orig = product.originalPrices?.[item.weight];
    return { ...product, quantity: item.quantity, selectedWeight: item.weight, selectedPrice: price, origPrice: orig };
  }).filter(Boolean);

  const subtotal = cartItems.reduce((s, i) => s + i.selectedPrice * i.quantity, 0);
  const totalSavings = cartItems.reduce((s, i) => {
    const o = Number(i.origPrice);
    const p = Number(i.selectedPrice);
    return o > p ? s + (o - p) * i.quantity : s;
  }, 0);
  const isValid = formData.name && formData.phone && formData.email && formData.address;

  const handleCheckout = () => {
    setPlacing(true);
    const lines = cartItems.map(i =>
      `${i.name} (${i.selectedWeight}) x${i.quantity} = ₹${i.selectedPrice * i.quantity}`
    ).join('%0A');
    const msg = `*New Order — AlphaZOne*%0A%0A👤 *Customer*%0AName: ${formData.name}%0APhone: ${formData.phone}%0AEmail: ${formData.email}%0AAddress: ${formData.address}%0A%0A🛍️ *Items*%0A${lines}%0A%0A💰 *Total: ₹${subtotal}*`;
    window.open(`https://wa.me/919100009907?text=${msg}`, '_blank');
    clearCart();
    setTimeout(() => navigate('/products'), 500);
  };

  if (cartItems.length === 0) return (
    <div className="co-empty">
      <span>🛒</span>
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added anything yet.</p>
      <button onClick={() => navigate('/products')}>← Continue Shopping</button>
    </div>
  );

  return (
    <div className="co-page">
      <div className="co-container">

        {/* Breadcrumb */}
        <nav className="co-breadcrumb">
          <span onClick={() => navigate('/')}>Home</span>
          <span>›</span>
          <span onClick={() => navigate('/products')}>Shop</span>
          <span>›</span>
          <span className="co-bc-active">Checkout</span>
        </nav>

        <div className="co-grid">

          {/* ── Left: Cart Items ── */}
          <div className="co-left">
            <div className="co-section-header">
              <button className="co-back-btn" onClick={() => navigate('/products')}>
                <MdArrowBack /> Back to Shop
              </button>
              <h2>Your Cart <span className="co-count">{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</span></h2>
            </div>

            <div className="co-items">
              {cartItems.map(item => {
                const disc = item.origPrice && Number(item.origPrice) > Number(item.selectedPrice)
                  ? Math.round(((Number(item.origPrice) - Number(item.selectedPrice)) / Number(item.origPrice)) * 100)
                  : null;
                return (
                  <div key={`${item.id}-${item.selectedWeight}`} className="co-item glass">
                    <div className="co-item-img">
                      <img src={item.images[0]} alt={item.name} />
                      {disc && <span className="co-item-disc">-{disc}%</span>}
                    </div>
                    <div className="co-item-info">
                      <span className="co-item-cat">{item.category}</span>
                      <h3>{item.name}</h3>
                      <span className="co-item-size">Size: {item.selectedWeight}</span>
                      <div className="co-item-price-row">
                        {item.origPrice && Number(item.origPrice) > Number(item.selectedPrice) && (
                          <span className="co-item-orig">₹{item.origPrice}</span>
                        )}
                        <span className="co-item-price">₹{item.selectedPrice}</span>
                      </div>
                    </div>
                    <div className="co-item-right">
                      <div className="co-qty">
                        <button onClick={() => updateQuantity(item.id, item.selectedWeight, -1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.selectedWeight, 1)}>+</button>
                      </div>
                      <span className="co-item-total">₹{item.selectedPrice * item.quantity}</span>
                      <button className="co-remove" onClick={() => updateQuantity(item.id, item.selectedWeight, -item.quantity)} title="Remove">
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Delivery strip */}
            <div className="co-delivery-strip glass">
              <div className="co-del-item">
                <MdLocalShipping />
                <div><strong>Fast Delivery</strong><span>2–3 business days</span></div>
              </div>
              <div className="co-del-item">
                <MdVerified />
                <div><strong>100% Genuine</strong><span>Quality assured</span></div>
              </div>
              <div className="co-del-item">
                <MdLock />
                <div><strong>Secure Order</strong><span>Via WhatsApp</span></div>
              </div>
            </div>
          </div>

          {/* ── Right: Form + Summary ── */}
          <div className="co-right">
            <div className="co-form-card glass">
              <h2>Delivery Details</h2>

              <div className="co-form">
                {[
                  { key: 'name', label: 'Full Name', type: 'text', icon: '👤', placeholder: 'Enter your name' },
                  { key: 'phone', label: 'Phone Number', type: 'tel', icon: '📞', placeholder: '+91 XXXXX XXXXX' },
                  { key: 'email', label: 'Email Address', type: 'email', icon: '✉️', placeholder: 'you@example.com' },
                ].map(f => (
                  <div key={f.key} className="co-field">
                    <label>{f.label}</label>
                    <div className="co-input-wrap">
                      <span className="co-input-icon">{f.icon}</span>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        value={formData[f.key]}
                        onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                      />
                    </div>
                  </div>
                ))}
                <div className="co-field">
                  <label>Delivery Address</label>
                  <div className="co-input-wrap">
                    <span className="co-input-icon" style={{ top: '0.9rem' }}>📍</span>
                    <textarea
                      placeholder="House no, Street, City, Pincode"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="co-summary">
                <h3>Order Summary</h3>
                <div className="co-summary-rows">
                  <div className="co-sum-row">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="co-sum-row savings">
                      <span>🎉 Total Savings</span>
                      <span>−₹{totalSavings}</span>
                    </div>
                  )}
                  <div className="co-sum-row">
                    <span>Delivery</span>
                    <span className="co-free">FREE</span>
                  </div>
                  <div className="co-sum-total">
                    <span>Total</span>
                    <span>₹{subtotal}</span>
                  </div>
                </div>
              </div>

              <button
                className="co-place-btn"
                onClick={handleCheckout}
                disabled={!isValid || placing}
              >
                {placing ? <><span className="co-spinner" /> Placing Order...</> : '💬 Place Order via WhatsApp'}
              </button>

              <p className="co-secure-note"><MdLock /> Your order is securely placed via WhatsApp</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
