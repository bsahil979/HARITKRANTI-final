# Admin Purchase & Marketplace Workflow

## Overview
This document describes the complete workflow where farmers add products, admin purchases them in bulk, and resells them in the marketplace to customers.

## Workflow Steps

### 1. Farmers Add Products
- Farmers can add products through:
  - **Products** (via `/farmer/products`)
  - **Listings** (via `/farmer/listings`)

### 2. Admin Views Available Products
- Admin navigates to **Purchase** page (`/admin/purchase`)
- Can view both:
  - **Products Tab**: All products from farmers
  - **Listings Tab**: All listings from farmers
- Search and filter by category
- View product details: name, description, price, quantity, farmer info

### 3. Admin Purchases Products
- Click "Purchase Product" on any item
- Fill in purchase form:
  - **Quantity**: Amount to purchase (cannot exceed available quantity)
  - **Purchase Price**: Price per unit (can negotiate with farmer's price)
  - **Notes**: Optional notes about the purchase
- Click "Confirm Purchase"
- Product is automatically added to **Inventory**

### 4. Admin Manages Inventory
- Navigate to **Inventory** page (`/admin/inventory`)
- View all purchased products with:
  - Total quantity, available quantity, sold quantity
  - Purchase price vs selling price
  - Source farmer information
  - Status (in_stock, low_stock, out_of_stock, listed)
- Edit inventory items:
  - Update selling price
  - Update warehouse location
- List products in marketplace:
  - Select quantity to list
  - Set selling price
  - View estimated revenue and profit

### 5. Admin Lists Products in Marketplace
- From Inventory page, click "List in Marketplace"
- Set selling price and quantity
- Product becomes available in the marketplace
- Admin can view all listed products in **My Marketplace** page (`/admin/marketplace`)

### 6. Customers View & Purchase
- Customers visit **Marketplace** page (`/marketplace`)
- See both:
  - **Farmer Products**: Direct from farmers
  - **Admin Products**: Purchased and resold by admin
- Search, filter, and sort products
- Add to cart and purchase

## Database Models

### Purchase Model
- Links admin to farmer product/listing
- Tracks purchase details (quantity, price, total amount)
- Status: pending, approved, completed, cancelled

### Inventory Model
- Stores purchased products in admin's warehouse
- Tracks quantities (total, available, sold)
- Pricing (purchase price, selling price, markup)
- Status: in_stock, low_stock, out_of_stock, listed, archived

### AdminProduct Model
- Products listed in marketplace by admin
- References inventory item
- Available to customers
- Status: available, out_of_stock, archived

## API Endpoints

### Purchase Endpoints (Admin Only)
- `GET /api/purchases` - Get all purchases
- `POST /api/purchases` - Create new purchase
- `PATCH /api/purchases/:id/status` - Update purchase status

### Inventory Endpoints
- `GET /api/inventory` - Get all inventory (Admin only)
- `GET /api/inventory/:id` - Get inventory item (Admin only)
- `PATCH /api/inventory/:id` - Update inventory (Admin only)
- `POST /api/inventory/list` - List product in marketplace (Admin only)
- `GET /api/inventory/marketplace/products` - Get admin products (Public)

## Admin Pages

1. **Purchase Page** (`/admin/purchase`)
   - View and purchase products from farmers

2. **Inventory Page** (`/admin/inventory`)
   - Manage purchased inventory
   - List products in marketplace

3. **My Marketplace Page** (`/admin/marketplace`)
   - View all listed products
   - Manage marketplace listings

## Features

- ✅ View all farmer products and listings
- ✅ Purchase products with custom pricing
- ✅ Automatic inventory creation on purchase
- ✅ Inventory management with quantity tracking
- ✅ List products in marketplace with markup
- ✅ Customers see both farmer and admin products
- ✅ Search, filter, and sort functionality
- ✅ Real-time quantity updates
- ✅ Profit calculation and revenue tracking

## Notes

- Admin can negotiate purchase price (may differ from farmer's listed price)
- Inventory automatically tracks available vs sold quantities
- Products can be partially listed (not all inventory needs to be listed)
- Marketplace shows both farmer direct products and admin resold products
- Admin products are clearly marked in the system


