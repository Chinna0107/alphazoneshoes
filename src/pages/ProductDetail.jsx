import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  MdStar, MdStarHalf, MdLocalShipping, MdVerified,
  MdArrowBack, MdShare, MdFavorite, MdFavoriteBorder,
  MdZoomIn, MdCheckCircle, MdSwapHoriz
} from 'react-icons/md';
import useProducts from '../hooks/useProducts';
import './ProductDetail.css';

const TAG_LABELS = {
  bestseller: '🔥 Best Seller', popular: '⭐ Popular',
  new: '🆕 New Arrival', offer: '💰 Offer',
  trending: '📈 Trending', limited: '⏳ Limited Edition',
};

const toSlug = (name, id) =>
  `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${id}`;

const calcDiscount = (orig, sale) => {
  const o = Number(orig), s = Number(sale);
  if (!o || !s || o <= s) return null;
  return Math.round(((o - s) / o) * 100);
};

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const id = slug?.split('-').pop();

  const { products: allProducts, loading } = useProducts();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [activeImg, setActiveImg] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [wishlisted, setWishlisted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState('desc');
  const imgRef = useRef(null);

  const { addToCart, updateQuantity, isInCart, getCartQuantity } = useCart();

  useEffect(() => {
    if (!allProducts.length) return;
    const found = allProducts.find(p => String(p.id) === String(id));
    if (found) {
      setProduct(found);
      setSelectedSize(Array.isArray(found.grams) ? found.grams[0] : found.grams || '');
      setActiveColorIdx(0);
      setActiveImg(0);
    }
  }, [allProducts, id]);

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - left) / width) * 100,
      y: ((e.clientY - top) / height) * 100,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="pd-loader"><div className="pd-ring" /></div>
  );

  if (!product) return (
    <div className="pd-notfound">
      <span>😕</span><p>Product not found.</p>
      <button onClick={() => navigate('/products')}>← Back to Shop</button>
    </div>
  );

  const sizes = Array.isArray(product.grams) ? product.grams : [product.grams].filter(Boolean);
  const salePrice = product.prices?.[selectedSize] || product.price || 0;
  const origPrice = product.originalPrices?.[selectedSize];
  const discount = calcDiscount(origPrice, salePrice);
  const colors  = product.colors?.length ? product.colors : null;
  const activeColor = colors?.[activeColorIdx] ? { name: colors[activeColorIdx].name || '', hex: colors[activeColorIdx].hex || '' } : null;
  const images  = (colors?.[activeColorIdx]?.images?.filter(Boolean) || product.images || []).filter(Boolean);
  const savings = discount && origPrice ? Number(origPrice) - Number(salePrice) : null;

  // stock helpers
  const getStock = (colorIdx, size) => {
    const c = product.colors?.[colorIdx];
    if (!c) return Infinity; // no color = no stock tracking
    if (!c.stock) return Infinity;
    const s = c.stock[size];
    return s === undefined ? Infinity : Number(s);
  };
  const activeStock = getStock(activeColorIdx, selectedSize);
  const inCartQty   = getCartQuantity(product.id, selectedSize, activeColor);
  const canAddMore  = activeStock === Infinity || inCartQty < activeStock;

  const related = allProducts
    .filter(p => p.category === product.category && String(p.id) !== String(product.id))
    .slice(0, 4);

  return (
    <div className="pd-page">
      <div className="pd-container">

        {/* Breadcrumb */}
        <nav className="pd-breadcrumb">
          <span onClick={() => navigate('/')}>Home</span>
          <span className="pd-bc-sep">›</span>
          <span onClick={() => navigate('/products')}>Shop</span>
          <span className="pd-bc-sep">›</span>
          <span onClick={() => navigate(`/products?cat=${product.category}`)}>{product.category}</span>
          <span className="pd-bc-sep">›</span>
          <span className="pd-bc-active">{product.name}</span>
        </nav>

        <div className="pd-grid">

          {/* ── Left: Images ── */}
          <div className="pd-images">
            {/* Thumbnails vertical */}
            <div className="pd-thumbs-col">
              {images.map((img, i) => (
                <div
                  key={i}
                  className={`pd-thumb ${activeImg === i ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt={`view ${i + 1}`} />
                </div>
              ))}
            </div>

            {/* Main image */}
            <div className="pd-main-wrap">
              {product.tag && <span className="pd-tag-badge">{TAG_LABELS[product.tag] || product.tag}</span>}
              {discount && <span className="pd-discount-badge">-{discount}%</span>}
              <div
                className={`pd-main-img ${zoomed ? 'zoomed' : ''}`}
                ref={imgRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setZoomed(true)}
                onMouseLeave={() => setZoomed(false)}
                style={zoomed ? { '--zx': `${zoomPos.x}%`, '--zy': `${zoomPos.y}%` } : {}}
              >
                <img src={images[activeImg]} alt={product.name} />
                {!zoomed && <span className="pd-zoom-hint"><MdZoomIn /> Hover to zoom</span>}
              </div>
              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button className="pd-img-prev" onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}>‹</button>
                  <button className="pd-img-next" onClick={() => setActiveImg(i => (i + 1) % images.length)}>›</button>
                </>
              )}
            </div>
          </div>

          {/* ── Right: Info ── */}
          <div className="pd-info">

            {/* Top actions */}
            <div className="pd-top-actions">
              <button className="pd-back-btn" onClick={() => navigate('/products')}>
                <MdArrowBack /> Back
              </button>
              <div className="pd-action-btns">
                <button className={`pd-icon-btn ${wishlisted ? 'wishlisted' : ''}`} onClick={() => setWishlisted(w => !w)} title="Wishlist">
                  {wishlisted ? <MdFavorite /> : <MdFavoriteBorder />}
                </button>
                <button className="pd-icon-btn" onClick={handleShare} title="Share">
                  {copied ? <MdCheckCircle style={{ color: '#4ade80' }} /> : <MdShare />}
                </button>
              </div>
            </div>

            <span className="pd-category-pill">{product.category}</span>
            <h1 className="pd-name">{product.name}</h1>

            {/* Color Swatches */}
            {colors && colors.length > 1 && (
              <div className="pd-colors">
                <span className="pd-color-label">Color: <strong>{activeColor?.name || ''}</strong></span>
                <div className="pd-color-swatches">
                  {colors.map((c, ci) => (
                    <button
                      key={ci}
                      className={`pd-color-swatch ${activeColorIdx === ci ? 'active' : ''}`}
                      style={{ background: c.hex }}
                      title={c.name}
                      onClick={() => { setActiveColorIdx(ci); setActiveImg(0); }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Rating */}
            <div className="pd-rating-row">
              <div className="pd-stars">
                <MdStar /><MdStar /><MdStar /><MdStar /><MdStarHalf />
              </div>
              <span className="pd-rating-val">4.5</span>
              <span className="pd-rating-count">(24 reviews)</span>
              {activeStock === 0
                ? <span className="pd-out-of-stock">✕ Out of Stock</span>
                : activeStock <= 5 && activeStock !== Infinity
                  ? <span className="pd-low-stock">⚠️ Only {activeStock} left!</span>
                  : <span className="pd-in-stock">✓ In Stock</span>
              }
            </div>

            {/* Price */}
            <div className="pd-price-block">
              <div className="pd-price-row">
                <span className="pd-sale-price">₹{salePrice}</span>
                {origPrice && Number(origPrice) > Number(salePrice) && (
                  <span className="pd-orig-price">₹{origPrice}</span>
                )}
                {discount && <span className="pd-disc-pill">-{discount}% OFF</span>}
              </div>
              {savings && (
                <p className="pd-savings">🎉 You save ₹{savings} on this order!</p>
              )}
            </div>

            {/* Size */}
            <div className="pd-size-section">
              <div className="pd-size-header">
                <span className="pd-size-label">
                  Select Size
                  {['Sandals', 'Shoes', 'Slippers'].includes(product.category) && <em> (UK)</em>}
                </span>
                <span className="pd-size-guide"><MdSwapHoriz /> Size Guide</span>
              </div>
              <div className="pd-sizes">
                {sizes.map(size => {
                  const sp = product.prices?.[size] || product.price || 0;
                  const op = product.originalPrices?.[size];
                  const d = calcDiscount(op, sp);
                  const stock = getStock(activeColorIdx, size);
                  const outOfStock = stock === 0;
                  return (
                    <button
                      key={size}
                      className={`pd-size-btn ${selectedSize === size ? 'active' : ''} ${outOfStock ? 'out-of-stock' : ''}`}
                      onClick={() => !outOfStock && setSelectedSize(size)}
                      disabled={outOfStock}
                      title={outOfStock ? 'Out of stock' : ''}
                    >
                      <span className="pd-size-val">{size}</span>
                      <span className="pd-size-price">₹{sp}</span>
                      {d && !outOfStock && <span className="pd-size-disc">-{d}%</span>}
                      {outOfStock && <span className="pd-size-oos">Out</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cart Actions */}
            <div className="pd-cart-row">
              {activeStock === 0 ? (
                <button className="pd-add-btn" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                  ✕ Out of Stock
                </button>
              ) : !isInCart(product.id, selectedSize, activeColor) ? (
                <button className="pd-add-btn" onClick={() => addToCart(product.id, selectedSize, activeColor)}>
                  🛒 Add to Cart
                </button>
              ) : (
                <div className="pd-qty-control">
                  <button onClick={() => updateQuantity(product.id, selectedSize, -1, activeColor)}>−</button>
                  <span>{getCartQuantity(product.id, selectedSize, activeColor)}</span>
                  <button
                    onClick={() => updateQuantity(product.id, selectedSize, 1, activeColor)}
                    disabled={!canAddMore}
                    title={!canAddMore ? 'Max stock reached' : ''}
                  >+</button>
                </div>
              )}
              <button className="pd-buy-btn" onClick={() => navigate('/checkout')} disabled={activeStock === 0}>
                ⚡ Buy Now
              </button>
            </div>

            {/* Delivery info strip */}
            <div className="pd-delivery-strip">
              <div className="pd-del-item">
                <MdLocalShipping />
                <div><strong>Free Delivery</strong><span>On orders above ₹500</span></div>
              </div>
              <div className="pd-del-item">
                <MdVerified />
                <div><strong>100% Genuine</strong><span>Quality assured</span></div>
              </div>
              <div className="pd-del-item">
                <span className="pd-del-icon">↩️</span>
                <div><strong>Easy Returns</strong><span>7-day exchange</span></div>
              </div>
            </div>

            {/* Tabs */}
            <div className="pd-tabs">
              <button className={`pd-tab ${tab === 'desc' ? 'active' : ''}`} onClick={() => setTab('desc')}>Description</button>
              <button className={`pd-tab ${tab === 'details' ? 'active' : ''}`} onClick={() => setTab('details')}>Details</button>
            </div>
            <div className="pd-tab-content">
              {tab === 'desc' && (
                <p className="pd-desc">{product.description || 'No description available.'}</p>
              )}
              {tab === 'details' && (
                <div className="pd-details-table">
                  <div className="pd-detail-row"><span>Category</span><span>{product.category}</span></div>
                  {product.gender && <div className="pd-detail-row"><span>Gender</span><span>{product.gender}</span></div>}
                  {colors && <div className="pd-detail-row"><span>Colors</span><span>{colors.map(c => c.name).filter(Boolean).join(', ') || colors.length + ' colors'}</span></div>}
                  {product.styleTags?.length > 0 && <div className="pd-detail-row"><span>Style</span><span>{product.styleTags.join(', ')}</span></div>}
                  <div className="pd-detail-row"><span>Available Sizes</span><span>{sizes.join(', ')}</span></div>
                  <div className="pd-detail-row"><span>Tag</span><span>{TAG_LABELS[product.tag] || '—'}</span></div>
                  <div className="pd-detail-row"><span>SKU</span><span>AZ-{String(product.id).padStart(4, '0')}</span></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="pd-related">
            <h2 className="pd-related-title">More from <span>{product.category}</span></h2>
            <div className="pd-related-grid">
              {related.map(p => {
                const defSize = Array.isArray(p.grams) ? p.grams[0] : p.grams;
                const rPrice = p.prices?.[defSize] || p.price || 0;
                const rOrig = p.originalPrices?.[defSize];
                const rDisc = calcDiscount(rOrig, rPrice);
                return (
                  <div key={p.id} className="pd-related-card" onClick={() => { navigate(`/products/${toSlug(p.name, p.id)}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    <div className="pd-rel-img-wrap">
                      {rDisc && <span className="pd-rel-disc">-{rDisc}%</span>}
                      <img src={p.images[0]} alt={p.name} />
                    </div>
                    <div className="pd-rel-info">
                      <h4>{p.name}</h4>
                      <div className="pd-rel-price">
                        {rOrig && Number(rOrig) > Number(rPrice) && <span className="pd-rel-orig">₹{rOrig}</span>}
                        <span className="pd-rel-sale">₹{rPrice}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;
