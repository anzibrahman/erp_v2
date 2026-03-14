// controllers/userController.js
import User from "../Model/UserSchema.js";

export const createStaffUser = async (req, res) => {
  try {
    const ownerId = req.user.id; // logged-in user making the request
    const { userName, email, mobileNumber, password, role, companyId } =
      req.body;

    if (!userName || !email || !mobileNumber || !password) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // only admins can create users (admin or staff)
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can create users" });
    }

    const existing = await User.findOne({
      $or: [{ email }, { mobileNumber }],
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Email or mobile already registered" });
    }

    const isAdminBeingCreated = role === "admin";

    const newUser = await User.create({
      userName: userName.trim(),
      email: email.trim(),
      mobileNumber: mobileNumber.trim(),
      password,
      role: role || "staff",
      // if creating an admin, owner is itself; if creating staff, owner is the current admin
      owner: isAdminBeingCreated ? undefined : ownerId,
      company: companyId || null,
    });

    // if you want admin’s owner to be its own id, update after create:
    if (isAdminBeingCreated && !newUser.owner) {
      newUser.owner = newUser._id;
      await newUser.save();
    }

    const userObj = newUser.toObject();
    delete userObj.password;

    return res.status(201).json({
      message: "User created successfully",
      user: userObj,
    });
  } catch (err) {
    console.error("createStaffUser error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};




// List all staff under current admin
export const listStaffUsers = async (req, res) => {
  try {
    const adminId = req.user.id; // logged-in primary user

    const users = await User.find({
      owner: adminId,     // match your field name
      role: "staff",      // only staff
    })
      .sort({ createdAt: -1 })
      .select("-password");

    return res.json(users);
  } catch (err) {
    console.error("listStaffUsers error:", err);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Get single staff user
export const getStaffUserById = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const user = await User.findOne({
      _id: id,
      owner: adminId,
      role: "staff",
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

export const updateStaffUser = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;
    const { userName, email, mobileNumber, role } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: id, owner: adminId, role: "staff" },
      { userName, email, mobileNumber, role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteStaffUser = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const user = await User.findOneAndDelete({
      _id: id,
      owner: adminId,
      role: "staff",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};
