import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext.jsx';
import EmptyState from '../components/EmptyState.jsx';

const ProductDetails = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [reportReason, setReportReason] = useState('');

  const loadProduct = async () => {
    const { data } = await api.get(`/products/${id}`);
    setProduct(data.data.product);
  };

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submitReview = async (event) => {
    event.preventDefault();
    await api.post(`/products/${id}/reviews`, {
      rating: Number(review.rating),
      comment: review.comment,
    });
    setReview({ rating: 5, comment: '' });
    loadProduct();
  };

  const reportProduct = async () => {
    if (!reportReason) return;
    await api.post(`/products/${id}/report`, { reason: reportReason });
    setReportReason('');
  };

  if (!product) {
    return <EmptyState title="Product not found" subtitle="Unable to load product." />;
  }

  return (
    <section className="detail">
      <div className="detail-grid">
        <div className="card-media">
          <img
            src={
              product.images?.[0] ||
              'https://images.unsplash.com/photo-1463320898484-cdee8141c787?auto=format&fit=crop&w=800&q=80'
            }
            alt={product.title}
          />
        </div>
        <div className="panel">
          <h2>{product.title}</h2>
          <p className="muted">{product.category}</p>
          <p>{product.description}</p>
          <div className="stats-row">
            <span>Price: ${product.price}</span>
            <span>Stock: {product.stock}</span>
            <span>Rating: {product.ratingsAverage || 0}</span>
          </div>
          <div className="card-actions">
            <button type="button" className="btn btn-primary" onClick={() => addItem(product)}>
              Add to cart
            </button>
            <input
              placeholder="Report reason"
              value={reportReason}
              onChange={(event) => setReportReason(event.target.value)}
            />
            <button type="button" className="btn btn-ghost" onClick={reportProduct}>
              Report
            </button>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Leave a review</h3>
        <form onSubmit={submitReview} className="form-grid">
          <select
            value={review.rating}
            onChange={(event) => setReview({ ...review, rating: event.target.value })}
          >
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} stars
              </option>
            ))}
          </select>
          <textarea
            value={review.comment}
            onChange={(event) => setReview({ ...review, comment: event.target.value })}
            rows="3"
            placeholder="Share your feedback"
            required
          />
          <button className="btn btn-primary" type="submit">
            Submit review
          </button>
        </form>
      </div>

      <div className="panel">
        <h3>Community reviews</h3>
        {product.reviews?.length ? (
          product.reviews.map((item) => (
            <div key={item._id} className="comment">
              <strong>{item.rating} stars</strong>
              <p>{item.comment}</p>
            </div>
          ))
        ) : (
          <EmptyState title="No reviews" subtitle="Be the first to review this product." />
        )}
      </div>
    </section>
  );
};

export default ProductDetails;
