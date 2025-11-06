# Complete Purchase & Marketplace Workflow ✅

## Overview
This document describes the complete end-to-end workflow from admin purchasing products from farmers to customers buying from the marketplace.

## Complete Workflow

### 1. **Admin Purchases from Farmers** 
   - Admin visits `/admin/purchase`
   - Views all available products from farmers (products with quantity > 0)
   - Selects a product (e.g., 40kg of apples from 70kg total)
   - Sets purchase price and quantity
   - Confirms purchase

   **What Happens:**
   - ✅ Product quantity is **automatically reduced** (70kg - 40kg = 30kg remaining)
   - ✅ If quantity reaches 0, product is **removed from available list** (not shown as "out of stock")
   - ✅ Purchase record is created and added to **Transaction History**
   - ✅ **Inventory item is automatically created** with purchased quantity
   - ✅ Purchase status set to "completed"
   - ✅ Transaction appears in Purchase History section

### 2. **Admin Views Purchase History**
   - In Purchase page, click "Transaction History" button
   - See all past purchases in a detailed table:
     - Date and time of purchase
     - Product name and category
     - Farmer name
     - Quantity purchased
     - Price per unit
     - Total amount spent
     - Purchase status
   - View **total amount spent** across all purchases
   - Products with 0 quantity are **automatically hidden** from available products list (not shown as "out of stock")

### 3. **Admin Manages Inventory**
   - Admin visits `/admin/inventory`
   - Views all purchased products
   - Sees:
     - Total quantity purchased
     - Available quantity (ready to sell)
     - Sold quantity
     - Purchase price vs selling price
   - Can edit selling price and warehouse location

### 4. **Admin Lists Products in Marketplace**
   - From Inventory page, clicks "List in Marketplace"
   - Sets selling price and quantity to list
   - Product becomes available in marketplace
   - Admin can view listed products in `/admin/marketplace`

   **What Happens:**
   - ✅ AdminProduct is created
   - ✅ Inventory status changes to "listed"
   - ✅ Product appears in customer marketplace

### 5. **Customer Purchases from Marketplace**
   - Customer visits `/marketplace`
   - Sees both:
     - **Farmer products** (direct from farmers)
     - **Admin products** (purchased and resold by admin)
   - Adds products to cart
   - Places order

   **What Happens:**
   - ✅ Order is created with seller type (farmer/admin)
   - ✅ **Admin gets notified** via notification system
   - ✅ **Inventory is automatically updated:**
     - AdminProduct quantity reduced
     - Inventory availableQuantity reduced
     - Inventory soldQuantity increased
     - Status updates (out_of_stock if quantity = 0, low_stock if < 10)
   - ✅ Notification created for admin: "New Order Received"

### 6. **Admin Views Orders & Notifications**
   - Admin visits `/admin/orders`
   - Sees all orders (including marketplace orders)
   - **Notification bell** shows unread count
   - Can view order details and update status
   - When order status changes, customer gets notified

## Key Features Implemented

### ✅ **Automatic Quantity Updates**
- When admin purchases: Farmer product quantity reduced
- When customer purchases: Admin inventory and marketplace product quantities reduced

### ✅ **Inventory Management**
- Tracks total, available, and sold quantities
- Automatic status updates (in_stock, low_stock, out_of_stock, listed)
- Links purchases to inventory items

### ✅ **Notification System**
- Admin notified when customers place orders
- Real-time unread count in header
- Notification dropdown with recent notifications
- Click notification to view order details

### ✅ **Order Processing**
- Handles both farmer and admin products
- Automatic inventory updates on order creation
- Status tracking (pending, accepted, rejected, completed, cancelled)
- Notifications on status changes

## Example Flow

1. **Farmer has 70kg of apples**
   - Product: "Fresh Apples", Quantity: 70kg, Price: ₨50/kg

2. **Admin purchases 40kg**
   - Purchase created: 40kg @ ₨45/kg (negotiated price)
   - **Farmer product updated:** 30kg remaining
   - **Inventory created:** 40kg available, purchase price ₨45/kg, selling price ₨54/kg (20% markup)

3. **Admin lists 30kg in marketplace**
   - AdminProduct created: 30kg @ ₨54/kg
   - **Inventory updated:** 30kg listed, 10kg still in stock

4. **Customer buys 20kg**
   - Order created: 20kg @ ₨54/kg
   - **Admin notified:** "New Order Received - ₨1,080"
   - **AdminProduct updated:** 10kg remaining
   - **Inventory updated:** availableQuantity = 10kg, soldQuantity = 20kg

5. **Admin views order**
   - Sees order in `/admin/orders`
   - Updates status to "accepted" or "completed"
   - Customer gets notified of status change

## API Endpoints

### Purchases
- `POST /api/purchases` - Create purchase (reduces product quantity)
- `GET /api/purchases` - Get all purchases

### Inventory
- `GET /api/inventory` - Get all inventory items
- `PATCH /api/inventory/:id` - Update inventory
- `POST /api/inventory/list` - List product in marketplace

### Orders
- `POST /api/orders` - Create order (updates inventory)
- `GET /api/orders/admin` - Get admin's marketplace orders
- `GET /api/orders/all` - Get all orders (admin)
- `PATCH /api/orders/:id/status` - Update order status

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread/count` - Get unread count
- `PATCH /api/notifications/:id/read` - Mark as read

## Database Updates

### On Purchase:
- ✅ Product.quantityAvailable reduced
- ✅ Product.quantityKg reduced
- ✅ Product.quantity reduced
- ✅ Product.status updated if quantity = 0
- ✅ Purchase record created
- ✅ Inventory record created

### On Order:
- ✅ AdminProduct.quantity reduced
- ✅ Inventory.availableQuantity reduced
- ✅ Inventory.soldQuantity increased
- ✅ Inventory.status updated
- ✅ Order record created
- ✅ Notification created for admin

## Testing the Flow

1. **Create test products** (if needed):
   ```bash
   cd backend
   node scripts/addTestProducts.js
   ```

2. **Login as Admin:**
   - Email: `admin@test.com`
   - Password: `admin123`

3. **Purchase Products:**
   - Go to `/admin/purchase`
   - Purchase products from farmers
   - Check that farmer product quantities are reduced

4. **List in Marketplace:**
   - Go to `/admin/inventory`
   - List products in marketplace
   - Check `/admin/marketplace` to see listed products

5. **Test Customer Purchase:**
   - Login as customer
   - Visit `/marketplace`
   - Add admin products to cart
   - Place order
   - Check admin notifications (bell icon)
   - Check `/admin/orders` for new order
   - Verify inventory quantities updated

## Status Indicators

- **Product Status:** available, reserved, sold, out_of_stock
- **Inventory Status:** in_stock, low_stock, out_of_stock, listed, archived
- **Order Status:** pending, accepted, rejected, completed, cancelled
- **Purchase Status:** pending, approved, completed, cancelled

## Notes

- All quantity updates are **automatic** and **atomic**
- Inventory tracks both listed and unlisted quantities
- Notifications are created automatically for relevant events
- System prevents purchasing more than available quantity
- System prevents listing more than available inventory

