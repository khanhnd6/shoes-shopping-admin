import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { auth, db } from '../../../firebase/config';
import Pagination from '../../pagination/Pagination';
import { Spinning } from '../../../animation-loading';
import { adminAccount } from '../../../AdminAccount';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faGift, faList, faLock, faPencil } from '@fortawesome/free-solid-svg-icons';
import { browserSessionPersistence, createUserWithEmailAndPassword, sendPasswordResetEmail, setPersistence } from 'firebase/auth';
import Notiflix from 'notiflix';
import { toast } from 'react-toastify';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import OverlaySendGift from './OverlaySendGift';
import { getUserAction } from '../../../services/services';

const itemsPerPage = 6;
const quantity = 3;

const ViewUsers = () => {
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [allUsersSort, setAllUsersSort] = useState([]);
  //
  const [currentPage, setCurrentPage] = useState(1)
  const [pageProducts, setPageProducts] = useState([]); //products every page (use slice to cut all 
  //
  const [openSendGift, setOpenSendGift] = useState(false)
  //
  const userIDSendGift = useRef()

  const getUsers = async () => {
    setLoading(true)
    try {
      const user = []
      getUserAction()
        .then(res=>{
          console.log("res.data", res.data)
          setTimeout(() => {
            setAllUsers(res.data)
            setAllUsersSort(res.data)
            setPageProducts(res.data.slice(0, itemsPerPage))
          }, 1000)
        })
        .catch(err =>{
          console.log(err)
        })
        .finally(()=>{
          setLoading(false)
        })
    }
    catch (e) {
      console.log(e.message);
    }
  }


  const handleSendVoucher = (e, userID) => {
    e.preventDefault()

  }


  const handleSeeDetails = (userid) => {
    console.log(userid)
  }

  useEffect(() => {
    getUsers()
  }, []);



  return (
    <>
    <div className="">
          <div className="h-full">
            <div className="w-full shadow-shadowPrimary px-3 rounded-md">
              <table className='w-full'>
                <thead>
                  <tr className={`${!loading && allUsersSort.length > 0 && 'border-[3px] border-transparent border-b-[#ececec]'} grid grid-cols-14 gap-0 grid-rows-1 text-[14px] font-bold py-4 uppercase tracking-wider`}>
                    <td className='col-span-3'>Tên</td>
                    <td className='col-span-2'>Vùng</td>
                    <td className='col-span-2'>Thành phố</td>
                    <td className='col-span-4 flex justify-center'>Địa chỉ</td>
                    <td className='col-span-3 flex justify-center'>SĐT</td>
                  </tr>
                </thead>
                <tbody style={{
                  height: `${loading ? '0' : itemsPerPage * 70 + 20}px`
                }}>
                  {!loading && allUsers.length === 0 && (
                    <div className="w-full h-full flex flex-col gap-4 items-center mt-8">
                      <div
                        style={{
                          backgroundImage: "url('/emptyOrder.jpg')"
                        }}
                        className="w-[220px] h-[250px] bg-cover bg-no-repeat bg-center"></div>
                      {/* khi chưa có người dùng nào */}
                      <div className='text-center text-[18px] font-bold text-bgPrimary leading-[32px] uppercase'>Chưa có người dùng nào được tạo ra
                      </div>
                    </div>
                  )}
                  {!loading
                    && (
                      (pageProducts.length === 0 && allUsers.length > 0)
                        ? (
                          <div className="w-full flex flex-col gap-4 items-center mt-8">
                            <div
                              style={{
                                backgroundImage: "url('/emptyOrder.jpg')"
                              }}
                              className="w-[220px] h-[250px] bg-cover bg-no-repeat bg-center"></div>
                            <div className='text-center text-[18px] font-bold text-bgPrimary leading-[32px] uppercase'>
                              {/* search */}
                              Chưa có người dùng nào
                            </div>
                          </div>
                        )
                        : (
                          pageProducts.map((user) => (
                            <tr
                              key={user.id}
                              className='grid items-center grid-cols-14 gap-2 rounded-[4px] h-[70px] border border-transparent border-b-[#ececec]'>
                              <td className='col-span-3 flex items-center'>
                                {user.firstName} {user.lastName}
                              </td >
                              <td className='col-span-2 flex ' >
                                <span className='text-[16px] line-clamp-2'>{user.region}</span>
                              </td >
                              <td className='col-span-2 flex items-center py-2'>
                                <p className="">{user.city}</p>
                              </td>
                              <td className='col-span-4 flex items-center py-2 font-bold'>
                                {user.address}
                              </td>
                              <td className='col-span-3 flex items-center font-bold'>
                                {user.number}
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
          {!loading && allUsers.length !== 0 && (
            <div className="">
              <Pagination
                products={allUsersSort}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                quantity={quantity}
                setPageProducts={setPageProducts} />
            </div>
          )}
        </div >
    </>
  );
};

export default ViewUsers;