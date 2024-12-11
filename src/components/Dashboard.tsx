// components/Dashboard.tsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { AuthService } from "../authService";
import { clearUser } from "../authSlice";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    AuthService.logout();
    dispatch(clearUser());
    navigate("/login");
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
          <Link
            to="/expenses"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4"
          >
            Expense Tracker
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.email}</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium mb-2">Profile Information</h3>
              <p>Email: {user?.email}</p>
              <p>User ID: {user?.id}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium mb-2">Account Status</h3>
              <p>Status: Active</p>
              <p>Last Login: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
