import React, { useState, useEffect } from 'react';
import { Link2, Copy, Trash2, BarChart3, LogOut, Menu, X, RefreshCw } from 'lucide-react';

const API_URL = "https://url-shortner-project-u4u7.onrender.com";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/user/me`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/user/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      setCurrentPage('login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link2 className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Shortly</span>
            </div>

            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-4">
                  <button
                    onClick={() => setCurrentPage('dashboard')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === 'dashboard'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setCurrentPage('create')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === 'create'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Create Short URL
                  </button>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700">{user.username}</span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>

                <div className="md:hidden flex items-center">
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-gray-700"
                  >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentPage('login')}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Login
                </button>
                <button
                  onClick={() => setCurrentPage('signup')}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {user && mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  setCurrentPage('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setCurrentPage('create');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Create Short URL
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          currentPage === 'login' ? (
            <LoginPage setUser={setUser} setCurrentPage={setCurrentPage} />
          ) : currentPage === 'signup' ? (
            <SignupPage setCurrentPage={setCurrentPage} />
          ) : (
            <LandingPage setCurrentPage={setCurrentPage} />
          )
        ) : currentPage === 'create' ? (
          <CreateUrlPage />
        ) : (
          <DashboardPage />
        )}
      </main>
    </div>
  );
}

function LandingPage({ setCurrentPage }) {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">Shorten Your URLs</h1>
      <p className="text-xl text-gray-600 mb-8">Create short, memorable links in seconds</p>
      <button
        onClick={() => setCurrentPage('signup')}
        className="px-8 py-3 text-lg font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-lg"
      >
        Get Started
      </button>
    </div>
  );
}

function LoginPage({ setUser, setCurrentPage }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setCurrentPage('dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Login</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 font-medium"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => setCurrentPage('signup')}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

function SignupPage({ setCurrentPage }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setCurrentPage('login'), 2000);
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Sign Up</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Account created! Redirecting to login...
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 font-medium"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => setCurrentPage('login')}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

function CreateUrlPage() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!url) {
      setError('URL is required');
      return;
    }

    setError('');
    setShortUrl(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (response.ok) {
        setShortUrl(data.result);
        setUrl('');
      } else {
        setError(data.message || 'Failed to create short URL');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const fullUrl = `${API_URL}/url/${shortUrl.shortId}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Create Short URL</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter your long URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="https://example.com/very/long/url"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 font-medium"
          >
            {loading ? 'Creating...' : 'Shorten URL'}
          </button>
        </div>

        {shortUrl && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Your short URL:</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={`${API_URL}/url/${shortUrl.shortId}`}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center space-x-2"
              >
                <Copy className="h-4 w-4" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardPage() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);

  useEffect(() => {
    fetchUrls();

    // Auto-refresh every 10 seconds to get latest clicks
    const interval = setInterval(() => {
      fetchUrls(true); // Silent refresh
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchUrls = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }

    try {
      const response = await fetch(`${API_URL}/url/my-urls`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUrls(data.urls);
      }
    } catch (error) {
      console.error('Failed to fetch URLs:', error);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUrls(true);
    setRefreshing(false);
  };

  const deleteUrl = async (shortId) => {
    if (!confirm('Are you sure you want to delete this URL?')) return;

    try {
      const response = await fetch(`${API_URL}/url/${shortId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setUrls(urls.filter((url) => url.shortId !== shortId));
      }
    } catch (error) {
      console.error('Failed to delete URL:', error);
    }
  };

  const copyToClipboard = (shortId) => {
    navigator.clipboard.writeText(`${API_URL}/url/${shortId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">My URLs</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
        >
          <svg
            className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>
      {urls.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">You haven't created any short URLs yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {urls.map((url) => (
            <div key={url._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1 mb-4 md:mb-0">
                  <p className="text-sm text-gray-500 mb-1">Original URL</p>
                  <p className="text-gray-900 truncate">{url.redirectUrl}</p>
                  <p className="text-sm text-indigo-600 mt-2">{`${API_URL}/url/${url.shortId}`}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Clicks: <span className="font-semibold text-indigo-600">{url.clicks}</span>
                    <span className="text-xs text-gray-400 ml-2">(Auto-updates every 10s)</span>
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(url.shortId)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center space-x-1"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => setSelectedUrl(selectedUrl?._id === url._id ? null : url)}
                    className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 flex items-center space-x-1"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </button>
                  <button
                    onClick={() => deleteUrl(url.shortId)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center space-x-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
              {selectedUrl?._id === url._id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Visit History</h4>
                  {url.visitHistory.length === 0 ? (
                    <p className="text-gray-500 text-sm">No visits yet</p>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {url.visitHistory
                        .slice(-10)
                        .reverse()
                        .map((visit, index) => (
                          <div key={index} className="text-sm text-gray-600 flex justify-between">
                            <span>{new Date(visit.timestamp).toLocaleString()}</span>
                            <span className="text-gray-400">{visit.ip || 'N/A'}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
