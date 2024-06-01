import { useState } from "react";
import InputForm from "../../inputForm/InputForm";
import ButtonPrimary from "../../button/ButtonPrimary";
import { toast } from "react-toastify";

function TagBox({quantityList, setQuantityList}){

    const [input, setInput] = useState("");

    const handleInputChange = (e) => {
        setInput(e.target.value)
    }

    const handleClickBtn =(e)=>{
        e.preventDefault()
        if(input == ""){
            toast.info("Vui lòng nhập", {
                autoClose: 1000
            })
            return;
        }
        setQuantityList([...quantityList, {size: input, quantity: 0}])
        setInput("")

    }


    return <div className="flex flex-row  w-full">
        <InputForm
            onChange={handleInputChange}
            type='tagbox'
            width='w-full'
            value={input}
            bg='bg-white'
            name={"size"}
            labelName= {"Size"}
            placeholder= {"Nhập Size"}
        >
        </InputForm>

        <ButtonPrimary className="mx-3" onClick={handleClickBtn} text="Thêm" />
    </div>
}

export default TagBox;