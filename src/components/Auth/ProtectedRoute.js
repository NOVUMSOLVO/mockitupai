import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const ProtectedRoute = ({ redirectPath = '/login', children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show a loading spinner while checking authentication state
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to the login page, but save the current location they were trying to go to
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If there are children, render them, otherwise render Outlet for nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;