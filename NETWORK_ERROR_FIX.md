# 🔧 Fixing Network Error While Logging In

## 🚨 Problem
Getting "Network Error" when trying to log in as admin.

## ✅ Solution

The network error occurs because **the backend server is not running**. The frontend is trying to connect to `http://localhost:5000/api` but the backend isn't available.

### **Step 1: Start the Backend Server**

1. **Open a new terminal/command prompt**

2. **Navigate to the backend folder:**
   ```bash
   cd HARITKRANTI-final/backend
   ```

3. **Start the backend server:**
   ```bash
   npm run dev
   ```

   You should see output like:
   ```
   🚀 API running http://localhost:5000
   ```

4. **Keep this terminal open** - the backend needs to keep running

### **Step 2: Verify Backend is Running**

- Check if you see: `🚀 API running http://localhost:5000`
- Or test in browser: `http://localhost:5000/health` should return `{"ok":true}`

### **Step 3: Try Logging In Again**

1. Go back to your frontend (should be running on `http://localhost:5173`)
2. Try logging in as admin again
3. The network error should be resolved

---

## 🔍 Troubleshooting

### **Backend Won't Start**

**Error: "Cannot find module"**
```bash
cd backend
npm install
```

**Error: "Port 5000 already in use"**
- Another process is using port 5000
- Either stop that process or change the port in `backend/src/index.js`

**Error: "MongoDB connection failed"**
- Check your MongoDB connection string
- Make sure MongoDB is accessible

### **Still Getting Network Error**

1. **Check .env file:**
   - Make sure `VITE_API_URL=http://localhost:5000/api` is set
   - Restart the frontend dev server after changing .env

2. **Check browser console:**
   - Open Developer Tools (F12)
   - Check the Network tab for failed requests
   - Look for CORS errors

3. **Verify both servers are running:**
   - Frontend: `http://localhost:5173` (or your Vite port)
   - Backend: `http://localhost:5000`

4. **Check CORS:**
   - Backend should have CORS enabled (it does in `backend/src/index.js`)
   - Make sure `cors` package is installed

---

## 📝 Quick Checklist

- [ ] Backend server is running (`npm run dev` in backend folder)
- [ ] Backend shows: `🚀 API running http://localhost:5000`
- [ ] Frontend .env has: `VITE_API_URL=http://localhost:5000/api`
- [ ] Frontend dev server is running
- [ ] No firewall blocking port 5000
- [ ] MongoDB connection is working

---

## 🎯 Expected Behavior

**When everything is working:**
1. Backend terminal shows: `🚀 API running http://localhost:5000`
2. Frontend can make API calls successfully
3. Login works without network errors
4. Admin login redirects to `/admin/dashboard`

---

**Need more help?** Check the browser console (F12) for specific error messages.


