import { useContext, useState } from "react";
import { Menu, User, Wallet, Edit3 } from "lucide-react";

import CurrentUserContext from "../../../sessions/ui/contexts/current-user-context";
import AuthContext from "../../../sessions/ui/contexts/auth-context";
import EditModal from "../components/edit.modal";

export default function ProfilePage() {
  const { setIsAuth } = useContext(AuthContext);
  const { currentUser, loading, setCurrentUser } = useContext(CurrentUserContext);
  const [editing, setEditing] = useState(false);

  const logout = async () => {
    sessionStorage.removeItem("token");
    setIsAuth(false);
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 md:p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white md:rounded-3xl md:shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-200 to-slate-300 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3 w-full justify-center">
              <div className="w-32 ml-[40px] h-2 bg-gray-400 rounded" />
            </div>
            <button
              onClick={logout}
              className="cursor-pointer p-2 hover:bg-slate-400/20 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="p-8 space-y-8">
            <div className="flex flex-col items-center space-y-6">
              {loading ? (
                <div className="w-1/2 aspect-square bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-32 h-32 text-gray-500" />
                </div>
              ) : (
                <img
                  src={currentUser.picture}
                  alt={`${currentUser.name.first} avatar`}
                  draggable="false"
                  className="w-1/2 aspect-square bg-gray-300 rounded-full"
                />
              )}

              <div className="flex space-x-3 mt-2">
                <button
                  className="cursor-pointer px-8 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Wallet className="w-5 h-5" />
                  <span>
                    BALANCE
                  </span>
                </button>
                <button
                  className="cursor-pointer px-8 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors flex items-center space-x-2"
                  disabled={loading}
                  onClick={() => setEditing(true)}
                >
                  <Edit3 className="w-5 h-5" />
                  <span>EDIT</span>
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Balance:</span>
                  {!loading && (
                    <span className="text-xl font-bold text-blue-600">
                      {currentUser.balance}
                    </span>
                  )}
                </div>
              </div>

              {editing && <EditModal onClose={() => setEditing(false)} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
