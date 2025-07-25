import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/users/profile",
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load profile");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faUser}
            className="text-5xl text-indigo-600 mb-4 animate-spin"
          />
          <p className="text-gray-600 font-semibold">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 font-bold">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden md:max-w-3xl mt-12">
      <div className="md:flex">
        <div className="w-full p-10">
          <div className="flex items-center justify-center mb-8">
            <FontAwesomeIcon icon={faUser} className="text-6xl text-indigo-700" />
          </div>
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Your Profile
            </h2>
            <p className="text-lg text-gray-600">
              Manage your account details.
            </p>
          </div>
          <div className="mt-10">
            {user ? (
              <div className="space-y-6">
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="firstName"
                  >
                    First Name
                  </label>
                  <p className="text-gray-800">{user.fullname.firstname}</p>
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="lastName"
                  >
                    Last Name
                  </label>
                  <p className="text-gray-800">{user.fullname.lastname}</p>
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <p className="text-gray-800">{user.email}</p>
                </div>
                {/* Add more user details here as needed */}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                No user data available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
