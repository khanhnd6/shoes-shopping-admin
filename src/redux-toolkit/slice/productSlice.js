import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  products: [],
  girlProducts: [],
  boyProducts: [],
  childProducts: [],
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    STORE_PRODUCTS: (state, action) => {
      state.products = action.payload
      // console.log('Store Products: ', state.products);
    },
    STORE_GIRL_PRODUCTS: (state, action) => {
      state.girlProducts = action.payload
      // console.log(state.girlProducts);
    },
    STORE_BOY_PRODUCTS: (state, action) => {
      state.boyProducts = action.payload
      // console.log(state.boyProducts);
    },
    STORE_CHILD_PRODUCTS: (state, action) => {
      state.childProducts = action.payload
      // console.log(state.childProducts);
    },
  }
})

export const { STORE_PRODUCTS, STORE_GIRL_PRODUCTS, STORE_BOY_PRODUCTS, STORE_CHILD_PRODUCTS } = productSlice.actions
export const selectProducts = (state) => state.product.products
export const selectGirlProducts = (state) => state.product.girlProducts
export const selectBoyProducts = (state) => state.product.boyProducts
export const selectChildProducts = (state) => state.product.childProducts
export default productSlice.reducer
