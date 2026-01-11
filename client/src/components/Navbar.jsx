import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          Bookit
        </Link>
        <nav className="nav-links">
          <NavLink to="/feed">Feed</NavLink>
          <NavLink to="/marketplace">Marketplace</NavLink>
          {user && <NavLink to="/seller">Seller</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <NavLink to="/orders">Orders</NavLink>
              <NavLink to="/cart">Cart</NavLink>
              <NavLink to="/me" className="chip">
                {user.username}
              </NavLink>
              <button type="button" className="btn btn-ghost" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-ghost">
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn-primary">
                Join
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
