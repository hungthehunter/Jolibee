import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderItems: [],
  selectedItemOrders: [],
  shippingAddress: {},
  paymentMethod: "",
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  user: "",
  isPaid: false,
  paidAt: "",
  isDelivered: false,
  deliveredAt: "",
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
      const { orderItem } = action.payload;
      const existingItem = state.orderItems.find(
        (item) => item.product === orderItem.product
      );
      if (existingItem) {
        existingItem.amount += orderItem.amount;
      } else {
        state.orderItems.push(orderItem);
      }
    },
    increaseAmount: (state, action) => {
      const { idProduct } = action.payload;
      const item = state.orderItems.find((item) => item.product === idProduct);
      if (item) item.amount++;
    },
    decreaseAmount: (state, action) => {
      const { idProduct } = action.payload;
      const item = state.orderItems.find((item) => item.product === idProduct);
      if (item && item.amount > 1) item.amount--;
    },
    removeOrderProduct: (state, action) => {
      const { idProduct } = action.payload;
      state.orderItems = state.orderItems.filter(
        (item) => item.product !== idProduct
      );
    },

    selectedOrder: (state, action) => {
      const { productId } = action.payload;

      if (state.selectedItemOrders.includes(productId)) {
        state.selectedItemOrders = state.selectedItemOrders.filter(
          (id) => id !== productId
        );
      } else {
        state.selectedItemOrders.push(productId);
      }

      console.log("Updated selectedItemOrders:", state.selectedItemOrders);
    },
    removeSelectedOrders: (state) => {
      state.orderItems = state.orderItems.filter(
        (item) => !state.selectedItemOrders.includes(item.product)
      );
      state.selectedItemOrders = [];
    },
    selectAllOrders: (state) => {
      if (state.selectedItemOrders.length === state.orderItems.length) {
        state.selectedItemOrders = [];
      } else {
        state.selectedItemOrders = state.orderItems.map((item) => item.product);
      }
    },

    clearOrder: (state) => {
      return {
        ...state,
        orderItems: [],
        shippingAddress: {},
        paymentMethod: "",
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
        user: "",
        isPaid: false,
        paidAt: "",
        isDelivered: false,
        deliveredAt: "",
      };
    },
  },
});

export const {
  addOrderProduct,
  increaseAmount,
  decreaseAmount,
  removeOrderProduct,
  clearOrder,
  selectAllOrders,
  selectedOrder,
  removeSelectedOrders,
} = orderSlice.actions;

export default orderSlice.reducer;
