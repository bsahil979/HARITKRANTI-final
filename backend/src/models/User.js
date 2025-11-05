import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["farmer", "consumer", "admin"],
      default: "consumer",
      set: (value) => {
        if (value === undefined || value === null) return value;
        const normalized = String(value).trim().toLowerCase();
        if (normalized === "customer") return "consumer";
        if (["consumer", "farmer", "admin"].includes(normalized)) return normalized;
        return normalized; // let enum validator handle invalid values
      },
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: "India" },
    },
    profileImage: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // For farmers
    farmDetails: {
      farmName: String,
      farmSize: String,
      crops: [String],
      certification: [String],
    },
    // For consumers
    preferences: {
      categories: [String],
      location: {
        state: String,
        city: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model("User", userSchema);
<<<<<<< HEAD
=======


>>>>>>> dda2e67 (Backup current local fixes before revert)
