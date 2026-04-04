import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import axios from 'axios';
import config from '../config';
import logo from '../assets/logo2.jpeg';
import './CustomerLogin.css';

const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [noOrders, setNoOrders] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginCustomer } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setNoOrders(false);
    if (!email || !phone) { setError('Please fill in all fields.'); return; }
    if (!/^\d{10}$/.test(phone)) { setError('Enter a valid 10-digit phone number.'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${config.API_URL}/api/orders/customer/verify`, { email, phone });
      if (res.data.success) {
        loginCustomer(res.data.customer);
        navigate('/dashboard');
      } else if (res.data.message === 'no_orders') {
        setNoOrders(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cl-page">
      <div className="cl-orb cl-orb-1" />
      <div className="cl-orb cl-orb-2" />
      <div className="cl-orb cl-orb-3" />

      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="login-card">
        {/* Left panel */}
        <div className="login-left">
          <div className="login-left-content">
            <img src={logo} alt="TheAlphaZone" className="login-logo" />
            <h1><span className="l-alpha">TheAlpha</span><span className="l-zone">Zone</span></h1>
            <p>Your premium fashion destination for sandals, shoes, flip flops, tshirts & night pants.</p>
            <div className="login-features">
              <div className="lf-item"><span>👟</span> Premium Footwear</div>
              <div className="lf-item"><span>👕</span> Trendy Apparel</div>
              <div className="lf-item"><span>🚚</span> Fast Delivery</div>
              <div className="lf-item"><span>✅</span> Quality Assured</div>
            </div>
          </div>
        </div>
        <div className="cl-right">
          <div className="cl-form-wrap">
            <div className="cl-header">
              <h2>Customer Login</h2>
              <p>Enter your email & phone to continue</p>
            </div>

            {error && <div className="cl-error">{error}</div>}

            {noOrders && (
              <div className="cl-no-orders">
                <span>🛍️</span>
                <p>You haven't ordered anything till now, but no worries —</p>
                <strong>Order now to be a valued customer!</strong>
                <button className="cl-shop-btn" onClick={() => navigate('/products')}>Shop Now →</button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="cl-form">
              <div className="cl-field">
                <label>Email Address</label>
                <div className="cl-input-wrap">
                  <span>✉️</span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="cl-field">
                <label>Phone Number</label>
                <div className="cl-input-wrap">
                  <span>📱</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="cl-btn" disabled={loading}>
                {loading ? <><span className="cl-spinner" /> Signing in...</> : <><span>🔑</span> Sign In</>}
              </button>
            </form>

            <div className="cl-divider"><span>secure login</span></div>

            <div className="cl-footer">
              <span>TheAlphaZone Customer Portal</span>
              <span className="cl-footer-badge">Your data is safe with us</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
