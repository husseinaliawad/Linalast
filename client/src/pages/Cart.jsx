import { useState } from 'react';
import api from '../api/axios';
import { useCart } from '../context/CartContext.jsx';
import EmptyState from '../components/EmptyState.jsx';

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const [status, setStatus] = useState('');

  const checkout = async () => {
    if (items.length === 0) return;
    const payload = {
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };
    await api.post('/orders', payload);
    clearCart();
    setStatus('Order placed!');
  };

  return (
    <section className="cart">
      <div className="section-header">
        <h2>Your cart</h2>
        <p className="muted">Review items and checkout.</p>
      </div>

      {items.length === 0 ? (
        <EmptyState title="Cart is empty" subtitle="Add something from the marketplace." />
      ) : (
        <div className="panel">
          {items.map((item) => (
            <div key={item.productId} className="cart-item">
              <img src={item.image || 'https://images.unsplash.com/photo-1463320898484-cdee8141c787?auto=format&fit=crop&w=200&q=80'} alt={item.title} />
              <div>
                <strong>{item.title}</strong>
                <span className="muted">${item.price}</span>
              </div>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
              />
              <button type="button" className="btn btn-ghost" onClick={() => removeItem(item.productId)}>
                Remove
              </button>
            </div>
          ))}
          <div className="cart-summary">
            <strong>Total: ${total.toFixed(2)}</strong>
            <button type="button" className="btn btn-primary" onClick={checkout}>
              Checkout
            </button>
            {status && <p className="success">{status}</p>}
          </div>
        </div>
      )}
    </section>
  );
};

export default Cart;
