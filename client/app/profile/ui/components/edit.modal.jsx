import { X, Save } from "lucide-react";

import useEdit from "../hooks/edit.hook";

export default function EditModal({ onClose }) {
  const {
    currentUser,
    company,
    setCompany,
    address,
    setAddress,
    loading,
    validForm,
    updateProfile,
  } = useEdit(onClose);
  
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm space-y-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={updateProfile}>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={({ target }) => setCompany(target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder={currentUser.company}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={({ target }) => setAddress(target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder={currentUser.address}
              required
              disabled={loading}
            />
          </div>

          <button
            className="cursor-pointer w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            disabled={loading || !validForm}
            type="submit"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
