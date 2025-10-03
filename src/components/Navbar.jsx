"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useI18n } from "../context/I18nProvider";
import {
  FaSeedling,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { t, lang, setLang } = useI18n();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <FaSeedling className="text-emerald-600 text-2xl" />
            <span className="text-xl font-bold text-emerald-700">HaritKranti</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              {t("home")}
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              {t("products")}
            </Link>
            <Link
              to="/farmers"
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              {t("farmers")}
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              {t("about")}
            </Link>

            <div className="flex items-center gap-2">
              <button onClick={() => setLang("en")} className={`px-3 py-1 rounded ${lang === "en" ? "bg-emerald-600 text-white" : "bg-gray-100"}`}>EN</button>
              <button onClick={() => setLang("hi")} className={`px-3 py-1 rounded ${lang === "hi" ? "bg-emerald-600 text-white" : "bg-gray-100"}`}>हिंदी</button>
            </div>

            {isAuthenticated && user?.role === "consumer" && (
            <Link to="/checkout" className="relative">
                <FaShoppingCart className="text-gray-700 hover:text-emerald-600 text-xl transition-colors" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors focus:outline-none"
                >
                  <FaUser className="text-xl" />
                  <span className="font-medium">
                    {user?.name?.split(" ")[0]}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    {user?.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        {t("adminDashboard")}
                      </Link>
                    )}

                    {user?.role === "farmer" && (
                      <Link
                        to="/farmer/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        {t("farmerDashboard")}
                      </Link>
                    )}

                    {user?.role !== "admin" && (
                      <>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          {t("profile")}
                        </Link>

                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          {t("orders")}
                        </Link>
                      </>
                    )}

                    <Link
                      to="/messages"
                      className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-500"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {t("messages")}
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      <div className="flex items-center space-x-2">
                        <FaSignOutAlt />
                        <span>{t("logout")}</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
                >
                  {t("login")}
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {t("register")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-green-500 focus:outline-none"
            >
              {isMenuOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
                onClick={toggleMenu}
              >
                {t("home")}
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
                onClick={toggleMenu}
              >
                {t("products")}
              </Link>
              <Link
                to="/farmers"
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
                onClick={toggleMenu}
              >
                {t("farmers")}
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
                onClick={toggleMenu}
              >
                {t("about")}
              </Link>

              <div className="flex items-center gap-2">
                <button onClick={() => { setLang("en"); toggleMenu(); }} className={`px-3 py-1 rounded ${lang === "en" ? "bg-emerald-600 text-white" : "bg-gray-100"}`}>EN</button>
                <button onClick={() => { setLang("hi"); toggleMenu(); }} className={`px-3 py-1 rounded ${lang === "hi" ? "bg-emerald-600 text-white" : "bg-gray-100"}`}>हिंदी</button>
              </div>

              {isAuthenticated && user?.role === "consumer" && (
                <Link
                  to="/checkout"
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-500 transition-colors"
                  onClick={toggleMenu}
                >
                  <FaShoppingCart />
                  <span>Cart ({cartItems.length})</span>
                </Link>
              )}
              {isAuthenticated ? (
                <>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
                      onClick={toggleMenu}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  {user?.role === "farmer" && (
                    <Link
                      to="/farmer/dashboard"
                      className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
                      onClick={toggleMenu}
                    >
                      Farmer Dashboard
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
                    onClick={toggleMenu}
                  >
                    Profile
                  </Link>

                  <Link
                    to="/orders"
                    className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
                    onClick={toggleMenu}
                  >
                    Orders
                  </Link>

                  <Link
                    to="/messages"
                    className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
                    onClick={toggleMenu}
                  >
                    Messages
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-500 transition-colors"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-center"
                    onClick={toggleMenu}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
