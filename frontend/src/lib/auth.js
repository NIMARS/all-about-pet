export function getToken() {
    return localStorage.getItem('token');
  }
  
  export function isAuthenticated() {
    return !!getToken();
  }
  
  export function getUserFromStorage() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  }
  
  export function isAdmin() {
    const user = getUserFromStorage();
    return user?.role === 'admin';
  }
  