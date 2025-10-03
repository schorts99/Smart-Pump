import { useState, useTransition, useMemo } from "react";

import UsernameValue from "../../domain/value-objects/username-value";

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

  const login = async (event) => {
    event.preventDefault();

    startLoading(() => {

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
