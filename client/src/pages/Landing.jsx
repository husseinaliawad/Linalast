import { Link } from 'react-router-dom';

const iconItems = [
  {
    title: 'Reading',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 5h6c2.8 0 5 2.2 5 5v8c-1.2-1-2.7-1.5-4.3-1.5H6V5zm12 0h-3.5c-1.2 0-2.3.4-3.2 1.1" />
      </svg>
    ),
  },
  {
    title: 'Writing',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20h6l10-10-6-6L4 14v6z" />
      </svg>
    ),
  },
  {
    title: 'Sharing',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 12h10M12 7l5 5-5 5M18 5v14" />
      </svg>
    ),
  },
  {
    title: 'Community',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 18c1.4-2 3.4-3 6-3s4.6 1 6 3M6 7a3 3 0 1 0 0.1 0M18 7a3 3 0 1 0 0.1 0" />
      </svg>
    ),
  },
];

const featuredBooks = [
  {
    title: 'Murder on the Orient Express',
    author: 'Agatha Christie',
    category: 'Best Reading',
    image:
      'https://images.unsplash.com/photo-1455885661740-29cbf08a42fa?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'And Then There Were None',
    author: 'Agatha Christie',
    category: 'Popular Authors',
    image:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Death on the Nile',
    author: 'Agatha Christie',
    category: 'Best Reading',
    image:
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'The Arabian Nights',
    author: 'Traditional',
    category: 'Arabic Books',
    image:
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Voices from Damascus',
    author: 'Contemporary Authors',
    category: 'Arabic Books',
    image:
      'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'The Secret Adversary',
    author: 'Agatha Christie',
    category: 'Popular Authors',
    image:
      'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=800&q=80',
  },
];

const philosophyItems = [
  {
    title: 'Why Bookit exists',
    text: 'To make literature social again and connect curious readers across cultures.',
  },
  {
    title: 'Readers meet writers',
    text: 'We build bridges between storytellers and the communities that inspire them.',
  },
  {
    title: 'Share knowledge',
    text: 'Reviews, notes, and thoughtful discussions travel faster when shared together.',
  },
  {
    title: 'Interactive community',
    text: 'Follow, comment, and collaborate with people who read like you do.',
  },
];

const testimonials = [
  {
    quote: 'The reviews here feel like warm letters from a reading partner.',
    name: 'Lina A.',
  },
  {
    quote: 'Bookit makes my writing prompts feel alive again.',
    name: 'Omar H.',
  },
  {
    quote: 'I sold my handmade notebooks to readers who truly care.',
    name: 'Rana M.',
  },
];

const supplies = [
  {
    title: 'Crafted Notebooks',
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Bookmarks',
    image:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Book Covers',
    image:
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Reading Tools',
    image:
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80',
  },
];

const Landing = () => {
  return (
    <div className="landing">
      <section className="hero section-full">
        <div className="hero-inner">
          <div className="hero-content">
            <p className="eyebrow">Syrian Virtual University - BPR601</p>
            <h1>BOOKIT</h1>
            <p className="hero-subtitle">This site for sharing knowledge and stories</p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                Join the community
              </Link>
            </div>
          </div>
          <div className="hero-glass">
            <h3>Modern literary circles</h3>
            <p>
              Curate your reading life, follow writers you admire, and build a bookshelf that feels
              alive with conversation.
            </p>
          </div>
        </div>
      </section>

      <section className="icon-section">
        <div className="icon-grid">
          {iconItems.map((item) => (
            <div key={item.title} className="icon-card">
              <span className="icon-circle">{item.icon}</span>
              <p>{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <div className="section-header">
          <h2>Many interesting books you'll find here</h2>
          <p className="muted">Agatha Christie style classics, modern thrillers, and Arabic gems.</p>
        </div>
        <div className="cards-grid">
          {featuredBooks.map((book) => (
            <article key={book.title} className="book-card">
              <img src={book.image} alt={book.title} />
              <div className="book-card-body">
                <span className="tag">{book.category}</span>
                <h4>{book.title}</h4>
                <p className="muted">{book.author}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="philosophy-section">
        <div className="section-header">
          <h2>Bookit Connect Souls, And That's What We Do</h2>
          <p className="muted">
            A warm space where readers, writers, and storytellers meet around shared curiosity.
          </p>
        </div>
        <div className="bubble-grid">
          {philosophyItems.map((item) => (
            <div key={item.title} className="bubble-card">
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="writer-section section-full">
        <div className="writer-inner">
          <div className="writer-content">
            <h2>Writer focused, reader powered</h2>
            <p>
              Capture the atmosphere of a literary studio: calm, focused, and full of gentle
              feedback.
            </p>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <div key={item.name} className="testimonial-card">
                <p>"{item.quote}"</p>
                <span className="muted">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="supplies-section">
        <div className="section-header">
          <h2>All Your Book Supplies</h2>
          <p className="muted">Notebooks, bookmarks, and cozy tools for every reader.</p>
        </div>
        <div className="cards-grid supplies-grid">
          {supplies.map((item) => (
            <article key={item.title} className="supply-card">
              <img src={item.image} alt={item.title} />
              <div className="supply-card-body">
                <h4>{item.title}</h4>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
