import React from 'react';
import { supabase } from './supabase';
import { Trash2, ShoppingCart, Instagram, MapPin } from 'lucide-react';
// import { initialProducts } from './data'; // Deprecated

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AdminPanel } from './components/AdminPanel';

import { CartDrawer } from './components/CartDrawer';

function App() {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showAdmin, setShowAdmin] = React.useState(false);
  const [filter, setFilter] = React.useState('All');
  const [cart, setCart] = React.useState([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const filteredProducts = filter === 'All'
    ? products
    : products.filter(p => p.category === filter);

  const addProduct = (newProduct) => {
    setProducts([newProduct, ...products]);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to remove this holy item?")) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete item.');
    } else {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const getOriginalPrice = (price, discount) => {
    if (!discount) return null;
    return Math.round(price / (1 - discount / 100));
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // Auto open cart to show feedback
  };

  const updateQuantity = (id, delta) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setIsCartOpen(false);
  };

  const checkoutWhatsApp = () => {
    const phoneNumber = "919891953999"; // Updated Business Number
    let message = "Namaste Kanha Poshak Bhandar! I would like to order the following sacred items:\n\n";

    let total = 0;
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      message += `${index + 1}. ${item.name} (Code: ${item.product_code || 'N/A'}) \n   Qty: ${item.quantity} x ₹${item.price} = ₹${itemTotal}\n`;
      total += itemTotal;
    });

    message += `\nTotal Amount: ₹${total}`;
    message += "\n\nPlease confirm availability.";

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
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

        {loading ? (
          <div className="loading">Loading Sacred Items...</div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="card-image">
                  <img src={product.image} alt={product.name} />
                  <div className="card-badge">{product.category}</div>
                  {product.discount > 0 && (
                    <div className="discount-badge">-{product.discount}%</div>
                  )}
                  {showAdmin && (
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProduct(product.id);
                      }}
                      title="Delete Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="card-content">
                  <h3>{product.name}</h3>
                  {product.product_code && <div className="product-code">Code: {product.product_code}</div>}
                  <p className="description">{product.description}</p>
                  <div className="card-footer">
                    <div className="price-container">
                      {product.discount > 0 && (
                        <span className="original-price">₹{getOriginalPrice(product.price, product.discount)}</span>
                      )}
                      <span className="price">₹{product.price}</span>
                    </div>
                    <button className="btn btn-primary" onClick={() => addToCart(product)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <h3>Kanha Poshak Bhandar</h3>
          <p className="address">
            <a href="https://maps.app.goo.gl/M9b8FMKQS4HM3not5?g_st=aw" target="_blank" rel="noreferrer" className="address-link">
              <MapPin size={16} />
              <span>Visit us: Kanha Poshak Bhandar, Badshahpur Main Bazar</span>
            </a>
          </p>

          <div className="social-links">
            <a href="https://www.instagram.com/_kanha_poshak_bhandar_?igsh=MWRnMnVrZ2licXIzMw==" target="_blank" rel="noreferrer" className="social-btn">
              <Instagram size={20} /> Follow us on Instagram
            </a>
          </div>

          <p className="footer-note">Serving the Divine since 2010. | Jai Shri Krishna</p>
        </div>
      </footer>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onCheckout={checkoutWhatsApp}
      />

      {cart.length > 0 && (
        <button className="floating-cart-btn" onClick={() => setIsCartOpen(true)}>
          <ShoppingCart size={24} />
          <span>View Cart ({cart.reduce((a, c) => a + c.quantity, 0)})</span>
        </button>
      )}

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
        .discount-badge {
            position: absolute;
            top: 1rem;
            left: 1rem;
            background: #d63031;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 800;
        }
        
        .delete-btn {
            position: absolute;
            bottom: 1rem;
            right: 1rem;
            background: #ff4757;
            color: white;
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.2s;
            z-index: 10;
        }
        .delete-btn:hover {
            transform: scale(1.1);
            background: #ff6b81;
        }

        .card-content {
          padding: 1.5rem;
        }
        .card-content h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          margin-bottom: 0.5rem;
          color: var(--color-text-main);
        }
        .product-code {
            font-size: 0.8rem;
            color: var(--color-primary);
            font-weight: 600;
            margin-bottom: 0.5rem;
            background: rgba(0,0,0,0.03);
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
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
        .price-container {
            display: flex;
            flex-direction: column;
        }
        .original-price {
            font-size: 0.9rem;
            text-decoration: line-through;
            color: #999;
            font-weight: 500;
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
        .loading {
          text-align: center;
          padding: 3rem;
          font-size: 1.2rem;
          color: var(--color-text-light);
        }

        .floating-cart-btn {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: #25D366; /* WhatsApp Green */
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
            cursor: pointer;
            z-index: 100;
            animation: bounce 2s infinite;
        }
        .floating-cart-btn:hover {
            transform: scale(1.05);
            background: #20bd5a;
        }

        .social-links {
            margin: 1.5rem 0;
        }
        .social-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: white;
            text-decoration: none;
            background: rgba(255,255,255,0.2);
            padding: 0.5rem 1rem;
            border-radius: 8px;
            transition: background 0.2s;
        }
        .social-btn:hover {
            background: #E1306C; /* Insta Gradient base */
        }
        .address {
            opacity: 0.9;
            margin-bottom: 1rem;
        }
        .address-link {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            color: white;
            text-decoration: none;
            transition: color 0.2s;
        }
        .address-link:hover {
            text-decoration: underline;
            color: #dff9fb;
        }

        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
            40% {transform: translateY(-10px);}
            60% {transform: translateY(-5px);}
        }
      `}</style>
    </div>
  );
}

export default App;
