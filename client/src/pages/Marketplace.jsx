import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard.jsx';
import Pagination from '../components/Pagination.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useCart } from '../context/CartContext.jsx';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const { addItem } = useCart();
  const limit = 6;

  const loadProducts = async () => {
    const { data } = await api.get('/products', {
      params: { page, limit, q: query, category },
    });
    setProducts(data.data.items);
    setTotal(data.data.total);
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query, category]);

  return (
    <section className="market">
      <div className="section-header">
        <h2>Marketplace</h2>
        <p className="muted">Discover cultural products from community sellers.</p>
      </div>

      <div className="market-filters">
        <input
          placeholder="Search products"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">All categories</option>
          <option value="book">Books</option>
          <option value="notebook">Notebooks</option>
          <option value="accessories">Accessories</option>
          <option value="tools">Reading tools</option>
        </select>
      </div>

      <div className="grid">
        {products.length === 0 ? (
          <EmptyState title="No products" subtitle="Try another search term." />
        ) : (
          products.map((product) => (
            <ProductCard key={product._id} product={product} onAdd={addItem} />
          ))
        )}
      </div>

      <Pagination page={page} total={total} limit={limit} onPageChange={setPage} />
    </section>
  );
};

export default Marketplace;
