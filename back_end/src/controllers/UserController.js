const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");
const cloudinary = require("cloudinary").v2;
const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;
    const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isCheckEmail = reg.test(email);
    if (!email || !password || !confirmPassword || !phone || !name) {
      return res
        .status(200)
        .json({ status: "ERR", message: "Please fill in all fields" });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "Email is invalid",
      });
    } else if (password !== confirmPassword) {
      return res.status.json({
        status: "ERR",
        message: "Password and Confirm Password are not the same",
      });
    }
    const response = await UserService.createUser(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const createUserNoRegister = async (req, res) => {
  try {
    const image = req.file;
    const { name, email, password, isAdmin, phone, address, city } = req.body;

    let avatar = null;
    if (image) {
      avatar = image.path;
    }

    const data = {
      name,
      email,
      password,
      isAdmin,
      phone,
      address,
      avatar,
      city,
    };

    const newUser = await UserService.createUserNoRegister(data);

    return res.status(201).json({
      status: "OK",
      message: "Create user successfully",
      data: newUser,
    });
  } catch (error) {
    // Nếu upload ảnh thành công nhưng user tạo thất bại thì xóa ảnh
    if (req.file?.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }

    return res.status(400).json({
      status: "ERR",
      message: "Create user failed",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isCheckEmail = reg.test(email);
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "ERR", message: "Please fill in all fields" });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "Email is invalid",
      });
    }
    const response = await UserService.loginUser(req.body);
    const { refresh_token, ...newResponse } = response;
    //
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      samesite: "none",
    });
    return res.status(200).json(newResponse);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const image = req.file; // Có thể undefined nếu không upload ảnh
    const { name, email, password, isAdmin, phone, address, city } = req.body;

    const oldUser = await UserService.getDetailUser(id);
    if (!oldUser) {
      return res.status(404).json({
        status: "ERR",
        message: "User not found",
      });
    }

    let newAvatar = oldUser?.data?.avatar || null;

    // Nếu có ảnh mới và ảnh cũ tồn tại thì xóa ảnh cũ khỏi Cloudinary
    if (image) {
      if (oldUser?.data?.avatar) {
        const parts = oldUser.data.avatar.split("/upload/");
        if (parts.length === 2) {
          const imagePath = parts[1].split(".")[0];
          const publicId = imagePath.split("/").slice(1).join("/");
          await cloudinary.uploader.destroy(publicId);
        }
      }

      newAvatar = image.path; // Cập nhật avatar mới
    }

    const data = {
      name,
      email,
      password,
      isAdmin,
      phone,
      address,
      avatar: newAvatar,
      city,
    };

    await UserService.updateUser(id, data);
    return res.status(200).json({
      status: "OK",
      message: "Update user successfully",
    });
  } catch (error) {
    if (req.file?.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }

    return res.status(400).json({
      status: "ERR",
      message: "Update user failed",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserService.getDetailUser(id);
    if (!user) {
      return res.status(404).json({
        status: "ERR",
        message: "User not found",
      });
    }

    // Xoá avatar nếu tồn tại
    const avatarUrl = user?.data?.avatar;
    if (avatarUrl) {
      const parts = avatarUrl.split("/upload/");
      if (parts.length === 2) {
        const imagePath = parts[1].split(".")[0];
        const publicId = imagePath.split("/").slice(1).join("/");
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await UserService.deleteUser(id);
    return res.status(200).json({
      status: "OK",
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: "ERR",
      message: "Delete user failed",
      error: error.message,
    });
  }
};

const deleteManyUser = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        status: "ERR",
        message: 'The "ids" field is required and must be a non-empty array',
      });
    }

    // Lấy chi tiết user và xóa avatar trên Cloudinary nếu có
    const users = await Promise.all(
      ids.map((id) => UserService.getDetailUser(id))
    );

    // Xóa avatar từ Cloudinary nếu có
    for (const user of users) {
      if (user && user.data && user.data.avatar) {
        const avatarUrl = user.data.avatar;
        const parts = avatarUrl.split("/upload/");
        if (parts.length === 2) {
          const imagePath = parts[1].split(".")[0];
          const publicId = imagePath.split("/").slice(1).join("/");
          console.log("Xóa avatar có publicId:", publicId);
          await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    // Xóa users trong database
    const response = await UserService.deleteMany({ ids });

    return res.status(200).json({
      status: "OK",
      message: response.message, // Thông báo trả về từ service
      data: response,
    });
  } catch (error) {
    console.error("Delete many users failed:", error);
    return res.status(500).json({
      status: "ERR",
      message: "Failed to delete users",
      error: error.message,
    });
  }
};


const getAllUser = async (req, res) => {
  try {
    const response = await UserService.getAllUser();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      status: "ERR",
      message: error.message,
    });
  }
};

const getDetailUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await UserService.getDetailUser(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      status: "ERR",
      message: error.message,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refresh_token;
    if (token) {
      return res.status(200).json({
        status: "ERR",
        message: "The token is required",
      });
    }
    const response = await JwtService.refreshJWTServiceToken(token);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      status: "ERR",
      message: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({
      status: "OK",
      message: "Logout success",
    });
  } catch (error) {
    return res.status(404).json({
      status: "ERR",
      message: error.message,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailUser,
  refreshToken,
  logoutUser,
  deleteManyUser,
  createUserNoRegister,
};
