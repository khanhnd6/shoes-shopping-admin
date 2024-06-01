//confidureStore.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import productSlice from "./slice/productSlice";
import cartSlice from "./slice/cartSlice";


const rootReducer = combineReducers({
  auth: authSlice,
  product: productSlice,
  cart: cartSlice
  // counter1: counterReducer1
});

const store = configureStore({
  reducer: rootReducer,
  // middleware: (gDM) => gDM().concat(loggerMiddleware)
})
// const loggerMiddleware = (store) => (next) => (action) => {
//   console.log(action);
//   //call next(action) to transfer action to reducer to update state and re-rennder
//   next(action)
// }



// store.subscribe(() => {
//   console.log(`current state ${store.getState().counter.count}`);
// })

// store.dispatch(increment(1))
// store.dispatch(increment(4))
// store.dispatch(increment(5))

export default store;