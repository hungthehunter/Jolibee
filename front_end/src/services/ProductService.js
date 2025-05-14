import axios from "axios";

export const createProduct = async (formData) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL_BACKEND}/product/createProduct`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

export const getDetailsProduct = async (id) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL_BACKEND}/product/get-details/${id}`
  );
  return res.data;
};

export const updateProduct = async (id, formData, access_token) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_URL_BACKEND}/product/updateProduct/${id}`,
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

export const deleteProduct = async (id, access_token) => {
  return axios.delete(
    `${import.meta.env.VITE_API_URL_BACKEND}/product/deleteProduct/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
};

export const deleteManyProduct = async (ids, access_token) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL_BACKEND}/product/delete-many`,
    { ids },
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return response.data;
};

export const getAllType = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL_BACKEND}/product/get-all-type`
  );
  return res.data;
};

export const getAllProduct = async (search, limit, page) => {
  const filter = search?.length > 0 ? JSON.stringify(['type', search]) : null;
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL_BACKEND}/product/get-all`,
    {
      params: {
        limit,
        page,
        filter, 
      },
    }
  );
  return res.data;
};


export const getProductType = async (type, page = 1, limit = 10) => {
  if (type) {
    return await axios.get(
      `${import.meta.env.VITE_API_URL_BACKEND}/product/get-all?filter=type&filter=${type}&limit=${limit}&page=${page}`
    );
  }
};
