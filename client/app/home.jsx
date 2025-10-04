import { useContext } from "react";

import AuthContext from "./sessions/ui/contexts/auth-context";
import LoginPage from "./sessions/ui/pages/login";
import ProfilePage from "./profile/ui/pages/profile";

export default function HomePage() {
  const { isAuth } = useContext(AuthContext);

  if (isAuth) {
    return <ProfilePage />;
  }

  return <LoginPage />
}
