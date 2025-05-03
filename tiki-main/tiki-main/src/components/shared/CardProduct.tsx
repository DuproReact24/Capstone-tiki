import React, { AllHTMLAttributes } from 'react';
import Image from 'next/image';
import { Rate } from 'antd';
import { formatCurrency } from '@/utils';
import Link from 'next/link';

type PropsType = {
  data: {
 

    badges_icon: string;
    color: string;
    deal: number;
    description: string;
    guarantee: string;
    id: number;
    id_cate: number;
    id_cate_detail: number;
    id_manufacturer: number;
    image_large: string;
    images: string;
    name: string;
    price: number;
    quantity_buy: number;
    rate: number;
    size_products: string;
    support_delivery: true;
    top_deal: true;
    madein:string
  };
};

export const CardProduct = ({
  data,
  ...rest
}: PropsType & AllHTMLAttributes<HTMLDivElement>) => {

  const {
   badges_icon,
   color,
   deal,
   description,
   guarantee,
   id,
   id_cate,
   id_cate_detail,
   id_manufacturer,
   image_large,
   images,
   name,
   price,
   quantity_buy,
   rate,
   size_products,
   support_delivery,
   top_deal,
   madein
  } = data;

  return (
    <Link
      href={`/detail/${id}`}
      className={`w-[16%]  border bg-white border-gray-200 pb-1 rounded-md flex flex-col gap-1 hover:shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] cursor-pointer flex-shrink-0 ${rest.className}`}
    >
      <Image
        src={`http://localhost:8080/img/${image_large}`}
        width={200}
        height={200}
        alt={""}
        unoptimized
        className='rounded-tl-md w-full rounded-tr-md'
      />
      <div className='flex flex-col gap-1'>
        <div className='flex flex-col gap-1 min-h-40'>
          <div className='flex flex-col gap-1 mt-0.5 ml-1.5 min-h-12'>
            {top_deal && (
              <Image
                src={'http://localhost:8080/img/top-deal-1.png'}
                width={80}
                height={20}
                alt={""}
                unoptimized
              />
            )}
            {guarantee && (
              <Image
                src={'http://localhost:8080/img/chinh-hang.png'}
                width={80}
                height={20}
                alt={""}
                unoptimized
              />
            )}
          </div>
          <div className='text-xs leading-4 ml-1.5 max-h-8 h-20 line-clamp-2'>
           {description}
          </div>
          <Rate
            className='block text-[10px] ml-1.5 [&>li]:!me-0.5 text-yellow-400'
            allowHalf
            disabled
            defaultValue={rate}
          />
          <div className='ml-1.5'>
            {top_deal ? (
              <>
                <span className='text-[#ff424e] font-semibold'>
                  {formatCurrency(
                    'vi-VN',
                    'VND',
                    price - (price * deal) / 100,
                  )}

                  <sup>₫</sup>
                </span>

                <div className=''>
                  <div className='bg-gray-200 inline text-xs font-medium px-1 rounded-full w-fit text-black'>
                    {deal}%
                  </div>

                  <div className='line-through text-gray-500 inline text-[11px] ml-1'>
                    {formatCurrency('vi-VN', 'VND', price)}

                    <sup>₫</sup>
                  </div>
                </div>
              </>
            ) : (
              <span className='text-black font-semibold tracking-tight'>
                {formatCurrency('vi-VN', 'VND', price)}
                <sup>₫</sup>
              </span>
            )}
          </div>
        </div>
        <div className='mb-3.5 ml-2.5'>
          {madein && <div className=' text-[10px] h-0'>Made in {madein}</div>}
        </div>
        <hr className='block w-[90%] self-center' />

      
        <div className='ml-0.5 text-[10px] text-gray-500 flex flex-row items-center justify-start gap-2 px-1 max-h-5'>
          {support_delivery==true ? (
            <>
              <Image
                src={'http://localhost:8080/img/ship.png'}
                width={32}
                height={16}
                alt={'shipping'}
                unoptimized
              />
         
            </>
          ) : (
            <>
              <Image
                src={'http://localhost:8080/img/ship.png'}
                width={32}
                height={16}
                alt={'shipping'}
                unoptimized
              />
              <span className='text-[10px] text-gray-500'>
               
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
 
  );
};
