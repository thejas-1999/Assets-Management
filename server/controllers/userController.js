import User from "../models/userModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import Asset from "../models/assetModel.js"
import sendEmail from "../utils/sendEmail.js";
import generateResetToken from '../utils/resetToken.js';
import crypto from 'crypto'; // for ES Modules





// @desc    Register a new user
// @route   POST /api/users/register
// @access  SuperAdmin Only
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, designation, phone, role } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    designation,
    phone,
    role: role || 'user',
  });

  if (user) {
    // Generate token and store in cookie
    generateToken(res, user._id);

    // ✅ Send welcome email to the user
    await sendEmail(
      user.email,
      "Welcome to Asset Manager",
      `Hi ${user.name},\n\nYour account has been successfully created.\n\nRegards,\nAsset Management Team`
    );

    // ✅ Notify admin (email will go to Mailtrap)
    await sendEmail(
      "admin@example.com",  // can be any dummy email — Mailtrap catches it
      "New User Registered",
      `A new user has registered:\n\nName: ${user.name}\nEmail: ${user.email}\nDesignation: ${user.designation}\nPhone: ${user.phone}\nRole: ${user.role}`
    );

    // Respond with user info
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      designation: user.designation,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});


// @desc    Login user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      designation: user.designation,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get own profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Fetch all assets assigned to this user
  const assignedAssets = await Asset.find({ assignedTo: user._id });

  res.json({
    ...user.toObject(),
    assignedAssets,
  });
});

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.designation = req.body.designation || user.designation;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      designation: updatedUser.designation,
      phone: updatedUser.phone,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Dashboard - basic info & asset count
// @route   GET /api/users/dashboard
// @access  Private


const getUserDashboard = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  const assetCount = await Asset.countDocuments({ assignedTo: req.user._id });
  res.json({ user, assetCount });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Admin or SuperAdmin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Admin or SuperAdmin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user by ID
// @route   PUT /api/users/:id
// @access  Admin or SuperAdmin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.designation = req.body.designation || user.designation;
    user.phone = req.body.phone || user.phone;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      designation: updatedUser.designation,
      phone: updatedUser.phone,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});




// @desc    Delete user by ID
// @route   DELETE /api/users/:id
// @access  SuperAdmin Only
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await User.deleteOne({ _id: id });

  res.status(200).json({ message: "User deleted successfully" });
});






const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('No user found with this email');
  }

  const { resetToken, hashedToken } = generateResetToken();

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const message = `Hi ${user.name},\n\nYou requested to reset your password.\nClick this link to reset it:\n${resetUrl}\n\nIf not requested, ignore this.`;

  await sendEmail(user.email, 'Password Reset Request', message);

  res.json({ message: 'Password reset link sent to email' });
});


const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password has been reset successfully' });
});





export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUserDashboard,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword
};
