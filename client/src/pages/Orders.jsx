import { useEffect, useState } from 'react';
import api from '../api/axios';
import EmptyState from '../components/EmptyState.jsx';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const { data } = await api.get('/orders/my');
    setOrders(data.data.items);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <section className="orders">
      <div className="section-header">
        <h2>Your orders</h2>
        <p className="muted">Track your recent marketplace purchases.</p>
      </div>

      {orders.length === 0 ? (
        <EmptyState title="No orders" subtitle="Checkout items to see orders here." />
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card">
            <div className="card-header">
              <strong>Order #{order._id.slice(-6)}</strong>
              <span className="chip">{order.status}</span>
            </div>
            <div className="card-body">
              {order.items.map((item) => (
                <div key={item.product} className="order-item">
                  <span>{item.title}</span>
                  <span>
                    {item.quantity} x ${item.price}
                  </span>
                </div>
              ))}
            </div>
            <div className="card-actions">
              <strong>Total: ${order.total}</strong>
            </div>
          </div>
        ))
      )}
    </section>
  );
};

export default Orders;
