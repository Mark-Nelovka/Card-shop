import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  product: [],
  isLoading: false,
  category: [],
  price: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  extraReducers: {},
});

export default productSlice.reducer;
