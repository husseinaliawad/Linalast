import { Link } from 'react-router-dom';

const PostCard = ({ post, onLike }) => {
  return (
    <article className="card">
      <div className="card-header">
        <div>
          <strong>{post.author?.username || 'Unknown'}</strong>
          <span className="muted">{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <Link to={`/posts/${post._id}`} className="link">
          View
        </Link>
      </div>
      <p className="card-body">{post.content}</p>
      {post.images?.length > 0 && (
        <div className="card-media">
          <img src={post.images[0]} alt="Post" />
        </div>
      )}
      <div className="card-actions">
        <button type="button" className="btn btn-ghost" onClick={() => onLike(post._id)}>
          Like ({post.likesCount || 0})
        </button>
        <span className="muted">Comments: {post.commentsCount || 0}</span>
      </div>
    </article>
  );
};

export default PostCard;
