"use client";

import { Link } from "react-router-dom";
import { FaUser, FaSeedling } from "react-icons/fa";

const RoleSelectionPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass p-10 rounded-xl text-center">
        <div className="flex justify-center">
          <FaSeedling className="text-green-500 text-4xl" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Select Your Role
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Choose to login or register as:
        </p>

        <div className="flex flex-col gap-4 mt-8">
          <Link
            to="/login?role=farmer"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FaSeedling className="mr-3 text-xl" />
            Login as Farmer
          </Link>
          <Link
            to="/login?role=customer"
            className="group relative w-full flex justify-center py-3 px-4 border border-green-600 text-lg font-medium rounded-md text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FaUser className="mr-3 text-xl" />
            Login as Customer
          </Link>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Admin? Login directly with your credentials
          </p>
          <Link
            to="/login"
            className="text-sm font-medium text-green-600 hover:text-green-500"
          >
            Login here (Admin, Farmer, or Customer)
          </Link>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 mb-2">
            New user? Register as:
          </p>
          <div className="flex gap-2 justify-center">
            <Link
              to="/register?role=farmer"
              className="text-sm font-medium text-green-600 hover:text-green-500"
            >
              Register as Farmer
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              to="/register?role=customer"
              className="text-sm font-medium text-green-600 hover:text-green-500"
            >
              Register as Customer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
