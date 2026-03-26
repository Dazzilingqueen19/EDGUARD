import React, { useState } from 'react';
import VoiceflowLoader from '../components/VoiceflowLoader';
import { useNavigate } from 'react-router-dom';
import '../styles-auth.css';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return Math.min(5, strength);
  };

  const getPasswordStrengthLabel = (strength) => {
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return labels[strength] || '';
  };

  const getPasswordStrengthColor = (strength) => {
    const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#059669'];
    return colors[strength] || '';
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else {
      // Check if email already exists
      const existingUsers = JSON.parse(localStorage.getItem('edguard_users') || '[]');
      if (existingUsers.some(u => u.email === formData.email)) {
        newErrors.email = 'This email is already registered';
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength < 3) {
      newErrors.password = 'Password must be stronger (use uppercase, numbers, and special characters)';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

    // Calculate password strength when password changes
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

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
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Store user data in localStorage (for demo purposes)
      const existingUsers = JSON.parse(localStorage.getItem('edguard_users') || '[]');
      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        password: formData.password // In real app, this would be hashed on backend
      };

      existingUsers.push(newUser);
      localStorage.setItem('edguard_users', JSON.stringify(existingUsers));

      // Auto-login after signup
      localStorage.setItem('edguard_user', JSON.stringify({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }));
      localStorage.setItem('edguard_isLoggedIn', 'true');

      // Redirect to home
      navigate('/');
    } catch (error) {
      setErrors({ submit: 'Signup failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <VoiceflowLoader />
      <div className="auth-background">
        <div className="auth-glow auth-glow-1"></div>
        <div className="auth-glow auth-glow-2"></div>
      </div>

      <div className="auth-content">
        <div className="auth-card signup-card">
          <div className="auth-header">
            <div className="auth-logo">
              <i className="fas fa-user-plus"></i>
            </div>
            <h1>Create Account</h1>
            <p className="auth-subtitle">Join EDGUARD and protect your family online</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {errors.submit && (
              <div className="form-error-alert">
                <i className="fas fa-exclamation-circle"></i>
                {errors.submit}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">
                <i className="fas fa-user"></i>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? 'input-error' : ''}
                disabled={isLoading}
              />
              {errors.name && (
                <span className="field-error">
                  <i className="fas fa-times-circle"></i>
                  {errors.name}
                </span>
              )}
            </div>

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
                  placeholder="Create a strong password"
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
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${(passwordStrength / 5) * 100}%`,
                        backgroundColor: getPasswordStrengthColor(passwordStrength)
                      }}
                    ></div>
                  </div>
                  <span className="strength-label">
                    Strength: <strong style={{ color: getPasswordStrengthColor(passwordStrength) }}>
                      {getPasswordStrengthLabel(passwordStrength)}
                    </strong>
                  </span>
                </div>
              )}
              {errors.password && (
                <span className="field-error">
                  <i className="fas fa-times-circle"></i>
                  {errors.password}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <i className="fas fa-check-circle"></i>
                Confirm Password
              </label>
              <div className="password-input-group">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? 'input-error' : ''}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={`fas fa-eye${showConfirmPassword ? '' : '-slash'}`}></i>
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <span className="field-success">
                  <i className="fas fa-check-circle"></i>
                  Passwords match
                </span>
              )}
              {errors.confirmPassword && (
                <span className="field-error">
                  <i className="fas fa-times-circle"></i>
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="auth-button signup-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus"></i>
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <button
            type="button"
            className="auth-button login-link-button"
            onClick={handleLoginRedirect}
            disabled={isLoading}
          >
            <i className="fas fa-sign-in-alt"></i>
            Login to Your Account
          </button>

          <div className="auth-requirements">
            <h4>
              <i className="fas fa-shield-alt"></i>
              Password Requirements
            </h4>
            <ul>
              <li className={formData.password?.length >= 8 ? 'met' : ''}>
                <i className={`fas fa-${formData.password?.length >= 8 ? 'check' : 'times'}-circle`}></i>
                At least 8 characters
              </li>
              <li className={/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? 'met' : ''}>
                <i className={`fas fa-${/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? 'check' : 'times'}-circle`}></i>
                Uppercase and lowercase letters
              </li>
              <li className={/[0-9]/.test(formData.password) ? 'met' : ''}>
                <i className={`fas fa-${/[0-9]/.test(formData.password) ? 'check' : 'times'}-circle`}></i>
                At least one number
              </li>
              <li className={/[^a-zA-Z0-9]/.test(formData.password) ? 'met' : ''}>
                <i className={`fas fa-${/[^a-zA-Z0-9]/.test(formData.password) ? 'check' : 'times'}-circle`}></i>
                Special character (!@#$%^&*)
              </li>
            </ul>
          </div>
        </div>

        <div className="auth-features">
          <h3>
            <i className="fas fa-user-shield"></i>
            Why Choose EDGUARD?
          </h3>
          <ul>
            <li>
              <i className="fas fa-lock"></i>
              <span>Bank-level security</span>
            </li>
            <li>
              <i className="fas fa-bell"></i>
              <span>Real-time monitoring</span>
            </li>
            <li>
              <i className="fas fa-chart-line"></i>
              <span>Detailed analytics</span>
            </li>
            <li>
              <i className="fas fa-shield-alt"></i>
              <span>24/7 protection</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
