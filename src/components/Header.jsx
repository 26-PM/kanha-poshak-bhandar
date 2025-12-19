import React from 'react';
import { ShoppingBag, Crown, Settings } from 'lucide-react';

export function Header({ toggleAdmin, showAdmin }) {
    return (
        <header className="header">
            <div className="container header-content">
                <div className="logo">
                    <Crown className="logo-icon" size={32} color="var(--color-primary)" />
                    <div>
                        <h1>Kanha Poshak Bhandar</h1>
                        <p className="subtitle">Badshahpur Main Bazar, Gurugram</p>
                    </div>
                </div>
                <nav>
                    <button className="nav-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        Home
                    </button>
                    <button className="nav-btn" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
                        Collection
                    </button>
                    <button
                        className={`btn ${showAdmin ? 'btn-primary' : 'btn-outline'}`}
                        onClick={toggleAdmin}
                        style={{ marginLeft: '1rem' }}
                    >
                        <Settings size={18} style={{ marginRight: '8px' }} />
                        {showAdmin ? 'Close Admin' : 'Admin'}
                    </button>
                </nav>
            </div>
            <style>{`
        .header {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          padding: 1rem 0;
          box-shadow: var(--shadow-sm);
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .logo h1 {
          font-size: 1.5rem;
          color: var(--color-text-main);
          font-weight: 700;
          line-height: 1.2;
        }
        .subtitle {
          font-size: 0.8rem;
          color: var(--color-text-light);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .nav-btn {
          background: none;
          color: var(--color-text-main);
          font-weight: 500;
          margin-left: 1.5rem;
          font-size: 1rem;
        }
        .nav-btn:hover {
          color: var(--color-primary);
        }
        .btn-outline {
          border: 1px solid var(--color-primary);
          color: var(--color-primary);
          background: transparent;
        }
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
          }
          .logo {
            text-align: center;
          }
        }
      `}</style>
        </header>
    );
}
