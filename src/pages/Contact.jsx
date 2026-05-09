import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Contact.css';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const message = e.target.message.value;
    window.open(`https://wa.me/9198885553249?text=Name: ${name}%0AEmail: ${email}%0AMessage: ${message}`, '_blank');
    toast.success('Redirecting to WhatsApp...');
    e.target.reset();
  };

  return (
    <div className="contact-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p className="contact-subtitle">We'd love to hear from you — reach out anytime!</p>

        <div className="contact-grid">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <div className="info-item">
              <h3>📞 Phone</h3>
              <p>+91 8885553249</p>
              {/* <p>+91 7901288956</p> */}
            </div>
            <div className="info-item">
              <h3>📧 Email</h3>
              <p>thealphazone007@gmail.com</p>
            </div>
            <div className="info-item">
              <h3>📍 Address</h3>
              <p>TheAlphaZone Fashion Store<br />Kadapa<br />Kadapa - 516001</p>
            </div>
            <div className="info-item">
              <h3>🕐 Business Hours</h3>
              <p>Monday – Sunday: 9:00 AM – 9:00 PM</p>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <h2>Send a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Your Name</label>
                <input name="name" type="text" placeholder="Enter your name" required />
              </div>
              <div className="form-group">
                <label>Your Email</label>
                <input name="email" type="email" placeholder="Enter your email" required />
              </div>
              <div className="form-group">
                <label>Your Message</label>
                <textarea name="message" placeholder="Write your message..." required rows="5" />
              </div>
              <button type="submit" className="submit-btn">💬 Send via WhatsApp</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

