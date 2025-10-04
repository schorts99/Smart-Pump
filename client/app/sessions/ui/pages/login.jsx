import useLogin from "../hooks/login.hook";

import logo from "../../../../../assets/logo.png";

export default function LoginPage() {
  const {
    username,
    setUsername,
    validUsername,
    password,
    setPassword,
    validForm,
    loading,
    login,
    error,
  } = useLogin();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center md:p-4">
      <div className="w-full max-w-md">
        <div className="bg-white md:rounded-3xl md:shadow-xl p-8 h-screen md:h-auto flex md:block items-center">
          <div className="space-y-8 w-full">
            <img className="w-40 mx-auto" draggable="false" alt="Smart Pump logo" src={logo} />

            <form className="space-y-4" onSubmit={login}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="email"
                  value={username}
                  onChange={({ target }) => setUsername(target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  required
                  disabled={loading}
                />
                {!validUsername && (
                  <small className="text-red-600">{username} is not a valid Username</small>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  required
                  disabled={loading}
                />
                {error && (
                  <small className="text-red-600 mt-2">{error}</small>
                )}
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading || !validForm}
                  className="mt-4 px-24 cursor-pointer bg-gray-400 disabled:hover:bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'LOGGING IN...' : 'LOGIN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
