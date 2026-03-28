import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { MdArrowBack, MdLocalShipping, MdVerified, MdLock, MdDelete, MdCheckCircle } from 'react-icons/md';
import config from '../config';
import './Checkout.css';

const STEPS = ['Confirm Cart', 'Your Details', 'Payment'];

const loadRazorpay = () =>
  new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

const Checkout = () => {
  const { cart, updateQuantity, clearCart, productsCache, cacheProducts } = useCart();
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState(productsCache);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });
  const [placing, setPlacing] = useState(false);
  const [payMethod, setPayMethod] = useState('razorpay');
  const [orderDone, setOrderDone] = useState(false);

  useEffect(() => {
    axios.get(`${config.API_URL}/api/products`)
      .then(res => {
        const list = res.data.success ? res.data.products : Array.isArray(res.data) ? res.data : [];
        if (list.length) { setAllProducts(list); cacheProducts(list); }
      })
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
    const o = Number(i.origPrice), p = Number(i.selectedPrice);
    return o > p ? s + (o - p) * i.quantity : s;
  }, 0);

  const isDetailsValid = formData.name && formData.phone && formData.email && formData.address;

  const handleRazorpay = async () => {
    setPlacing(true);
    const ok = await loadRazorpay();
    if (!ok) { alert('Failed to load Razorpay. Please try WhatsApp order.'); setPlacing(false); return; }

    // In production: create order on backend and get order_id
    // Here we open Razorpay directly with amount
    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID', // 🔑 Replace with your Razorpay Key ID
      amount: subtotal * 100, // paise
      currency: 'INR',
      name: 'TheAlphaZone',
      description: `Order of ${cartItems.length} item(s)`,
      image: 'https://alphazonebe.vercel.app/logo.png',
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      notes: { address: formData.address },
      theme: { color: '#e1782d' },
      handler: () => {
        clearCart();
        setOrderDone(true);
        setPlacing(false);
      },
      modal: {
        ondismiss: () => setPlacing(false),
      },
    };
    new window.Razorpay(options).open();
  };

  const handleWhatsApp = () => {
    const lines = cartItems.map(i =>
      `${i.name} (${i.selectedWeight}) x${i.quantity} = ₹${i.selectedPrice * i.quantity}`
    ).join('%0A');
    const msg = `*New Order — TheAlphaZone*%0A%0A👤 *Customer*%0AName: ${formData.name}%0APhone: ${formData.phone}%0AEmail: ${formData.email}%0AAddress: ${formData.address}%0A%0A🛍️ *Items*%0A${lines}%0A%0A💰 *Total: ₹${subtotal}*`;
    window.open(`https://wa.me/919100009907?text=${msg}`, '_blank');
    clearCart();
    setOrderDone(true);
  };

  // ── Order Success ──
  if (orderDone) return (
    <div className="co-success">
      <div className="co-success-card glass">
        <MdCheckCircle className="co-success-icon" />
        <h2>Order Placed!</h2>
        <p>Thank you, <strong>{formData.name}</strong>. We'll confirm your order shortly.</p>
        <button onClick={() => navigate('/products')}>Continue Shopping →</button>
      </div>
    </div>
  );

  // ── Empty Cart ──
  if (cartItems.length === 0 && allProducts.length > 0) return (
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

        {/* Stepper */}
        <div className="co-stepper">
          {STEPS.map((label, i) => (
            <div key={i} className={`co-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="co-step-circle">
                {i < step ? <MdCheckCircle /> : <span>{i + 1}</span>}
              </div>
              <span className="co-step-label">{label}</span>
              {i < STEPS.length - 1 && <div className={`co-step-line ${i < step ? 'done' : ''}`} />}
            </div>
          ))}
        </div>

        {/* ── Step 0: Confirm Cart ── */}
        {step === 0 && (
          <div className="co-step-content">
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

            <div className="co-summary-bar glass">
              <div className="co-summary-info">
                <span>{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</span>
                {totalSavings > 0 && <span className="co-saving-pill">🎉 Saving ₹{totalSavings}</span>}
                <span className="co-sum-total-inline">Total: <strong>₹{subtotal}</strong></span>
              </div>
              <div className="co-step-actions">
                <button className="co-back-btn" onClick={() => navigate('/products')}>
                  <MdArrowBack /> Back to Shop
                </button>
                <button className="co-next-btn" onClick={() => setStep(1)} disabled={cartItems.length === 0}>
                  Proceed to Details →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 1: Delivery Details ── */}
        {step === 1 && (
          <div className="co-step-content co-details-grid">
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

              <div className="co-step-actions">
                <button className="co-back-btn" onClick={() => setStep(0)}>
                  <MdArrowBack /> Back
                </button>
                <button className="co-next-btn" onClick={() => setStep(2)} disabled={!isDetailsValid}>
                  Proceed to Payment →
                </button>
              </div>
            </div>

            {/* Mini order summary */}
            <div className="co-mini-summary glass">
              <h3>Order Summary</h3>
              <div className="co-mini-items">
                {cartItems.map(item => (
                  <div key={`${item.id}-${item.selectedWeight}`} className="co-mini-item">
                    <img src={item.images[0]} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <span>{item.selectedWeight} × {item.quantity}</span>
                    </div>
                    <strong>₹{item.selectedPrice * item.quantity}</strong>
                  </div>
                ))}
              </div>
              <div className="co-mini-total">
                {totalSavings > 0 && (
                  <div className="co-sum-row savings"><span>🎉 Savings</span><span>−₹{totalSavings}</span></div>
                )}
                <div className="co-sum-row"><span>Delivery</span><span className="co-free">FREE</span></div>
                <div className="co-sum-total"><span>Total</span><span>₹{subtotal}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Payment ── */}
        {step === 2 && (
          <div className="co-step-content co-details-grid">
            <div className="co-form-card glass">
              <h2>Choose Payment</h2>

              <div className="co-pay-methods">
                <div
                  className={`co-pay-option ${payMethod === 'razorpay' ? 'selected' : ''}`}
                  onClick={() => setPayMethod('razorpay')}
                >
                  <div className="co-pay-radio" />
                  <div className="co-pay-info">
                    <strong>💳 Pay Online</strong>
                    <span>UPI, Cards, Net Banking via Razorpay</span>
                  </div>
                  <div className="co-pay-badges">
                    <span>UPI</span><span>Visa</span><span>MC</span>
                  </div>
                </div>

                <div
                  className={`co-pay-option ${payMethod === 'whatsapp' ? 'selected' : ''}`}
                  onClick={() => setPayMethod('whatsapp')}
                >
                  <div className="co-pay-radio" />
                  <div className="co-pay-info">
                    <strong>💬 Order via WhatsApp</strong>
                    <span>Pay on delivery or via UPI after confirmation</span>
                  </div>
                  <div className="co-pay-badges">
                    <span>COD</span><span>UPI</span>
                  </div>
                </div>
              </div>

              {/* Customer recap */}
              <div className="co-recap glass">
                <p><span>👤</span> {formData.name}</p>
                <p><span>📞</span> {formData.phone}</p>
                <p><span>✉️</span> {formData.email}</p>
                <p><span>📍</span> {formData.address}</p>
              </div>

              <div className="co-step-actions">
                <button className="co-back-btn" onClick={() => setStep(1)}>
                  <MdArrowBack /> Back
                </button>
                <button
                  className="co-place-btn"
                  onClick={payMethod === 'razorpay' ? handleRazorpay : handleWhatsApp}
                  disabled={placing}
                >
                  {placing
                    ? <><span className="co-spinner" /> Processing...</>
                    : payMethod === 'razorpay'
                      ? '💳 Pay ₹' + subtotal
                      : '💬 Order via WhatsApp'}
                </button>
              </div>

              <p className="co-secure-note"><MdLock /> Secured & encrypted checkout</p>
            </div>

            {/* Mini order summary */}
            <div className="co-mini-summary glass">
              <h3>Order Summary</h3>
              <div className="co-mini-items">
                {cartItems.map(item => (
                  <div key={`${item.id}-${item.selectedWeight}`} className="co-mini-item">
                    <img src={item.images[0]} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <span>{item.selectedWeight} × {item.quantity}</span>
                    </div>
                    <strong>₹{item.selectedPrice * item.quantity}</strong>
                  </div>
                ))}
              </div>
              <div className="co-mini-total">
                {totalSavings > 0 && (
                  <div className="co-sum-row savings"><span>🎉 Savings</span><span>−₹{totalSavings}</span></div>
                )}
                <div className="co-sum-row"><span>Delivery</span><span className="co-free">FREE</span></div>
                <div className="co-sum-total"><span>Total</span><span>₹{subtotal}</span></div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Checkout;
