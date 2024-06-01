import { faMinus, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { db } from '../../../firebase/config';
import { Spinning } from '../../../animation-loading'
import OrderDetailAdmin from './OrderDetailAdmin';
import Pagination from '../../pagination/Pagination';
import { toast } from 'react-toastify';
import { getCommonTypeAction, getOrdersAction } from '../../../services/services';

const solvePrice = (price) => {
  return Number(price).toLocaleString('vi-VN');
}


const itemsPerPage = 5;
const quantity = 3;

const ViewOrders = () => {
  
  const [orderID, setOrderID] = useState('')
  const [orderDetailAdmin, setOrderDetailAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [allOrders, setAllOrders] = useState(true)
  const [allOrdersSort, setAllOrdersSort] = useState([])
  const navigate = useNavigate()
  //
  const [currentPage, setCurrentPage] = useState(1)
  const [pageProducts, setPageProducts] = useState([]); //products every page (use slice to cut all 
  //
  const [notFound, setFound] = useState(false)
  const filterRef = useRef()
  const queryRef = useRef()
  const paymentTypeRef = useRef()



  const getOrders = async () => {
    setLoading(true)
    try {
      
      
    getOrdersAction()
    .then(res => {
      console.log(res.data)
      setTimeout(() => {
        setAllOrders(res.data)
        setAllOrdersSort(res.data)
        setPageProducts(res.data.slice(0, itemsPerPage))
      }, 500)
  
    })
    .catch(err => {
      toast.error("Lỗi lấy đơn hàng", 
        {
          autoClose: 1000
        }
      )
    })
    .finally(()=>{
      setLoading(false)
    })
      // setTimeout(() => {
      //   setLoading(false)
      //   setAllOrders(allOrdersConverted)
      //   setAllOrdersSort(allOrdersConverted)
      //   setPageProducts(allOrdersConverted.slice(0, itemsPerPage))
      // }, 500)
    }
    catch (e) {
      console.log(e.message);
    }
  }

  const handleFilterOrder = (e) => {

    const status = filterRef.current.value
    const paymentType = paymentTypeRef.current.value

    console.log(status, paymentType)

    if (status == 'all' && paymentType == 'all'){
      setAllOrdersSort(allOrders)
    } else {
      setAllOrdersSort([...allOrders].filter(item => ((status == 'all' || item.status === status) && (paymentType == 'all' || item.paymentType == paymentType))));
    }

    setCurrentPage(1)
  }

  const solveQuery = (value) => {
    //1 la a[..] > b[...]
    //-1 ..
    switch (value) {
      case 'latest':
        return {
          field: 'creatAt',
          order: -1
        }
      case 'oldest':
        return {
          field: 'creatAt',
          order: 1
        }
      default:
        break;
    }
  }

  const handleQueryOrder = (e) => {
    if (e.target.value !== 'default') {
      const { field, order } = solveQuery(e.target.value)
      setAllOrdersSort([...allOrdersSort].sort((a, b) => {
        if ((new Date(a[field])) > (new Date(b[field]))) return order
        return (order) * (-1)
      }));
    }
  }

  const formatDate = (str) =>{
    let arr = str.split("T")
    let strDate = arr[0].split("-").reverse().reduce((cur, item) => cur + item +'/', "")
    strDate = strDate.slice(0, 10)
    let strHour = arr[1].split(":").reduce((cur, item) => cur + item +':', "")
    strHour = strHour.slice(0, 8)
    return [strDate ,strHour];
  }

  useEffect(() => {
    getOrders()
    setOrderDetailAdmin(false)
  }, [])


  console.log("products: ", allOrdersSort)

  return (
    <>
          <div className="">
            <div className="h-full">
              <div className="flex gap-4 mb-4 w-full items-center justify-end">
                <div className='text-bgPrimary text-[16px] flex items-center'>
                  <p className='font-bold inline-block text-[16px]'>Số lượng</p>
                  : {notFound ? "0" : allOrdersSort.length} đơn hàng
                </div>
                <div className="">
                  <select
                    ref={filterRef}
                    onChange={handleFilterOrder}
                    className='outline-none bg-slate-100 px-3 py-2 text-bgPrimary cursor-pointer border border-solid border-[#ddd] inline-block'
                    name="status" id="">
                    <option key='1' selected value="all">Tình trạng: Tất cả</option>
                    <option key='2' value="Pending">Pending</option>
                    <option key='3' value="Shipping">Shipping</option>
                    <option key='4' value="Shipped">Shipped</option>
                    <option key='5' value="Pending Cancellation">Pending Cancellation</option>
                    <option key='6' value="Cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div className="mx-2">
                  <select
                    ref={paymentTypeRef}
                    onChange={handleFilterOrder}
                    className='outline-none bg-slate-100 px-3 py-2 text-bgPrimary cursor-pointer border border-solid border-[#ddd] inline-block'
                    name="paymentType" id="">
                    <option key='1' selected value="all">PTTT: Tất cả</option>
                    <option key='2' value="Cash on delivery">Cash on delivery</option>
                    <option key='3' value="Internet banking">Internet banking</option>
                  </select>
                </div>
                <div className="">
                  <select
                    ref={queryRef}
                    onChange={handleQueryOrder}
                    className='outline-none bg-slate-100 px-3 py-2 text-bgPrimary cursor-pointer border border-solid border-[#ddd] shadow-shadowSearch'
                    name="sort-by" id="">
                    <option key='0' value="default">Sắp xếp đơn hàng theo</option>
                    <option key='1' value="latest">Mới nhất</option>
                    <option key='2' value="oldest">Cũ nhất</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto shadow-shadowPrimary px-3 rounded-md w-full">
                <table className='w-full'>
                  <thead>
                    <tr className={`${!loading && allOrders.length > 0 && 'border-[3px] border-transparent border-b-[#ececec]'} grid grid-cols-14 grid-rows-1 text-[12px] font-bold py-4 uppercase tracking-wider`}>
                      <td className='col-span-2'>Họ tên</td>
                      <td className='col-span-3'>Địa chỉ</td>
                      <td className='col-span-2'>SĐT</td>
                      <td className='col-span-2'>Ngày đặt</td>
                      <td className='col-span-1'>Tình trạng</td>
                      <td className='col-span-1'>PT thanh toán</td>
                      <td className='col-span-1'>Tổng</td>
                      <td className='col-span-2'>Hành động</td>
                    </tr>
                  </thead>
                  <tbody style={{
                    height: `${loading ? '0' : itemsPerPage * 70 + 20}px`
                  }}>
                    {!loading && allOrders.length === 0 && (
                      <div className="w-full h-full flex flex-col gap-4 mt-8 items-center">
                        <div
                          style={{
                            backgroundImage: "url('/emptyOrder.jpg')"
                          }}
                          className="w-[220px] h-[250px] bg-cover bg-no-repeat bg-center"></div>
                        <div className='text-center text-[18px] font-bold text-bgPrimary leading-[32px] uppercase'>Chưa có đơn hàng nào được tạo ra
                        </div>
                      </div>
                    )}
                    {!loading
                      && (
                        (pageProducts.length === 0 && allOrders.length > 0)
                          ? (
                            <div className="w-full flex flex-col gap-4 items-center mt-8">
                              <div
                                style={{
                                  backgroundImage: "url('/emptyOrder.jpg')"
                                }}
                                className="w-[220px] h-[250px] bg-cover bg-no-repeat bg-center"></div>
                              <div className='text-center text-[18px] font-bold text-bgPrimary leading-[32px] uppercase'>
                                Chưa có đơn hàng nào
                                <p className="inline-block text-primary ml-[6px]">{filterRef.current.value} {paymentTypeRef.current.value == "all" ? "" : "và " +paymentTypeRef.current.value}</p>
                              </div>
                            </div>
                          )
                          : (
                            pageProducts.map((order) => (
                              <tr
                                key={order.id}
                                className='grid grid-cols-14 gap-2 rounded-[4px] h-[70px] border border-transparent border-b-[#ececec]'>
                                <td className='col-span-2 items-center'>
                                  <p className=" text-[12px] flex flex-col line-clamp-2">
                                    {order.customerName}
                                  </p>
                                </td >
                                <td className='col-span-3 flex ' >
                                  <span className='text-[12px] line-clamp-2'>{order.shipAddress}</span>
                                </td >
                                <td className='col-span-2 flex items-center py-2'>
                                  <p className="text-[12px] line-clamp-2">{order.contactNumber}</p>
                                </td>
                                <td className='col-span-2 flex items-center py-2'>
                                  <p className="text-[12px]">
                                    {
                                      formatDate(order.modifiedDate).map(el =>{
                                        return <>{el} <br/></>
                                      })
                                    }
                                  </p>
                                </td>
                                
                                <td className='col-span-1 flex items-center py-2'>
                                  <p className={`text-[12px] font-medium ${order.status == 'Pending' ? "text-cyan-600" : "" } ${order.status == 'Shipping' ? "text-orange-600" : "" } ${order.status == 'Shipped' ? "text-emerald-600" : "" } ${order.status == 'Cancelled' ? "text-slate-600" : "" } `}>{order.status}</p>
                                </td>
                                
                                
                                <td className='col-span-1 flex items-center py-2'>
                                  <p className={`text-[12px]  font-medium ${order.paymentType == 'Cash on delivery' ? "text-yellow-600" : "" } ${order.paymentType == 'Internet banking' ? "text-sky-600" : "" }  }  `}>{order.paymentType}</p>
                                </td>

                                <td className='col-span-1 flex items-center py-2'>
                                  <p className={`text-[12px] font-medium`}>{order.total.toLocaleString()}</p>
                                </td>
                                

                                <td className='col-span-2 flex items-center font-bold'>
                                  <button
                                    onClick={(e) => {
                                      setOrderID(order.id)
                                      setOrderDetailAdmin(true)
                                      navigate(`/admin/view-order-details/${order.id}`)
                                    }}
                                    className='bg-primary text-white px-2 py-1 hover:bg-[#a40206] transition-all ease-linear duration-[120ms]'>
                                    <span className='tracking-wider uppercase text-[12px] font-medium'>Xem chi tiết</span>
                                  </button>
                                </td>
                              </tr>
                            ))
                          )
                      )}
                  </tbody>
                </table>
              </div>
              {loading && (
                <div className="w-full h-[350px]">
                  <Spinning color='#1f2028' size='30px' />
                </div>
              )}
            </div>
            {!loading && allOrders.length !== 0 && (
              <div className="">
                <Pagination
                  products={allOrdersSort}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  quantity={quantity}
                  setPageProducts={setPageProducts} />
              </div>
            )}
          </div>
    </>
  );
};

export default ViewOrders;