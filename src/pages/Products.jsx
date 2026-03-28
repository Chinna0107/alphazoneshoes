import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdStar, MdFilterList, MdClose, MdSearch } from 'react-icons/md';
import config from '../config';
import './Products.css';

const CATEGORY_ICONS = { All: '🛍️', Sandals: '👡', Shoes: '👟', Slippers: '🩴', 'T-Shirts': '👕', 'Track Pants': '🩲' };
const TAG_LABELS = {
  bestseller: '🔥 Best Seller', popular: '⭐ Popular',
  new: '🆕 New Arrival', offer: '💰 Offer',
  trending: '📈 Trending', limited: '⏳ Limited',
};
const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'discount', label: 'Best Discount' },
  { value: 'name', label: 'Name A–Z' },
];

const calcDiscount = (orig, sale) => {
  const o = Number(orig), s = Number(sale);
  if (!o || !s || o <= s) return null;
  return Math.round(((o - s) / o) * 100);
};

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [selectedTags, setSelectedTags] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedWeights, setSelectedWeights] = useState({});
  const { cart, addToCart, updateQuantity, getCartCount, isInCart, getCartQuantity } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${config.API_URL}/api/products`);
      const list = res.data.success ? res.data.products : Array.isArray(res.data) ? res.data : [];
      setAllProducts(list);
      setCategories(['All', ...new Set(list.map(p => p.category))]);
      const prices = list.flatMap(p => p.prices ? Object.values(p.prices).map(Number) : [p.price || 0]);
      const max = Math.max(...prices, 1000);
      setMaxPrice(max);
      setPriceRange([0, max]);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const toggleTag = (tag) => setSelectedTags(prev =>
    prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
  );

  const getMinPrice = (product) => {
    if (product.prices && typeof product.prices === 'object') {
      return Math.min(...Object.values(product.prices).map(Number));
    }
    return product.price || 0;
  };

  const filteredProducts = allProducts
    .filter(p => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTag = selectedTags.length === 0 || selectedTags.includes(p.tag);
      const minP = getMinPrice(p);
      const matchPrice = minP >= priceRange[0] && minP <= priceRange[1];
      return matchCat && matchSearch && matchTag && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return getMinPrice(a) - getMinPrice(b);
      if (sortBy === 'price-desc') return getMinPrice(b) - getMinPrice(a);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'discount') {
        const da = calcDiscount(a.originalPrices?.[Array.isArray(a.grams) ? a.grams[0] : a.grams], getMinPrice(a)) || 0;
        const db = calcDiscount(b.originalPrices?.[Array.isArray(b.grams) ? b.grams[0] : b.grams], getMinPrice(b)) || 0;
        return db - da;
      }
      return 0;
    });

  const activeFiltersCount = selectedTags.length + (sortBy !== 'default' ? 1 : 0) + (priceRange[1] < maxPrice ? 1 : 0);

  return (
    <div className="products-page">

      {/* Top Bar */}
      <div className="products-topbar">
        <div className="search-wrap">
          <MdSearch className="search-icon-inner" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && <button className="search-clear" onClick={() => setSearchTerm('')}><MdClose /></button>}
        </div>
        <div className="topbar-actions">
          <button className={`filter-toggle-btn ${showFilter ? 'active' : ''}`} onClick={() => setShowFilter(!showFilter)}>
            <MdFilterList />
            Filters
            {activeFiltersCount > 0 && <span className="filter-count">{activeFiltersCount}</span>}
          </button>
          <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {getCartCount() > 0 && (
            <button className="checkout-btn-top" onClick={() => navigate('/checkout')}>
              🛒 Checkout ({getCartCount()})
            </button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="filter-panel glass">
          <div className="filter-section">
            <h4>Tags</h4>
            <div className="filter-tags">
              {Object.entries(TAG_LABELS).map(([val, label]) => (
                <button
                  key={val}
                  className={`filter-tag-btn ${selectedTags.includes(val) ? 'active' : ''}`}
                  onClick={() => toggleTag(val)}
                >{label}</button>
              ))}
            </div>
          </div>
          <div className="filter-section">
            <h4>Price Range <span>₹{priceRange[0]} – ₹{priceRange[1]}</span></h4>
            <input
              type="range" min={0} max={maxPrice}
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="price-range-slider"
            />
          </div>
          <button className="filter-reset" onClick={() => { setSelectedTags([]); setSortBy('default'); setPriceRange([0, maxPrice]); }}>
            Reset Filters
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-circle" /><div className="spinner-circle" /><div className="spinner-circle" />
          </div>
          <p>Loading products...</p>
        </div>
      ) : (
        <div className="products-container">

          {/* Sidebar */}
          <aside className="categories-sidebar">
            <h3>Categories</h3>
            <ul>
              {categories.map(cat => (
                <li key={cat} className={selectedCategory === cat ? 'active' : ''} onClick={() => setSelectedCategory(cat)}>
                  <span>{CATEGORY_ICONS[cat] || '📦'}</span> {cat}
                </li>
              ))}
            </ul>
            <div className="sidebar-results">
              <span>{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</span>
            </div>
          </aside>

          {/* Grid */}
          <div className="products-list">
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <span>🔍</span>
                <p>No products found. Try adjusting your filters.</p>
                <button onClick={() => { setSelectedCategory('All'); setSearchTerm(''); setSelectedTags([]); }}>Clear Filters</button>
              </div>
            ) : filteredProducts.map(product => {
              const defaultWeight = Array.isArray(product.grams) ? product.grams[0] : product.grams;
              const currentWeight = selectedWeights[product.id] ?? defaultWeight;
              const currentPrice = product.prices?.[currentWeight] || product.price || 0;
              const origPrice = product.originalPrices?.[currentWeight];
              const disc = calcDiscount(origPrice, currentPrice);

              return (
                <div key={product.id} className="product-item" onClick={() => navigate(`/products/${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${product.id}`)}>
                  <div className="product-image-container">
                    {product.tag && <span className={`product-badge ${product.tag}`}>{TAG_LABELS[product.tag] || product.tag}</span>}
                    {disc && <span className="product-disc-badge">-{disc}%</span>}
                    <img src={product.images[0]} alt={product.name} />
                    <div className="quick-view-overlay">
                      <button className="quick-view-btn">View Details</button>
                    </div>
                  </div>
                  <div className="product-info">
                    <span className="product-cat-label">{product.category}</span>
                    <h3>{product.name}</h3>
                    {/* <div className="product-rating"><MdStar /><MdStar /><MdStar /><MdStar /><MdStar /><span>4.5</span></div> */}
                    <p>{product.description || ''}</p>
                    <div className="product-details" onClick={e => e.stopPropagation()}>
                      <select
                        className="grams-dropdown"
                        value={currentWeight}
                        onChange={e => setSelectedWeights({ ...selectedWeights, [product.id]: e.target.value })}
                      >
                        {Array.isArray(product.grams)
                          ? product.grams.map((g, i) => <option key={i} value={g}>{g}</option>)
                          : <option value={product.grams}>{product.grams}</option>}
                      </select>
                      <div className="price-section">
                        {origPrice && Number(origPrice) > Number(currentPrice) && (
                          <span className="original-price">₹{origPrice}</span>
                        )}
                        <span className="price">₹{currentPrice}</span>
                        {disc && <span className="discount-badge">-{disc}%</span>}
                      </div>
                    </div>
                    <div onClick={e => e.stopPropagation()}>
                      {!isInCart(product.id, currentWeight) ? (
                        <button className="add-to-cart" onClick={() => addToCart(product.id, currentWeight)}>
                          Add to Cart
                        </button>
                      ) : (
                        <div className="quantity-control">
                          <button onClick={() => updateQuantity(product.id, currentWeight, -1)}>−</button>
                          <span>{getCartQuantity(product.id, currentWeight)}</span>
                          <button onClick={() => updateQuantity(product.id, currentWeight, 1)}>+</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}


    </div>
  );
};

export default Products;
