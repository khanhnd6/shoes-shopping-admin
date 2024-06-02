import React, { useEffect, useState } from 'react';
import { OverlayLoading, Skeleton } from '../../../animation-loading';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { NavLink, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectEmail, selectUserName } from '../../../redux-toolkit/slice/authSlice'
import Notiflix from 'notiflix';
import { toast } from 'react-toastify';
import { getCommonTypeAction, getOrderItemsAction, getOrdersAction, updateOrderStatus } from '../../../services/services';

import avt from '../../../avt.png'

const solvePrice = (price) => {
  return Number(price).toLocaleString('vi-VN');
}

const OrderDetailAdmin = () => {

  const {orderId} = useParams()

  const [loading, setLoading] = useState(true)
  
  const [order, setOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [orderStatus, setOrderStatus] = useState([])
  const [currentStatus, setCurrentStatus] = useState(null)


  const [listStatus, setListStatus] = useState([])


  const getOrderStatus = async () => {
    getCommonTypeAction("orderStatus")
      .then(res => {
        setListStatus(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }
  const getOrder = async () => {
    setLoading(true)

    getOrdersAction(orderId)
      .then(res=>{
        setOrder(res.data[0])
        setCurrentStatus(res.data[0].status)
      })
      .catch(err => {
        toast.error("Error: "+ err.message, {autoClose: 1000})
      })
      .finally(()=>{
        setLoading(false)
      })
  }

  const getOrderItems = async () => {
    getOrderItemsAction(orderId)
      .then(res=>{
        let items = res.data;
        items.forEach(el => {
          el.images = []
          if(!!el.path)
            el.images = el.path.split(",")
        });
        console.log("res.data", items)
        setOrderItems(items)
      })
      .catch(err => {
        toast.error("Error: "+ err.message, {autoClose: 1000})
      })
  }

  console.log(orderItems)

  const handleUpdateStatus = async (id, orderStatus) => {
    updateOrderStatus(order.id, order.customerId, orderStatus)
      .then(res => {
        if(res.data.status == 0){
          toast.success("Thay đổi trạng thái thành công", {autoClose: 1000})
        } else {
          
          toast.error("Thay đổi trạng thái không thành công", {autoClose: 1000})
        }
      })
      .catch(err => {
        toast.error("Có lỗi xảy ra", {autoClose: 1000})
      })
  }

  
  const formatDate = (str) => {
    let arr = str.split("T")
    let strDate = arr[0].split("-").reverse().reduce((cur, item) => cur + item +'/', "")
    strDate = strDate.slice(0, 10)
    let strHour = arr[1].split(":").reduce((cur, item) => cur + item +':', "")
    strHour = strHour.slice(0, 8)
    return [strDate, "|" ,strHour];
  } 

  const confirmUpdateStatus = async (id, orderStatus, val) => {
    Notiflix.Confirm.show(
      'Cập nhật tình trạng đơn hàng',
      'Bạn có muốn cập nhật tình trạng đơn hàng?',
      'Cập nhật',
      'Hủy bỏ',
      function okCb() {
        setCurrentStatus(val)
        handleUpdateStatus(id, orderStatus)
      },
      function cancelCb() {
        console.log();
      },
      {
        zindex: 2000,
        width: '352px',
        zindex: 999999,
        fontFamily: 'Roboto',
        borderRadius: '4px',
        titleFontSize: '18px',
        titleColor: '#c30005',
        messageFontSize: '16px',
        cssAnimationDuration: 300,
        cssAnimationStyle: 'zoom',
        buttonsFontSize: '16px',
        okButtonBackground: '#c30005',
        cancelButtonBackground: '#a5a3a3',
        backgroundColor: '##d8d8d8',
        backOverlayColor: 'rgba(0,0,0,0.4)',
      },
    );
  }

  const handleChangeStatus = (e) => {
    console.log(e.target.value)
  }

  useEffect(() => {
    getOrder()
    getOrderItems()
    getOrderStatus()
  }, [])

  console.log("order: ", order)


  return (
    <>
      {!!order &&  <OverlayLoading loading={loading}>
        <div className={`w-full h-auto ${loading && 'blur-[2px]'}`}>
          <div className="max-w-[1230px] mx-auto ">
            <div className="w-full px-[15px]">
              <div className="w-full flex">
                <form className='w-full flex flex-col '>
                  {/* top */}
                  <div className="flex">
                    <div className="w-full pr-4 border border-transparent border-r-[#ddd]">
                      <h1 className='text-[18px] text-bgPrimary font-bold uppercase flex items-center'>
                        Chi tiết đơn hàng
                        
                        <div className="inline-block px-1 border border-[#777] ml-2 text-[14px]">
                          <p className="inline-block text-primary opacity-75">{currentStatus}</p>
                        </div>

                        <div className="inline-block px-1 border border-[#777] ml-2 text-[14px]">
                          <p className="inline-block text-primary opacity-75">{order.paymentStatus}</p>
                        </div>
                      </h1>
                      <div className="w-[100px] h-[3px] my-[10px] bg-red-600"></div>
                      <div className="">
                        <div className="flex justify-between uppercase font-bold border-[2px] border-transparent border-b-[#ccc]">
                          <h2 className='text-[14px] tracking-widest text-bgPrimary py-2'>Sản phẩm</h2>
                          <h2 className='text-[14px] tracking-widest text-bgPrimary py-2'>Tổng</h2>
                        </div>
                        <div className="flex items-center flex-col justify-between border border-transparent border-b-[#ddd]">
                          {orderItems.length != 0 &&
                            orderItems.map((el, id) =>{
                              return <div key={id} className="flex pb-4 mt-4">
                                <Skeleton loading={loading}>
                                  <img className="h-[80px] object-cover" src={el.images[0]} alt="" />
                                </Skeleton>
                                <div className="pl-4">
                                  <div className="flex">
                                    <Skeleton loading={loading}>
                                      <h5 className='text-[#334862]'>{el.productCode}-{el.productName}</h5>
                                    </Skeleton>
                                    <Skeleton loading={loading} className='inline-block'>
                                      <p className='inline-block ml-1'> ×{el.quantity}</p>
                                    </Skeleton>
                                  </div>
                                  <Skeleton loading={loading}>
                                    <div className="text-[14px] text-[#777]">
                                      Size: {el.size} <br/>
                                      Màu: {el.color}
                                    </div>
                                  </Skeleton>
                                  {/* <div className="text-primary px-1 text-[12px] border border-primary inline-block">7 ngày trả hàng</div> */}
                                </div>
                              </div>
                            })
                          }
                        </div>
                        {
                          !!order && orderItems.length != 0 && 
                          <>
                            <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                              <h2 className=''>Thời gian đặt hàng</h2>
                              <Skeleton className='inline-block' loading={loading}>
                                <h2 className={`${loading && 'w-[100px]'} font-bold inline-block text-[14px]`}>
                                  {formatDate(order.createdDate)}
                                </h2>
                              </Skeleton>
                            </div>
                            <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                              <h2 className=''>Tổng phụ</h2>
                              <Skeleton className='inline-block' loading={loading}>
                                <h2 className={`${loading && 'w-[100px]'} font-bold inline-block text-[14px]`}>
                                  {solvePrice(order.total - (!!order.shippingFee ? order.shippingFee : 0))}{orderItems[0].unitPrice}
                                </h2>
                              </Skeleton>
                            </div>
                            <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                              <h2 className=''>Giao hàng</h2>
                              <Skeleton className={`${loading && 'w-[100px]'} inline-block`} loading={loading}>
                                <h2 className='font-bold inline-block text-[14px]'>
                                  {solvePrice(order?.shippingFee) }{orderItems[0].unitPrice}
                                </h2>
                              </Skeleton>
                            </div>
                            <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                              <h2 className=''>Voucher</h2>
                              <Skeleton className={`${loading && 'w-[100px]'} inline-block`} loading={loading}>
                                <h2 className='font-bold inline-block text-[14px]'>
                                  {order.voucher}
                                </h2>
                              </Skeleton>
                            </div>
                            <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                              <h2 className=''>Phương thức thanh toán</h2>
                              <Skeleton className='inline-block' loading={loading}>
                                <h2 className='font-bold inline-block text-[14px]'>
                                  {order.paymentType}
                                </h2>
                              </Skeleton>
                            </div>
                            <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                              <h2 className=''>Tổng cộng</h2>
                              <Skeleton className={`${loading && 'w-[100px]'} inline-block`} loading={loading}>
                                <h2 className='font-bold inline-block text-[14px]'>
                                  {solvePrice(order.total)}{orderItems[0].unitPrice}
                                </h2>
                              </Skeleton>
                            </div>
                          </> 
                        }
                      </div>
                    </div>
                    
                    {!!order &&
                    <div className="w-full pl-4">
                      <h1 className='text-[18px] text-bgPrimary font-bold uppercase'>Thông tin khách hàng</h1>
                      <div className="w-[100px] h-[3px] my-[10px] bg-red-600"></div>
                      <div className="flex justify-between uppercase font-bold border-[2px] border-transparent border-b-[#ccc]">
                        <h2 className='text-[14px] tracking-widest text-bgPrimary py-2'>Thông tin</h2>
                        <h2 className='text-[14px] tracking-widest text-bgPrimary py-2'>Cụ thể</h2>
                      </div>
                      <div className="">
                        <div className="flex items-center justify-between border border-transparent border-b-[#ddd]">
                          <div className="flex pb-4 mt-4">
                            <Skeleton loading={loading}>
                              <NavLink
                                // to={`/san-pham/${order?.cartProduct.id}`}
                                className=''>
                                <img className="h-[80px] aspect-square object-cover rounded-full"
                                  src={avt} alt="" />
                              </NavLink>
                            </Skeleton>
                            <div className="pl-4">
                              <div className="">
                                <Skeleton loading={loading}>
                                  <div
                                    className='text-bgPrimary'>
                                    <p className="font-medium inline-block mr-1">Họ tên:</p>
                                    {order.customerName}
                                  </div>
                                </Skeleton>
                                <Skeleton loading={loading} className=''>
                                  <p className="font-medium inline-block mr-1">Email:</p>
                                  <p className='inline-block'> {order.email}</p>
                                </Skeleton>
                                
                                <Skeleton loading={loading} className=''>
                                  <p className="font-medium inline-block mr-1">SĐT:</p>
                                  <p className='inline-block'> {order.contactNumber}</p>
                                </Skeleton>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Thời gian đặt hàng</h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className={`${loading && 'w-[100px]'} font-bold inline-block text-[14px]`}>
                              {(order && `${order?.orderDate} | ${order?.orderTime}`) || '25 tháng 4 năm 2002'}
                            </h2>
                          </Skeleton>
                        </div> */}
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd] text-[14px]">
                          <h2 className='w-1/2'>Tỉnh / Thành phố
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block '>
                              {order?.shipCity}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd] text-[14px]">
                          <h2 className='w-1/2'>Quận / Huyện
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block'>
                              {order.shipRegion}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd] text-[14px]">
                          <h2 className='w-1/2'>Địa chỉ cụ thể
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block '>
                              {order.shipAddress}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd] text-[14px]">
                          <h2 className='w-1/2'>Số điện thoại
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block '>
                              {order.contactNumber}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd] text-[14px]">
                          <h2 className='w-1/2'>Ghi chú
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block '>
                              {order.note != null ? order.note : <p className={`${loading || 'italic'}`}>Không có ghi chú</p>}
                            </h2>
                          </Skeleton>
                        </div>
                      </div>
                    </div>
                  }

                  </div>
                  <div style={{
                    height: '.1875rem',
                    width: '100%',
                    backgroundPositionX: '-1.875rem',
                    backgroundSize: '7.25rem .1875rem',
                    backgroundImage: 'repeating-linear-gradient(45deg,#6fa6d6,#6fa6d6 33px,transparent 0,transparent 41px,#f18d9b 0,#f18d9b 74px,transparent 0,transparent 82px)',
                  }} className='my-4'></div>
                  {/* bottom */}
                  <div className="">
                    <div className="w-full flex items-center justify-between item shadow-shadowPrimary px-3">
                      {listStatus.length > 0 && listStatus.map(item => (
                          <button
                            key={item.shortNum}
                            onClick={(e)=>{
                              e.preventDefault()
                              confirmUpdateStatus(e.target.value, item.shortNum, item.value)
                              // handleUpdateStatus(e.target.value, item.shortNum)
                            }}
                            value={item.shortNum}
                            className={` ${currentStatus === item.value ? 'border-b-primary text-primary' : 'border-b-[#fff]'} text-center text-bgPrimary cursor-pointer transition-all ease-in-out duration-150 border-[2px] border-t-0 border-l-0 border-r-0 hover:text-primary font-medium py-3`}>
                              {item.value}
                          </button>
                        ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div >
      </OverlayLoading >}
    </>
  );
};

export default OrderDetailAdmin;