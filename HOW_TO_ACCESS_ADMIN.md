# 🔐 How to Access Admin Pages

## 📋 Requirements

To access the admin pages, you need:
1. **An account with `admin` role** (not available through normal registration)
2. **Be logged in** to the application

## 🚀 Methods to Access Admin Pages

### **Method 1: Direct URL (If Already Logged In as Admin)**

If you're already logged in with an admin account, you can directly navigate to:

```
http://localhost:5173/admin/dashboard
```

Or any other admin page:
- `/admin/dashboard` - Dashboard
- `/admin/users` - Users Management
- `/admin/products` - Products Management
- `/admin/listings` - Listings Management
- `/admin/orders` - Orders Management
- `/admin/categories` - Categories Management
- `/admin/messages` - Messages Moderation
- `/admin/reports` - Reports & Complaints
- `/admin/analytics` - Analytics
- `/admin/settings` - Settings

### **Method 2: Through Navigation Menu**

1. **Log in** with an admin account
2. Click on your **profile icon/name** in the top navigation bar
3. Click **"Admin Dashboard"** from the dropdown menu
4. You'll be redirected to `/admin/dashboard`

### **Method 3: After Login (Automatic Redirect)**

If you log in with an admin account, you'll be automatically redirected to `/admin/dashboard`.

---

## 👤 How to Create an Admin Account

**Important:** Admin accounts cannot be created through the normal registration form (which only allows "farmer" or "consumer" roles).

### **Option 1: Create Admin via Backend/Database (Recommended)**

#### **Using MongoDB directly:**

1. Connect to your MongoDB database
2. Insert an admin user directly:

```javascript
// In MongoDB shell or MongoDB Compass
db.users.insertOne({
  name: "Admin User",
  email: "admin@haritkranti.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5", // Hash for "admin123"
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Note:** The password hash above is for "admin123" - you should generate your own hash using bcrypt.

#### **Using Backend API (if you have admin creation endpoint):**

```bash
# If you have a backend endpoint for creating admin users
curl -X POST http://localhost:5000/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@haritkranti.com",
    "password": "your-secure-password"
  }'
```

### **Option 2: Temporarily Modify Registration (For Testing Only)**

**⚠️ WARNING: Only for development/testing. Remove this before production!**

1. Open `src/pages/RegisterPage.jsx`
2. Find the role select dropdown (around line 254)
3. Add admin option:

```jsx
<select
  id="role"
  name="role"
  value={formData.role}
  onChange={handleChange}
  className="form-input"
  required
  disabled={!!location.search}
>
  <option value="customer">Customer</option>
  <option value="farmer">Farmer</option>
  <option value="admin">Admin</option> {/* Add this line */}
</select>
```

4. Register with admin role
5. **Remove this option before deploying to production!**

### **Option 3: Create Admin via Backend Script**

Create a script file `backend/scripts/createAdmin.js`:

```javascript
import mongoose from "mongoose";
import User from "../src/models/User.js";
import bcrypt from "bcryptjs";

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/haritkranti");
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@haritkranti.com" });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      process.exit(0);
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);
    const admin = await User.create({
      name: "Admin User",
      email: "admin@haritkranti.com",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });
    
    console.log("Admin user created successfully!");
    console.log("Email: admin@haritkranti.com");
    console.log("Password: admin123");
    console.log("⚠️  Please change the password after first login!");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
```

Run the script:
```bash
cd backend
node scripts/createAdmin.js
```

---

## 🔑 Default Admin Credentials (If Created via Script)

If you use the script above:
- **Email:** `admin@haritkranti.com`
- **Password:** `admin123`

**⚠️ IMPORTANT:** Change the password immediately after first login!

---

## ✅ Step-by-Step Access Guide

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Create an admin account** using one of the methods above

3. **Log in:**
   - Go to `http://localhost:5173/login`
   - Enter admin email and password
   - Click "Sign In"

4. **Access admin panel:**
   - You'll be automatically redirected to `/admin/dashboard`
   - OR click your profile menu → "Admin Dashboard"
   - OR navigate directly to `/admin/dashboard`

5. **Navigate admin pages:**
   - Use the sidebar navigation on the left
   - All admin pages are listed there

---

## 🛡️ Security Notes

1. **Admin accounts should be created manually** - Never allow public registration with admin role
2. **Use strong passwords** for admin accounts
3. **Limit admin account creation** - Only create admin accounts through secure backend processes
4. **Remove admin option from registration** if you added it for testing
5. **Use environment variables** for sensitive admin credentials

---

## 🐛 Troubleshooting

### **"Access Denied" or Redirected to Login**

- **Check your role:** Make sure your account has `role: "admin"` in the database
- **Check authentication:** Make sure you're logged in
- **Check token:** Your session token might have expired - try logging in again

### **Can't See Admin Dashboard in Menu**

- Make sure your user object has `role: "admin"`
- Check the Redux state: `state.auth.user.role` should be "admin"
- Try logging out and logging back in

### **Admin Route Not Working**

- Check `src/components/AdminRoute.jsx` - it should check for `user?.role === "admin"`
- Verify your Redux store is properly configured
- Check browser console for any errors

---

## 📝 Quick Test

To quickly test admin access:

1. **Temporarily add admin to registration** (for testing only)
2. **Register as admin**
3. **Log in**
4. **Access `/admin/dashboard`**
5. **Remove admin from registration** after testing

---

**Need Help?** Check the browser console for errors or verify your user role in the database.



