import User from "../models/User.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const filter = {};
    if (role) filter.role = role;
    
    const query = User.find(filter).select("-password").sort("-createdAt").skip((+page - 1) * +limit).limit(+limit);
    const [users, total] = await Promise.all([query, User.countDocuments(filter)]);
    
    res.json({
      success: true,
      data: users,
      total,
      page: +page,
      limit: +limit,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      profileImage: req.body.profileImage,
      farmDetails: req.body.farmDetails,
      preferences: req.body.preferences,
    };
    
    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all farmers
// @route   GET /api/users/farmers
// @access  Public
export const getFarmers = async (req, res, next) => {
  try {
    const farmers = await User.find({ role: "farmer" })
      .select("-password")
      .sort("-createdAt");
    
    res.json({
      success: true,
      data: farmers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get farmer by ID
// @route   GET /api/users/farmers/:id
// @access  Public
export const getFarmerById = async (req, res, next) => {
  try {
    const farmer = await User.findOne({ 
      _id: req.params.id, 
      role: "farmer" 
    }).select("-password");
    
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }
    
    res.json({
      success: true,
      data: { farmer, profile: farmer },
    });
  } catch (error) {
    next(error);
  }
};


