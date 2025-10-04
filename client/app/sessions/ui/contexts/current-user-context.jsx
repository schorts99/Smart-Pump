import { createContext, useState, useEffect , useContext} from "react";
import { FetchHTTPProvider, JSONAPIConnector } from "@schorts/shared-kernel";

import AuthContext from "./auth-context";

import EmailPasswordAuthProvider from "../../infrastructure/auth-providers/email-password-auth-provider";

const fetchHTTPProvider = new FetchHTTPProvider(() => {
  const token = sessionStorage.getItem("token");

  return token ? `Bearer ${token}` : "";
});
const jSONAPIConnector = new JSONAPIConnector(fetchHTTPProvider);
const emailPasswordAuthProvider = new EmailPasswordAuthProvider(jSONAPIConnector);

const CurrentUserContext = createContext({ currentUser: null, setCurrentUser: () => {} });

function CurrentUserProvider({ children }) {
  const { isAuth } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isAuth) {
      emailPasswordAuthProvider.currentUser()
        .then(setUser)
        .finally(() => setLoading(false));
    }
  }, [isAuth]);

  return (
    <CurrentUserContext.Provider value={{ loading, currentUser: user, setCurrentUser: setUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export { CurrentUserProvider };
export default CurrentUserContext;
