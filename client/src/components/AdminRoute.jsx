import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Loading from './Loading.jsx';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/feed" replace />;
  }

  return children;
};

export default AdminRoute;
