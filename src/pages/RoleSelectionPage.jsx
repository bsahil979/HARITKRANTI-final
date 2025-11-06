"use client";

import { Link } from "react-router-dom";
import { FaUser, FaSeedling, FaUserShield } from "react-icons/fa";

const RoleSelectionPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Video - Close-up of crops swaying / Green meadow with gentle breeze */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover opacity-80 z-0"
        poster="/assets/farm-meadow.jpg"
      >
        <source src="/assets/farm-meadow.mp4" type="video/mp4" />
        {/* Fallback to existing video if new video not available */}
        <source src="/haritvideo.mp4" type="video/mp4" />
      </video>
      
      {/* Semi-transparent overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-green-900/30 backdrop-blur-sm z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 bg-white/80 rounded-2xl shadow-xl p-8 w-96 max-w-full text-center">
        <div className="flex justify-center mb-4">
          <FaSeedling className="text-green-600 text-4xl" />
        </div>
        <h2 className="text-2xl font-bold text-green-800 mb-2">
          Select Your Role
        </h2>
        <p className="text-gray-700 mb-6">
          Please select your role to proceed.
        </p>

        <div className="flex flex-col gap-4 mt-8">
          <Link
            to="/login?role=farmer"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FaSeedling className="mr-3 text-xl" />
            Farmer
          </Link>
          <Link
            to="/login?role=customer"
            className="group relative w-full flex justify-center py-3 px-4 border border-green-600 text-lg font-medium rounded-md text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FaUser className="mr-3 text-xl" />
            Customer
          </Link>
          <Link
            to="/login?role=admin"
            className="group relative w-full flex justify-center py-3 px-4 border border-purple-600 text-lg font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <FaUserShield className="mr-3 text-xl" />
            Admin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
