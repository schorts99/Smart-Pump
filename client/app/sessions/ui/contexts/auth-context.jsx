import { createContext, useState, useEffect } from "react";
import { FetchHTTPProvider, JSONAPIConnector } from "@schorts/shared-kernel";

import EmailPasswordAuthProvider from "../../infrastructure/auth-providers/email-password-auth-provider";

const fetchHTTPProvider = new FetchHTTPProvider(() => {
  const token = sessionStorage.getItem("token");

  return token ? `Bearer ${token}` : "";
});
const jSONAPIConnector = new JSONAPIConnector(fetchHTTPProvider);
const emailPasswordAuthProvider = new EmailPasswordAuthProvider(jSONAPIConnector);
const AuthContext = createContext(false);

function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    emailPasswordAuthProvider.isAuthenticated()
      .then(setIsAuth)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ loading, isAuth, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };
export default AuthContext;
