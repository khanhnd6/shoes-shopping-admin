import { addDoc, collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Spinning } from '../../../animation-loading';
import { db, storage } from '../../../firebase/config';
import InputForm from '../../inputForm/InputForm';
import UploadSquare from './UploadSquare';
import { useNavigate, useParams } from 'react-router-dom';
import { selectProducts, STORE_PRODUCTS } from '../../../redux-toolkit/slice/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faPlus, faWrench } from '@fortawesome/free-solid-svg-icons';
import { addProductAction, getCategoryAction, getProductAction, getProductDetailsAction, getSupplierAction } from '../../../services/services';
import SizeTable from '../sizeTable/SizeTable';
import TagBox from '../tagBox/TagBox';
import axios from 'axios';

const AddProduct = ({type}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [quantityList, setQuantityList] = useState([]);
  const [product, setProduct] = useState({images: []});
  const [srcs, setSrcs] = useState([]);

  
  const {code} = useParams()

  useEffect(() => {
    getCategoryAction()
      .then(res => {
        setCategories(res.data);
      })
      .catch(err => {
        console.log(err);
      });

    getSupplierAction()
      .then(res => {
        setSuppliers(res.data);
      })
      .catch(err => {
        console.log(err);
      });


      console.log(type)

      if(type == "EDIT"){
        getProductDetailsAction(code)
          .then(res => {
            let data = res.data

            console.log("EDIT, CODE: ", data, code)

            let lst = []

            data.forEach(i => {
              lst.push({size: i.size, quantity: i.quantity})
            })


            let images = []
            let imgs = data[0].images
            console.log("imgs", imgs)
            if(!!imgs) 
                images = imgs.split(",")

            let lstSrc = []
            const fetchImage = async () => {
              try {
                

              } catch (error) {
                console.error('Error fetching image:', error);
              }
            };
        
            fetchImage();

            setQuantityList(lst)

            data = data[0]

            setProduct({
              categoryId: data.categoryid,
              code: data.code,
              description: data.description,
              discount: data.discount,
              name: data.name,
              price: data.price,
              supplierId: data.supplierId,
              unitPrice: data.unitPrice,
              images: images
            })
          })
          .catch( err => {
            console.log(err)
          })
      }

  }, []);

  console.log(product)
  console.log("SRCS: ", srcs)
  const handleEditProduct = async (e) => {
    e.preventDefault();
    setLoading(true);


    setLoading(false);
    toast.success("Sửa sản phẩm thành công", {
      autoClose: 1200
    });
  };

  const handleImageChange = (event, fileImg) => {
    event.preventDefault();
    setSrcs([...srcs, fileImg]);
  };

  const handleRemoveImage = (e, iSrc) => {
    e.preventDefault();
    setSrcs(srcs.filter(i => i.name !== iSrc.name));
  };

  
  const handleRemoveImage2 = (e, iSrc) => {
    e.preventDefault();
    console.log(iSrc)
    let imgs = product.images
    setProduct({...product, images: imgs.filter(i => i != iSrc)})
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    


    if (!Array.isArray(quantityList) || quantityList.length === 0) {
      toast.error("Danh sách số lượng không hợp lệ hoặc trống");
      return;
    }

    let paths = srcs.reduce((total, curr) => `${total},/uploads/${curr.name}`, "");
    const path2 = product.images.reduce((total, curr) => `${total};${curr}`, "");

    if(path2.length > 0){
      paths = path2 +paths
    }
    paths = paths.slice(1)

    console.log("PATH", paths, path2)

    try {
      quantityList.forEach((el, id) => {
        setLoading(true);
        console.log(id, el);

        const addProduct = (el, id) => {
          return addProductAction(
            product.code,
            product.name,
            parseFloat(product.price),
            parseFloat(product.discount),
            el.size,
            "",
            el.quantity,
            product.description,
            product.unitPrice,
            product.supplierId,
            product.categoryId,
            id === 0 ? paths : null ,
            id === 0 ? srcs : undefined // Only pass srcs for the first item
          )
          .then(res => {
            console.log(res);
            if (res.data.status === 0) {
              toast.success(`Size: ${el.size} - Thành công`, {
                autoClose: 5000
              });
            } else {
              toast.error(<div><h1>Size: {el.size} - Lỗi</h1><p>Message: {res.data.message}</p></div>, {
                autoClose: 5000 + 500 * id
              });
            }
          })
          .catch(err => {
            console.log(err.message);
          })
          .finally(() => {
            setLoading(false);
          });
        };

        addProduct(el, id);
      });
    } catch (e) {
      
      toast.error(e.message, {
        autoClose: 1200
      });
    }
    


  };


  console.log(product)



  return (
    <>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="w-full flex gap-6">
          <div className="w-1/2 flex flex-col gap-6">
            <InputForm
              onChange={(e) => setProduct({ ...product, code: e.target.value })}
              name='code'
              value={product.code}
              type='input'
              typeInput='input'
              width='w-full'
              bg='bg-white'
              labelName='Mã sản phẩm'
              placeholder='Nhập vào mã sản phẩm'
              id='product-code'
            />
            <InputForm
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              name='name'
              value={product.name}
              type='input'
              typeInput='input'
              width='w-full'
              bg='bg-white'
              labelName='Tên sản phẩm'
              placeholder='Nhập vào tên sản phẩm'
              id='product-name'
            />
            <div className="w-full flex gap-6">
              <div className="w-1/2 flex flex-col gap-4 flex-1 justify-center">
                <div className='flex flex-row gap-2'>
                  <InputForm
                    onChange={(e) => {
                      let val = e.target.value.replace(/[^0-9\.]+/g, '');
                      setProduct({ ...product, price: val });
                    }}
                    value={product.price}
                    type='number'
                    width='w-1/2'
                    name='price'
                    bg='bg-white'
                    labelName='Giá'
                    py='py-[10px]'
                    placeholder='Giá sản phẩm'
                    id='product-price'
                  />
                  <InputForm
                    value={product.unitPrice}
                    onChange={(e) => setProduct({ ...product, unitPrice: e.target.value })}
                    type='input'
                    width='w-1/4'
                    name='inventory'
                    bg='bg-white'
                    labelName='Đơn vị tiền'
                    maxLength={7}
                    py='py-[10px]'
                    placeholder='Nhập đơn vị tiền'
                    id='unit-price'
                  />
                  <InputForm
                    value={product.discount}
                    onChange={(e) => {
                      let val = e.target.value.replace(/[^0-9\.]+/g, '');
                      setProduct({ ...product, discount: val });
                    }}
                    type='number'
                    width='w-1/4'
                    name='discount'
                    bg='bg-white'
                    labelName='Discount'
                    maxLength={7}
                    py='py-[10px]'
                    placeholder='0.1 = 10%'
                    id='unit-price'
                  />
                </div>
                <InputForm
                  onChange={(e) => setProduct({ ...product, categoryId: e.target.value })}
                  type='select'
                  value={product.categoryId}
                  width='w-full'
                  bg='bg-white'
                  name='categoryId'
                  labelName='Loại'
                  placeholder='Loại sản phẩm'
                  id='product-category'
                >
                  {categories.length > 0 && (
                    <>
                      <option key={0} value="">Chọn loại sản phẩm</option>
                      {categories.map((el, id) => (
                        <option key={id + 1} value={el.id}>{el.name}</option>
                      ))}
                    </>
                  )}
                </InputForm>
                <InputForm
                  onChange={(e) => setProduct({ ...product, supplierId: e.target.value })}
                  type='select'
                  width='w-full'
                  value={product.supplierId}
                  bg='bg-white'
                  name='supplierId'
                  labelName='Thương hiệu'
                  placeholder='Thương hiệu sản phẩm'
                  id='product-brand'
                >
                  {suppliers.length > 0 && (
                    <>
                      <option key={0} value="">Chọn thương hiệu</option>
                      {suppliers.map((el, id) => (
                        <option key={id + 1} value={el.id}>{el.name}</option>
                      ))}
                    </>
                  )}
                </InputForm>
                <InputForm
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  type='input'
                  width='w-full'
                  value={product.description}
                  bg='bg-white'
                  name='description'
                  labelName='Mô tả'
                  placeholder='Nhập mô tả'
                  id='description'
                />
                <div className='w-full flex flex-row gap-4 flex-1 justify-center'>
                  <TagBox quantityList={quantityList} setQuantityList={setQuantityList} />
                </div>
              </div>
            </div>

            {quantityList.length > 0 && (
              <SizeTable quantityList={quantityList} setQuantityList={setQuantityList} />
            )}
          </div>

          
          <div className="w-1/2 grid grid-cols-2 gap-5 aspect-square h-full">
            {!!product.images && product.images.length > 0 && product.images.map((el, idx) => (
              <UploadSquare
                img={el}
                key={idx}
                handleImageChange={()=>{}}
                handleRemoveImage={handleRemoveImage2}
                name='add-image'
                text='Tải lên ảnh sản phẩm'
                width="w-full"
              />
            ))}
            {srcs.length > 0 && srcs.map((el, idx) => (
              <UploadSquare
                src={el}
                key={idx}
                handleImageChange={handleImageChange}
                handleRemoveImage={handleRemoveImage}
                name='add-image'
                text='Tải lên ảnh sản phẩm'
                width="w-full"
              />
            ))}
            <UploadSquare
              handleImageChange={handleImageChange}
              name='add-image'
              text='Tải lên ảnh sản phẩm'
              width="w-full"
              id='product-preview-1'
            />
          </div>
        </div>
        <button
          type="submit"
          className='mt-[20px] w-[170px] px-[10px] h-10 bg-primary text-white text-[14px] leading-[37px] font-bold tracking-[1px] uppercase transition-all ease-in duration-500 focus:outline-none hover:bg-[#a40206]'
        >
          {loading ? <Spinning /> : "Xác nhận"}
        </button>
      </form>
    </>
  );
};

export default AddProduct;
