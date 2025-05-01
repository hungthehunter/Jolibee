export const getAllProduct = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL_BACKEND}/product/get-all`
  );
  return res.data;
};
export const isJsonString = (data) => {
  try {
    JSON.parse(data);
  } catch (e) {
    return false;
  }
  return true;
};

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

export const renderOptions = (arr) => {
  let results = [];
  if (arr) {
    results = arr?.map((opt) => {
      return {
        value: opt,
        label: opt,
      };
    });
  }
  return results;
};


import { createContext, useContext } from "react";

export const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);