import React, { useState } from "react";
import "./index.scss"; //tailwindcss
import "./App.css"; //reset css

import { Header, Footer, Auth, Admin } from "./components";
import {
  Home,
  GirlShoes,
  BoyShoes,
  ChildShoes,
  Page404,
  ProductDetail,
  Cart,
  CheckOut,
  CheckoutSuccess,
  MyOrder,
  SearchResult,
} from "./pages";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import InfoAccount from "./pages/infoAccount/InfoAccount";
import { PermissionDenied } from "./components/admin";
import OverlayProduct from "./pages/productDetail/OverlayProduct";
import OrderDetail from "./pages/myOrder/OrderDetail";

//LƯU Ý: đang set height cho body là 300vh để xuất hiện thanh scroll
const App = () => {
  
  const [logined, setLogined] = useState(
    localStorage.getItem("logined") === "true" ? true : false
  );

  return (
    <>
      <BrowserRouter>
        <ToastContainer
          style={{
            zIndex: 999999,
          }}
        />
        <Routes>
          <Route
            path="/dang-nhap"
            element={logined ? <Navigate to="/admin" /> : <Auth />}
          />
          <Route
            path="/admin/*"
            element={logined ? <Admin /> : <Auth />}
          />
          <Route path="/*" element={logined ? <Page404></Page404> : <Navigate to="/admin" />}></Route>
        </Routes>

        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
