import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAdd }) => {
  return (
    <article className="card">
      <div className="card-media">
        <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1463320898484-cdee8141c787?auto=format&fit=crop&w=800&q=80'} alt={product.title} />
      </div>
      <div className="card-header">
        <div>
          <strong>{product.title}</strong>
          <span className="muted">{product.category}</span>
        </div>
        <span className="chip">${product.price}</span>
      </div>
      <p className="card-body">{product.description}</p>
      <div className="card-actions">
        <Link to={`/products/${product._id}`} className="link">
          Details
        </Link>
        {onAdd && (
          <button type="button" className="btn btn-primary" onClick={() => onAdd(product)}>
            Add to cart
          </button>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
