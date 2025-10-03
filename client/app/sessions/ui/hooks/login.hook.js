import { useState, useTransition, useMemo } from "react";
import { FetchHTTPProvider, JSONAPIConnector } from "@schorts/shared-kernel";

import EmailPasswordAuthProvider from "../../infrastructure/auth-providers/email-password-auth-provider";

import UsernameValue from "../../domain/value-objects/username-value";

const fetchHTTPProvider = new FetchHTTPProvider();
const jSONAPIConnector = new JSONAPIConnector(fetchHTTPProvider);
const emailPasswordAuthProvider = new EmailPasswordAuthProvider(jSONAPIConnector);

export default function useLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, startLoading] = useTransition();

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
      } catch (error) {}
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
  };
}
