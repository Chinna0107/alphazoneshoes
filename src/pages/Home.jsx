import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import Slider from 'react-slick';
import { MdStar, MdLocalShipping, MdVerified, MdPayment, MdPhone, MdShoppingCart, MdMessage } from 'react-icons/md';
import { PiPantsFill } from 'react-icons/pi';
import { TbFlipFlops } from 'react-icons/tb';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useProducts from '../hooks/useProducts';
import config from '../config';
import './Home.css';

const CATEGORIES = [
  { name: 'Sandals', icon: '👡', desc: 'Stylish sandals for every occasion' },
  { name: 'Shoes', icon: '👟', desc: 'Premium footwear for all lifestyles' },
  { name: 'Flip Flops', icon: null, reactIcon: 'flipflops', desc: 'Comfortable home & casual flip flops' },
  { name: 'T-Shirts', icon: '👕', desc: 'Trendy tees for every mood' },
  { name: 'Track Pants', icon: null, img: null, reactIcon: 'pants', desc: 'Comfortable track & lounge wear' },
];

const SLIDES = [
  {
    id: 1, title: 'TheAlphaZone',
    tag: 'New Collection', heading: 'Welcome to TheAlphaZone', desc: 'Fashion that defines you — sandals, shoes, tshirts & more',
    desktop: 'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1775295183/1_ik1a3r.png',
    mobile:  'https://res.cloudinary.com/dgyykbmt6/image/upload/w_1080,h_1080,c_pad,b_auto,q_auto,f_auto/v1775231862/Alpha_Zone_Promotion_Poster_aaqsgf.png',
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

const Home = () => {
  const { products } = useProducts();
  const [sliders, setSliders] = useState(SLIDES);
  const [selectedWeights, setSelectedWeights] = useState({});
  const [loading, setLoading] = useState(true);
  const { addToCart, updateQuantity, isInCart, getCartQuantity } = useCart();
  const navigate = useNavigate();

  const calcDiscount = (original, sale) => {
    const o = Number(original), s = Number(sale);
    if (!o || !s || o <= s) return null;
    return Math.round(((o - s) / o) * 100);
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    setLoading(false);
    try {
      const res = await axios.get(`${config.API_URL}/api/sliders`);
      if (res.data.success && res.data.sliders.length) setSliders(res.data.sliders);
    } catch { /* silent */ }
  };

  const sliderSettings = {
    dots: true, infinite: true, speed: 600, slidesToShow: 1, slidesToScroll: 1,
    autoplay: true, autoplaySpeed: 4000, accessibility: false, focusOnSelect: false,
  };

  return (
    <div className="home">
      {loading ? (
        <div className="home-loader"><div className="loader-ring" /></div>
      ) : (
        <>
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
                          <button className="hero-btn" onClick={() => navigate('/products')}>Shop Now →</button>
                          <button className="hero-btn-outline" onClick={() => navigate('/about')}>Our Story</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* Mobile Categories Strip */}
          <section className="mob-categories-section">
            <h2 className="section-title">Shop by Category</h2>
            <div className="mob-cat-scroll">
              {CATEGORIES.map(cat => (
                <div key={cat.name} className="mob-cat-card" onClick={() => navigate('/products', { state: { category: cat.name } })}>
                  {cat.reactIcon
                    ? cat.reactIcon === 'flipflops' ? <TbFlipFlops className="mob-cat-react-icon" /> : <PiPantsFill className="mob-cat-react-icon" />
                    : <span className="mob-cat-icon">{cat.icon}</span>
                  }
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
                  {cat.img
                    ? <img src={cat.img} alt={cat.name} className="cat-img" />
                    : cat.reactIcon
                    ? cat.reactIcon === 'flipflops' ? <TbFlipFlops className="cat-react-icon" /> : <PiPantsFill className="cat-react-icon" />
                    : <span className="cat-icon">{cat.icon}</span>
                  }
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
                { num: '1', icon: <MdShoppingCart />, title: 'Browse', desc: 'Explore our fashion collections' },
                { num: '2', icon: <MdMessage />, title: 'Order', desc: 'Send your order via WhatsApp' },
                { num: '3', icon: <MdPhone />, title: 'Confirm', desc: 'We call to confirm your order' },
                { num: '4', icon: <MdPayment />, title: 'Pay', desc: 'Secure & easy payment' },
                { num: '5', icon: <MdLocalShipping />, title: 'Delivered', desc: 'Fast delivery to your door' },
              ].map((step, i) => (
                <div key={i} className="step-card glass">
                  <span className="step-num">{step.num}</span>
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
                  const defaultWeight = Array.isArray(product.grams) ? product.grams[0] : product.grams;
                  const currentWeight = selectedWeights[product.id] ?? defaultWeight;
                  const currentPrice = product.prices?.[currentWeight] || product.price || 0;
                  return (
                    <div key={product.id} className="product-card glass" onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>
                      <img src={product.images?.[0] || product.image} alt={product.name} />
                      <span className="product-cat-badge">{product.category}</span>
                      <h3>{product.name}</h3>
                      <div className="rating">
                        {/* {[...Array(5)].map((_, i) => <MdStar key={i} />)} */}
                        {/* <span>4.5</span> */}
                      </div>
                      <div className="product-details">
                        <select className="size-dropdown" value={currentWeight}
                          onChange={e => setSelectedWeights({ ...selectedWeights, [product.id]: e.target.value })}
                          onClick={e => e.stopPropagation()}>
                          {Array.isArray(product.grams)
                            ? product.grams.map((g, i) => <option key={i} value={g}>{g}</option>)
                            : <option value={product.grams}>{product.grams}</option>}
                        </select>
                        <div className="home-price-wrap">
                          {product.originalPrices?.[currentWeight] && Number(product.originalPrices[currentWeight]) > Number(currentPrice) && (
                            <span className="home-orig-price">₹{product.originalPrices[currentWeight]}</span>
                          )}
                          <span className="price">₹{currentPrice}</span>
                          {calcDiscount(product.originalPrices?.[currentWeight], currentPrice) && (
                            <span className="home-disc-badge">-{calcDiscount(product.originalPrices[currentWeight], currentPrice)}%</span>
                          )}
                        </div>
                      </div>
                      {isInCart(product.id, currentWeight) ? (
                        <div className="qty-control" onClick={e => e.stopPropagation()}>
                          <button onClick={() => updateQuantity(product.id, currentWeight, -1)}>−</button>
                          <span>{getCartQuantity(product.id, currentWeight)}</span>
                          <button onClick={() => updateQuantity(product.id, currentWeight, 1)}>+</button>
                        </div>
                      ) : (
                        <button className="add-btn" onClick={e => { e.stopPropagation(); addToCart(product.id, currentWeight); }}>
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
              <h2>Ready to Upgrade Your Style? 👟</h2>
              <p>Shop the latest fashion at TheAlphaZone</p>
              <div className="cta-btns">
                <button className="cta-call" onClick={() => window.location.href = 'tel:+919100009907'}>📞 Call Us</button>
                <button className="cta-shop" onClick={() => navigate('/products')}>🛍️ Shop Now</button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
