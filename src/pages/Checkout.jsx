import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MdArrowBack, MdLocalShipping, MdVerified, MdLock, MdDelete, MdCheckCircle } from 'react-icons/md';
import './Checkout.css';

const STEPS = ['Confirm Cart', 'Your Details', 'Place Order'];

const WHATSAPP_NUMBER = '918885553249';

const Checkout = () => {
  const { cart, updateQuantity, clearCart, productsCache } = useCart();
  const navigate = useNavigate();
  const [allProducts] = useState(productsCache);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });
  const [orderDone, setOrderDone] = useState(false);
  const [locating, setLocating] = useState(false);

  const getLocation = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported by your browser.'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
          );
          const data = await res.json();
          const a = data.address || {};
          const parts = [a.house_number, a.road || a.pedestrian, a.neighbourhood || a.suburb, a.city || a.town || a.village, a.state, a.postcode].filter(Boolean);
          setFormData(prev => ({ ...prev, address: parts.join(', ') }));
        } catch {
          alert('Could not fetch address. Please enter manually.');
        } finally { setLocating(false); }
      },
      () => { alert('Location access denied. Please enter address manually.'); setLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const cartItems = Object.values(cart).map(item => {
    const product = allProducts.find(p => String(p.id) === String(item.productId));
    if (!product) return null;
    const price = product.prices?.[item.weight] || product.price || 0;
    const orig = product.originalPrices?.[item.weight];
    const colorImages = item.color ? product.colors?.find(c => c.name === item.color.name || c.hex === item.color.hex)?.images : null;
    const displayImage = colorImages?.[0] || product.images?.[0] || '';
    return { ...product, quantity: item.quantity, selectedWeight: item.weight, selectedPrice: price, origPrice: orig, selectedColor: item.color, displayImage };
  }).filter(Boolean);

  const subtotal = cartItems.reduce((s, i) => s + i.selectedPrice * i.quantity, 0);
  const totalSavings = cartItems.reduce((s, i) => {
    const o = Number(i.origPrice), p = Number(i.selectedPrice);
    return o > p ? s + (o - p) * i.quantity : s;
  }, 0);

  const isDetailsValid = formData.name && formData.phone && formData.email && formData.address;

  const handlePlaceOrder = () => {
    const itemLines = cartItems.map(i =>
      `• ${i.name} (${i.selectedWeight}${i.selectedColor ? `, ${i.selectedColor.name}` : ''}) × ${i.quantity} = ₹${i.selectedPrice * i.quantity}`
    ).join('\n');

    const message = encodeURIComponent(
      `🛍️ *New Order — TheAlphaZone*\n\n` +
      `👤 *Name:* ${formData.name}\n` +
      `📞 *Phone:* ${formData.phone}\n` +
      `✉️ *Email:* ${formData.email}\n` +
      `📍 *Address:* ${formData.address}\n\n` +
      `*Items:*\n${itemLines}\n\n` +
      `${totalSavings > 0 ? `🎉 Savings: ₹${totalSavings}\n` : ''}` +
      `💰 *Total: ₹${subtotal}*\n\n` +
      `🚚 Free delivery on orders above ₹499`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    clearCart();
    setOrderDone(true);
  };

  const MiniSummary = () => (
    <div className="co-mini-summary glass">
      <h3>Order Summary</h3>
      <div className="co-mini-items">
        {cartItems.map((item, i) => (
          <div key={i} className="co-mini-item">
            <img src={item.displayImage} alt={item.name} />
            <div>
              <p>{item.name}</p>
              <span>
                {item.selectedWeight}
                {item.selectedColor && <span className="co-mini-color" style={{ background: item.selectedColor.hex }} title={item.selectedColor.name} />}
                × {item.quantity}
              </span>
            </div>
            <strong>₹{item.selectedPrice * item.quantity}</strong>
          </div>
        ))}
      </div>
      <div className="co-mini-total">
        {totalSavings > 0 && <div className="co-sum-row savings"><span>🎉 Savings</span><span>−₹{totalSavings}</span></div>}
        <div className="co-sum-row"><span>Delivery</span><span className="co-free">FREE</span></div>
        <div className="co-sum-total"><span>Total</span><span>₹{subtotal}</span></div>
      </div>
    </div>
  );

  if (orderDone) return (
    <div className="co-success-page">
      <div className="co-success-container">
        <div className="co-success-header">
          <div className="co-success-icon-wrap"><MdCheckCircle className="co-success-icon" /></div>
          <h1>Order Sent! 🎉</h1>
          <p className="co-success-sub">Thank you, <strong>{formData.name}</strong>! Your order has been sent via WhatsApp. We'll confirm shortly.</p>
        </div>
        <div className="co-success-msg glass" style={{ maxWidth: 480, margin: '2rem auto', padding: '1.5rem' }}>
          <p>🚚 Delivered within <strong>2–3 business days</strong>.</p>
          <p>📞 We'll call <strong>{formData.phone}</strong> to confirm.</p>
        </div>
        <button className="co-success-shop-btn" onClick={() => navigate('/products')}>Continue Shopping →</button>
      </div>
    </div>
  );

  if (cartItems.length === 0 && allProducts.length > 0) return (
    <div className="co-empty">
      <span>🛒</span><h2>Your cart is empty</h2>
      <p>Looks like you haven't added anything yet.</p>
      <button onClick={() => navigate('/products')}>← Continue Shopping</button>
    </div>
  );

  return (
    <div className="co-page">
      <div className="co-container">

        <nav className="co-breadcrumb">
          <span onClick={() => navigate('/')}>Home</span><span>›</span>
          <span onClick={() => navigate('/products')}>Shop</span><span>›</span>
          <span className="co-bc-active">Checkout</span>
        </nav>

        <div className="co-stepper">
          {STEPS.map((label, i) => (
            <div key={i} className={`co-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="co-step-circle">{i < step ? <MdCheckCircle /> : <span>{i + 1}</span>}</div>
              <span className="co-step-label">{label}</span>
              {i < STEPS.length - 1 && <div className={`co-step-line ${i < step ? 'done' : ''}`} />}
            </div>
          ))}
        </div>

        {/* Step 0: Confirm Cart */}
        {step === 0 && (
          <div className="co-step-content">
            <div className="co-items">
              {cartItems.map((item, idx) => {
                const disc = item.origPrice && Number(item.origPrice) > Number(item.selectedPrice)
                  ? Math.round(((Number(item.origPrice) - Number(item.selectedPrice)) / Number(item.origPrice)) * 100) : null;
                return (
                  <div key={idx} className="co-item glass">
                    <div className="co-item-img">
                      <img src={item.displayImage} alt={item.name} />
                      {disc && <span className="co-item-disc">-{disc}%</span>}
                    </div>
                    <div className="co-item-info">
                      <span className="co-item-cat">{item.category}</span>
                      <h3>{item.name}</h3>
                      <span className="co-item-size">
                        Size: {item.selectedWeight}
                        {item.selectedColor && (
                          <span className="co-item-color-dot" style={{ background: item.selectedColor.hex }} title={item.selectedColor.name} />
                        )}
                        {item.selectedColor?.name && <span className="co-item-color-name">{item.selectedColor.name}</span>}
                      </span>
                      <div className="co-item-price-row">
                        {item.origPrice && Number(item.origPrice) > Number(item.selectedPrice) && <span className="co-item-orig">₹{item.origPrice}</span>}
                        <span className="co-item-price">₹{item.selectedPrice}</span>
                      </div>
                    </div>
                    <div className="co-item-right">
                      <div className="co-qty">
                        <button onClick={() => updateQuantity(item.id, item.selectedWeight, -1, item.selectedColor)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.selectedWeight, 1, item.selectedColor)}>+</button>
                      </div>
                      <span className="co-item-total">₹{item.selectedPrice * item.quantity}</span>
                      <button className="co-remove" onClick={() => updateQuantity(item.id, item.selectedWeight, -item.quantity, item.selectedColor)} title="Remove"><MdDelete /></button>
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
                <button className="co-back-btn" onClick={() => navigate('/products')}><MdArrowBack /> Back to Shop</button>
                <button className="co-next-btn" onClick={() => setStep(1)} disabled={cartItems.length === 0}>Proceed to Details →</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Delivery Details */}
        {step === 1 && (
          <div className="co-step-content co-details-grid">
            <div className="co-form-card glass">
              <h2>Delivery Details</h2>
              <div className="co-form">
                {[
                  { key: 'name',  label: 'Full Name',     type: 'text',  icon: '👤', placeholder: 'Enter your name' },
                  { key: 'phone', label: 'Phone Number',  type: 'tel',   icon: '📞', placeholder: '+91 XXXXX XXXXX' },
                  { key: 'email', label: 'Email Address', type: 'email', icon: '✉️', placeholder: 'you@example.com' },
                ].map(f => (
                  <div key={f.key} className="co-field">
                    <label>{f.label}</label>
                    <div className="co-input-wrap">
                      <span className="co-input-icon">{f.icon}</span>
                      <input type={f.type} placeholder={f.placeholder} value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} />
                    </div>
                  </div>
                ))}
                <div className="co-field">
                  <label>
                    Delivery Address
                    <button type="button" className="co-locate-btn" onClick={getLocation} disabled={locating}>
                      {locating ? <><span className="co-spinner" /> Locating...</> : '📍 Use My Location'}
                    </button>
                  </label>
                  <div className="co-input-wrap">
                    <span className="co-input-icon" style={{ top: '0.9rem' }}>📍</span>
                    <textarea placeholder="House no, Street, City, Pincode" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} rows={3} />
                  </div>
                </div>
              </div>
              <div className="co-step-actions">
                <button className="co-back-btn" onClick={() => setStep(0)}><MdArrowBack /> Back</button>
                <button className="co-next-btn" onClick={() => setStep(2)} disabled={!isDetailsValid}>Review Order →</button>
              </div>
            </div>
            <MiniSummary />
          </div>
        )}

        {/* Step 2: Place Order via WhatsApp */}
        {step === 2 && (
          <div className="co-step-content co-details-grid">
            <div className="co-form-card glass">
              <h2>Place Order</h2>
              <div className="co-recap glass">
                <p><span>👤</span> {formData.name}</p>
                <p><span>📞</span> {formData.phone}</p>
                <p><span>✉️</span> {formData.email}</p>
                <p><span>📍</span> {formData.address}</p>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: '1rem 0', fontSize: '0.95rem' }}>
                Your order details will be sent via WhatsApp. We'll confirm and process your order shortly.
              </p>
              <div className="co-step-actions">
                <button className="co-back-btn" onClick={() => setStep(1)}><MdArrowBack /> Back</button>
                <button className="co-place-btn" onClick={handlePlaceOrder}>
                  💬 Order via WhatsApp
                </button>
              </div>
              <p className="co-secure-note"><MdLock /> Your details are safe with us</p>
            </div>
            <MiniSummary />
          </div>
        )}

      </div>
    </div>
  );
};

export default Checkout;

