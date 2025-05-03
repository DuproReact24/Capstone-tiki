import { toggleCartItem, removeFromCart } from '@/features/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { formatCurrency } from '@/utils';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Checkbox, InputNumber } from 'antd';
import Image from 'next/image';
import React, { useState } from 'react';

type PropsType = {
  product: any;
};

export const ItemCart = ({ product }: PropsType) => {
  const [amount, setAmount] = useState(1);
  const handleChangeAmount = (type: string) => {
    switch (type) {
      case '+':
        setAmount(amount + 1);
        break;
      case '-':
        if (amount === 1) return;
        setAmount(amount - 1);
        break;
      default:
        break;
    }
  };
  const cartItems = useAppSelector((state: any) => state.cart.items);
  const handleDelete =(id:number)=>{
    fetch(`http://localhost:8080/delete-cart/${id}`, {
      method: 'DELETE',
    }).then(async (res) => {
      window.location.reload();
    });
  }
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const dispatch = useAppDispatch();

  const handleSelectProduct = (productItem: any) => {
    const newProduct = {
      ...productItem,
      amount: amount,
      price: product.price * amount,
    };
  
    // Kiểm tra nếu sản phẩm đã có trong Redux cart hay chưa
    const isSelected = cartItems.find((item:any) => item.id === productItem.id);
  
    if (isSelected) {
      // Nếu đã có => tức là bỏ chọn => xóa ra
      dispatch(removeFromCart(productItem.id));
    } else {
      // Nếu chưa có => thêm vào
      dispatch(toggleCartItem(newProduct));
    }
  };
  
  return (
    <div className='ml-2 flex mb-5'>
      <div className='flex w-[45%] w-max-[45%] flex-row items-center'>
        <Checkbox
         value={product.id}  
         onChange={() => handleSelectProduct(product)} />
        <Image
          className='w-[80px] h-[80px] mx-3'
          src={`http://localhost:8080/img/${product.image_large}`}
          alt='product'
          width={80}
          height={80}
          unoptimized
        />

        <div className='w-[51%]'>
          <div className='flex flex-row items-center gap-1'>
           
        {product.support_delivery && (
             <Image
             src={`http://localhost:8080/img/chinh-hang.png`}
             alt='now'
             width={32}
             height={16}
             unoptimized
           />
           )}
            <Image
              src='/doi-y.png'
              alt='doi-y'
              width={89}
              height={20}
              unoptimized
            />
          </div>
          <span className='text-sm'>
            {product.description}
          </span>
          <div className='flex flex-row items-center gap-1'>
           {product.support_delivery && (
             <Image
             src={`http://localhost:8080/img/now.png`}
             alt='now'
             width={32}
             height={16}
             unoptimized
           />
           )}
            <span className='text-xs'>Giao siêu tốc 2h</span>
          </div>
        </div>
      </div>
      <span className='w-[20%] w-max-[15%]  font-semibold flex items-center'>
        {formatCurrency('vi-VN', 'VND', product.price)}
        <sup>₫</sup>
      </span>
      <div className='w-[15%] w-max-[15%] flex items-center'>
      
        <button className='bg-blue-500 text-white font-semibold rounded w-[55%] flex justify-center items-center text-center'  onClick={() => {
                handleChangeAmount('+');
              }}>+</button>
        <p className='w-[55%] flex justify-center items-center text-center'>{amount}</p>
        <button className=' bg-red-500 text-white font-semibold rounded w-[55%] flex justify-center items-center text-center'  onClick={() => {
                handleChangeAmount('-');
              }}>-</button>
      </div>

      <span className='font-semibold text-red-500 w-[20%]  flex items-center'>
        {formatCurrency('vi-VN', 'VND', product.price * amount)}
        <sup>₫</sup>
      </span>
      <div className='text-gray-500 w-[10%] pr-5 flex justify-end items-center'>
        <TrashIcon className='size-5' onClick={() => { handleDelete(product.id) }} />
      </div>
    </div>
  );
};
