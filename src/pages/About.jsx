import './About.css';

const About = () => (
  <div className="about-page">
    <div className="about-hero">
      <div className="about-hero-content glass">
        <h1><span className="a-alpha">TheAlpha</span><span className="a-zone">Zone</span></h1>
        <p>Your premium fashion destination for footwear & apparel</p>
      </div>
    </div>

    <div className="about-container">
      <div className="about-story glass">
        <h2>Our Story</h2>
        <p>Welcome to <strong>TheAlphaZone</strong> — where fashion meets comfort. We started with a simple mission: to bring premium quality sandals, shoes, flip flops, tshirts, and track pants to everyone at prices that make sense.</p>
        <p>From trendy sneakers to ultra-soft track pants, every product at TheAlphaZone is carefully curated to ensure you look great and feel even better. We believe fashion should be accessible, comfortable, and expressive.</p>
        <p>Whether you're stepping out in style or lounging at home, TheAlphaZone has you covered — head to toe.</p>
      </div>

      <div className="about-features">
        {[
          { icon: '👟', title: 'Premium Footwear', desc: 'Sandals, shoes & flip flops for every occasion and lifestyle' },
          { icon: '👕', title: 'Trendy Apparel', desc: 'Fresh tshirts and comfortable track pants for every mood' },
          { icon: '🚚', title: 'Fast Delivery', desc: 'Quick doorstep delivery with freshness guaranteed' },
          { icon: '✅', title: 'Quality Assured', desc: 'Every product quality-checked before it reaches you' },
        ].map((f, i) => (
          <div key={i} className="about-feature-card glass">
            <span className="af-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="about-values glass">
        <h2>Our Values</h2>
        <div className="values-grid">
          {[
            { label: 'Quality', desc: 'Never compromising on product quality' },
            { label: 'Style', desc: 'Keeping up with the latest fashion trends' },
            { label: 'Comfort', desc: 'Products designed for all-day comfort' },
            { label: 'Affordability', desc: 'Premium fashion at accessible prices' },
            { label: 'Customer First', desc: 'Your satisfaction is our top priority' },
          ].map((v, i) => (
            <div key={i} className="value-item">
              <span className="value-dot" />
              <div><strong>{v.label}:</strong> {v.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default About;

