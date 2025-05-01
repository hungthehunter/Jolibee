import axios from "axios";

export const axiosJWT = axios.create();

export const loginUser = async (data) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL_BACKEND}/user/sign-in`,
    data
  );
  return res.data;
};

export const signupUser = async (data) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL_BACKEND}/user/sign-up`,
    data
  );
  return res.data;
};

export const createUser = async (data) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL_BACKEND}/user/create-user`,
    data
  );
  return res.data;
};

export const getDetailUser = async (id, access_token) => {
  const res = await axiosJWT.get(
    `${import.meta.env.VITE_API_URL_BACKEND}/user/get-details/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const refreshToken = async (refreshToken) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_BACKEND}/user/refresh-token`,
      {}, // nếu không cần body
      {
        headers:{
          token: `Bearer ${refreshToken}`,
        } 
      }
    );
    return res.data;
  } catch (err) {
    console.error("Refresh token error:", err);
    return null;
  }
};

export const logoutUser = async () => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL_BACKEND}/user/log-out`
  );
  return res.data;
};

export const updateUser = async (id, formData, access_token) => {
  const res = await axiosJWT.put(
    `${import.meta.env.VITE_API_URL_BACKEND}/user/update-user/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllUser = async (access_token) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL_BACKEND}/user/get-all`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteUser = async (id, access_token) => {
  return axios.delete(
    `${import.meta.env.VITE_API_URL_BACKEND}/user/delete-user/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
};

export const deleteManyUser = async (ids, access_token) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL_BACKEND}/user/delete-many`,
      { ids },
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
    console.log("API response:", response); // Log phản hồi API để kiểm tra
    return response.data;
  } catch (error) {
    console.error("Error deleting users:", error);
    throw error; // Đảm bảo ném lỗi nếu có vấn đề
  }
};
