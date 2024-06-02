import React, { useEffect, useState } from 'react';
import BgHomeAdmin from './BgHomeAdmin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faDollarSign, faTruck, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { Skeleton } from '../../../animation-loading';
import { adminAccount } from '../../../AdminAccount';
import { getOrdersAction, getProductAction, getReportAction, getUserAction } from '../../../services/services';

import ButtonPrimary from '../../button/ButtonPrimary';
import DashBoardChart from './DashBoardChart';

const solvePrice = (price) => {
  return Number(price).toLocaleString('vi-VN');
}

const HomeAdmin = () => {
  const [loading, setLoading] = useState(true)
  const [allUsers, setAllUsers] = useState(null)
  const [allProducts, setAllProducts] = useState(null)
  const [allOrders, setAllOrders] = useState(null)
  const [total, setTotal] = useState(0)
  const [data, setData] = useState(null)

  const [filter, setFilter] = useState({fromdate: new Date(), todate: new Date(), type: 1})

  const getUsers = async () => {
    getUserAction()
      .then(res => {
        setAllUsers(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }


  const getReportHandler = async(fromdate, todate, type) => {
    getReportAction(fromdate, todate, type)
    .then(res => {
      console.log("res.data", res.data)
      setData(res.data)
    })
    .catch(err => {
      console.log(err)  
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("filter", filter)
    await getReportHandler(filter.fromdate, filter.todate, filter.type)
  }

  const getProducts = async () => {
    getProductAction()
      .then(res => {
        setAllProducts(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const getOrders = async () => {
    getOrdersAction()
      .then(res => {
        setAllOrders(res.data)
        setTotal(res.data.reduce((total, cur) => total + cur.total, 0))
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      Promise.all([getProducts(), getUsers(), getOrders(), getReportHandler(filter.fromdate, filter.todate, filter.type)]).finally(() => {
        setLoading(false);
      });
    }, 1000)
  }, []);

  console.log(allProducts, allUsers, allOrders, data)


  return (
    <div className="w-full h-full flex flex-col gap-5">
      <div className="w-full h-[150px] flex gap-6">

        <Skeleton loading={loading} className={`flex-1 ${loading && 'overflow-hidden'}`}>
          <div className="relative flex-1 h-full shadow-shadowHover rounded-tl-[12px] rounded-tr-[12px] border-l-0 border-r-0 flex justify-center items-center gap-4 border-[6px] border-transparent border-b-[#f25a7f]">
            {!loading && (
              <div className="absolute left-[50%] top-0 translate-x-[-50%] translate-y-[-25%] w-[55px] aspect-square rounded-full bg-[#f25a7f]/80 flex items-center justify-center">
                <FontAwesomeIcon className='text-[20px] text-white' icon={faUserPlus} />
              </div>
            )}
            <div className="flex flex-col items-center mt-6">
              <p className="text-[24px] font-medium">{allUsers?.length}</p>
              <span className="text-[14px] text-[#666] tracking-wider">Khách hàng</span>
            </div>
          </div>
        </Skeleton>

        <Skeleton loading={loading} className={`flex-1 ${loading && 'overflow-hidden'}`}>
          <div className="relative flex-1 h-full shadow-shadowHover rounded-tl-[12px] rounded-tr-[12px] border-l-0 border-r-0 flex justify-center items-center gap-4 border-[6px] border-transparent border-b-[#5183cb]">
            {!loading && (
              <div className="absolute left-[50%] top-0 translate-x-[-50%] translate-y-[-25%] w-[55px] aspect-square rounded-full bg-[#5183cb]/80 flex items-center justify-center">
                <FontAwesomeIcon className='text-[20px] text-white' icon={faCartShopping} />
              </div>
            )}
            <div className="flex flex-col items-center mt-6">
              <p className="text-[24px] font-medium">{allProducts?.total}</p>
              <span className="text-[14px] text-[#666] tracking-wider">Sản phẩm</span>
            </div>
          </div>
        </Skeleton>

        <Skeleton loading={loading} className={`flex-1 ${loading && 'overflow-hidden'}`}>
          <div className="relative flex-1 h-full shadow-shadowHover rounded-tl-[12px] rounded-tr-[12px] border-l-0 border-r-0 flex justify-center items-center gap-4 border-[6px] border-transparent border-b-[#fb963a]">
            {!loading && (
              <div className="absolute left-[50%] top-0 translate-x-[-50%] translate-y-[-25%] w-[55px] aspect-square rounded-full bg-[#fb963a]/80 flex items-center justify-center">
                <FontAwesomeIcon className='text-[20px] text-white' icon={faTruck} />
              </div>
            )}
            <div className="flex flex-col items-center mt-6">
              <p className="text-[24px] font-medium">{allOrders?.length}</p>
              <span className="text-[14px] text-[#666] tracking-wider">Đơn hàng</span>
            </div>
          </div>
        </Skeleton>

        <Skeleton loading={loading} className={`flex-1 ${loading && 'overflow-hidden'}`}>
          <div className="relative flex-1 h-full shadow-shadowHover rounded-tl-[12px] rounded-tr-[12px] border-l-0 border-r-0 flex justify-center items-center gap-4 border-[6px] border-transparent border-b-[#fe5c3a]">
            {!loading && (
              <div className="absolute left-[50%] top-0 translate-x-[-50%] translate-y-[-25%] w-[55px] aspect-square rounded-full bg-[#fe5c3a]/80 flex items-center justify-center">
                <FontAwesomeIcon className='text-[20px] text-white' icon={faDollarSign} />
              </div>
            )}
            <div className="flex flex-col items-center mt-6">
              {solvePrice(total)}
              <span className="text-[14px] text-[#666] tracking-wider">Doanh thu (VNĐ)</span>
            </div>
          </div>
        </Skeleton>
      </div>
      <div className="w-full flex-1 rounded-[12px]">

          <div className='w-full'>
            <h2 className='font-medium text-center py-[20px] text-2xl'>Báo cáo thống kê đơn hàng</h2>
            <form onSubmit={handleSubmit}>

              <div className='flex flex-row w-full align-center p-2'>
                <div className='w-1/3 m-[10px]'>
                  <label className='font-medium'>Từ ngày: </label>
                  <input required value={filter.fromdate} onChange={(e)=>{setFilter({...filter, fromdate: e.target.value})}} type="date" className='bg-white' />
                </div>
                <div className='w-1/3 m-[10px]'>
                  <label className='font-medium'>Đến ngày: </label>
                  <input required  value={filter.todate} onChange={(e)=>{setFilter({...filter, todate: e.target.value})}} type="date" className='bg-white' />
                </div>
                <div className='w-1/3 m-[10px]'>
                  <label className='font-medium'>Lọc theo: </label>
                  <select required value={filter.type} onChange={(e) => setFilter({...filter, type: e.target.value}) } >
                    <option selected value="1">Nhà cung cấp</option>
                    <option value="0">Loại sản phẩm</option>
                  </select>
                </div>
                
                
                <ButtonPrimary text="Xác nhận" className="mb-[10px]" loading = {loading}  onClick = {(e)=>{}} />
              </div>
            </form>

            <div className='w-full'>
              { data && data.orderItems && 
                <table className="table-fixed w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 font-medium">
                      <tr>
                          <th scope="col" className="px-2 py-3 whitespace-nowrap w-5 border border-1 border-current">
                            STT
                          </th>
                          <th scope="col" className="px-2 py-3 whitespace-nowrap w-10 border border-1 border-current">
                            Mã
                          </th>
                          <th scope="col" className="px-2 py-3 whitespace-nowrap w-20 border border-1 border-current">
                            Tên SP
                          </th>

                          <th scope="col" className="px-2 py-3 whitespace-nowrap w-10 border border-1 border-current">
                            Giá
                          </th>
                          <th scope="col" className="px-2 py-3 whitespace-nowrap w-10 border border-1 border-current">
                            Giảm
                          </th>
                          
                          <th scope="col" className="px-2 py-3 whitespace-nowrap w-5 border border-1 border-current">
                            Số<br/>
                            lượng
                          </th>

                          <th scope="col" className="px-2 py-3 whitespace-nowrap w-10 border border-1 border-current">
                            Doanh thu<br/>ước lượng
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                    {data && data.orderItems && data.orderItems.map((el, idx) => {
                      return <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td scope="col" className="px-2 py-3 whitespace-nowrap w-20 border border-1 text-center border-current">
                        {idx+1}
                      </td>
                      <td scope="col" className="px-2 py-3 whitespace-nowrap w-20 border border-1 border-current">
                        {el.code}
                      </td>
                      <td scope="col" className="px-2 py-3 whitespace-nowrap w-20 border border-1 border-current overflow-hidden">
                        {el.productName}
                      </td>
                      <td scope="col" className="px-2 py-3 whitespace-nowrap w-20 border border-1 border-current">
                        {el.price} {el.unitPrice}
                      </td>
                      <td scope="col" className="px-2 py-3 whitespace-nowrap w-20 border border-1 border-current">
                        {!!el.discount ? parseFloat(el.discount) * 100 + "%": 0}
                      </td>
                      <td scope="col" className="px-2 py-3 whitespace-nowrap w-20 border border-1 border-current">
                        {el.quantity}
                      </td>
                      <td scope="col" className="px-2 py-3 whitespace-nowrap w-20 border border-1 border-current">
                        {(el.quantity * el.price * (1- (!!el.discount ? parseFloat(el.discount): 0) )).toLocaleString()} {el.unitPrice}
                      </td>
                    </tr>
                    })}
                  </tbody>
              </table>
              }
            </div>

          </div>

        {data && <DashBoardChart data={data} />}
      </div>
    </div>
  );
};

export default HomeAdmin;