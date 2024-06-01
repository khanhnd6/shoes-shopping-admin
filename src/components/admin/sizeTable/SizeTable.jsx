

function SizeTable({quantityList, setQuantityList}){

    function handleChangeQuantity(e, i){
        e.preventDefault();
        let temp = [...quantityList]
        temp[i].quantity = parseInt(e.target.value != "" ? e.target.value : 0 );
        setQuantityList(temp)
    }



    return <div className="relative overflow-x-auto">
        <h6 className="font-medium p-2">Số lượng</h6>
        <table className="table-fixed w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 font-medium">
                <tr>
                    <th scope="col" className="px-2 py-3 whitespace-nowrap w-20 border border-1 border-current">Size</th>
                    <th scope="col" className="px-2 py-3 whitespace-nowrap w-20 border border-1 border-current">Số lượng</th>
                </tr>
            </thead>
            <tbody>
                {
                    quantityList.length > 0 &&
                    quantityList.map((el, id)=>{
                        return <tr key = {id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td key={2*id} scope="col" className="px-2 py-3 whitespace-nowrap w-20 border border-1 border-current">Size: {el.size}</td>
                            <td key={2*id+1} scope="col" className="px-2 py-3 whitespace-nowrap w-20 border border-1 border-current">
                                <input className="w-full" type="number" value={el.quantity} placeholder="Nhập số lượng" onChange={(e)=> {handleChangeQuantity(e,id)}} />
                            </td>
                        </tr>
                    })
                }
            </tbody>
        </table>
    </div>
    
}

export default SizeTable;