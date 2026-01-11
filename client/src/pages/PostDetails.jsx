import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import EmptyState from '../components/EmptyState.jsx';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [reportReason, setReportReason] = useState('');

  const loadPost = async () => {
    const { data } = await api.get(`/posts/${id}`);
    setPost(data.data.post);
  };

  const loadComments = async () => {
    const { data } = await api.get('/comments', {
      params: { parentType: 'post', parentId: id },
    });
    setComments(data.data.items);
  };

  useEffect(() => {
    loadPost();
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submitComment = async (event) => {
    event.preventDefault();
    await api.post('/comments', { parentType: 'post', parentId: id, content: commentText });
    setCommentText('');
    loadComments();
  };

  const reportPost = async () => {
    if (!reportReason) return;
    await api.post(`/posts/${id}/report`, { reason: reportReason });
    setReportReason('');
  };

  if (!post) {
    return <EmptyState title="Post not found" subtitle="We could not load this post." />;
  }

  return (
    <section className="detail">
      <div className="card">
        <div className="card-header">
          <div>
            <strong>{post.author?.username}</strong>
            <span className="muted">{new Date(post.createdAt).toLocaleString()}</span>
          </div>
          <span className="chip">{post.likesCount} likes</span>
        </div>
        <p className="card-body">{post.content}</p>
        {post.images?.length > 0 && (
          <div className="card-media">
            <img src={post.images[0]} alt="Post" />
          </div>
        )}
        <div className="card-actions">
          <input
            placeholder="Reason to report"
            value={reportReason}
            onChange={(event) => setReportReason(event.target.value)}
          />
          <button type="button" className="btn btn-ghost" onClick={reportPost}>
            Report
          </button>
        </div>
      </div>

      <div className="panel">
        <h3>Comments</h3>
        <form onSubmit={submitComment} className="form-grid">
          <textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            rows="3"
            placeholder="Write a comment"
            required
          />
          <button className="btn btn-primary" type="submit">
            Comment
          </button>
        </form>
        <div className="comment-list">
          {comments.length === 0 ? (
            <EmptyState title="No comments" subtitle="Start the discussion." />
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="comment">
                <strong>{comment.author?.username}</strong>
                <p>{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default PostDetails;
