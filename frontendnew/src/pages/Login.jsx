import React, { useState } from 'react';
import VoiceflowLoader from '../components/VoiceflowLoader';
import { useNavigate } from 'react-router-dom';
import '../styles-auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store user data in localStorage (for demo purposes)
      const users = JSON.parse(localStorage.getItem('edguard_users') || '[]');
      const user = users.find(u => u.email === formData.email);

      if (!user) {
        setErrors({ email: 'User not found. Please sign up first.' });
        setIsLoading(false);
        return;
      }

      // Verify password (in real app, this would be done on backend)
      if (user.password !== formData.password) {
        setErrors({ password: 'Incorrect password' });
        setIsLoading(false);
        return;
      }

      // Login successful
      localStorage.setItem('edguard_user', JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name
      }));
      localStorage.setItem('edguard_isLoggedIn', 'true');

      // Redirect to home
      navigate('/');
    } catch (error) {
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="auth-container">
      <VoiceflowLoader />
      <div className="auth-background">
        <div className="auth-glow auth-glow-1"></div>
        <div className="auth-glow auth-glow-2"></div>
      </div>

      <div className="auth-content">
        <div className="auth-card login-card">
          <div className="auth-header">
            <div className="auth-logo">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h1>EDGUARD Login</h1>
            <p className="auth-subtitle">Secure access to your parental control dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {errors.submit && (
              <div className="form-error-alert">
                <i className="fas fa-exclamation-circle"></i>
                {errors.submit}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">
                <i className="fas fa-envelope"></i>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? 'input-error' : ''}
                disabled={isLoading}
              />
              {errors.email && (
                <span className="field-error">
                  <i className="fas fa-times-circle"></i>
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-lock"></i>
                Password
              </label>
              <div className="password-input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={errors.password ? 'input-error' : ''}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={`fas fa-eye${showPassword ? '' : '-slash'}`}></i>
                </button>
              </div>
              {errors.password && (
                <span className="field-error">
                  <i className="fas fa-times-circle"></i>
                  {errors.password}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="auth-button login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Logging in...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Login to Dashboard
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>Don't have an account?</span>
          </div>

          <button
            type="button"
            className="auth-button signup-link-button"
            onClick={handleSignupRedirect}
            disabled={isLoading}
          >
            <i className="fas fa-user-plus"></i>
            Create New Account
          </button>

          <div className="auth-help">
            <p>
              <i className="fas fa-info-circle"></i>
              Demo credentials: test@example.com / password123
            </p>
          </div>
        </div>

        <div className="auth-features">
          <h3>
            <i className="fas fa-shield-alt"></i>
            Security Features
          </h3>
          <ul>
            <li>
              <i className="fas fa-lock"></i>
              <span>Password encryption</span>
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              <span>Email verification</span>
            </li>
            <li>
              <i className="fas fa-bell"></i>
              <span>Real-time alerts</span>
            </li>
            <li>
              <i className="fas fa-user-shield"></i>
              <span>Secure dashboard</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
