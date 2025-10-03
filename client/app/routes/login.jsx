import LoginPage from "../login/ui/pages/login";

export function meta({}) {
  return [
    { title: "Smart Pump - Login" },
  ];
}

export default function LoginRoute() {
  return <LoginPage />;
}
