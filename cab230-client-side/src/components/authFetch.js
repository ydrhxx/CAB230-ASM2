export const authFetch = async (url, options = {}) => {
    const bearerToken = localStorage.getItem('bearerToken');
    const refreshToken = localStorage.getItem('refreshToken');
  
    // Attach bearer token to the request
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    };
  
    let response = await fetch(url, { ...options, headers });
  
    // If bearer token expired (401), try refreshing it
    if (response.status === 401 && refreshToken) {
      try {
        const refreshRes = await fetch('http://4.237.58.241:3000/user/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
  
        const refreshData = await refreshRes.json();
  
        if (refreshRes.ok && refreshData.bearerToken?.token) {
          // Save new tokens
          localStorage.setItem('bearerToken', refreshData.bearerToken.token);
          localStorage.setItem('refreshToken', refreshData.refreshToken.token);
  
          // Retry original request with new token
          headers.Authorization = `Bearer ${refreshData.bearerToken.token}`;
          return await fetch(url, { ...options, headers });
        } else {
          throw new Error('Refresh failed');
        }
      } catch (err) {
        console.error('Auto-refresh failed:', err);
        logoutUser(); // Clean up if refresh fails
      }
    }
  
    return response;
  };
  
  // Helper to log out
  const logoutUser = () => {
    localStorage.removeItem('bearerToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };
  