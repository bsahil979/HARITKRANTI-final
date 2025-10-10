// src/pages/HomePage.jsx
"use client";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../redux/slices/productSlice";
import { getAllFarmers } from "../redux/slices/farmerSlice";
import { getCategories } from "../redux/slices/categorySlice";
import ProductCard from "../components/ProductCard";
import FarmerCard from "../components/FarmerCard";
import Loader from "../components/Loader";
import { FaSeedling, FaCloudSun, FaStore, FaLeaf, FaBookOpen } from "react-icons/fa";
import { useI18n } from "../context/I18nProvider";

const HomePage = () => {
  const dispatch = useDispatch();
  const { t } = useI18n();

  // use optional chaining / default empty arrays to avoid undefined crashes
  const { products = [], loading: productLoading = false } = useSelector(
    (state) => state.products || {}
  );
  const { farmers = [], loading: farmerLoading = false } = useSelector(
    (state) => state.farmers || {}
  );
  const { categories = [], loading: categoryLoading = false } = useSelector(
    (state) => state.categories || {}
  );

  useEffect(() => {
    dispatch(getProducts({ limit: 8 }));
    dispatch(getAllFarmers());
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <div>
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
          poster="/haritvideo.mp4"
        >
          <source src="/haritvideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40 z-10 pointer-events-none" aria-hidden="true" />
        <div className="relative z-20 w-full">
          <div className="max-w-2xl mx-auto text-center px-4">
            <div className="inline-block bg-white/80 backdrop-blur text-emerald-800 text-xs font-semibold rounded-full px-4 py-2 mb-6 shadow-md border border-emerald-200">
              <span className="uppercase tracking-wider">
                {t("announcement")}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
              {t("heroTitleLine1")} &amp;
              <br className="hidden md:block" /> {t("heroTitleLine2")}
            </h1>
            <p className="text-base md:text-lg text-gray-100 mb-10">
              {t("heroSubtitle1")}
              <br className="hidden md:block" />
              {t("heroSubtitle2")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/products"
                className="btn btn-primary px-8 py-3 text-lg rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {t("shopNow")}
              </Link>
              <Link
                to="/farmers"
                className="btn btn-outline px-8 py-3 text-lg rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-white border-white hover:bg-white hover:text-emerald-700"
              >
                {t("meetFarmers")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">{t("whyChoose")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <Link to="/crop-recommendation" className="glass p-6 rounded-2xl text-center transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-2 block h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <FaSeedling className="text-emerald-600 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{t("cropRecommendation")}</h3>
                <p className="text-gray-600">
                  {t("cropRecommendationDesc")}
                </p>
              </Link>
            </div>
            <div>
              <Link to="/weather-forecast" className="glass p-6 rounded-2xl text-center transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-2 block h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <FaCloudSun className="text-emerald-600 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{t("weatherForecasting")}</h3>
                <p className="text-gray-600">
                  {t("weatherForecastingDesc")}
                </p>
              </Link>
            </div>
            <div>
              <Link to="/marketplace" className="glass p-6 rounded-2xl text-center transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-2 block h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <FaStore className="text-emerald-600 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{t("directMarketplace")}</h3>
                <p className="text-gray-600">
                  {t("directMarketplaceDesc")}
                </p>
              </Link>
            </div>
            <div>
              <Link to="/guidance" className="glass p-6 rounded-2xl text-center transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-2 block h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <FaBookOpen className="text-emerald-600 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{t("guidance")}</h3>
                <p className="text-gray-600">
                  {t("guidanceDesc")}
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">{t("featuredProducts")}</h2>
            <Link
              to="/products"
              className="text-green-600 hover:text-green-800 font-medium text-lg transition-all duration-300"
            >
              {t("viewAllProducts")}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader />
              </div>
            ) : (() => {
              const filteredProducts = (products ?? []).filter(product =>
                product.category?.name?.toLowerCase() === 'fruits' ||
                product.category?.name?.toLowerCase() === 'vegetables'
              );
              return filteredProducts.length > 0 ? (
                filteredProducts
                  .slice(0, 4)
                  .map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-2xl font-semibold text-gray-700 mb-4">{t("noFeatured")}</h3>
                  <p className="text-gray-500 mb-6">{t("checkBack")}</p>
                  <Link
                    to="/products"
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    {t("browseAll")}
                  </Link>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Fresh Produce Direct from Partnered Farmers</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated categories of farm-fresh products, sourced directly from verified local farmers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Vegetables Category */}
            <Link
              to="/products?category=vegetables"
              className="group glass p-8 rounded-3xl text-center transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-2 border border-emerald-100 hover:border-emerald-200"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">🥬</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-emerald-700 transition-colors duration-300">
                Vegetables
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Leafy greens, tomatoes, onions
              </p>
              <p className="text-xs text-emerald-600 mb-6 font-medium">
                Sourced from verified local farmers
              </p>
              <button className="btn btn-primary px-6 py-3 text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                Shop Now
              </button>
            </Link>

            {/* Fruits Category */}
            <Link
              to="/products?category=fruits"
              className="group glass p-8 rounded-3xl text-center transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-2 border border-emerald-100 hover:border-emerald-200"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">🍎</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-emerald-700 transition-colors duration-300">
                Fruits
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Mangoes, bananas, papayas
              </p>
              <p className="text-xs text-emerald-600 mb-6 font-medium">
                Sourced from verified local farmers
              </p>
              <button className="btn btn-primary px-6 py-3 text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                Shop Now
              </button>
            </Link>

            {/* Grains & Cereals Category */}
            <Link
              to="/products?category=grains"
              className="group glass p-8 rounded-3xl text-center transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-2 border border-emerald-100 hover:border-emerald-200"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">🌾</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-emerald-700 transition-colors duration-300">
                Grains & Cereals
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Rice, wheat, jowar, bajra
              </p>
              <p className="text-xs text-emerald-600 mb-6 font-medium">
                Sourced from verified local farmers
              </p>
              <button className="btn btn-primary px-6 py-3 text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                Shop Now
              </button>
            </Link>

            {/* Pulses & Legumes Category */}
            <Link
              to="/products?category=pulses"
              className="group glass p-8 rounded-3xl text-center transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-2 border border-emerald-100 hover:border-emerald-200"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">🧅</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-emerald-700 transition-colors duration-300">
                Pulses & Legumes
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Moong, toor, chana, masoor
              </p>
              <p className="text-xs text-emerald-600 mb-6 font-medium">
                Sourced from verified local farmers
              </p>
              <button className="btn btn-primary px-6 py-3 text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">{t("ourFarmers")}</h2>
            <Link
              to="/farmers"
              className="text-green-600 hover:text-green-800 font-medium text-lg transition-all duration-300"
            >
              {t("viewAllFarmers")}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {farmerLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader />
              </div>
            ) : (farmers ?? []).length > 0 ? (
              (farmers ?? [])
                .slice(0, 3)
                .map((farmer) => (
                  <FarmerCard key={farmer._id} farmer={farmer} />
                ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">{t("noFarmersYet")}</h3>
                <p className="text-gray-500 mb-6">{t("connectingFarmers")}</p>
                <Link
                  to="/farmers"
                  className="text-green-600 hover:text-green-800 font-medium"
                >
                  {t("checkBackLater")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">{t("ctaReady")}</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            {t("ctaText")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/register"
              className="btn bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {t("signUpNow")}
            </Link>
            <Link
              to="/about"
              className="btn border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {t("learnMore")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
