const ReviewCard = ({ review, onLike }) => {
  return (
    <article className="card">
      <div className="card-header">
        <div>
          <strong>{review.bookTitle}</strong>
          <span className="muted">by {review.bookAuthor}</span>
        </div>
        <span className="chip">{review.rating}/5</span>
      </div>
      <p className="card-body">{review.content}</p>
      <div className="card-actions">
        <button type="button" className="btn btn-ghost" onClick={() => onLike(review._id)}>
          Like ({review.likesCount || 0})
        </button>
        <span className="muted">By {review.author?.username}</span>
      </div>
    </article>
  );
};

export default ReviewCard;
