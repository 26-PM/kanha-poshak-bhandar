import React from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';

export function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart, onCheckout }) {
    if (!isOpen) return null;

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="cart-overlay" onClick={onClose}>
            <div className="cart-drawer" onClick={e => e.stopPropagation()}>
                <div className="cart-header">
                    <div className="header-title">
                        <ShoppingBag size={24} />
                        <h2>Your Cart ({cartItems.length})</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <p>Your cart is empty.</p>
                            <button className="btn btn-outline" onClick={onClose}>Start Shopping</button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="item-details">
                                    <h4>{item.name}</h4>
                                    <p className="item-price">₹{item.price}</p>
                                    {item.product_code && <span className="item-code">Code: {item.product_code}</span>}

                                    <div className="quantity-controls">
                                        <button onClick={() => onUpdateQuantity(item.id, -1)} disabled={item.quantity <= 1}>
                                            <Minus size={14} />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => onUpdateQuantity(item.id, 1)}>
                                            <Plus size={14} />
                                        </button>
                                        <button className="remove-item-btn" onClick={() => onRemoveItem(item.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="item-total">
                                    ₹{item.price * item.quantity}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>Total Amount:</span>
                            <span className="amount">₹{total}</span>
                        </div>

                        <div className="action-buttons">
                            <button className="clear-cart-btn" onClick={() => {
                                if (window.confirm('Are you sure you want to clear your cart?')) onClearCart();
                            }}>
                                Clear Cart
                            </button>
                            <button className="checkout-btn" onClick={onCheckout}>
                                Checkout on WhatsApp
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .cart-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                    display: flex;
                    justify-content: flex-end;
                    backdrop-filter: blur(3px);
                    animation: fadeIn 0.3s;
                }
                .cart-drawer {
                    background: white;
                    width: 100%;
                    max-width: 450px;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    animation: slideIn 0.3s;
                    box-shadow: -5px 0 30px rgba(0,0,0,0.2);
                }
                .cart-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: var(--color-text-main);
                    color: white;
                }
                .header-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .close-btn {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 5px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                }
                .close-btn:hover {
                    background: rgba(255,255,255,0.2);
                }

                .cart-items {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1.5rem;
                }
                .empty-cart {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: #888;
                    text-align: center;
                }
                .btn-outline {
                    margin-top: 1rem;
                    border: 2px solid var(--color-primary);
                    color: var(--color-primary);
                    background: transparent;
                    padding: 0.5rem 1.5rem;
                    border-radius: 50px;
                    cursor: pointer;
                    font-weight: 600;
                }

                .cart-item {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid #eee;
                    align-items: center;
                }
                .item-image {
                    width: 70px;
                    height: 70px;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid #eee;
                    flex-shrink: 0;
                }
                .item-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .item-details {
                    flex: 1;
                }
                .item-details h4 {
                    margin: 0 0 0.25rem 0;
                    color: var(--color-text-main);
                    font-size: 0.95rem;
                }
                .item-price {
                    color: var(--color-primary);
                    font-weight: 600;
                    font-size: 0.9rem;
                    margin-bottom: 0.25rem;
                }
                .item-code {
                    font-size: 0.75rem;
                    color: #999;
                    display: block;
                    margin-bottom: 0.5rem;
                }
                .quantity-controls {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .quantity-controls button {
                    width: 24px;
                    height: 24px;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #555;
                }
                .quantity-controls button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .quantity-controls span {
                    font-size: 0.9rem;
                    font-weight: 600;
                    min-width: 20px;
                    text-align: center;
                }
                .remove-item-btn {
                    margin-left: auto;
                    border: none;
                    background: #ffebec !important;
                    color: #ff4757 !important;
                    border-color: #ff4757 !important;
                }

                .cart-footer {
                    padding: 1.5rem;
                    border-top: 1px solid #eee;
                    background: #fcfcfc;
                }
                .cart-total {
                    display: flex;
                    justify-content: space-between;
                    font-size: 1.2rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                    color: var(--color-text-main);
                }
                .action-buttons {
                    display: flex;
                    gap: 1rem;
                }
                .clear-cart-btn {
                    flex: 1;
                    padding: 0.8rem;
                    background: white;
                    border: 1px solid #ddd;
                    color: #666;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                }
                .checkout-btn {
                    flex: 2;
                    padding: 0.8rem;
                    background: #25D366;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
}
