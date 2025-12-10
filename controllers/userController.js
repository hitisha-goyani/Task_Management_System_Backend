import HttpError from "../middleware/ErrorHandler.js";
import User from "../model/User.js";


// ADD USER 
const addUser = async (req, res, next) => {
  try {
    const { name, email, password, role, department } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new HttpError("User already exists with this email", 400));
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
      department,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });

  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


// LOGIN

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByCredentials(email, password);
    if (!user) {
      return next(new HttpError("Unable to login", 400));
    }

    const token = await user.generateAuthToken();

    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });

  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


// UPDATE USER

const update = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password"];

    const isValid = updates.every((field) =>
      allowedUpdates.includes(field)
    );

    if (!isValid) {
      return next(new HttpError("Invalid update fields", 400));
    }

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) return next(new HttpError("User not found", 404));

    // check if email already exists
    if (req.body.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return next(new HttpError("Email already in use", 400));
      }
    }

    updates.forEach((field) => {
      user[field] = req.body[field];
    });

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user,
    });

  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


// DELETE USER 

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);

    if (!user) {
      return next(new HttpError("User not found or delete failed", 404));
    }

    res.status(200).json({
      message: "User account deleted successfully",
    });

  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


// AUTH CHECK 
const authLogin = async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user });

  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


// LOGOUT 

const logout = async (req, res, next) => {
  try {
    const user = req.user;
    const token = req.token;

    user.tokens = user.tokens.filter((t) => t.token !== token);

    await user.save();

    res.status(200).json({ message: "Logged out successfully" });

  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


// LOGOUT ALL 

const logoutAll = async (req, res, next) => {
  try {
    const user = req.user;

    user.tokens = [];
    await user.save();

    res
      .status(200)
      .json({ message: "Logged out from all sessions successfully" });

  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

export default {
  addUser,
  login,
  update,
  deleteUser,
  authLogin,
  logout,
  logoutAll,
};
