const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService")
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

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isCheckEmail = reg.test(email);
    if (!email || !password) {
      return res
        .status(200)
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
      samesite: 'strict',
    });
    return res.status(200).json(newResponse);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status.json({
        status: "ERR",
        message: "The userId is required ",
      });
    }
    const response = await UserService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(404).json({
        status: "ERR",
        message: "the userId is required",
      });
    }
    const response = await UserService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      status: "ERR",
      message: error.message,
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
      status:"ERR",
      message: 'The token is required'
    })
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

const logoutUser = async(req,res) => {
  try {
    res.clearCookies('refresh_token');
    return res.status(200).json({
      status: 'OK',
      message: 'Logout success'
    });
  } catch (error) {
    return res.status(404).json({
      status: 'ERR',
      message: error.message
    })
  }
}

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailUser,
  refreshToken,
  logoutUser
};
