'use client';
import { setProduct } from '@/features/product/productSlice';
import { useAppDispatch } from '@/lib/hooks';
import React from 'react'

export default function RecommendToday({item,updateState}:any) {
    
    const {name,id} = item
    const dispatch = useAppDispatch()
    const handleGetProduct = (id:number) => {
       
        const res = fetch(`http://localhost:8080/get-products-cate/${id}`).then(async (res) => 
{
    const data = await res.json()
    updateState(data)
 
}
        
        )
    }
  return (
    <>
    <div className='mt-2' onClick={() => { handleGetProduct(id) }}>
    <div
   className={`w-36 h-16 hover:bg-gray-300 bg-white-100 border-b  flex flex-col items-center justify-center cursor-pointer`}
  
 >
   <span className='text-blue-500 text-xs'>{name}</span>
 </div>
</div>
</>
  )
}
