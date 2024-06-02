import React, { useEffect, useState } from 'react';
import BgHomeAdmin from './BgHomeAdmin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faDollarSign, faTruck, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { Skeleton } from '../../../animation-loading';
import { adminAccount } from '../../../AdminAccount';
import { getOrdersAction, getProductAction, getUserAction } from '../../../services/services';

const solvePrice = (price) => {
  return Number(price).toLocaleString('vi-VN');
}

const HomeAdmin = () => {
  const [loading, setLoading] = useState(true)
  const [allUsers, setAllUsers] = useState(null)
  const [allProducts, setAllProducts] = useState(null)
  const [allOrders, setAllOrders] = useState(null)
  const [total, setTotal] = useState(0)

  const getUsers = async () => {
    getUserAction()
      .then(res => {
        setAllUsers(res.data)
      })
      .catch(err => {
        console.log(err)
      })
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

        let iTotal = res.data.reduce((total, curr) => total + (!curr.total ? 0 : curr.total), 0)
        setTotal(iTotal)

      })
      .catch(err => {
        console.log(err)
      })
  }

  // useEffect(() => {
  //   (async function () {
  //     setLoading(true);
  //     await getProducts()
  //     await getUsers()
  //     await getOrders()
  //     setTimeout(() => {
  //       setLoading(false)
  //     }, 1000)
  //   })()
  // }, [])

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      Promise.all([getProducts(), getUsers(), getOrders()]).finally(() => {
        setLoading(false);
      });
    }, 1000)
  }, []);

  console.log(allProducts, allUsers, allOrders)


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
      <div className="w-full bg-red-600 flex-1 rounded-[12px]"></div>
    </div>
  );
};

export default HomeAdmin;