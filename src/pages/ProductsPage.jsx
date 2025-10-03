"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getProducts } from "../redux/slices/productSlice";
import { getCategories } from "../redux/slices/categorySlice";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { FaFilter, FaSearch, FaSeedling, FaAppleAlt, FaCarrot } from "react-icons/fa";
import { useI18n } from "../context/I18nProvider";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useI18n();

  const { products, loading } = useSelector((state) => state.products);
  const { categories, loading: categoryLoading } = useSelector(
    (state) => state.categories
  );

  const [filters, setFilters] = useState({
    category: "",
    search: "",
    sort: "newest",
  });

  const [showFilters, setShowFilters] = useState(false);

  // Get categories and sync URL param
  useEffect(() => {
    dispatch(getCategories());

    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");

    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [dispatch, location.search]);

  // Debounced product fetching
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = {};

      if (filters.category) {
        params.category = filters.category;
      }

      if (filters.search) {
        params.search = filters.search;
      }

      dispatch(getProducts(params));
    }, 1000); // delay of 1 second

    return () => clearTimeout(delayDebounce);
  }, [dispatch, filters.category, filters.search]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (filters.sort === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (filters.sort === "price-low") {
      return a.price - b.price;
    } else if (filters.sort === "price-high") {
      return b.price - a.price;
    }
    return 0;
  });

  const resultsCount = sortedProducts.length;

  if (loading || categoryLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("browseProducts")}</h1>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">{resultsCount} {t("results")}</div>

      {/* Fruits and Vegetables Section */}
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Fruits Section */}
          <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 p-6 rounded-2xl border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <FaAppleAlt className="text-orange-500 text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-orange-800">{t("freshFruits")}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🍎 Apples</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🍌 Bananas</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🍊 Oranges</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🥭 Mangoes</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🍇 Grapes</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🍓 Strawberries</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🥝 Kiwi</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🍑 Cherries</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🍈 Melons</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🥥 Coconuts</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🍍 Pineapples</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🫐 Blueberries</span>
              </div>
            </div>
          </div>

          {/* Vegetables Section */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-6 rounded-2xl border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <FaCarrot className="text-emerald-600 text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-emerald-800">{t("freshVegetables")}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🥕 Carrots</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🥬 Lettuce</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🍅 Tomatoes</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🥒 Cucumbers</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🧅 Onions</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🥔 Potatoes</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🌶️ Peppers</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🥦 Broccoli</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🌽 Corn</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🍆 Eggplant</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🥬 Cabbage</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">🥕 Radish</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-grow">
            <div className="relative">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder={t("searchProductsPlaceholder")}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
            </div>
          </form>

          <div className="flex gap-4">
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="newest">{t("newest")}</option>
              <option value="price-low">{t("priceLow")}</option>
              <option value="price-high">{t("priceHigh")}</option>
            </select>

            <button
              onClick={toggleFilters}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <FaFilter />
              <span>{t("filters")}</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("category")}</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">{t("allCategories")}</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaSeedling className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t("noProductsFound")}</h3>
          <p className="text-gray-600">{t("tryAdjustSearch")}</p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
