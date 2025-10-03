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
          Are you a Farmer or a Customer?
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please select your role to proceed.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
          <Link
            to="/login?role=farmer"
            className="group relative w-full sm:w-1/2 flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FaSeedling className="mr-3 text-xl" />
            Farmer
          </Link>
          <Link
            to="/login?role=customer"
            className="group relative w-full sm:w-1/2 flex justify-center py-3 px-4 border border-green-600 text-lg font-medium rounded-md text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FaUser className="mr-3 text-xl" />
            Customer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
