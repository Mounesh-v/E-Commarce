import React, { useState } from "react";

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(storedUser);
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");

  // 🔥 handle update
  const handleUpdate = () => {
    const updatedUser = { ...user, name, avatar };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    alert("Profile updated");
  };

  // 🔥 handle image upload (simple preview)
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setAvatar(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      {/* Profile Card */}
      <div className="bg-white shadow rounded-xl p-6 flex gap-6 items-center">

        {/* Avatar */}
        <div>
          {avatar ? (
            <img
              src={avatar}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
              {user?.name?.charAt(0)}
            </div>
          )}

          <input type="file" onChange={handleImage} className="mt-2 text-sm" />
        </div>

        {/* Info */}
        <div className="flex-1">
          <input
            className="border p-2 rounded w-full mb-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <p className="text-gray-500">{user?.email}</p>

          <button
            onClick={handleUpdate}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update Profile
          </button>
        </div>
      </div>

      {/* Orders Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">My Orders</h3>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">No orders yet</p>

          {/* Later map orders */}
          {/* orders.map(order => (...)) */}
        </div>
      </div>
    </div>
  );
};

export default Profile;