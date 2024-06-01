import { faEdit, faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { collection, deleteDoc, doc, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Spinning } from '../../../animation-loading';
import { db, storage } from '../../../firebase/config';
import Pagination from '../../pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import { deleteObject, ref } from 'firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
import Notiflix from 'notiflix';
import { STORE_PRODUCTS, selectProducts } from '../../../redux-toolkit/slice/productSlice';
import "../../lineClamp.scss"
import { selectUserID } from '../../../redux-toolkit/slice/authSlice';
import { deleteProductAction, getCategoryAction, getCommonTypeAction, getProductAction, getSupplierAction } from '../../../services/services';

const ViewProducts = () => {
  const itemsPerPage = 5;
  const quantity = 5;

  const [loading, setLoading] = useState(false);

  const filterRef = useRef()
  const fSortRef = useRef()
  
  const [notFound, setNotFound] = useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [products, setProducts] = useState([]); //all products
  const [total, setTotal] = useState(0); //all products

  const [category, setCategory] = useState([])
  const [supplier, setSupplier] = useState([])


  const [currentPage, setCurrentPage] = useState(1)
  
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const productsRedux = useSelector(selectProducts)
  const userID = useSelector(selectUserID) || localStorage.getItem('userID')

  const fCategoryRef = useRef(null)
  const fSupplierRef = useRef(null)
  const fSearchNameRef = useRef(null)


  const handleChangePageNum = (pageNum, pageSize) => {
    setLoading(true)
    
    const categoryId = fCategoryRef.current && fCategoryRef.current.value != "" ? fCategoryRef.current.value : null;
    const supplierId = fSupplierRef.current && fSupplierRef.current.value != "" ? fSupplierRef.current.value : null;
    const searchName = fSearchNameRef.current && fSearchNameRef.current.value != "" ? fSearchNameRef.current.value : null;
    const sortBy = fSortRef.current && fSortRef.current.value != "" ? fSortRef.current.value : null;

    getProductAction(currentPage, itemsPerPage, null, searchName, supplierId, null, categoryId, null, null, null, sortBy, null)
    .then(res=>{
      let dat = res.data.data

      console.log("dat: ", dat, res)

      dat.forEach(element => {
        element.images = element.images == null ? [] : element.images.split(";")
      });

      setProducts(dat)
      setTotal(res.data.total)
    })
    .catch(e => {
      toast.error(e.message, {
        autoClose: 1000
      })
    })
    .finally(()=>{
      setLoading(false)
    })

  }

  //...img này bao gồm 1 img và 4 img preview
  const confirmDelete = (code) => {
    Notiflix.Confirm.show(
      'Xóa sản phẩm',
      'Bạn có muốn xóa sản phẩm này ?',
      'Xóa',
      'Hủy bỏ',
      function okCb() {
        handleDeleteProduct(code)
      },
      function cancelCb() {
        console.log();
      },
      {
        zindex: 2000,
        width: '320px',
        zindex: 999999,
        fontFamily: 'Roboto',
        borderRadius: '4px',
        titleFontSize: '20px',
        titleColor: '#c30005',
        messageFontSize: '18px',
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

  //hàm này để xóa đi sản phẩm trong Cart Product
  const handleDeleteCartProduct = async (idProduct) => {
    const productsRef = query(collection(db, "cartProducts"))
    const q = query(productsRef);
    try {
      const querySnapshot = await getDocs(q);
      // console.log(querySnapshot.docs);
      const allIdCartProductsDelete = querySnapshot.docs.filter((doc) => doc.data().id === idProduct)
      // console.log(allIdCartProductsDelete);
      Promise.all(
        allIdCartProductsDelete.map(async (idCartProductsDelete) => {
          try {
            await deleteDoc(doc(db, "cartProducts", idCartProductsDelete.id));
          } catch (e) {
            console.log(e.message);
          }
        })

      )
    }
    catch (e) {
      console.log(e.message);
    }
  }

  const handleDeleteProduct = async (code) => {
    try {
      console.log("CODE: ", code)
      
      deleteProductAction(code)
        .then(res => {
          console.log("delete: ", res)
          if(+res.data.status == 0){
            toast.success('Xóa sản phẩm thành công', {
              autoClose: 1000
            })
          } else {
            toast.error('Xóa sản phẩm thất bại', {
              autoClose: 1000
            })
          }
        })
        .catch(err=>{
          toast.error('Xóa sản phẩm thất bại', {
            autoClose: 1000
          })
        })
        .finally(()=>{
          handleFilterProduct()
        })
    } catch (e) {
      toast.error(e.message, {
        autoClose: 1000
      })
    }
  }

  const solvePrice = (price) => {
    return Number(price).toLocaleString('vi-VN');
  }


  const handleFilterProduct = (e = null) => {
    setLoading(true)
    if(!!e)
      e.preventDefault(); // Prevent the default form submission

    const categoryId = fCategoryRef.current && fCategoryRef.current.value != "" ? fCategoryRef.current.value : null;
    const supplierId = fSupplierRef.current && fSupplierRef.current.value != "" ? fSupplierRef.current.value : null;
    const searchName = fSearchNameRef.current && fSearchNameRef.current.value != "" ? fSearchNameRef.current.value : null;
    const sortBy = fSortRef.current && fSortRef.current.value != "" ? fSortRef.current.value : null;

    getProductAction(currentPage, itemsPerPage, null, searchName, supplierId, null, categoryId, null, null, null, sortBy, null)
    .then(res=>{
      let dat = res.data.data

      console.log("dat: ", dat, res)

      dat.forEach(element => {
        element.images = element.images == null ? [] : element.images.split(";")
      });

      setProducts(dat)
      setTotal(res.data.total)
    })
    .catch(e => {
      toast.error(e.message, {
        autoClose: 1000
      })
    })
    .finally(()=>{
      setLoading(false)
    })

  };

  useEffect(()=>{
    handleFilterProduct()
  }, [currentPage])

  useEffect(() => {
    // getProducts()
    getSupplierAction()
      .then(res => {
        
        console.log(res)
        setSupplier(res.data)
      })
      .catch(err => {
        console.log(err)
      })

      
    getCategoryAction()
      .then(res => {
        setCategory(res.data)
      })
      .catch(err => {
        console.log(err)
      })


  }, [])

  console.log(products)

  return (
    <>
      <div className='w-full'>
        <span className='text-bgPrimary block text-[16px] mb-4'>
          <p className='font-bold inline-block text-[16px]'>Số lượng</p>
          : {total} sản phẩm
        </span>
        <div className='border border-transparent pb-6 border-b-[#bbb] flex justify-between items-center'>
          <div className="">
            <select
              // onChange={handleFilterProduct}
              className='outline-none float-left bg-slate-100 px-3 py-2 text-bgPrimary cursor-pointer border border-solid border-[#ddd] shadow-shadowSearch'
              name="fCategory" 
              ref={fCategoryRef}
              >
                <option value="">Loại SP: Tất cả</option>
                {category.length > 0 && category.map((item, idx)=><option key={idx} value={item.id}>{item.name}</option>)}
            </select>
            <select
              // onChange={handleFilterProduct}
              className='outline-none mx-2 float-left bg-slate-100 px-3 py-2 text-bgPrimary cursor-pointer border border-solid border-[#ddd] shadow-shadowSearch'
              name="fSupplier" 
              ref={fSupplierRef}
              >
                <option value="">Nhà cung cấp: Tất cả</option>
                {category.length > 0 && supplier.map((item, idx)=><option key={idx} value={item.id}>{item.name}</option>)}
            </select>
          </div>
          <form
            onSubmit={handleFilterProduct}
            className="flex gap-4 items-center">
            <div className="px-[15px] overflow-hidden inline-flex gap-2 items-center border border-solid border-bgPrimary ">
              <input
                ref={fSearchNameRef}
                className='block py-[6px] text-[16px] text-bgPrimary outline-none'
                placeholder='Tìm kiếm theo tên'
                autoComplete='off'
                type="text" name="" id="" />
            </div>
            <button
              type='submit'
              className='text-white  bg-bgPrimary opacity-80 hover:opacity-100 transition-all ease-linear duration-300 px-4 py-[8px] text-[16px]'>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
          <div className="">
            <select
              ref={fSortRef}
              // onChange={handleFilterProduct}
              className='outline-none float-right bg-slate-100 px-3 py-2 text-bgPrimary cursor-pointer border border-solid border-[#ddd] shadow-shadowSearch'
              name="sort-by" id="">
              <option value="">Sắp xếp</option>
              <option value="latest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="lowest-price">Giá tăng dần</option>
              <option value="highest-price">Giá giảm dần</option>
              <option value="a-z">A - Z</option>
              <option value="z-a">Z - A</option>
            </select>
          </div>
        </div>

        {
          notFound
            ? <div className='flex flex-col items-center'>
              <img
                className='w-[350px] object-cover'
                src="../../notFound.jpg" alt=""
              />
              <h1 className='text-[20px] text-center text-bgPrimary'>Không tìm thấy sản phẩm phù hợp</h1>
            </div>
            : <>
              <div
                style={{
                  height: `${itemsPerPage * 130 + 20}px`
                }}
                className="w-full text-bgPrimary">
                {loading
                  ? <Spinning color='#1f2028' size='28px' />
                  : (
                    <table className='w-full'>
                      <thead>
                        <tr 
                        key="0"
                          className='border border-transparent border-b-[#bbb] grid gap-3 grid-cols-14 mb-4 text-[13px] font-bold py-[10px]'>
                          <td key="0" className='col-span-1'>Thứ tự</td>
                          <td key="1" className='col-span-1'>Code</td>
                          <td key="2" className='col-span-6'>Thông tin sản phẩm</td>
                          <td key="3" className='col-span-1'>Nhà cung cấp</td>
                          <td key="4" className='col-span-1'>Phân loại</td>
                          <td key="5" className='col-span-2'>Giá</td>
                          <td key="6" className='col-span-2'>Thao tác</td>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product, idx) => (
                          <tr
                            key={product.id}
                            className='grid gap-3 grid-cols-14 mb-4 rounded-[4px] py-[10px] shadow-md'>
                            <td className='col-span-1 flex items-center justify-center'>
                              <span className='text-[13px] font-medium'>
                                {(idx + 1) + itemsPerPage * (currentPage - 1)}
                              </span>
                            </td>
                            <td className='col-span-1 flex items-center '>
                              <span className='text-[13px] font-medium'>
                                {product.productCode}
                              </span>
                            </td>
                            <td className='col-span-6 grid grid-cols-7 gap-4'>
                              <img
                                onClick={() => navigate(`/san-pham/${product.id}`)}
                                className='col-span-3 rounded-[4px] h-[75px] w-full object-cover cursor-pointer'
                                src={ product.images.length == 0 ? "": process.env.REACT_APP_API_ENDPOINT+product.images[0]} alt="" />
                              <div className="col-span-4 flex flex-col mt-4">
                                <span
                                  onClick={() => navigate(`/san-pham/${product.id}`)}
                                  className='text-[13px] font-medium text-bgPrimary line-clamp-1 cursor-pointer'>{product.name}</span>
                                  <br/>
                                <span className='text-[#888] line-clamp-2 text-[12px]'>{product.description}</span>
                              </div>
                            </td>
                            <td className='col-span-1 flex items-center'>
                              <span className='text-[13px] bg-[#d9d6d6] rounded-[4px] px-2 py-1'>{product.supplier}</span>
                            </td>
                            <td className='col-span-1 flex items-center'>
                              <span className='text-[13px] bg-[#d9d6d6] rounded-[4px] px-2 py-1'>{product.category}</span>
                            </td>
                            <td className='col-span-2 flex items-center'>
                              <span className='text-[13px] font-medium'>
                                {solvePrice(product.price)}
                                <p className='inline-block text-[13px] align-top ml-[2px]'>{product.unitPrice}</p>
                              </span>
                            </td>
                            <td className='col-span-2 flex items-center gap-5'>
                              <button
                                onClick={() => {
                                  navigate(`/admin/edit-product/${product.productCode}`)
                                }}>
                                <FontAwesomeIcon className='text-[18px] cursor-pointer text-bgPrimary hover:text-green-600 transition-all ease-linear duration-100' icon={faEdit} />
                              </button>
                              <button
                                onClick={() => confirmDelete(product.productCode)}
                                className=''>
                                <FontAwesomeIcon className='text-[18px] cursor-pointer text-bgPrimary hover:text-primary transition-all ease-linear duration-100' icon={faTrashAlt} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
              </div>

              {!loading &&
                (<div className="">
                  <Pagination
                    products={products}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    quantity={quantity}
                    totalItems={total}  
                    type="CALLAPI"
                    handleChangePageNum = {handleChangePageNum}
                  />
                </div>)
              }
            </>
        }

      </div>
    </>
  );
};

export default ViewProducts;