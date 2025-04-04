const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { generalAccessToken, generalRefreshToken } = require("./JwtService");
const { default: mongoose } = require("mongoose");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, phone } = newUser;
    try {
      const checkUser = await User.findOne({
        email: email,
      });

      if (checkUser !== null) {
        resolve({
          status: "OK",
          message: "The email is already",
        });
      }
      const hash = bcrypt.hashSync(password, 10);
      const createdUser = await User.create({
        name,
        email,
        password: hash,
        phone,
      });
      if (createUser) {
        resolve({
          status: "OK",
          message: "User created successfully",
          data: createdUser,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      const comparedPassword = bcrypt.compareSync(password, checkUser.password);
      if (checkUser)
        if (!comparedPassword) {
          resolve({
            status: "OK",
            message: "The password is  incorrect",
          });
        }
      const access_token = await generalAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });

      const refresh_token = await generalRefreshToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });

      resolve({
        status: "OK",
        message: "SUCCESS",
        access_token,
        refresh_token,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({_id: mongoose.Types.ObjectId(id)});
      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      } else {
        const updateUser = await User.findByIdAndUpdate(id, data, {
          new: true,
        });
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: updateUser,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkedUser = await User.findOne({ _id: id});

      if (checkedUser === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      await User.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "SUCCESS",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find();
      resolve({
        status: "OK",
        message: "Get all user successfully",
        data: allUser,
      });
    } catch (error) {
      reject({
        status: "OK",
        message: error.message,
      });
    }
  });
};

const getDetailUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ _id: id });
      if (user === null) {
      resolve({
          status: "OK",
          message: "The user is not defined",
        });}
      resolve({
        status: "OK",
        message: "Get user successfully",
        data: user,
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: error.message,
      });
    }
  });
};

const refreshToken = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN);
      const access_token = await generalAccessToken({
        id: decoded.id,
        isAdmin: decoded.isAdmin,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        access_token,
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: error.message,
      });
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailUser,
  refreshToken,
};
