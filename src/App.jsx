import React from 'react';
import { initialProducts } from './data';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AdminPanel } from './components/AdminPanel';

function App() {
    const [products, setProducts] = React.useState(initialProducts);
    const [showAdmin, setShowAdmin] = React.useState(false);
    const [filter, setFilter] = React.useState('All');

    const categories = ['All', ...new Set(products.map(p => p.category))];
    const filteredProducts = filter === 'All'
        ? products
        : products.filter(p => p.category === filter);

    const addProduct = (product) => {
        setProducts([product, ...products]);
    };

    return (
        <div className="app">
            <Header toggleAdmin={() => setShowAdmin(!showAdmin)} showAdmin={showAdmin} />

            {showAdmin && <AdminPanel onAddProduct={addProduct} />}

            <Hero />

            <main className="container" id="products">
                <h2 className="section-title">Our Sacred Collection</h2>

                <div className="filters">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-btn ${filter === cat ? 'active' : ''}`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="product-grid">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="product-card">
                            <div className="card-image">
                                <img src={product.image} alt={product.name} />
                                <div className="card-badge">{product.category}</div>
                            </div>
                            <div className="card-content">
                                <h3>{product.name}</h3>
                                <p className="description">{product.description}</p>
                                <div className="card-footer">
                                    <span className="price">₹{product.price}</span>
                                    <button className="btn btn-primary" onClick={() => alert('Order functionality coming soon! Visit our shop at Badshahpur Main Bazar.')}>
                                        Enquire
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="footer">
                <div className="container">
                    <p>&copy; 2024 Kanha Poshak Bhandar. Badshahpur Main Bazar, Gurugram.</p>
                    <p className="footer-note">Serving the Divine since 2010.</p>
                </div>
            </footer>

            <style>{`
        .filters {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }
        .filter-btn {
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          background: white;
          border: 1px solid #ddd;
          color: var(--color-text-light);
          font-weight: 500;
          transition: all 0.2s;
        }
        .filter-btn.active, .filter-btn:hover {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .product-card {
          background: white;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          transition: transform 0.3s, box-shadow 0.3s;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }
        .card-image {
          height: 300px;
          overflow: hidden;
          position: relative;
        }
        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: contain; /* Changed to contain so full product is seen */
          background-color: #f8f8f8;
          transition: transform 0.5s;
        }
        .product-card:hover .card-image img {
          transform: scale(1.05);
        }
        .card-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255,255,255,0.9);
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-text-main);
        }
        
        .card-content {
          padding: 1.5rem;
        }
        .card-content h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          color: var(--color-text-main);
        }
        .description {
          font-size: 0.9rem;
          color: var(--color-text-light);
          margin-bottom: 1.5rem;
          line-height: 1.4;
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }
        .price {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary-dark);
        }

        .footer {
          background: var(--color-text-main);
          color: white;
          padding: 3rem 0;
          text-align: center;
          margin-top: auto;
        }
        .footer-note {
          opacity: 0.6;
          margin-top: 0.5rem;
          font-size: 0.9rem;
        }
      `}</style>
        </div>
    );
}

export default App;
