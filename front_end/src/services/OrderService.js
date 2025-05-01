import axios from "axios";
import { axiosJWT } from "./UserService";

export const createOrder = async (formData, access_token) => {
  const id = formData.user;
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL_BACKEND}/order/create/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getOrderByUserId = async (id, access_token) => {
  const res = await axiosJWT.get(
    `${import.meta.env.VITE_API_URL_BACKEND}/order/get-all-order-user-id/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const updateOrder = async(id, formData, access_token) => {
  const res = await axiosJWT.put(
    `${import.meta.env.VITE_API_URL_BACKEND}/order/update-order/${id}`,
    formData,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
}


export const getOrderById = async (id, access_token) => {
  const res = await axiosJWT.get(
    `${import.meta.env.VITE_API_URL_BACKEND}/order/get-details-order/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};


export const cancelOrder = async (id, access_token, orderItems) => {
  const res = await axiosJWT.delete(
    `${import.meta.env.VITE_API_URL_BACKEND}/order/cancel-order/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
      data: { orderItems }, 
    }
  );
  return res.data;
};

export const getAllOrder = async() => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL_BACKEND}/order/get-all-order`,
  );
  return res.data;
}
