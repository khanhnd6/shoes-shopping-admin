
import axios from 'axios'

const getUserAction = async () => {
    
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_ENDPOINT}/customer/get-customer`,
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${localStorage.getItem("token")}`
    },
    };
    
    return new Promise((resolve, reject)=>{

        axios.request(config)
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            });
    })  
    
}


    //    pageNum:1,
    //    pageSize:10,
    //    code:null, 
    //    name:null, 
    //    supplierId:null, 
    //    supplier:null, 
    //    categoryId:null, 
    //    category:null, 
    //    fromPrice:null, 
    //    toPrice:null, 
    //    isHidden:null
const getProductAction = async (
    pageNum = 1, 
    pageSize = 5, 
    code = null, 
    name = null, 
    supplierId = null, 
    supplier = null, 
    categoryId = null, 
    category = null, 
    fromPrice = null, 
    toPrice = null, 
    sortBy = null, // - LATEST, OLDEST, LOWEST-PRICE, HIGHEST-PRICE, A-Z, Z-A
    isHidden = null
) => {
    let queryParams = new URLSearchParams({
        pageNum,
        pageSize,
        code,
        name,
        supplierId,
        supplier,
        categoryId,
        category,
        fromPrice, 
        toPrice,
        sortBy,
        isHidden
    });
    console.log(queryParams)
    

    queryParams = [...queryParams.entries()].reduce((acc, [key, value]) => {
        if (value !== null && value !== 'null' && value !== undefined) {
            acc.append(key, value);
        }
        return acc;
    }, new URLSearchParams());

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_ENDPOINT}/product/get-product?${queryParams.toString()}`,
    };

    
    console.log(`${process.env.REACT_APP_API_ENDPOINT}/product/get-product?${queryParams.toString()}`, queryParams)
    
    return new Promise((res, rej) => {
        axios.request(config)
            .then((response) => {
               res(response) 
            })
            .catch((error) => {
                rej(error)
            });
    })
    
}



const getProductDetailsAction = async (
    code = null, 
) => {
    let queryParams = new URLSearchParams({
        code,
    });

    console.log(queryParams)
    

    queryParams = [...queryParams.entries()].reduce((acc, [key, value]) => {
        if (value !== null && value !== 'null' && value !== undefined) {
            acc.append(key, value);
        }
        return acc;
    }, new URLSearchParams());

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_API_ENDPOINT}/product/get-product-details?${queryParams.toString()}`,
        headers: { }
    };
    
    return new Promise((res, rej) => {
        axios.request(config)
            .then((response) => {
               res(response) 
            })
            .catch((error) => {
                rej(error)
            });
    })
    
}




const getCategoryAction = async (category = null, categoryId = null) => {


    let queryParams = new URLSearchParams({
        category,
        categoryId
    });

    queryParams = [...queryParams.entries()].reduce((acc, [key, value]) => {
        if (value !== null && value !== 'null' && value !== undefined) {
            acc.append(key, value);
        }
        return acc;
    }, new URLSearchParams());

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_ENDPOINT}/category/get-category?${queryParams.toString()}`,
    };
    
    return new Promise((res, rej) => {
        axios.request(config)
            .then((response) => {
               res(response) 
            })
            .catch((error) => {
                rej(error)
            });
    })
    
}

const addProductAction = async (
    productCode,
    productName,
    price,
    discount = 0,
    size,
    color,
    quantity,
    description = "",
    unitPrice,
    supplierId,
    categoryId,
    images = "",
    srcs
) => {

    const FormData = require('form-data');

    let data = new FormData();
    
    data.append('productName', productName);
    data.append('price', price);
    data.append('discount', discount);
    data.append('code', productCode);
    data.append('size', size);
    data.append('quantity', quantity);
    data.append('color', color);
    data.append('description', description);
    data.append('unitPrice', unitPrice);
    data.append('supplierId', supplierId);
    data.append('categoryId', categoryId);
    if(images != null)
        data.append('images', images);
    
    if(srcs != undefined && srcs.length > 0 ){
        srcs.forEach(i => {
            data.append('srcs', i);
        })
    }
    

    console.log([...data.entries()])

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_API_ENDPOINT}/product/add-product`,
        headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        data 
        // {
            
            // code: productCode,
            // productName,
            // price,
            // discount,
            // size,
            // color,
            // quantity,
            // description,
            // unitPrice,
            // supplierId,
            // categoryId,
            // images,
            // srcs: srcs
        // }
    };

    return new Promise((res, rej) => {
        
        axios.request(config)
        .then((response) => {
            res(response)
        })
        .catch((error) => {
            rej(error)
        });
    })


}

const getSupplierAction = async (supplier = null, supplierId = null) => {

    

    let queryParams = new URLSearchParams({
        supplier,
        supplierId
    });

    queryParams = [...queryParams.entries()].reduce((acc, [key, value]) => {
        if (value !== null && value !== 'null' && value !== undefined) {
            acc.append(key, value);
        }
        return acc;
    }, new URLSearchParams());


    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_ENDPOINT}/supplier/get-supplier?${queryParams.toString()}`,
      data: {
        supplier, 
        supplierId
      }
    };
    
    return new Promise((res, rej) => {
        axios.request(config)
            .then((response) => {
               res(response) 
            })
            .catch((error) => {
                rej(error)
            });
    })
}


const getOrdersAction = async (id = null) =>{

    let queryParams = new URLSearchParams({
        id
    });

    queryParams = [...queryParams.entries()].reduce((acc, [key, value]) => {
        if (value !== null && value !== 'null' && value !== undefined) {
            acc.append(key, value);
        }
        return acc;
    }, new URLSearchParams());




    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_ENDPOINT}/order/get-orders-admin?${queryParams.toString()}`,
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem("token")}`
    }
    };
    
    return new Promise((res, rej)=>{
        axios.request(config)
            .then((response) => {
                res(response)
            })
            .catch((error) => {
                rej(error)
            });
    })
    
}


const getCommonTypeAction = (type = null) =>{


    let queryParams = new URLSearchParams({
        type
    });

    queryParams = [...queryParams.entries()].reduce((acc, [key, value]) => {
        if (value !== null && value !== 'null' && value !== undefined) {
            acc.append(key, value);
        }
        return acc;
    }, new URLSearchParams());





    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_API_ENDPOINT}/common/get-common-type?${queryParams.toString()}`,
        headers: { },
        data: {
            type
        }
    };

    return new Promise((res, rej) => {
        axios.request(config)
            .then((response) => {
                res(response)
            })
            .catch((error) => {
                rej(error)
            });
    })

}


const deleteProductAction = async (productCode =null, productId = null) => {
    
    if(productCode == null && productId == null){
        return {
            "status": -1,
            "message": "product code và product Id không được cung cấp",
            "data": null
        }
    }
    
    let config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_API_ENDPOINT}/product/delete-product`,
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        data : {
            productCode,
            productId
        }
    };

    return new Promise((res, rej)=>{        
        axios.request(config)
        .then((response) => {
            res(response)
        })
        .catch((error) => {
            rej(error)
        });

    })
}




const getOrderItemsAction = async (orderId = null) =>{

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_API_ENDPOINT}/order/get-order-items?orderId=${orderId}`,
        headers: { 
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    };

    return new Promise((res, rej)=>{
        axios.request(config)
            .then((response) => {
                res(response)
            })
            .catch((error) => {
                rej(error)
            });
    })
    
}


const updateOrderStatus = async (orderId, customerId, orderStatus = null, paymentStatus = null) => {

    let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_API_ENDPOINT}/order/change-order-status`,
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        data : {
            
            orderId, customerId, orderStatus, paymentStatus
        }
    };

    return new Promise((res, rej) => {
        axios.request(config)
        .then((response) => {
            res(response)
        })
        .catch((error) => {
            rej(error)
        });
    })

}


export {getUserAction, getProductAction, getCategoryAction, getSupplierAction, getOrdersAction, getCommonTypeAction, deleteProductAction, getOrderItemsAction, updateOrderStatus, addProductAction, getProductDetailsAction}
