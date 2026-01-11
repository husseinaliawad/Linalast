import { useEffect, useState } from 'react';
import api from '../api/axios';
import PostCard from '../components/PostCard.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import Pagination from '../components/Pagination.jsx';
import EmptyState from '../components/EmptyState.jsx';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [postPage, setPostPage] = useState(1);
  const [postTotal, setPostTotal] = useState(0);
  const [postSort, setPostSort] = useState('latest');
  const [postForm, setPostForm] = useState({ content: '', images: '' });

  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [reviewSort, setReviewSort] = useState('latest');
  const [reviewForm, setReviewForm] = useState({
    bookTitle: '',
    bookAuthor: '',
    rating: 5,
    content: '',
  });

  const limit = 5;

  const loadPosts = async () => {
    const { data } = await api.get('/posts', {
      params: { page: postPage, limit, sort: postSort },
    });
    setPosts(data.data.items);
    setPostTotal(data.data.total);
  };

  const loadReviews = async () => {
    const { data } = await api.get('/reviews', {
      params: { page: reviewPage, limit, sort: reviewSort },
    });
    setReviews(data.data.items);
    setReviewTotal(data.data.total);
  };

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postPage, postSort]);

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewPage, reviewSort]);

  const handlePostSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      content: postForm.content,
      images: postForm.images ? [postForm.images] : [],
    };
    await api.post('/posts', payload);
    setPostForm({ content: '', images: '' });
    loadPosts();
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...reviewForm,
      rating: Number(reviewForm.rating),
    };
    await api.post('/reviews', payload);
    setReviewForm({ bookTitle: '', bookAuthor: '', rating: 5, content: '' });
    loadReviews();
  };

  const likePost = async (id) => {
    await api.post(`/posts/${id}/like`);
    loadPosts();
  };

  const likeReview = async (id) => {
    await api.post(`/reviews/${id}/like`);
    loadReviews();
  };

  return (
    <section className="feed">
      <div className="section-header">
        <h2>Community Feed</h2>
        <p className="muted">Share posts, reviews, and ideas with readers across SVU.</p>
      </div>

      <div className="feed-grid">
        <div className="panel">
          <h3>Create a post</h3>
          <form onSubmit={handlePostSubmit} className="form-grid">
            <textarea
              name="content"
              value={postForm.content}
              onChange={(event) => setPostForm({ ...postForm, content: event.target.value })}
              placeholder="What are you reading today?"
              rows="4"
              required
            />
            <input
              name="images"
              value={postForm.images}
              onChange={(event) => setPostForm({ ...postForm, images: event.target.value })}
              placeholder="Optional image URL"
            />
            <button className="btn btn-primary" type="submit">
              Publish
            </button>
          </form>
        </div>

        <div className="panel">
          <h3>Write a review</h3>
          <form onSubmit={handleReviewSubmit} className="form-grid">
            <input
              name="bookTitle"
              value={reviewForm.bookTitle}
              onChange={(event) => setReviewForm({ ...reviewForm, bookTitle: event.target.value })}
              placeholder="Book title"
              required
            />
            <input
              name="bookAuthor"
              value={reviewForm.bookAuthor}
              onChange={(event) => setReviewForm({ ...reviewForm, bookAuthor: event.target.value })}
              placeholder="Author"
              required
            />
            <select
              value={reviewForm.rating}
              onChange={(event) => setReviewForm({ ...reviewForm, rating: event.target.value })}
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} stars
                </option>
              ))}
            </select>
            <textarea
              name="content"
              value={reviewForm.content}
              onChange={(event) => setReviewForm({ ...reviewForm, content: event.target.value })}
              placeholder="Share your thoughts"
              rows="4"
              required
            />
            <button className="btn btn-primary" type="submit">
              Publish review
            </button>
          </form>
        </div>
      </div>

      <div className="feed-section">
        <div className="section-header row">
          <h3>Posts</h3>
          <select value={postSort} onChange={(event) => setPostSort(event.target.value)}>
            <option value="latest">Latest</option>
            <option value="top">Top</option>
          </select>
        </div>
        {posts.length === 0 ? (
          <EmptyState title="No posts yet" subtitle="Be the first to spark the conversation." />
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} onLike={likePost} />)
        )}
        <Pagination page={postPage} total={postTotal} limit={limit} onPageChange={setPostPage} />
      </div>

      <div className="feed-section">
        <div className="section-header row">
          <h3>Reviews</h3>
          <select value={reviewSort} onChange={(event) => setReviewSort(event.target.value)}>
            <option value="latest">Latest</option>
            <option value="top">Top</option>
          </select>
        </div>
        {reviews.length === 0 ? (
          <EmptyState title="No reviews yet" subtitle="Share the next great recommendation." />
        ) : (
          reviews.map((review) => (
            <ReviewCard key={review._id} review={review} onLike={likeReview} />
          ))
        )}
        <Pagination
          page={reviewPage}
          total={reviewTotal}
          limit={limit}
          onPageChange={setReviewPage}
        />
      </div>
    </section>
  );
};

export default Feed;
