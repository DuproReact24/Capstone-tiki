'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { CheckIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

import {
  TruckIcon,
  InformationCircleIcon,
  ArchiveBoxXMarkIcon,
  ReceiptRefundIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import { Input, InputRef, Rate, Tooltip } from 'antd';
import { formatCurrency } from '@/utils';
import { SliderBanner } from '@/components/home';
import { ListProduct } from '@/components/shared';
import products from '@/data/products.json';
import { CardProduct } from '@/components/shared/CardProduct';
import { useAppSelector } from '@/lib/hooks';
import { useDispatch } from 'react-redux';
import ClientWrapper from '@/components/ClientWrapper/ClientWrapper';
import { Bounce, toast, ToastContainer } from 'react-toastify';

export default function Page({ params }: { params: { slug: string } }) {
  const [image, setImage] = useState<any>([]);

  const [newImg, setImg] = useState<any>('');
  const inputRef = useRef<InputRef>(null);
  const handlePrice = (type: string) => {
    switch (type) {
      case '+': {
        if (inputRef.current?.input) {
          inputRef.current.input.value = (
            parseInt(inputRef.current.input.value) + 1
          ).toString();
        }

        break;
      }
      case '-': {
        if (inputRef.current?.input) {
          if (parseInt(inputRef.current.input.value) <= 1) return;
          inputRef.current.input.value = (
            parseInt(inputRef.current.input.value) - 1
          ).toString();
          console.log('minus');
        }

        break;
      }
      default:
        console.log('default');
    }
  };
  const [data, setData] = useState<any>({});

  const [itemorther, setItemOrther] = useState<any>([]);
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  

  const filteredProducts = itemorther.filter((product: any) =>
    product?.name?.toLowerCase().includes(data?.name?.toLowerCase()),
  );
  const filteredProductsTopDeals = itemorther.filter(
    (product: any) =>
      product?.top_deal === true &&
      product?.name?.toLowerCase().includes(data?.name?.toLowerCase() || ''),
  );
  useEffect(() => {
    const savedAddress = localStorage.getItem('address'); // Lấy dữ liệu từ localStorage
    if (savedAddress) {
      const parsedAddress = JSON.parse(savedAddress); // Chuyển đổi lại thành object
      setProvince(parsedAddress.province); 
      setDistrict(parsedAddress.district); 
      setWard(parsedAddress.ward); 
    }
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8080/get-products/${params.slug}`, {
      method: 'GET',
    }).then(async (res) => {
      const newdata = await res.json();
      const { data } = newdata;
      const image = JSON.parse(data.images);
      setImage(image);
      setData(data);
    });
  }, []);
  useEffect(() => {
    
    fetch('http://localhost:8080/get-products-orthers', {
      method: 'GET',
    }).then(async (res) => {
      const newdata = await res.json();

      const { data } = newdata;

      setItemOrther(data);
    });
  }, []);
const handleAddtoCart =(data:any)=>{
  const payload = {
    id_user:+user,
    description:data.description,
    support_delivery:data.support_delivery,
    top_deal:data.top_deal,
    price:data.price,
    image_large:data.image_large,
    address:province+district+ward,
    
  }

  
  fetch('http://localhost:8080/add-cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then(async (res) => {
    toast('Thêm vỏ hàng thành công', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      });
   
  }).catch((error) => {
    console.error('Network error:', error);
  });
}
const user = useAppSelector((state: any) => state.auth.user.id);

  return (
    <ClientWrapper>
      <ToastContainer/>
      <div className='flex flex-row mb-5 gap-6 w-[90%]'>
      <div className='flex flex-col w-[27%] bg-white p-4 rounded-md sticky h-fit top-5'>
        <Image
          className='rounded-lg w-full'
          src={
            newImg == ''
              ? `http://localhost:8080/img/${data.image_large}`
              : newImg
          }
          width={368}
          height={368}
          alt='Product'
          unoptimized
        />
        <div className='flex flex-row gap-2 mt-2'>
          {image?.map((item: any, index: number) => (
            <Image
              className='border-gray-100 border p-1 rounded-md '
              src={`http://localhost:8080/img/${item}`}
              width={47}
              height={47}
              onMouseEnter={() => {
                setImg(`http://localhost:8080/img/${item}`);
              }}
              alt='Product'
              unoptimized
              key={index}
            />
          ))}
        </div>
        <hr className='my-3' />
        <div className='flex flex-row justify-between items-center'>
          <div className='flex flex-row items-center gap-2 '>
            <Image src='/ai.png' width={26} height={26} alt='Tiki' />
            <span className='text-gray-500 text-sm'>Xem thêm</span>
            <span className='text-sm'> Ưu điểm & lưu ý của sản phẩm </span>
          </div>
          <ChevronRightIcon className='size-5' />
        </div>
      </div>
      <div className='w-[40%] flex flex-col gap-4'>
        <div className='bg-white p-3 rounded-lg h-fit'>
          <div className='flex flex-row gap-2 items-center'>
            <Image
              src='/top-deal-1.png'
              width={110}
              height={20}
              alt='Product'
              unoptimized
            />
            <Image
              src='/chinh-hang.png'
              width={120}
              height={20}
              alt='Product'
              unoptimized
            />
            <span className='text-sm'>
              Thương hiệu: <span className='text-blue-500'>Nutushop</span>
            </span>
          </div>
          <span className='font-medium text-2xl mt-2 inline-block'>
            {data.description}
          </span>
          <div className='flex flex-row items-center gap-2 mt-2'>
            <span className='text-md font-medium'>{data.rate}</span>
            <Rate defaultValue={5} allowHalf disabled className='text-[16px]' />
            <span className='text-gray-500'>(37)</span>
            <span className='text-gray-300 text-xs'>|</span>
            <span className='text-gray-500'>{data.quantity_buy}</span>
          </div>
          <div>
            <span className='font-semibold text-2xl mt-2 inline-block'>
              {formatCurrency('vi-VN', 'VND', Number(data.price))}
            </span>
            <sup>₫</sup>
          </div>
          <div className='border border-gray-200 rounded-lg p-2 mt-2 flex flex-col'>
            <span>Giá sau khuyến mãi:</span>
            <span className='text-red-500 text-3xl font-semibold mb-2 inline-block'>
              {formatCurrency(
                'vi-VN',
                'VND',
                data.price * (1 - data.deal / 100),
              )}
              <sup>₫</sup>
            </span>
            <div className='flex flex-row items-center gap-2'>
              <CheckIcon className='size-4 text-blue-500' />
              <span className='font-medium'>
                Giảm{' '}
                {formatCurrency(
                  'vi-VN',
                  'VND',
                  data.price - data.price * (1 - data.deal / 100),
                )}
                <sup>₫</sup>
                <span className='ml-1 text-gray-500 font-normal'>
                  từ coupon của Tiki
                </span>
              </span>
            </div>
            <div className='text-sm my-2'>Khuyến mãi có thể hết sớm</div>
          </div>
        </div>
        <div className='bg-white p-4 rounded-lg h-fit'>
          <span className='text-lg font-semibold block mb-2'>
            Thông tin vận chuyển
          </span>

          <span className='mt-4 block'>
            Giao đến {district ? `Q. ${district},` : ''}
            {ward ? ` P. ${ward},` : ''}
            {province}
          </span>

          <div className='flex flex-row items-center gap-2 mt-3'>
            <TruckIcon className='size-6 text-gray-500' />
            <span className=' text-md font-medium'>Giao Thứ Sáu</span>
          </div>
          <span className='mb-4 block'>
            Trước 19h, 12/07:{' '}
            <span className='mr-2'>
              {formatCurrency('vi-VN', 'VND', 8000)}
              <sup>₫</sup>
            </span>
            <span className='text-gray-500 line-through'>
              {formatCurrency('vi-VN', 'VND', 23000)}
              <sup>₫</sup>
            </span>
          </span>
        </div>
        <div className='bg-white p-4 rounded-lg h-fit'>
          <span className='text-lg font-semibold block mb-2'>Ưu đãi khác</span>
          <div className='flex flex-row justify-between'>
            <span>10 Mã giảm giá</span>
            <div className='flex flex-row gap-3 items-center text-blue-600 font-medium'>
              <span className='border rounded-lg border-gray-200 p-1 px-2'>
                Giảm 70K
              </span>
              <span className='border rounded-lg border-gray-200 p-1 px-2'>
                Giảm 65K
              </span>
              <ChevronRightIcon className='size-7 text-gray-500' />
            </div>
          </div>
        </div>
        {/* <div className='bg-white p-4 rounded-lg h-fit'>
          <span className='text-lg font-semibold block mb-2'>
            Dịch vụ bổ sung
          </span>

          <div className='flex flex-row justify-between items-center'>
            <div className='gap-2 flex flex-row items-center'>
              <Image
                src='/tiki-card.png'
                width={44}
                height={44}
                alt='Tiki'
                unoptimized
              />
              <span className='text-md font-medium'>
                Ưu đãi đến 600k với thẻ TikiCard
              </span>
            </div>
            <span className='text-blue-600 cursor-pointer'>Đăng ký</span>
          </div>

          <div className='flex flex-row justify-between items-center mt-3'>
            <div className='gap-2 flex flex-row items-center'>
              <Image
                className='rounded-2xl'
                src='/paylater.png'
                width={44}
                height={44}
                alt='Tiki'
                unoptimized
              />
              <span className='text-md font-medium'>Mua trước trả sau</span>
            </div>
            <span className='text-blue-600 cursor-pointer'>Đăng ký</span>
          </div>
        </div> */}
        <div className='bg-white p-4 rounded-lg h-fit'>
          <span className='text-lg font-semibold block mb-2'>
            Sản phẩm liên quan
          </span>
          <div className='flex flex-row flex-wrap gap-3'>
            {filteredProducts.slice(0, 10).map((product: any, index: any) => (
              <CardProduct className='w-[23%]' key={index} data={product} />
            ))}
          </div>
        </div>
        <div className='bg-white p-4 rounded-lg h-fit overflow-hidden'>
          <span className='text-lg font-semibold block mb-2'>Top deals</span>
          <ListProduct
            data={filteredProductsTopDeals.slice(0, 7)}
            cardStyle='w-[23%]'
          />
        </div>

        <div className='bg-white p-4 rounded-lg h-fit'>
          <span className='text-lg font-semibold block mb-2'>
            Thông tin bảo hành
          </span>
          <div>
            <div>
              <span>Thời gian bảo hành: </span>
              <span className='font-medium '>{data.guarantee}</span>
              <hr className='mt-3' />
            </div>

            <div>
              <span>Hình thức bảo hành: </span>
              <span className='font-medium '>Phiếu bảo hành</span>
              <hr className='mt-3' />
            </div>
            <div>
              <span>Nơi bảo hành: </span>
              <span className='font-medium '>
                Bảo hành bởi nhà bán hàng thông qua Tiki
              </span>
              <hr className='mt-3' />
            </div>
            <div>
              <span>Hướng dẫn bảo hành: </span>
              <span className='font-medium text-blue-600 '>Xem chi tiết</span>
              <hr className='mt-3' />
            </div>
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg h-fit'>
          <span className='text-lg font-semibold block mb-2'>
            An tâm mua sắm
          </span>
          <div>
            <div>
              <div className='flex flex-row items-center gap-2'>
                <ArchiveBoxXMarkIcon className='size-6 text-blue-600 font-medium' />
                <span>Được đồng kiểm khi nhận hàng</span>
              </div>
              <hr className='mt-3' />
            </div>

            <div>
              <div className='flex flex-row items-center gap-2'>
                <ReceiptRefundIcon className='size-6 text-blue-600 font-medium' />
                <span>Được hoàn tiền 200% nếu là hàng giả.</span>
              </div>
              <hr className='mt-3' />
            </div>

            <div>
              <div className='flex flex-row items-start gap-2'>
                <CubeIcon className='size-6 text-blue-600 font-medium' />
                <div className='flex flex-col'>
                  <div>Đổi trả miễn phí: </div>
                  <ul className='w-[90%] list-disc ml-5'>
                    <li>
                      Đổi trả miễn phí trong 30 ngày khi bạn đổi ý hoặc sản phẩm
                      không đúng cam kết.
                    </li>
                    <li>Trong 365 ngày khi có lỗi từ nhà sản xuất.</li>
                  </ul>
                  <span className='text-black underline cursor-pointer'>
                    Chi tiết
                  </span>
                </div>
              </div>
              <hr className='mt-3' />
            </div>
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg h-fit'>
          <span className='text-lg font-semibold block mb-2'>
            Thông tin chi tiết
          </span>
          <div className='flex flex-col w-full'>
            <div className='grid grid-cols-2'>
              <span className='text-gray-500'>
                Sản phẩm có được bảo hành không?
              </span>
              <span>Có</span>
            </div>

            <hr className='my-2' />
            <div className='grid grid-cols-2 w-full'>
              <span className='text-gray-500'>Hình thức bảo hành</span>
              <span>Phiếu bảo hành</span>
            </div>

            <hr className='my-2' />
            <div className='grid grid-cols-2'>
              <span className='text-gray-500'>Thời gian bảo hành</span>
              <span>12</span>
            </div>
          </div>
        </div>
      </div>
      <div className='w-[23%] flex flex-col'>
        <div className='p-4 bg-white flex flex-col rounded-lg'>
          
          <hr className='my-3 block' />
          <div>
            <span className='text-lg font-semibold mb-3 block'>Số lượng</span>
            <div className='flex flex-row gap-1 '>
              <div
                className='w-10 cursor-pointer hover:bg-gray-100 text-gray-500 text-2xl font-semibold h-8 flex items-center justify-center border rounded-md border-gray-200'
                onClick={() => {
                  handlePrice('-');
                }}
              >
                -
              </div>
              <Input
                ref={inputRef}
                className='w-10 h-8 text-center'
                type='number'
                defaultValue={1}
              />

              <div
                className='w-10 cursor-pointer hover:bg-gray-100  text-gray-500 text-2xl font-semibold h-8 flex items-center justify-center border rounded-md border-gray-200'
                onClick={() => {
                  handlePrice('+');
                }}
              >
                +
              </div>
            </div>

            <span className='text-lg font-semibold mt-3 inline-block'>
              Tạm tính
            </span>
            <div className='text-3xl mt-3 font-semibold flex flex-row items-center'>
              <span>
                {formatCurrency('vi-VN', 'VND',   data.price * (1 - data.deal / 100))}
                <sup>₫</sup>
              </span>

              <Tooltip
                color='white'
                placement='bottom'
                title={
                  <div className='p-3'>
                    <div className='flex flex-row items-center gap-1 text-black'>
                      <div className='flex flex-row gap-2 items-center text-lg'>
                        <CheckIcon className='size-4 text-blue-500' />
                        <div className='text-md font-medium'>
                          {formatCurrency('vi-VN', 'VND', 6400)}
                          <sup>₫</sup>
                        </div>
                      </div>
                      <span className='text-gray-500 text-md'>
                        từ coupon của Tiki
                      </span>
                    </div>
                    <div className='text-xs text-black mt-3'>
                      Khuyến mãi có thể hết sớm
                    </div>
                  </div>
                }
              >
                <InformationCircleIcon className='ml-3 size-6 text-gray-500' />
              </Tooltip>
            </div>
            <div>
             
              <button className='bg-white text-blue-500 border border-blue-500 rounded-md w-full h-10 mt-3' onClick={() => { 
                handleAddtoCart(data)
               }}>
                Thêm vào giỏ
              </button>
              <button className='bg-white text-blue-500 border border-blue-500 rounded-md w-full h-10 mt-3'>
                Mua trước trả sau
              </button>
            </div>
          </div>
        </div>
        <SliderBanner className='h-fit mt-5'>
          <div className='w-full h-32 flex flex-row shrink-0 gap-3'>
            <div className='w-full h-32 relative'>
              <Image
                className='rounded-lg'
                src='/banner-d-1.png'
                fill
                unoptimized
                alt=''
              />
            </div>
          </div>

          <div className='w-full h-32 flex flex-row shrink-0 gap-3'>
            <div className='w-full h-32 relative'>
              <Image
                className='rounded-lg'
                src='/banner-d-2.png'
                fill
                unoptimized
                alt=''
              />
            </div>
          </div>

          <div className='w-full h-32 flex flex-row shrink-0 gap-3'>
            <div className='w-full h-32 relative'>
              <Image
                className='rounded-lg'
                src='/banner-d-1.png'
                fill
                unoptimized
                alt=''
              />
            </div>
          </div>
        </SliderBanner>
      </div>
    </div>
     
     </ClientWrapper>
  );
}
