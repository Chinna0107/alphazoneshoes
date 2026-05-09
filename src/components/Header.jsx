import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import logo from '../assets/logo3.png';
import './Header.css';

const Header = () => {
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = getCartCount();

  const handleCartClick = (e) => {
    e.preventDefault();
    navigate('/checkout');
    setIsMenuOpen(false);
  };

  return (
    <header className="header glass-header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="TheAlphaZone" className="logo-img" />
          <span className="brand-name">
            <span className="brand-alpha">TheAlpha</span><span className="brand-zone">Zone</span>
          </span>
        </Link>
      </div>
      <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
        <span /><span /><span />
      </button>
      <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
        <Link to="/products" onClick={() => setIsMenuOpen(false)}>Shop</Link>
        <Link to="/faq" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
        <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
        <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
        <a href="#" className="cart-icon" onClick={handleCartClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </a>
      </nav>
    </header>
  );
};

export default Header;

