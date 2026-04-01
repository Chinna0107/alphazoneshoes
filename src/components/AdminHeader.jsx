import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo2.jpeg';
import './AdminHeader.css';

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <img src={logo} alt="TheAlphaZone" className="admin-logo" />
        <div className="admin-brand">
          <span className="ab-alpha">TheAlpha</span><span className="ab-zone">Zone</span>
          <span className="ab-tag">Admin</span>
        </div>
      </div>

      <nav className="admin-nav">
        <button
          className={`admin-nav-btn ${isActive('/admin/products') ? 'active' : ''}`}
          onClick={() => navigate('/admin/products')}
        >
          📦 Products
        </button>
        <button
          className={`admin-nav-btn ${isActive('/admin/orders') ? 'active' : ''}`}
          onClick={() => navigate('/admin/orders')}
        >
          🧾 Orders
        </button>
        <button
          className={`admin-nav-btn ${isActive('/admin/sliders') ? 'active' : ''}`}
          onClick={() => navigate('/admin/sliders')}
        >
          🖼️ Sliders
        </button>
        <button className="admin-nav-btn" onClick={() => navigate('/')}>
          🏪 View Store
        </button>
      </nav>

      <div className="admin-header-right">
        <div className="admin-user-pill">
          <span className="admin-user-dot" />
          <span>{user.email || 'Admin'}</span>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
