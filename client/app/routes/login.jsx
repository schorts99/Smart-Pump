import LoginPage from "../sessions/ui/pages/login";

export function meta({}) {
  return [
    { title: "Smart Pump - Login" },
  ];
}

export default function LoginRoute() {
  return <LoginPage />;
}
