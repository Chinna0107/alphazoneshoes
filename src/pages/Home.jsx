import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Slider from 'react-slick';
import { MdStar, MdLocalShipping, MdVerified, MdPayment, MdPhone, MdWhatsapp } from 'react-icons/md';
import { PiPantsFill, PiTShirtFill } from 'react-icons/pi';
import { TbFlipFlops } from 'react-icons/tb';
import { GiSandal, GiRunningShoe, GiSlippers } from 'react-icons/gi';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useProducts from '../hooks/useProducts';
import useSliders from '../hooks/useSliders';
import './Home.css';

const CATEGORIES = [
  { name: 'Sandals',      reactIcon: 'sandals',   desc: 'Stylish sandals for every occasion',       color: '#e1782d' },
  { name: 'Shoes',        reactIcon: 'shoes',     desc: 'Premium footwear for all lifestyles',       color: '#f0a54b' },
  { name: 'Flip Flops',   reactIcon: 'flipflops', desc: 'Comfortable home & casual flip flops',      color: '#e1782d' },
  { name: 'Slides',       reactIcon: 'slides',    desc: 'Trendy slides for everyday comfort',        color: '#f0a54b' },
  { name: 'T-Shirts',     reactIcon: 'tshirt',    desc: 'Trendy tees for every mood',                color: '#e1782d' },
  { name: 'Track Pants',  reactIcon: 'pants',     desc: 'Comfortable track & lounge wear',           color: '#f0a54b' },
];

const SLIDES = [
  { id: 1, title: 'TheAlphaZone', tag: 'New Collection', heading: 'Welcome to TheAlphaZone', desc: 'Fashion that defines you — sandals, shoes, tshirts & more', desktop: 'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1775577214/The_Alpha_Zone_banner_design_mmhrur.png', mobile: 'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1775577674/Gemini_Generated_Image_ibjvytibjvytibjv_ogr02z.png' },
  { id: 2, title: 'Women Wear', tag: "Women's Fashion", heading: 'Style Meets Elegance', desc: "Explore our exclusive women's collection — kurtas, tops, dresses & more", desktop: 'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1775295189/3_kf6rli.png', mobile: 'https://res.cloudinary.com/dgyykbmt6/image/upload/w_1080,h_1180,c_pad,b_auto,q_auto,f_auto/v1775231866/Women_Styles_iz0gtu.png' },
  { id: 3, title: 'Men Wear', tag: "Men's Collection", heading: 'Dress Bold, Live Bold', desc: "Premium men's wear — shirts, track pants, tshirts & more", desktop: 'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1775295185/2_a2zgz3.png', mobile: 'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1775294710/2_tahsrz.png' },
  { id: 4, title: 'Kids Wear', tag: "Kids' Fashion", heading: 'Fun Styles for Little Ones', desc: 'Bright, comfy & trendy kids wear for every occasion', desktop: 'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1775295185/4_ylmzjd.png', mobile: 'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1775295120/oie_Z5GKo8MMaKT6_nbropo.png' },
];

const TRUST = ['🚚 Fast Delivery', '✅ Quality Assured', '🔒 Secure Payments', '↩️ Easy Returns', '💬 24/7 Support', '🏆 Premium Brands', '🎁 Best Prices', '⭐ 500+ Happy Customers'];

const STATS = [
  { num: '500+', label: 'Happy Customers' },
  { num: '200+', label: 'Products' },
  { num: '5★',   label: 'Avg Rating' },
  { num: '2hr',  label: 'Avg Response' },
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

const Home = () => {
  const { products } = useProducts();
  const { sliders: fetchedSliders } = useSliders();
  const sliders = fetchedSliders.length ? fetchedSliders : SLIDES;
  const [selectedWeights, setSelectedWeights] = useState({});
  const { addToCart, updateQuantity, isInCart, getCartQuantity } = useCart();
  const navigate = useNavigate();

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

      {/* Marquee Trust Strip */}
      <div className="trust-marquee-wrap">
        <div className="trust-marquee">
          {[...TRUST, ...TRUST].map((t, i) => (
            <span key={i} className="trust-marquee-item">{t}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <section className="stats-section">
        {STATS.map(s => (
          <div key={s.label} className="stat-item">
            <span className="stat-num">{s.num}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* Mobile Categories Strip */}
      <section className="mob-categories-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="mob-cat-scroll">
          {CATEGORIES.map(cat => (
            <div key={cat.name} className="mob-cat-card" onClick={() => navigate('/products', { state: { category: cat.name } })}>
              <div className="mob-cat-icon-wrap" style={{ '--cat-color': cat.color }}>
                <CategoryIcon type={cat.reactIcon} className="mob-cat-react-icon" />
              </div>
              <h3>{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Desktop Categories */}
      <section className="categories-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid">
          {CATEGORIES.map(cat => (
            <div key={cat.name} className="cat-card glass" onClick={() => navigate('/products', { state: { category: cat.name } })}>
              <div className="cat-icon-wrap" style={{ '--cat-color': cat.color }}>
                <CategoryIcon type={cat.reactIcon} className="cat-react-icon" />
              </div>
              <h3>{cat.name}</h3>
              <p>{cat.desc}</p>
              <span className="cat-arrow">→</span>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="features-section">
        <h2 className="section-title">Why TheAlphaZone?</h2>
        <div className="features-grid">
          {[
            { icon: <MdVerified />,      title: 'Premium Quality',  desc: 'Every product is quality-checked before dispatch',  color: '#e1782d' },
            { icon: <MdLocalShipping />, title: 'Fast Delivery',    desc: 'Quick doorstep delivery guaranteed',                color: '#f0a54b' },
            { icon: <MdPayment />,       title: 'Secure Payments',  desc: 'Multiple safe payment options',                    color: '#4ade80' },
            { icon: <MdPhone />,         title: '24/7 Support',     desc: 'Always here to help you',                          color: '#60a5fa' },
          ].map((f, i) => (
            <div key={i} className="feature-card glass">
              <span className="feature-icon" style={{ color: f.color }}>{f.icon}</span>
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
              const defaultWeight = Array.isArray(product.grams) ? product.grams[0] : product.grams;
              const currentWeight = selectedWeights[product.id] ?? defaultWeight;
              const currentPrice = product.prices?.[currentWeight] || product.price || 0;
              const origPrice = product.originalPrices?.[currentWeight];
              const disc = calcDiscount(origPrice, currentPrice);
              const img = product.colors?.[0]?.images?.[0] || product.images?.[0] || product.image;
              return (
                <div key={product.id} className="product-card glass" onClick={() => navigate(`/products/${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${product.id}`)} style={{ cursor: 'pointer' }}>
                  <div className="product-card-img-wrap">
                    {disc && <span className="pc-disc-badge">-{disc}%</span>}
                    <img src={img} alt={product.name} />
                  </div>
                  <div className="product-card-info">
                    <span className="product-cat-badge">{product.category}</span>
                    <h3>{product.name}</h3>
                    <div className="product-details" onClick={e => e.stopPropagation()}>
                      <select className="size-dropdown" value={currentWeight}
                        onChange={e => setSelectedWeights({ ...selectedWeights, [product.id]: e.target.value })}>
                        {Array.isArray(product.grams)
                          ? product.grams.map((g, i) => <option key={i} value={g}>{g}</option>)
                          : <option value={product.grams}>{product.grams}</option>}
                      </select>
                      <div className="home-price-wrap">
                        {origPrice && Number(origPrice) > Number(currentPrice) && <span className="home-orig-price">₹{origPrice}</span>}
                        <span className="price">₹{currentPrice}</span>
                      </div>
                    </div>
                    <div onClick={e => e.stopPropagation()}>
                      {isInCart(product.id, currentWeight) ? (
                        <div className="qty-control">
                          <button onClick={() => updateQuantity(product.id, currentWeight, -1)}>−</button>
                          <span>{getCartQuantity(product.id, currentWeight)}</span>
                          <button onClick={() => updateQuantity(product.id, currentWeight, 1)}>+</button>
                        </div>
                      ) : (
                        <button className="add-btn" onClick={() => addToCart(product.id, currentWeight)}>Add to Cart</button>
                      )}
                    </div>
                  </div>
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
          <div className="offer-card glass offer-1" onClick={() => navigate('/products', { state: { category: 'Shoes' } })}>
            <div className="offer-badge">40% OFF</div>
            <div className="offer-icon">👟</div>
            <h3>Shoes Collection</h3>
            <p>Premium sneakers & formal shoes at unbeatable prices</p>
            <span className="offer-cta">Shop Now →</span>
          </div>
          <div className="offer-card glass offer-2" onClick={() => navigate('/products', { state: { category: 'T-Shirts' } })}>
            <div className="offer-badge">NEW</div>
            <div className="offer-icon">👕</div>
            <h3>Summer Tees</h3>
            <p>Fresh arrivals — breathable cotton tshirts</p>
            <span className="offer-cta">Shop Now →</span>
          </div>
          <div className="offer-card glass offer-3" onClick={() => navigate('/products', { state: { category: 'Flip Flops' } })}>
            <div className="offer-badge">COMBO</div>
            <div className="offer-icon">🩴</div>
            <h3>Slipper + Sandal</h3>
            <p>Buy any 2 footwear & save big</p>
            <span className="offer-cta">Shop Now →</span>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2 className="section-title">⭐ What Customers Say</h2>
        <div className="testimonials-grid">
          {[
            { name: 'Rahul M.',  role: 'Regular Customer', text: 'TheAlphaZone has the best sandals! Super comfortable and stylish. Highly recommend!', init: 'R', stars: 5 },
            { name: 'Priya S.',  role: 'Fashion Lover',    text: 'Ordered tshirts and track pants — amazing quality and fast delivery. Love it!',       init: 'P', stars: 5 },
            { name: 'Arjun K.', role: 'Happy Customer',   text: 'Best shoes at this price range. Will definitely order again from TheAlphaZone!',       init: 'A', stars: 5 },
          ].map((t, i) => (
            <div key={i} className="testimonial-card glass">
              <div className="t-stars">{[...Array(t.stars)].map((_, j) => <MdStar key={j} />)}</div>
              <p>"{t.text}"</p>
              <div className="t-customer">
                <div className="t-avatar">{t.init}</div>
                <div><h4>{t.name}</h4><span>{t.role}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="wacta-section">
        <div className="wacta-card glass">
          <div className="wacta-text">
            <h2>Need Help? Chat with Us! 💬</h2>
            <p>Order via WhatsApp — fast, easy & personal</p>
          </div>
          <a href="https://wa.me/918885553249" target="_blank" rel="noopener noreferrer" className="wacta-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Chat on WhatsApp
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-glass glass">
          <h2>Ready to Upgrade Your Style? 👟</h2>
          <p>Shop the latest fashion at TheAlphaZone</p>
          <div className="cta-btns">
            <button className="cta-call" onClick={() => window.location.href = 'tel:+918885553249'}>📞 Call Us</button>
            <button className="cta-shop" onClick={() => navigate('/products')}>🛍️ Shop Now</button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
