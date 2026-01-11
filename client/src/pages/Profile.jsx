import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext.jsx';
import PostCard from '../components/PostCard.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import ProductCard from '../components/ProductCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

const Profile = () => {
  const { id } = useParams();
  const { user, refresh } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [editForm, setEditForm] = useState({ avatar: '', bio: '', social: {} });
  const [reportReason, setReportReason] = useState('');

  const profileId = id && id !== 'me' ? id : user?._id;
  const isMe = user && profileId === user._id;

  const loadProfile = async () => {
    if (!profileId) return;
    const { data } = await api.get(`/users/${profileId}`);
    setProfile(data.data.user);
    setStats(data.data.stats);
    setEditForm({
      avatar: data.data.user.avatar || '',
      bio: data.data.user.bio || '',
      social: data.data.user.social || {},
    });
  };

  const loadContent = async () => {
    if (!profileId) return;
    const [postsRes, reviewsRes, productsRes] = await Promise.all([
      api.get(`/users/${profileId}/posts`),
      api.get(`/users/${profileId}/reviews`),
      api.get(`/users/${profileId}/products`),
    ]);
    setPosts(postsRes.data.data.items);
    setReviews(reviewsRes.data.data.items);
    setProducts(productsRes.data.data.items);
  };

  useEffect(() => {
    loadProfile();
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  const updateProfile = async (event) => {
    event.preventDefault();
    const payload = {
      avatar: editForm.avatar,
      bio: editForm.bio,
      social: editForm.social,
    };
    await api.put('/users/me', payload);
    refresh();
    loadProfile();
  };

  const followToggle = async (action) => {
    await api.post(`/users/${profileId}/${action}`);
    loadProfile();
  };

  const reportUser = async () => {
    if (!reportReason) return;
    await api.post(`/users/${profileId}/report`, { reason: reportReason });
    setReportReason('');
  };

  if (!profile) {
    return <EmptyState title="Profile not found" subtitle="Unable to load user." />;
  }

  return (
    <section className="profile">
      <div className="profile-header">
        <img src={profile.avatar || 'https://i.pravatar.cc/150?img=19'} alt={profile.username} />
        <div>
          <h2>{profile.username}</h2>
          <p className="muted">{profile.bio || 'No bio yet.'}</p>
          {stats && (
            <div className="stats-row">
              <span>{stats.posts} posts</span>
              <span>{stats.reviews} reviews</span>
              <span>{stats.products} products</span>
              <span>{stats.followers} followers</span>
            </div>
          )}
        </div>
        {!isMe && (
          <div className="profile-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => followToggle('follow')}
            >
              Follow
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => followToggle('unfollow')}
            >
              Unfollow
            </button>
            <input
              placeholder="Report reason"
              value={reportReason}
              onChange={(event) => setReportReason(event.target.value)}
            />
            <button type="button" className="btn btn-ghost" onClick={reportUser}>
              Report
            </button>
          </div>
        )}
      </div>

      {isMe && (
        <div className="panel">
          <h3>Edit profile</h3>
          <form onSubmit={updateProfile} className="form-grid">
            <label>
              Avatar URL
              <input
                value={editForm.avatar}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, avatar: event.target.value }))
                }
              />
            </label>
            <label>
              Bio
              <textarea
                value={editForm.bio}
                onChange={(event) => setEditForm((prev) => ({ ...prev, bio: event.target.value }))}
                rows="3"
              />
            </label>
            <label>
              Website
              <input
                value={editForm.social?.website || ''}
                onChange={(event) =>
                  setEditForm((prev) => ({
                    ...prev,
                    social: { ...prev.social, website: event.target.value },
                  }))
                }
              />
            </label>
            <label>
              Twitter
              <input
                value={editForm.social?.twitter || ''}
                onChange={(event) =>
                  setEditForm((prev) => ({
                    ...prev,
                    social: { ...prev.social, twitter: event.target.value },
                  }))
                }
              />
            </label>
            <button className="btn btn-primary" type="submit">
              Save changes
            </button>
          </form>
        </div>
      )}

      <div className="profile-content">
        <div>
          <h3>Posts</h3>
          {posts.length === 0 ? (
            <EmptyState title="No posts" subtitle="This user has not shared any posts yet." />
          ) : (
            posts.map((post) => <PostCard key={post._id} post={post} onLike={() => {}} />)
          )}
        </div>
        <div>
          <h3>Reviews</h3>
          {reviews.length === 0 ? (
            <EmptyState title="No reviews" subtitle="No book reviews yet." />
          ) : (
            reviews.map((review) => <ReviewCard key={review._id} review={review} onLike={() => {}} />)
          )}
        </div>
        <div>
          <h3>Products</h3>
          {products.length === 0 ? (
            <EmptyState title="No products" subtitle="No products listed yet." />
          ) : (
            products.map((product) => <ProductCard key={product._id} product={product} />)
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;
