import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext.jsx';
import EmptyState from '../components/EmptyState.jsx';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'book',
    images: '',
    stock: 0,
  });

  const loadProducts = async () => {
    if (!user) return;
    const { data } = await api.get(`/users/${user._id}/products`);
    setProducts(data.data.items);
  };

  const loadOrders = async () => {
    const { data } = await api.get('/orders/seller');
    setOrders(data.data.items);
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const createProduct = async (event) => {
    event.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      images: form.images ? [form.images] : [],
      stock: Number(form.stock),
    };
    await api.post('/products', payload);
    setForm({ title: '', description: '', price: '', category: 'book', images: '', stock: 0 });
    loadProducts();
  };

  const updateStatus = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    loadOrders();
  };

  return (
    <section className="seller">
      <div className="section-header">
        <h2>Seller dashboard</h2>
        <p className="muted">Manage your cultural products and orders.</p>
      </div>

      <div className="panel">
        <h3>Add new product</h3>
        <form onSubmit={createProduct} className="form-grid">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            rows="3"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(event) => setForm({ ...form, price: event.target.value })}
            required
          />
          <select
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
          >
            <option value="book">Book</option>
            <option value="notebook">Notebook</option>
            <option value="tools">Reading tools</option>
            <option value="accessories">Accessories</option>
          </select>
          <input
            placeholder="Image URL"
            value={form.images}
            onChange={(event) => setForm({ ...form, images: event.target.value })}
          />
          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(event) => setForm({ ...form, stock: event.target.value })}
            min="0"
          />
          <button className="btn btn-primary" type="submit">
            Publish product
          </button>
        </form>
      </div>

      <div className="panel">
        <h3>Your products</h3>
        {products.length === 0 ? (
          <EmptyState title="No products yet" subtitle="Add your first listing above." />
        ) : (
          products.map((product) => (
            <div key={product._id} className="card">
              <div className="card-header">
                <strong>{product.title}</strong>
                <span className="chip">${product.price}</span>
              </div>
              <p className="card-body">{product.description}</p>
              <div className="card-actions">
                <span className="muted">Stock: {product.stock}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="panel">
        <h3>Orders for you</h3>
        {orders.length === 0 ? (
          <EmptyState title="No orders" subtitle="Orders will show up here." />
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
                <select
                  value={order.status}
                  onChange={(event) => updateStatus(order._id, event.target.value)}
                >
                  <option value="pending">pending</option>
                  <option value="paid">paid</option>
                  <option value="shipped">shipped</option>
                  <option value="completed">completed</option>
                  <option value="canceled">canceled</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default SellerDashboard;
