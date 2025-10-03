import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { placeholder } from "../assets";
import { useI18n } from "../context/I18nProvider";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { t } = useI18n();

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholder;
  };

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <div className="card bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-transform duration-300">
      {/* Product Link */}
      <Link to={`/products/${product._id}`}>
        <div className="relative h-48 overflow-hidden">
          {product?.images?.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name || "Product"}
              onError={handleImageError}
              className="w-full h-48 object-cover"
            />
          ) : (
            <img
              src={placeholder}
              alt="placeholder"
              className="w-full h-48 object-cover"
            />
          )}

          {product.isOrganic && (
            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
              Organic
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1 truncate">
            {product.name || "Unnamed Product"}
          </h3>
          <p className="text-gray-500 text-sm mb-2 truncate">
            {product.category?.name || product.category || "General"}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-green-600 font-bold">
              ₨{product.price ? product.price.toFixed(2) : "0.00"}{" "}
              {product.unit ? `/ ${product.unit}` : ""}
            </span>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="m-4 w-[calc(100%-2rem)] bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-300"
      >
        {t("addToCart")}
      </button>
    </div>
  );
};

export default ProductCard;
