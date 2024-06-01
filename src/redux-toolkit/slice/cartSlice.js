import { createSlice } from "@reduxjs/toolkit"
import { addDoc, collection } from "firebase/firestore"
import { toast } from "react-toastify"
import { db } from "../../firebase/config"


//CÁI REDUX NÀY CHỈ ĐỂ CHỨA {
// SẢN PHẨM,
// SỐ LƯỢNG CỦA SẢN PHẨM ĐÓ
// } (MỖI USER SẼ LÀ 1 REDUX RIÊNG)
const initialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  cartTotalPayment: 0
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    CAlC_TOTAL_PAYMENT: (state, action) => {
      state.cartTotalPayment = action.payload
    }
    // ADD_TO_CART: (state, action) => {
    //   console.log(action.payload);
    //   // action.payload.quantity là số lượng tăng thêm
    //   const productIndex = state.cartItems.findIndex(item => item.id === action.payload.product.id)
    //   console.log('productIndex: ', productIndex);
    //   if (productIndex < 0) {
    //     state.cartItems.push({
    //       ...action.payload.product,
    //       quantity: 1
    //     })
    //   } else {
    //     state.cartItems[productIndex] = {
    //       ...action.payload.product,
    //       quantity: state.cartItems[productIndex].quantity + action.payload.quantity
    //     }
    //   }
    //   toast.success(`Sản phẩm đã được thêm vào giỏ hàng`, {
    //     position: "top-left",
    //     autoClose: 1200
    //   })
    //   localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    // },

    // REMOVE_FROM_CART: (state, action) => {
    //   const newCartItems = state.cartItems.filter(item => item.id !== action.payload)
    //   state.cartItems = newCartItems
    //   toast.success(`Xóa sản phảm khỏi giỏ hàng thành công`, {
    //     position: "top-left",
    //     autoClose: 1200
    //   })
    //   localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    // }
  }
})

// export const { ADD_TO_CART, REMOVE_FROM_CART } = cartSlice.actions
export const { CAlC_TOTAL_PAYMENT } = cartSlice.actions
export const selectTotalPayment = (state) => state.cart.cartTotalPayment
export const selectCartItems = (state) => state.cart.cartItems
export const selectCartTotalQuantity = (state) => state.cart.cartTotalQuantity
export const selectCartTotalAmount = (state) => state.cart.cartTotalAmount
export default cartSlice.reducer
