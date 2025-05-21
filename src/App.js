import React, { Suspense, lazy } from 'react';
import { Routes, Route, Outlet, Navigate, Link } from 'react-router-dom';
import NewLayout from './components/Layout/NewLayout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'));
const UserDashboard = lazy(() => import('./UserDashboard'));
const PasswordReset = lazy(() => import('./components/Auth/PasswordReset'));

// Loading component for Suspense fallback
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// This component wraps all pages that should use the layout
const LayoutWrapper = () => (
  <NewLayout>
    <Outlet />
  </NewLayout>
);

function App() {
  return (
    <div className="App">
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public routes with layout */}
          <Route element={<LayoutWrapper />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
          </Route>
          
          {/* Auth routes without layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<LayoutWrapper />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              {/* Add more protected routes here */}
            </Route>
          </Route>
          
          {/* Redirects */}
          <Route path="/home" element={<Navigate to="/" replace />} />
          
          {/* 404 - Page Not Found */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Oops! The page you're looking for doesn't exist.</p>
              <Link 
                to="/" 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go back home
              </Link>
            </div>
          } />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;