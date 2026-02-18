import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check expiry
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          // Ideally fetch user details or use info in token
          // Backend token subject is user ID (Long), not username.
          // But we don't have username in token payload yet unless we customize generateToken.
          // For now, set user object with ID.
          setUser({ id: decoded.sub, username: decoded.sub });
        }
      } catch (e) {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/signin', { usernameOrEmail: username, password });
      const { accessToken } = response.data;

      localStorage.setItem("token", accessToken);
      setToken(accessToken);

      const decoded = jwtDecode(accessToken);
      setUser({ id: decoded.sub, username: username }); // Temporarily using input username as we don't have it in token payload yet

      return true;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
