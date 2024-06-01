
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NavAdmin from './nav/NavAdmin';
import HomeAdmin from './home/HomeAdmin';
import ViewProducts from './viewProducts/ViewProducts';
import AddProduct from './addProduct/AddProduct';
import ViewOrders from './viewOrders/ViewOrders';
import ViewUsers from './viewUsers/ViewUsers';
import OrderDetailAdmin from './viewOrders/OrderDetailAdmin';

const Admin = () => {

  return (
    <div className='w-full bg-white py-[35px] px-[15px]'>
      <div className="max-w-[1230px] min-h-[600px] bg-[#fff] mx-auto rounded-[12px] flex shadow-shadowAuth">
        <NavAdmin />
        <div className="rounded-tr-[12px] rounded-br-[12px] flex-1 px-[25px] pt-[20px] pb-5">
          <Routes>
            <Route path='' element={<HomeAdmin />} />
            <Route path='home' element={<HomeAdmin />} />
            <Route path='view-users' element={<ViewUsers />} />
            <Route path='view-products' element={<ViewProducts />} />
            <Route path='add-product' element={<AddProduct type = "ADD" />} />
            <Route path='edit-product/:code' element={<AddProduct type = "EDIT" />} />
            <Route path='view-orders' element={<ViewOrders />} />
            <Route path='view-order-details/:orderId' element={<OrderDetailAdmin />} />
          </Routes>
        </div>

      </div>
    </div>
  );
};

export default Admin;