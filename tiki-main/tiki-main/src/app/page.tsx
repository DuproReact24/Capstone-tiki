'use client';
import { SliderBanner } from '@/components/home';
import { Tabs, ListProduct } from '@/components/shared';
import Image from 'next/image';

import brands from '@/data/brands.json';
import { Countdown } from '@/components/shared/Countdown';
import { ListBrand } from '@/components/home/ListBrand';
import { useEffect, useRef, useState } from 'react';
import { CardProduct } from '@/components/shared/CardProduct';
import RecommendToday from '@/components/recommendtoday/RecommendToday';
import { useSelector } from 'react-redux';
import { useAppSelector } from '@/lib/hooks';


export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem('persist:root');
  const [apiCalled, setApiCalled] = useState(false);
  const [data,setDate] = useState<any>([])

  const [products, setProducts] = useState<any>([]);
  useEffect(() => {

    if (token && !apiCalled) {
      // Nếu token là truthy và apiCalled là false
      setApiCalled(true);  // Đánh dấu là đã gọi API
      fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
    }).then(() => {}).catch(() => { 
      console.log("ko thanh cong")
     })
    
    }
  }, [token,apiCalled]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null, // viewport
        rootMargin: '0px', // no margin
        threshold: 0.5, // 50% of target visible
      },
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    // Clean up the observer
    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  });
  useEffect(() => { 
   fetch('http://localhost:8080/get-cate',
    {
      method: 'GET',
     }
  ).then(async(res) => { 
    const data = await res.json();
    console.log(1,data.data)
    setDate(data)
   })


   },[])
     useEffect(() => { 


fetch('http://localhost:8080/get-products',
  {
    method: 'GET',
   }
).then(async(res) => { 
  const data = await res.json();

  setProducts(data)
 })
    },[])
   const data1 = useAppSelector((state) => { state.product.product })
   console.log({data1})
  return (
    <>
      <SliderBanner  >
        <div className='w-full h-full flex flex-row shrink-0 gap-3'>`
          <div className='w-1/2 h-full relative'>
            <Image
              className='rounded-lg'
              src='/banner-1-1.webp'
              fill
              unoptimized
              alt=''
            />
          </div>
          <div className='w-1/2 h-full relative'>
            <Image
              className='rounded-lg'
              src='/banner-1-2.webp'
              fill
              unoptimized
              alt=''
            />
          </div>
        </div>

        <div className='w-full h-full flex flex-row shrink-0 gap-3'>
          <div className='w-1/2 h-full relative'>
            <Image
              className='rounded-lg'
              src='/banner-2-1.webp'
              fill
              unoptimized
              alt=''
            />
          </div>
          <div className='w-1/2 h-full relative'>
            <Image
              className='rounded-lg'
              src='/banner-2-2.webp'
              fill
              unoptimized
              alt=''
            />
          </div>
        </div>

        <div className='w-full h-full flex flex-row shrink-0 gap-3'>
          <div className='w-1/2 h-full relative'>
            <Image
              className='rounded-lg'
              src='/banner-3-1.webp'
              fill
              unoptimized
              alt=''
            />
          </div>
          <div className='w-1/2 h-full relative'>
            <Image
              className='rounded-lg'
              src='/banner-3-2.webp'
              fill
              unoptimized
              alt=''
            />
          </div>
        </div>
      </SliderBanner>
      <div className='flex flex-row w-2/3  relative'>
      <div className=' '>
      <div className='bg-white rounded-tl-xl rounded-tr-xl pr-1 pt-4 mb-2 mr-2 '>
<span className='font-semibold text-md ml-3'>Gợi ý hôm nay</span>
<div className='mt-5'>
 {data.data?.map((item:any,index:number) => { 
  return <>

<RecommendToday  item={item} key={index} updateState ={setProducts}/>
</>
  })}

  
</div>
</div>
      </div>
    <div className=''>
    <div className='bg-white h-32 rounded-lg flex flex-row w-100 gap-5 justify-center pt-4 mb-3'>
        <a className='flex flex-col items-center  text-sm font-medium gap-2 max-w-24'>
          <Image
            className='rounded-xl border border-gray-200'
            src='/top-deal.png'
            width={44}
            height={44}
            unoptimized
            alt='top-deal'
          />
          <span className='text-[#D93843]'>TOP DEAL</span>
        </a>

        <a className='flex flex-col items-center  text-sm font-medium gap-2 max-w-24'>
          <Image
            className='rounded-xl border border-gray-200'
            src='/tiki-trading.png'
            width={44}
            height={44}
            unoptimized
            alt='tiki-trading'
          />
          <span>Tiki Trading</span>
        </a>

        <a className='flex flex-col items-center text-sm font-medium gap-2 max-w-24'>
          <Image
            className='rounded-xl border border-gray-200'
            src='/coupon-sieu-hot.png'
            width={44}
            height={44}
            unoptimized
            alt='coupon-sieu-hot'
          />
          <span className='text-center'>Coupon siêu hot</span>
        </a>

        <a className='flex flex-col items-center  text-sm font-medium gap-2 max-w-24'>
          <Image
            className='rounded-xl border border-gray-200'
            src='/xa-kho-giam-nua-gia.png'
            width={44}
            unoptimized
            height={44}
            alt='xa-kho-giam-nua-gia'
          />
          <span className='text-center'>Xả kho giảm nửa giá</span>
        </a>

        <a className='flex flex-col items-center  text-sm font-medium gap-2 max-w-24'>
          <Image
            className='rounded-xl border border-gray-200'
            src='/hang-ngoai-gia-hot.png'
            width={44}
            height={44}
            unoptimized
            alt='hang-ngoai-gia-hot'
          />
          <span className='text-center'>Hàng ngoại giá hot</span>
        </a>

        <a className='flex flex-col items-center  text-sm font-medium gap-2 max-w-24'>
          <Image
            className='rounded-xl border border-gray-200'
            src='/cung-me-cham-be.webp'
            width={44}
            height={44}
            unoptimized
            alt='cuong-me-cham-be'
          />
          <span className='text-center'>Cùng mẹ chăm bé</span>
        </a>

        <a className='flex flex-col items-center  text-sm font-medium gap-2 max-w-24'>
          <Image
            className='rounded-xl border border-gray-200'
            src='/mot-sach-tiki.webp'
            width={44}
            height={44}
            unoptimized
            alt='mot-sach-tiki'
          />
          <span className='text-center'>Mọt sách Tiki</span>
        </a>
        <a className='flex flex-col items-center  text-sm font-medium gap-2 max-w-24'>
          <Image
            className='rounded-xl border border-gray-200'
            src='/the-gioi-cong-nghe.webp'
            width={44}
            height={44}
            unoptimized
            alt='the-gioi-cong-nghe'
          />
          <span className='text-center'>Thế giới công nghệ</span>
        </a>

        <a className='flex flex-col items-center  text-sm font-medium gap-2 max-w-24'>
          <Image
            className='rounded-xl border border-gray-200'
            src='/yeu-bep-nghien-nha.webp'
            width={44}
            height={44}
            unoptimized
            alt='yeu-bep-nghien-nha'
          />
          <span className='text-center'>Yêu bếp nghiện nhà</span>
        </a>

        <a className='flex flex-col items-center  text-sm font-medium gap-2 max-w-24'>
          <Image
            className='rounded-xl border border-gray-200'
            src='/khoe-dep-toan-dien.webp'
            width={44}
            height={44}
            unoptimized
            alt='khoe-dep-toan-dien'
          />
          <span className='text-center'>Khỏe đẹp toàn diện</span>
        </a>
      </div>
      
      <div className='relative rounded-lg mb-4 w-100' ref={targetRef}>
      
      <div className='flex flex-col'>
      <div className='flex flex-row flex-wrap gap-2 mt-2'>
          {products.data?.map((product: any) => {
           
      
           return <CardProduct data={product} key={product.id} />;
          })}
        </div>
        <div className='p-2 border mt-10 px-20 self-center rounded-md text-blue-500 border-blue-500'>
          Xem Thêm
        </div>
      </div>
       
      </div>
    </div>  
      </div>

    </>
  );
}
