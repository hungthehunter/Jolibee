import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  phone: "",
  email: "",
  address: "",
  id: "",
  avatar: "",
  access_token: "",
  isAdmin: false,
  city: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const {_id="",name="", email="", address="", phone="", avatar="", access_token="",isAdmin,city="",refresh_token=""} = action.payload;
      state.name = name;
      state.email = email;
      state.address = address;
      state.phone = phone;
      state.avatar = avatar;
      state.id = _id;
      state.access_token = access_token;
      state.isAdmin = isAdmin;
      state.city=city;
      state.refresh_token=refresh_token
      state.access_token = access_token
    },
    resetUser : (state) => {
      state.name = "";
      state.email = "";
      state.access_token = "";
      state.address = "";
      state.phone = "";
      state.avatar = "";
      state.id = "";
      state.isAdmin = false;
      state.city="";
      state.refresh_token="";
      state.access_token = "";
    }
  },
});
export const { updateUser,resetUser } = userSlice.actions;
export default userSlice.reducer;
