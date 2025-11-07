# HaritKranti Backend - Complete Code Explanation

## 📋 Table of Contents
1. [Core Files](#core-files)
2. [Database Models](#database-models)
3. [Controllers](#controllers)
4. [Routes](#routes)
5. [Middleware](#middleware)
6. [Utilities](#utilities)

---

## 🚀 Core Files

### `src/index.js` - Main Server Entry Point
**What it does:**
- Sets up Express server with CORS enabled
- Configures body parser with 50MB limit for image uploads
- Connects to MongoDB database
- Registers all API routes (auth, users, products, orders, etc.)
- Starts server on port 5000 (or from env)
- Includes health check endpoint (`/health`)

**Key Features:**
- MongoDB URI sanitization (handles URL encoding)
- Error handling middleware
- Route not found handler

---

### `src/db.js` - Database Connection
**What it does:**
- Establishes connection to MongoDB using Mongoose
- Enables strict query mode
- Auto-creates indexes for better performance

---

## 📊 Database Models

### `models/User.js` - User Schema
**What it stores:**
- Basic info: name, email, password (hashed), phone, address
- Role: farmer, consumer, or admin
- Profile image (URL and reference to Image model)
- **For Farmers:**
  - Basic farm details (farmName, farmSize, crops, certification)
  - Extended profile (description, farming practices, business hours, social media, delivery options)
- **For Consumers:**
  - Preferences (categories, location)

**Key Features:**
- Password hashing before save (bcrypt)
- Password comparison method
- Password removed from JSON output (security)
- Role normalization (customer → consumer)

---

### `models/Product.js` - Farmer Products Schema
**What it stores:**
- Product info: name, title, description
- Pricing: price, pricePerKg (supports both)
- Quantity: quantity, quantityKg, quantityAvailable (supports multiple formats)
- Category: ObjectId reference or string enum (backward compatible)
- Images: imageUrl (single), images (array), imageRefs (ObjectId references)
- Location: district, state, city, pincode
- Status: available, reserved, sold, out_of_stock, pending
- **Admin Approval:**
  - `isListed`: Only approved products appear in marketplace
  - `approvedPrice`: Admin can override farmer's price

**Key Features:**
- Text search index on name/title/description
- Virtual fields: effectivePrice, effectiveQuantity, firstImage
- Pre-save middleware syncs related fields (name↔title, price↔pricePerKg, etc.)
- Backward compatibility with old Listing model

---

### `models/Order.js` - Order Schema
**What it stores:**
- Consumer: Who placed the order
- Seller: Farmer or Admin (sellerType)
- Items: Array of products (can be Product, AdminProduct, or Inventory)
- Total amount, status (pending, accepted, rejected, completed, cancelled)
- Order type: pickup or delivery
- Delivery/Pickup details (address, date, time)
- Payment: method (cash, online, card) and status

**Key Features:**
- Indexes on consumer, seller, status for fast queries
- Supports both farmer products and admin products in same order

---

### `models/AdminProduct.js` - Admin Marketplace Products
**What it stores:**
- Admin seller reference
- Inventory reference (source of truth for quantity)
- Product details: name, description, category, images
- Pricing: price, pricePerKg
- Quantity and unit
- Status: available, out_of_stock, archived
- Admin markup (profit margin)

**Key Features:**
- Always syncs quantity with Inventory model (inventory is source of truth)
- Indexes for efficient marketplace queries

---

### `models/Inventory.js` - Admin Inventory Management
**What it stores:**
- Admin owner
- Purchase reference (from which purchase this came)
- Product details (copied from purchase)
- Quantities: totalQuantity, availableQuantity, soldQuantity
- Pricing: purchasePrice (from farmer), sellingPrice (to consumer)
- Source: sourceFarmer, sourceProduct
- Status: in_stock, low_stock, out_of_stock, listed, archived
- Warehouse location

**Key Features:**
- Tracks inventory lifecycle: purchase → inventory → marketplace listing → order
- Inventory is the source of truth for available quantities

---

### `models/Purchase.js` - Admin Purchases from Farmers
**What it stores:**
- Product or Listing reference (what admin is buying)
- Farmer (seller) and Admin (buyer)
- Quantity, unit, purchasePrice, totalAmount
- Status: pending, approved, completed, cancelled
- Notes

**Purpose:**
- Records when admin buys products from farmers
- Creates inventory items automatically

---

### `models/Category.js` - Product Categories
**What it stores:**
- Name (unique), description, icon
- isActive flag

**Purpose:**
- Organizes products into categories
- Can be managed by admin

---

### `models/Listing.js` - Legacy Listing Model
**What it stores:**
- Title, category, pricePerKg, quantityKg
- Images array
- Farmer reference
- Location (district, state, pincode)
- Status: available, reserved, sold

**Note:** This is a legacy model. New products use Product model instead.

---

### `models/CropRecommendation.js` - Crop Recommendation Data
**What it stores:**
- User (optional - can be anonymous)
- Location: latitude, longitude, place
- Soil data: soilType, soilPh, NPK values
- Land area, season
- Weather data: temperature, rainfall, humidity, windSpeed, soilMoisture
- Recommendations array: crop name, score, confidence, reasons, yield estimate, water requirement, market price, growing period, pest/disease warnings, fertilizer needs

**Purpose:**
- Stores crop recommendation history
- Helps farmers decide what to grow based on soil/weather conditions

---

### `models/Notification.js` - User Notifications
**What it stores:**
- User (recipient)
- Type: order_placed, order_accepted, order_rejected, order_completed, order_cancelled, purchase_completed, inventory_low, product_listed
- Title, message
- Related entity: relatedId, relatedType (order, purchase, inventory, product)
- Read status (isRead)
- Link (optional URL)

**Purpose:**
- Notifies users about important events (orders, purchases, etc.)

---

### `models/Image.js` - Image Storage Model
**What it stores:**
- URL (Cloudinary URL or base64)
- Storage type: url or base64
- Metadata: filename, mimeType, size, width, height
- Image type: profile, product, farm, certificate, other
- Uploader reference
- Referenced by: what entity uses this image (User, Product, etc.)
- Cloudinary specific: cloudinaryId, cloudinaryUrl
- Thumbnail URL

**Purpose:**
- Centralized image management
- Supports both Cloudinary (URL) and base64 storage
- Tracks image ownership and usage

---

## 🎮 Controllers

### `controllers/auth.controller.js` - Authentication
**Functions:**
1. **register**: Creates new user account
   - Validates email uniqueness
   - Hashes password
   - Generates JWT token
   - Returns user data (without password)

2. **login**: Authenticates user
   - Validates email/password
   - Optional role check
   - Returns JWT token

3. **getMe**: Gets current authenticated user profile

**Key Features:**
- JWT token generation with configurable secret and expiry
- Role normalization (customer → consumer)
- Secure password handling

---

### `controllers/product.controller.js` - Product Management
**Functions:**
1. **createProduct**: Farmer creates new product
   - Uploads image to Cloudinary
   - Sets status to "pending" (requires admin approval)
   - Sets isListed to false (not in marketplace yet)

2. **listProducts**: Get products with filters
   - Text search, category, price range, location filters
   - Only shows listed products to public (admin sees all)
   - Pagination support

3. **getProduct**: Get single product details

4. **updateProduct**: Update product (farmer or admin)

5. **deleteProduct**: Delete product (farmer or admin)

6. **getFarmerProducts**: Get all products by logged-in farmer

7. **approveProduct**: Admin approves and lists product
   - Sets isListed to true
   - Sets status to "available"
   - Can override price with approvedPrice

---

### `controllers/order.controller.js` - Order Management
**Functions:**
1. **createOrder**: Consumer places order
   - Validates item quantities (checks inventory for admin products)
   - Calculates total amount
   - Creates order with pending status
   - Updates product/inventory quantities
   - Creates notification for seller
   - **Important:** Inventory is source of truth for admin products

2. **getConsumerOrders**: Get all orders by consumer

3. **getFarmerOrders**: Get all orders for farmer's products

4. **getAdminOrders**: Get all orders for admin's products

5. **getAllOrders**: Admin sees all orders

6. **getOrderDetails**: Get single order (with authorization check)

7. **updateOrderStatus**: Seller updates order status
   - Creates notification for consumer
   - Updates payment status if completed

**Key Features:**
- Supports both farmer products and admin products
- Automatic inventory sync (inventory is source of truth)
- Quantity validation before order creation

---

### `controllers/purchase.controller.js` - Admin Purchase Management
**Functions:**
1. **getAllPurchases**: Get all purchases by admin

2. **createPurchase**: Admin buys from farmer
   - Validates available quantity
   - Reduces farmer's product quantity
   - Creates Purchase record
   - **Automatically creates Inventory item** with 20% markup
   - Updates product status if quantity becomes 0

3. **updatePurchaseStatus**: Update purchase status

**Workflow:**
Farmer Product → Admin Purchase → Inventory → AdminProduct (marketplace)

---

### `controllers/inventory.controller.js` - Inventory Management
**Functions:**
1. **getAllInventory**: Get all inventory items (admin)

2. **getInventoryItem**: Get single inventory item

3. **updateInventory**: Update inventory details

4. **listProductInMarketplace**: Create AdminProduct from inventory
   - Validates quantity
   - Creates AdminProduct linked to inventory
   - Sets inventory status to "listed"

5. **getAllAdminProducts**: Get all admin products for marketplace
   - **Always syncs quantity with inventory** (inventory is source of truth)
   - Filters out products with 0 quantity
   - Updates status based on inventory

**Key Feature:**
- Inventory quantity is always the source of truth
- AdminProduct.quantity syncs with Inventory.availableQuantity

---

### `controllers/user.controller.js` - User Management
**Functions:**
1. **getUsers**: Get all users (admin, with pagination)

2. **getUser**: Get single user (admin)

3. **updateProfile**: Update user profile
   - Supports basic fields (name, phone, address)
   - Supports farmer profile (farmName, description, business hours, etc.)
   - Supports consumer preferences

4. **deleteUser**: Delete user (admin)

5. **getFarmers**: Get all farmers (public)

6. **getFarmerById**: Get single farmer profile (public)

---

### `controllers/category.controller.js` - Category Management
**Functions:**
1. **getCategories**: Get all active categories (public)

2. **createCategory**: Create category (admin)

3. **updateCategory**: Update category (admin)

4. **deleteCategory**: Delete category (admin)

---

### `controllers/cropRecommendation.controller.js` - Crop Recommendations
**Functions:**
1. **getCropRecommendations**: Get crop recommendations
   - Takes soil type, pH, NPK, weather data, location, season
   - Calculates score for each crop (wheat, rice, maize, tomato, potato, sugarcane, cotton, soybean, groundnut, mustard)
   - Scoring based on: soil type (30pts), pH (20pts), temperature (15pts), rainfall (15pts), season (10pts), NPK (10pts)
   - Returns top 5 crops with confidence level (high/medium/low)
   - Saves to database if user is authenticated

2. **getRecommendationHistory**: Get user's recommendation history

**Crop Database:**
- Contains detailed info for 10 major crops
- Includes: soil preferences, temperature/rainfall ranges, NPK needs, seasons, water requirements, yield estimates, pest/disease warnings, fertilizer needs, market prices

---

### `controllers/notification.controller.js` - Notifications
**Functions:**
1. **getNotifications**: Get user's notifications
2. **markAsRead**: Mark notification as read
3. **deleteNotification**: Delete notification

---

### `controllers/image.controller.js` - Image Management
**Functions:**
1. **uploadImage**: Upload image to Cloudinary
2. **getImage**: Get image details
3. **deleteImage**: Delete image

---

### `controllers/listing.controller.js` - Legacy Listing Controller
**Functions:**
- CRUD operations for legacy Listing model
- Used for backward compatibility

---

## 🛣️ Routes

### `routes/auth.routes.js`
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

---

### `routes/product.routes.js`
- `GET /api/products` - List products (public, optional auth)
- `GET /api/products/:id` - Get product (public)
- `GET /api/products/farmer/me` - Get farmer's products (farmer only)
- `POST /api/products` - Create product (farmer only)
- `PATCH /api/products/:id` - Update product (farmer/admin)
- `PUT /api/products/:id/approve` - Approve product (admin only)
- `DELETE /api/products/:id` - Delete product (farmer/admin)

---

### `routes/order.routes.js`
- `POST /api/orders` - Create order (consumer only)
- `GET /api/orders/consumer` - Get consumer orders (consumer only)
- `GET /api/orders/farmer` - Get farmer orders (farmer only)
- `GET /api/orders/admin` - Get admin orders (admin only)
- `GET /api/orders/all` - Get all orders (admin only)
- `GET /api/orders/:id` - Get order details (protected)
- `PATCH /api/orders/:id/status` - Update order status (protected)

---

### `routes/purchase.routes.js`
- All routes require admin authentication
- `GET /api/purchases` - Get all purchases
- `POST /api/purchases` - Create purchase
- `PATCH /api/purchases/:id/status` - Update purchase status

---

### `routes/inventory.routes.js`
- `GET /api/inventory/marketplace/products` - Get admin products (public)
- `GET /api/inventory` - Get all inventory (admin only)
- `GET /api/inventory/:id` - Get inventory item (admin only)
- `PATCH /api/inventory/:id` - Update inventory (admin only)
- `POST /api/inventory/list` - List product in marketplace (admin only)

---

### `routes/user.routes.js`
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user (admin only)
- `PUT /api/users/profile` - Update profile (protected)
- `DELETE /api/users/:id` - Delete user (admin only)
- `GET /api/users/farmers` - Get all farmers (public)
- `GET /api/users/farmers/:id` - Get farmer (public)

---

### `routes/category.routes.js`
- `GET /api/categories` - Get categories (public)
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

---

### `routes/cropRecommendation.routes.js`
- `POST /api/crop-recommendation` - Get recommendations (public, optional auth)
- `GET /api/crop-recommendation/history` - Get history (protected)

---

### `routes/notification.routes.js`
- `GET /api/notifications` - Get notifications (protected)
- `PATCH /api/notifications/:id/read` - Mark as read (protected)
- `DELETE /api/notifications/:id` - Delete notification (protected)

---

### `routes/image.routes.js`
- `POST /api/images` - Upload image (protected)
- `GET /api/images/:id` - Get image (protected)
- `DELETE /api/images/:id` - Delete image (protected)

---

### `routes/listing.routes.js`
- Legacy routes for Listing model (backward compatibility)

---

## 🔒 Middleware

### `middleware/auth.js`
**Functions:**
1. **protect**: JWT authentication middleware
   - Extracts token from Authorization header
   - Verifies token
   - Attaches user to req.user
   - Returns 401 if invalid/missing token

2. **optionalAuth**: Optional authentication
   - Same as protect but doesn't fail if no token
   - Sets req.user if token valid, otherwise continues without it

3. **authorize**: Role-based authorization
   - Checks if user role is in allowed roles
   - Returns 403 if unauthorized

**Key Features:**
- JWT secret normalization (handles quotes, undefined, null)
- Fallback secret if env not set

---

### `middleware/error.js`
**Functions:**
1. **notFound**: 404 handler for unknown routes
2. **errorHandler**: Global error handler
   - Logs error
   - Returns error message with status code

---

## 🛠️ Utilities

### `utils/upload.js`
**Functions:**
1. **configureCloudinary**: Configures Cloudinary with env credentials
2. **upload**: Multer middleware for file uploads
   - Memory storage (10MB limit)
3. **uploadBufferToCloudinary**: Uploads buffer to Cloudinary
   - Returns secure URL

**Purpose:**
- Handles image uploads to Cloudinary
- Supports streaming uploads

---

## 🔄 Key Workflows

### 1. Farmer Product Workflow
1. Farmer creates product → Status: "pending", isListed: false
2. Admin reviews and approves → Status: "available", isListed: true
3. Product appears in marketplace
4. Consumer places order → Quantity reduced, order created
5. Farmer accepts/rejects order

### 2. Admin Purchase Workflow
1. Admin views farmer products
2. Admin creates purchase → Farmer product quantity reduced
3. Inventory item created automatically (with 20% markup)
4. Admin lists inventory as AdminProduct → Appears in marketplace
5. Consumer places order → Inventory quantity reduced
6. Order fulfilled

### 3. Order Processing
1. Consumer adds items to cart
2. Consumer places order → Quantities validated
3. Inventory/Product quantities updated
4. Notification sent to seller
5. Seller accepts/rejects → Notification sent to consumer
6. Order completed → Payment status updated

### 4. Inventory Sync (Critical)
- **Inventory.availableQuantity is always the source of truth**
- AdminProduct.quantity always syncs with Inventory.availableQuantity
- When order is placed, inventory is updated first, then AdminProduct syncs
- This ensures accurate stock levels

---

## 🔐 Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Authentication**: Token-based auth with expiry
3. **Role-Based Access Control**: protect + authorize middleware
4. **Password Removal**: Passwords never sent in responses
5. **Input Validation**: Mongoose schema validation
6. **File Size Limits**: 10MB for images, 50MB for body

---

## 📝 Notes

- **Backward Compatibility**: Product model supports both old Listing format and new format
- **Quantity Sync**: Inventory is always source of truth for admin products
- **Image Storage**: Supports both Cloudinary (URL) and base64
- **Category System**: Can use ObjectId references or string enums
- **Admin Approval**: Products require admin approval before appearing in marketplace
- **Notification System**: Automatic notifications for orders, purchases, etc.

---

## 🎯 API Endpoints Summary

- **Auth**: `/api/auth/*` - Registration, login, profile
- **Users**: `/api/users/*` - User management
- **Products**: `/api/products/*` - Product CRUD, approval
- **Orders**: `/api/orders/*` - Order management
- **Purchases**: `/api/purchases/*` - Admin purchases (admin only)
- **Inventory**: `/api/inventory/*` - Inventory management (admin only)
- **Categories**: `/api/categories/*` - Category management
- **Crop Recommendations**: `/api/crop-recommendation/*` - Crop suggestions
- **Notifications**: `/api/notifications/*` - User notifications
- **Images**: `/api/images/*` - Image upload/management

---

*This document provides a comprehensive overview of the HaritKranti backend codebase. Each component is designed to support a multi-role agricultural marketplace platform connecting farmers, consumers, and administrators.*

