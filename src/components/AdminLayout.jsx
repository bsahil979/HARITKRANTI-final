"use client";

import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaShoppingCart,
  FaList,
  FaBox,
  FaChartBar,
  FaCog,
  FaBars,
  FaTimes,
  FaComments,
  FaExclamationCircle,
} from "react-icons/fa";

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: "/admin/dashboard", icon: FaTachometerAlt, label: "Dashboard" },
    { path: "/admin/users", icon: FaUsers, label: "Users" },
    { path: "/admin/products", icon: FaBox, label: "Products" },
    { path: "/admin/listings", icon: FaList, label: "Listings" },
    { path: "/admin/orders", icon: FaShoppingCart, label: "Orders" },
    { path: "/admin/categories", icon: FaList, label: "Categories" },
    { path: "/admin/messages", icon: FaComments, label: "Messages" },
    { path: "/admin/reports", icon: FaExclamationCircle, label: "Reports" },
    { path: "/admin/analytics", icon: FaChartBar, label: "Analytics" },
    { path: "/admin/settings", icon: FaCog, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-emerald-600">Admin Panel</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600 hover:text-gray-900"
        >
          {sidebarOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:transition-none`}
        >
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200 hidden lg:block">
              <h1 className="text-2xl font-bold text-emerald-600">HaritKranti</h1>
              <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-emerald-50 text-emerald-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="text-xl" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 hidden lg:block">
              <p className="text-xs text-gray-500 text-center">
                © 2024 HaritKranti
              </p>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="pt-16 lg:pt-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

