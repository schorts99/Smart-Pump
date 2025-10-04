import { useState, useTransition, useMemo, useContext } from "react";
import { FetchHTTPProvider, JSONAPIConnector } from "@schorts/shared-kernel";

import AuthContext from "../contexts/auth-context";

import EmailPasswordAuthProvider from "../../infrastructure/auth-providers/email-password-auth-provider";

import UsernameValue from "../../domain/value-objects/username-value";

const fetchHTTPProvider = new FetchHTTPProvider(() => {
  const token = sessionStorage.getItem("token");

  return token ? `Bearer ${token}` : "";
});
const jSONAPIConnector = new JSONAPIConnector(fetchHTTPProvider);
const emailPasswordAuthProvider = new EmailPasswordAuthProvider(jSONAPIConnector);

export default function useLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, startLoading] = useTransition();
  const [error, setError] = useState("");
  const { setIsAuth } = useContext(AuthContext);

  const validUsername = useMemo(() => {
    if (username === "") {
      return true;
    }

    return new UsernameValue(username).isValid;
  }, [username]);

  const validPassword = useMemo(() => {
    return password.length > 0;
  }, [password]);

  const validForm = useMemo(() => {
    return validUsername && validPassword;
  }, [validUsername, validPassword]);

  const login = (event) => {
    event.preventDefault();

    startLoading(async () => {
      try {
        await emailPasswordAuthProvider.authenticate(username, password);
        setIsAuth(true);
      } catch (error) {
        setPassword("");

        if (error.statusCode === 400) {
          setError("Invalid username or password");
        } else {
          setError("Something went wrong");
        }

        setTimeout(() => {
          setError("");
        }, 6000);
      }
    });
  };

  return {
    username,
    setUsername,
    validUsername,
    password,
    setPassword,
    validForm,
    loading,
    login,
    error,
  };
}
