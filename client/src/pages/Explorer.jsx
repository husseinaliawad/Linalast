import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext.jsx';

const fallbackImages = [
  'https://images.unsplash.com/photo-1455885661740-29cbf08a42fa?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
];

const navItems = [
  { label: 'HOME', path: '/feed' },
  { label: 'STORE', path: '/marketplace' },
  { label: 'PROFILE', path: '/me' },
  { label: 'CHAT', path: null },
  { label: 'SETTINGS', path: null },
];

const Explorer = () => {
  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const userName = user?.username || 'Bookit Member';
  const userAvatar = user?.avatar || 'https://i.pravatar.cc/150?img=11';
  const savedIds = useMemo(
    () => new Set((user?.savedPosts || []).map((id) => String(id))),
    [user]
  );

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createForm, setCreateForm] = useState({
    content: '',
    mediaUrl: '',
    mediaType: '',
  });
  const [commentDrafts, setCommentDrafts] = useState({});
  const [commentsByPost, setCommentsByPost] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [notice, setNotice] = useState('');

  const loadPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/posts', {
        params: { page: 1, limit: 10, sort: 'latest' },
      });
      setPosts(data.data.items);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (postId) => {
    const { data } = await api.get('/comments', {
      params: { parentType: 'post', parentId: postId },
    });
    setCommentsByPost((prev) => ({ ...prev, [postId]: data.data.items }));
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreatePost = async (event) => {
    event.preventDefault();
    if (!createForm.content.trim()) return;
    const payload = {
      content: createForm.content.trim(),
      images: createForm.mediaUrl ? [createForm.mediaUrl] : [],
    };
    await api.post('/posts', payload);
    setCreateForm({ content: '', mediaUrl: '', mediaType: '' });
    loadPosts();
  };

  const handleLike = async (post) => {
    const liked = post.likes?.some((id) => String(id) === String(user?._id));
    const endpoint = liked ? 'unlike' : 'like';
    await api.post(`/posts/${post._id}/${endpoint}`);
    loadPosts();
  };

  const handleSave = async (post) => {
    const saved = savedIds.has(String(post._id));
    const endpoint = saved ? 'unsave' : 'save';
    await api.post(`/posts/${post._id}/${endpoint}`);
    refresh();
  };

  const toggleComments = async (postId) => {
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
    if (!commentsByPost[postId]) {
      await loadComments(postId);
    }
  };

  const submitComment = async (postId) => {
    const text = commentDrafts[postId]?.trim();
    if (!text) return;
    await api.post('/comments', {
      parentType: 'post',
      parentId: postId,
      content: text,
    });
    setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
    await loadComments(postId);
    loadPosts();
  };

  const actionItems = [
    {
      label: 'product',
      color: 'blue',
      icon: 'box',
      onClick: () => navigate('/marketplace'),
    },
    {
      label: 'image',
      color: 'orange',
      icon: 'image',
      onClick: () => setCreateForm((prev) => ({ ...prev, mediaType: 'image' })),
    },
    {
      label: 'video',
      color: 'blue',
      icon: 'video',
      onClick: () => setCreateForm((prev) => ({ ...prev, mediaType: 'video' })),
    },
  ];

  return (
    <div className="explorer-page">
      <header className="explorer-topbar">
        <button type="button" className="back-button" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <h2>explirer page</h2>
        <div className="topbar-spacer" />
      </header>

      <div className="explorer-grid">
        <div className="explorer-feed">
          <section className="create-post">
            <form onSubmit={handleCreatePost} className="create-form">
              <div className="create-input">
                <input
                  placeholder="start a post"
                  value={createForm.content}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, content: event.target.value }))
                  }
                />
                <img src={userAvatar} alt="User avatar" className="create-avatar" />
              </div>
              {createForm.mediaType && (
                <input
                  className="media-input"
                  placeholder={
                    createForm.mediaType === 'video' ? 'video URL (optional)' : 'image URL (optional)'
                  }
                  value={createForm.mediaUrl}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, mediaUrl: event.target.value }))
                  }
                />
              )}
              <div className="create-actions">
                <div className="action-left">
                  {actionItems.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      className={`action-pill ${item.color}${
                        createForm.mediaType === item.label ? ' active' : ''
                      }`}
                      onClick={item.onClick}
                    >
                      <span className="action-icon">
                        {item.icon === 'box' && (
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M3 7l9 5 9-5-9-5-9 5z" />
                            <path d="M3 7v10l9 5 9-5V7" />
                          </svg>
                        )}
                        {item.icon === 'image' && (
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M4 5h16v14H4z" />
                            <path d="M8 13l3 3 5-5 4 4" />
                          </svg>
                        )}
                        {item.icon === 'video' && (
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M4 6h11v12H4z" />
                            <path d="M15 10l5-3v10l-5-3" />
                          </svg>
                        )}
                      </span>
                      {item.label}
                    </button>
                  ))}
                </div>
                <button type="submit" className="create-submit">
                  post
                </button>
              </div>
            </form>
          </section>

          <section className="feed-list">
            {loading && <p className="feed-status">Loading posts...</p>}
            {error && <p className="feed-status error-text">{error}</p>}
            {!loading &&
              posts.map((post, index) => {
                const liked = post.likes?.some((id) => String(id) === String(user?._id));
                const saved = savedIds.has(String(post._id));
                const postImage = post.images?.[0] || fallbackImages[index % fallbackImages.length];
                return (
                  <article key={post._id} className="post-card">
                    <div className="post-header">
                      <div className="post-user">
                        <img
                          src={post.author?.avatar || 'https://i.pravatar.cc/150?img=8'}
                          alt={post.author?.username || 'User'}
                        />
                        <span>{post.author?.username || 'Bookit user'}</span>
                      </div>
                      <span className="post-time">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="post-text">{post.content}</p>
                    <div className="post-image">
                      <img src={postImage} alt="Post visual" />
                    </div>
                    <div className="post-actions">
                      <div className="action-item">
                        <button
                          type="button"
                          aria-label="Bookmark"
                          className={saved ? 'is-saved' : ''}
                          onClick={() => handleSave(post)}
                        >
                          <svg viewBox="0 0 24 24">
                            <path d="M6 4h12v16l-6-4-6 4V4z" />
                          </svg>
                        </button>
                      </div>
                      <div className="action-item">
                        <button
                          type="button"
                          className={liked ? 'like active' : 'like'}
                          aria-label="Like"
                          onClick={() => handleLike(post)}
                        >
                          <svg viewBox="0 0 24 24">
                            <path d="M12 21s-7-4.3-9-8.5C1 8.5 3.5 6 6.5 6c2 0 3.5 1.2 5.5 3.2C14 7.2 15.5 6 17.5 6 20.5 6 23 8.5 21 12.5 19 16.7 12 21 12 21z" />
                          </svg>
                        </button>
                        <span className="post-count">{post.likesCount || 0}</span>
                      </div>
                      <div className="action-item">
                        <button
                          type="button"
                          aria-label="Comment"
                          onClick={() => toggleComments(post._id)}
                        >
                          <svg viewBox="0 0 24 24">
                            <path d="M4 5h16v11H7l-3 3V5z" />
                          </svg>
                        </button>
                        <span className="post-count">{post.commentsCount || 0}</span>
                      </div>
                    </div>
                    {openComments[post._id] && (
                      <div className="post-comments">
                        <div className="comment-input">
                          <input
                            placeholder="Write a comment"
                            value={commentDrafts[post._id] || ''}
                            onChange={(event) =>
                              setCommentDrafts((prev) => ({
                                ...prev,
                                [post._id]: event.target.value,
                              }))
                            }
                          />
                          <button type="button" onClick={() => submitComment(post._id)}>
                            Send
                          </button>
                        </div>
                        {(commentsByPost[post._id] || []).map((comment) => (
                          <div key={comment._id} className="comment-item">
                            <strong>{comment.author?.username || 'User'}</strong>
                            <span>{comment.content}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
          </section>
        </div>

        <aside className="profile-panel">
          <div className="profile-card">
            <img
              src={userAvatar}
              alt="Profile"
              className="profile-avatar"
            />
            <strong>{userName}</strong>
            <div className="profile-nav">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="profile-btn"
                  onClick={() => {
                    if (item.path) {
                      navigate(item.path);
                    } else {
                      setNotice('This section is coming soon.');
                    }
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {notice && <p className="profile-note">{notice}</p>}
          </div>
        </aside>
      </div>

      <button type="button" className="floating-chat" aria-label="Chat">
        <img src={userAvatar} alt="Chat" />
      </button>
    </div>
  );
};

export default Explorer;
