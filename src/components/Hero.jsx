import React from 'react';

export function Hero() {
    return (
        <section className="hero">
            <div className="container hero-container">
                <div className="hero-text">
                    <span className="badge">Welcome to Divine Elegance</span>
                    <h2>Adorning the Divine with Love & Devotion</h2>
                    <p>
                        Exclusive collection of Poshak, Pagdi, Bansuri, and accessories for Laddu Gopal.
                        Located in the heart of Gurugram.
                    </p>
                    <button className="btn btn-primary" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
                        View Collection
                    </button>
                </div>
                <div className="hero-image">
                    <div className="image-wrapper">
                        <img src="/images/hero_kanha_1766162920355.png" alt="Kanha Ji" />
                    </div>
                </div>
            </div>
            <style>{`
        .hero {
          background: linear-gradient(135deg, #fff8e1 0%, #fff 100%);
          padding: 4rem 0;
          overflow: hidden;
        }
        .hero-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 4rem;
        }
        .badge {
          display: inline-block;
          background: var(--color-accent);
          color: var(--color-text-main);
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .hero-text h2 {
          font-size: 3.5rem;
          line-height: 1.1;
          color: var(--color-secondary);
          margin-bottom: 1.5rem;
        }
        .hero-text p {
          font-size: 1.125rem;
          color: var(--color-text-light);
          margin-bottom: 2rem;
          max-width: 500px;
        }
        .image-wrapper {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          border: 4px solid white;
        }
        .image-wrapper img {
          width: 100%;
          transition: transform 0.5s ease;
        }
        .image-wrapper:hover img {
          transform: scale(1.05);
        }
        @media (max-width: 960px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-text {
             margin: 0 auto;
             display: flex;
             flex-direction: column;
             align-items: center;
          }
        }
      `}</style>
        </section>
    );
}
