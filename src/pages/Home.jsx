import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Slider from 'react-slick';
import { MdStar, MdLocalShipping, MdVerified, MdPayment, MdPhone, MdTrendingUp, MdPeople, MdShoppingBag } from 'react-icons/md';
import { PiPantsFill, PiTShirtFill } from 'react-icons/pi';
import { TbFlipFlops } from 'react-icons/tb';
import { GiSandal, GiRunningShoe, GiSlippers } from 'react-icons/gi';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useProducts from '../hooks/useProducts';
import useSliders from '../hooks/useSliders';
import './Home.css';

const CATEGORIES = [
  { name: 'Sandals',     reactIcon: 'sandals',   desc: 'Stylish sandals for every occasion' },
  { name: 'Shoes',      reactIcon: 'shoes',     desc: 'Premium footwear for all lifestyles' },
  { name: 'Flip Flops', reactIcon: 'flipflops', desc: 'Comfortable home & casual flip flops' },
  { name: 'Slides',     reactIcon: 'slides',    desc: 'Trendy slides for everyday comfort' },
  { name: 'T-Shirts',   reactIcon: 'tshirt',    desc: 'Trendy tees for every mood' },
  { name: 'Track Pants',reactIcon: 'pants',     desc: 'Comfortable track & lounge wear' },
];

const SLIDES = [
  {
    id: 1, title: 'TheAlphaZone',
    tag: 'New Collection', heading: 'Welcome to TheAlphaZone', desc: 'Fashion that defines you — sandals, shoes, tshirts & more',
    desktop: 'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1775577214/The_Alpha_Zone_banner_design_mmhrur.png',
    mobile:  'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1775577674/Gemini_Generated_Image_ibjvytibjvytibjv_ogr02z.png',
  },
  {
    id: 2, title: 'Women Wear',
    tag: 'Women\'s Fashion', heading: 'Style Meets Elegance', desc: 'Explore our exclusive women\'s collection — kurtas, tops, dresses & more',
    desktop: 'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1775295189/3_kf6rli.png',
    mobile:  'https://res.cloudinary.com/dgyykbmt6/image/upload/w_1080,h_1180,c_pad,b_auto,q_auto,f_auto/v1775231866/Women_Styles_iz0gtu.png',
  },
  {
    id: 3, title: 'Men Wear',
    tag: 'Men\'s Collection', heading: 'Dress Bold, Live Bold', desc: 'Premium men\'s wear — shirts, track pants, tshirts & more',
    desktop: 'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1775295185/2_a2zgz3.png',
    mobile:  'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1775294710/2_tahsrz.png',
  },
  {
    id: 4, title: 'Kids Wear',
    tag: 'Kids\' Fashion', heading: 'Fun Styles for Little Ones', desc: 'Bright, comfy & trendy kids wear for every occasion',
    desktop: 'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1775295185/4_ylmzjd.png',
    mobile:  'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1775295120/oie_Z5GKo8MMaKT6_nbropo.png',
  },
];

const CategoryIcon = ({ type, className }) => {
  const props = { className };
  switch (type) {
    case 'sandals':   return <GiSandal {...props} />;
    case 'shoes':     return <GiRunningShoe {...props} />;
    case 'flipflops': return <TbFlipFlops {...props} />;
    case 'slides':    return <GiSlippers {...props} />;
    case 'tshirt':    return <PiTShirtFill {...props} />;
    case 'pants':     return <PiPantsFill {...props} />;
    default:          return null;
  }
};

const STATS = [
  { icon: <MdShoppingBag />, value: '10,000+', label: 'Orders Delivered' },
  { icon: <MdPeople />,      value: '5,000+',  label: 'Happy Customers' },
  { icon: <MdTrendingUp />,  value: '500+',    label: 'Products' },
  { icon: <MdStar />,        value: '4.8★',    label: 'Avg. Rating' },
];

const TICKER_ITEMS = [
  '🚚 Free Delivery on orders above ₹499',
  '✅ 100% Authentic Products',
  '🔒 Secure Payments',
  '🔄 Easy Returns',
  '⚡ Same Day Dispatch',
  '🎁 Exclusive Member Offers',
];

const Home = () => {
  const { products } = useProducts();
  const { sliders: fetchedSliders } = useSliders();
  const sliders = fetchedSliders.length ? fetchedSliders : SLIDES;
  const [selectedWeights, setSelectedWeights] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [visibleStats, setVisibleStats] = useState(false);
  const statsRef = useRef(null);
  const { addToCart, updateQuantity, isInCart, getCartQuantity } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisibleStats(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const calcDiscount = (original, sale) => {
    const o = Number(original), s = Number(sale);
    if (!o || !s || o <= s) return null;
    return Math.round(((o - s) / o) * 100);
  };

  const sliderSettings = {
    dots: true, infinite: true, speed: 600, slidesToShow: 1, slidesToScroll: 1,
    autoplay: true, autoplaySpeed: 4000, accessibility: false, focusOnSelect: false,
  };

  return (
    <div className="home">
      <>
          {/* Ticker */}
          {/* <div className="ticker-wrap">
            <div className="ticker-track">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <span key={i} className="ticker-item">{item}</span>
              ))}
            </div>
          </div> */}

          {/* Hero Slider */}
          <div className="hero-wrap">
            <Slider {...sliderSettings} className="hero-slider">
              {sliders.map(s => (
                <div key={s.id} className="slide">
                  <div className="slide-box">
                    <picture>
                      <source media="(max-width: 480px)" srcSet={s.mobile || s.desktop || s.imageUrl} />
                      <img src={s.desktop || s.imageUrl} alt={s.title} />
                    </picture>
                    <div className="slide-overlay">
                      <div className="slide-text glass">
                        <span className="slide-tag">{s.tag || 'New Collection'}</span>
                        <h1>{s.heading || 'Welcome to TheAlphaZone'}</h1>
                        <p>{s.desc || 'Fashion that defines you — sandals, shoes, tshirts & more'}</p>
                        <div className="slide-btns">
                          <button className="hero-btn" onClick={() => s.productSlug ? navigate(`/products/${s.productSlug}`) : navigate('/products')}>Shop Now →</button>
                          <button className="hero-btn-outline" onClick={() => navigate('/about')}>Our Story</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* Stats Bar
          <section className="stats-section" ref={statsRef}>
            <div className={`stats-grid ${visibleStats ? 'stats-visible' : ''}`}>
              {STATS.map((s, i) => (
                <div key={i} className="stat-card glass" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <span className="stat-icon">{s.icon}</span>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </section> */}

          {/* Mobile Categories Strip */}
          <section className="mob-categories-section">
            <h2 className="section-title">Shop by Category</h2>
            <div className="mob-cat-scroll">
              {CATEGORIES.map(cat => (
                <div key={cat.name} className="mob-cat-card" onClick={() => navigate('/products', { state: { category: cat.name } })}>
                  <CategoryIcon type={cat.reactIcon} className="mob-cat-react-icon" />
                  <h3>{cat.name}</h3>
                  <span className="mob-cat-arrow">→</span>
                </div>
              ))}
            </div>
          </section>

          {/* Categories */}
          <section className="categories-section">
            <h2 className="section-title">Shop by Category</h2>
            <div className="categories-grid">
              {CATEGORIES.map(cat => (
                <div key={cat.name} className="cat-card glass" onClick={() => navigate('/products', { state: { category: cat.name } })}>
                  <CategoryIcon type={cat.reactIcon} className="cat-react-icon" />
                  <h3>{cat.name}</h3>
                  <p>{cat.desc}</p>
                  <span className="cat-arrow">→</span>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="workflow-section">
            <h2 className="section-title">How It Works</h2>
            <div className="workflow-steps">
              {[
                { icon: '🔍', title: 'Browse', desc: 'Explore our wide range of fashion products' },
                { icon: '🛒', title: 'Add to Cart', desc: 'Pick your size, color & quantity' },
                { icon: '💳', title: 'Checkout', desc: 'Pay securely via UPI, card or COD' },
                { icon: '📦', title: 'Delivered', desc: 'Fast delivery right to your door' },
              ].map((step, i) => (
                <div key={i} className="step-card glass">
                  <div className="step-num">{i + 1}</div>
                  <span className="step-icon">{step.icon}</span>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="features-section">
            <h2 className="section-title">Why TheAlphaZone?</h2>
            <div className="features-grid">
              {[
                { icon: <MdVerified />, title: 'Premium Quality', desc: 'Every product is quality-checked before dispatch' },
                { icon: <MdLocalShipping />, title: 'Fast Delivery', desc: 'Quick doorstep delivery guaranteed' },
                { icon: <MdPayment />, title: 'Secure Payments', desc: 'Multiple safe payment options' },
                { icon: <MdPhone />, title: '24/7 Support', desc: 'Always here to help you' },
              ].map((f, i) => (
                <div key={i} className="feature-card glass">
                  <span className="feature-icon">{f.icon}</span>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Products */}
          {products.length > 0 && (
            <section className="featured-section">
              <h2 className="section-title">Featured Products</h2>
              <div className="products-grid">
                {products.slice(0, 8).map(product => {
                  const pid = product.id || product._id;
                  const colors = product.colors?.length ? product.colors : null;
                  const activeColorIdx = selectedColors[pid] ?? 0;
                  const activeImages = (colors?.[activeColorIdx]?.images?.filter(Boolean)?.length
                    ? colors[activeColorIdx].images.filter(Boolean)
                    : product.images) || [];
                  const defaultWeight = Array.isArray(product.grams) ? product.grams[0] : product.grams;
                  const currentWeight = selectedWeights[pid] ?? defaultWeight;
                  const currentPrice = product.prices?.[currentWeight] || product.price || 0;
                  const origPrice = product.originalPrices?.[currentWeight];
                  const disc = calcDiscount(origPrice, currentPrice);
                  const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  return (
                    <div key={pid} className="product-card glass"
                      onClick={() => navigate(`/products/${slug}-${pid}`)}
                      style={{ cursor: 'pointer' }}>
                      <div className="product-card-img-wrap">
                        {product.tag && <span className="product-card-badge">{product.tag}</span>}
                        {disc && <span className="product-card-disc">-{disc}%</span>}
                        <img src={activeImages[0] || product.images?.[0] || product.image} alt={product.name} />
                      </div>
                      <span className="product-cat-badge">{product.category}</span>
                      <h3>{product.name}</h3>
                      {colors && colors.length > 1 && (
                        <div className="product-card-swatches" onClick={e => e.stopPropagation()}>
                          {colors.map((c, ci) => (
                            <button key={ci}
                              className={`card-swatch ${activeColorIdx === ci ? 'active' : ''}`}
                              style={{ background: c.hex }} title={c.name}
                              onClick={() => setSelectedColors({ ...selectedColors, [pid]: ci })} />
                          ))}
                        </div>
                      )}
                      <div className="product-details">
                        <select className="size-dropdown" value={currentWeight}
                          onChange={e => setSelectedWeights({ ...selectedWeights, [pid]: e.target.value })}
                          onClick={e => e.stopPropagation()}>
                          {Array.isArray(product.grams)
                            ? product.grams.map((g, i) => <option key={i} value={g}>{g}</option>)
                            : <option value={product.grams}>{product.grams}</option>}
                        </select>
                        <div className="home-price-wrap">
                          {origPrice && Number(origPrice) > Number(currentPrice) && (
                            <span className="home-orig-price">₹{origPrice}</span>
                          )}
                          <span className="price">₹{currentPrice}</span>
                          {disc && <span className="home-disc-badge">-{disc}%</span>}
                        </div>
                      </div>
                      {isInCart(pid, currentWeight) ? (
                        <div className="qty-control" onClick={e => e.stopPropagation()}>
                          <button onClick={() => updateQuantity(pid, currentWeight, -1)}>−</button>
                          <span>{getCartQuantity(pid, currentWeight)}</span>
                          <button onClick={() => updateQuantity(pid, currentWeight, 1)}>+</button>
                        </div>
                      ) : (
                        <button className="add-btn" onClick={e => { e.stopPropagation(); addToCart(pid, currentWeight); }}>
                          Add to Cart
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="view-all-wrap">
                <button className="view-all-btn" onClick={() => navigate('/products')}>Explore All Products →</button>
              </div>
            </section>
          )}

          {/* Hot Deals */}
          <section className="offers-section">
            <h2 className="section-title">🔥 Hot Deals</h2>
            <div className="offers-grid">
              <div className="offer-card glass offer-1" style={{cursor:"pointer"}} onClick={() => navigate("/products", { state: { category: "Shoes" } })}>
                <div className="offer-badge">40% OFF</div>
                <h3>👟 Shoes Collection</h3>
                <p>Premium sneakers & formal shoes at unbeatable prices</p>
              </div>
              <div className="offer-card glass offer-2" style={{cursor:"pointer"}} onClick={() => navigate("/products", { state: { category: "T-Shirts" } })}>
                <div className="offer-badge">NEW</div>
                <h3>👕 Summer Tees</h3>
                <p>Fresh arrivals — breathable cotton tshirts</p>
              </div>
              <div className="offer-card glass offer-3" style={{cursor:"pointer"}} onClick={() => navigate("/products", { state: { category: "Flip Flops" } })}>
                <div className="offer-badge">COMBO</div>
                <h3>🩴 Slipper + Sandal</h3>
                <p>Buy any 2 footwear & save big</p>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="testimonials-section">
            <h2 className="section-title">⭐ What Customers Say</h2>
            <div className="testimonials-grid">
              {[
                { name: 'Rahul M.', role: 'Regular Customer', text: '"TheAlphaZone has the best sandals! Super comfortable and stylish. Highly recommend!"', init: 'R' },
                { name: 'Priya S.', role: 'Fashion Lover', text: '"Ordered tshirts and track pants — amazing quality and fast delivery. Love it!"', init: 'P' },
                { name: 'Arjun K.', role: 'Happy Customer', text: '"Best shoes at this price range. Will definitely order again from TheAlphaZone!"', init: 'A' },
              ].map((t, i) => (
                <div key={i} className="testimonial-card glass">
                  <div className="t-stars">{[...Array(5)].map((_, j) => <MdStar key={j} />)}</div>
                  <p>"{t.text}"</p>
                  <div className="t-customer">
                    <div className="t-avatar">{t.init}</div>
                    <div><h4>{t.name}</h4><span>{t.role}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="cta-section">
            <div className="cta-glass glass">
              <div className="cta-glow" />
              <span className="cta-eyebrow">Limited Time Offer</span>
              <h2>Ready to Upgrade Your Style? 👟</h2>
              <p>Shop the latest fashion at TheAlphaZone — quality you can feel, prices you'll love</p>
              <div className="cta-btns">
                <button className="cta-whatsapp" onClick={() => window.open('https://wa.me/918885553249', '_blank')}>💬 WhatsApp Us</button>
                <button className="cta-call" onClick={() => window.location.href = 'tel:+918885553249'}>📞 Call Us</button>
                <button className="cta-shop" onClick={() => navigate('/products')}>🛍️ Shop Now</button>
              </div>
              <p className="cta-note">⚡ Free delivery on orders above ₹499 &nbsp;|&nbsp; 🔒 Secure checkout</p>
            </div>
          </section>
        </>
    </div>
  );
};

export default Home;

