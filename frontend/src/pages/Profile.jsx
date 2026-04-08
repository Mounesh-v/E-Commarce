import React, { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem("userInfo"));

  const [user, setUser] = useState(storedUser);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  //  Sync form state when user changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  // Fetch user (ONLY once when id available)
  useEffect(() => {
    if (!storedUser?._id) return;

    const fetchUser = async () => {
      try {
        console.log("Calling API with id:", storedUser._id);

        const res = await api.get(`/auth/user/${storedUser._id}`);

        setUser(res.data.user);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch user data");
      }
    };

    fetchUser();
  }, [storedUser?._id]);

  //  Handle update
  const handleUpdate = () => {
    const updatedUser = { ...user, name, avatar };

    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    setUser(updatedUser);

    toast.success("Profile updated");
  };

  //  Handle image preview
  // const handleImage = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const url = URL.createObjectURL(file);
  //   setAvatar(url);
  // };

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/cart/get-cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCartItems(res.data.cart.items);
      } catch (error) {
        toast.error("Failed to fetch cart items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      <div className="bg-white shadow rounded-xl p-6 flex gap-6 items-center">
        {/* Avatar */}
        {/* <div>
          {avatar ? (
            <img
              src={avatar}
              className="w-24 h-24 rounded-full object-cover"
              alt="avatar"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
              {user?.name?.charAt(0)}
            </div>
          )}

          <input type="file" onChange={handleImage} className="mt-2 text-sm" />
        </div> */}

        {/* Info */}
        <div className="flex-1">
          <label htmlFor="" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            className="border p-2 rounded w-full mb-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <p className="text-gray-500">{user?.email}</p>

          <button
            onClick={handleUpdate}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update Profile
          </button>
        </div>
      </div>

      {/* Orders */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">My Orders</h3>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">No orders yet</p>
        </div>
      </div>

      {/* Cart */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">My Cart</h3>

        <div className="bg-white p-4 rounded shadow">
          {loading ? (
            <div className="w-12 mx-auto text-blue-600 flex items-center justify-center">
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <circle cx="12" cy="3" r="1">
                    <animate
                      id="spinner_7Z73"
                      begin="0;spinner_tKsu.end-0.5s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <circle cx="16.50" cy="4.21" r="1">
                    <animate
                      id="spinner_Wd87"
                      begin="spinner_7Z73.begin+0.1s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <circle cx="7.50" cy="4.21" r="1">
                    <animate
                      id="spinner_tKsu"
                      begin="spinner_9Qlc.begin+0.1s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <circle cx="19.79" cy="7.50" r="1">
                    <animate
                      id="spinner_lMMO"
                      begin="spinner_Wd87.begin+0.1s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <circle cx="4.21" cy="7.50" r="1">
                    <animate
                      id="spinner_9Qlc"
                      begin="spinner_Khxv.begin+0.1s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <circle cx="21.00" cy="12.00" r="1">
                    <animate
                      id="spinner_5L9t"
                      begin="spinner_lMMO.begin+0.1s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <circle cx="3.00" cy="12.00" r="1">
                    <animate
                      id="spinner_Khxv"
                      begin="spinner_ld6P.begin+0.1s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <circle cx="19.79" cy="16.50" r="1">
                    <animate
                      id="spinner_BfTD"
                      begin="spinner_5L9t.begin+0.1s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <circle cx="4.21" cy="16.50" r="1">
                    <animate
                      id="spinner_ld6P"
                      begin="spinner_XyBs.begin+0.1s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <circle cx="16.50" cy="19.79" r="1">
                    <animate
                      id="spinner_7gAK"
                      begin="spinner_BfTD.begin+0.1s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <circle cx="7.50" cy="19.79" r="1">
                    <animate
                      id="spinner_XyBs"
                      begin="spinner_HiSl.begin+0.1s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <circle cx="12" cy="21" r="1">
                    <animate
                      id="spinner_HiSl"
                      begin="spinner_7gAK.begin+0.1s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    dur="6s"
                    values="360 12 12;0 12 12"
                    repeatCount="indefinite"
                  ></animateTransform>
                </g>
              </svg>
            </div>
          ) : cartItems.length === 0 ? (
            <p className="text-gray-500">No items in cart</p>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 border-b py-3"
              >
                <img
                  src={item.product?.images?.[0]?.url || item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />

                <div className="flex-1">
                  <h4 className="font-semibold">
                    {item.product?.name || item.name}
                  </h4>
                  <p className="text-gray-500">₹{item.price}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
