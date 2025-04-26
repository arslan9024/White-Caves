
import './App.css'

export default function App() {
  return (
    <div className="app">
      <header>
        <nav>
          <div className="logo">White Caves</div>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#properties">Properties</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>
      </header>

      <section className="hero">
        <h1>Luxury Real Estate in Dubai</h1>
        <p>Discover Premium Properties with White Caves</p>
        <button className="cta-button">Explore Properties</button>
      </section>

      <section className="featured-properties">
        <h2>Featured Properties</h2>
        <div className="property-grid">
          <div className="property-card">
            <div className="property-image"></div>
            <h3>Luxury Villa - Palm Jumeirah</h3>
            <p>5 Bed | 6 Bath | 8,000 sq ft</p>
            <p className="price">AED 15,000,000</p>
          </div>
          <div className="property-card">
            <div className="property-image"></div>
            <h3>Downtown Penthouse</h3>
            <p>4 Bed | 5 Bath | 5,500 sq ft</p>
            <p className="price">AED 12,500,000</p>
          </div>
          <div className="property-card">
            <div className="property-image"></div>
            <h3>Emirates Hills Villa</h3>
            <p>6 Bed | 7 Bath | 10,000 sq ft</p>
            <p className="price">AED 25,000,000</p>
          </div>
        </div>
      </section>

      <section className="contact">
        <h2>Contact Us</h2>
        <div className="contact-info">
          <p>Email: info@whitecaves.ae</p>
          <p>Phone: +971 4 XXX XXXX</p>
          <p>Address: Downtown Dubai, UAE</p>
        </div>
      </section>

      <footer>
        <p>© 2024 White Caves Real Estate. All rights reserved.</p>
      </footer>
    </div>
  )
}
