'use client';
import { Checkbox, Tooltip } from 'antd';
import Image from 'next/image';
import {
  TrashIcon,
  InformationCircleIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';

import cart from '@/data/cart.json';
import { ItemCart } from '@/components/cart/ItemCart';
import { formatCurrency } from '@/utils';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { successCart } from '@/features/cart/cartSlice';
import ticketsData from '../../mocks/ticket.json';

export default function Page() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state: any) => state.auth.user.id);
  const items = useAppSelector((state: any) => state.cart.items);

  const [isEditing, setIsEditing] = useState(false);
  const [addressInfo, setAddressInfo] = useState({
    name: 'Nguyen Phuc Thinh',
    phone: '0896359374',
    label: 'Nha',
    address: '13 Duong so 14, Binh Tan, HCM',
  });

  const [data, setData] = useState([]);
  const [datames, setDatamessage] = useState({});
  const [selectedCoupons, setSelectedCoupons] = useState<number[]>([]);
  const [totalDiscount, setTotalDiscount] = useState<number>(0);

  const totalPrice = items.reduce((sum: any, item: any) => sum + item.price, 0);

  const toggleSelect = (id: number, discount: number) => {
    setSelectedCoupons((prevSelected) => {
      if (prevSelected.includes(id)) {
        setTotalDiscount((prev) => prev - discount);
        return prevSelected.filter((couponId) => couponId !== id);
      } else {
        setTotalDiscount((prev) => prev + discount);
        return [...prevSelected, id];
      }
    });
  };

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8080/get-cart/${user}`, {
        method: 'GET',
      }).then(async (res) => {
        const data = await res.json();
        setData(data.data);
      });
    }
  }, []);

  const handleSubmit = (data: any) => {
    const { items, addressInfo } = data;
    if (items.length === 0) {
      toast('Vui Lòng Chọn Đơn hàng', { position: 'top-right', autoClose: 2000, transition: Bounce });
      return;
    }

    const payload = {
      products: items.map((item: any) => ({
        image_large: item.image_large,
        description: item.description,
        top_deal: item.top_deal,
        support_delivery: item.support_delivery,
        guarantee: item.guarantee,
        price: item.price,
        id_user: item.id_user,
        name: addressInfo.name,
        phone: addressInfo.phone,
        address: addressInfo.address,
      })),
    };

    fetch(`http://localhost:8080/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (res.status === 204 || res.status === 201) {
          const data = await res.json();
          toast('Đặt hàng thành công', { position: 'top-right', autoClose: 2000, transition: Bounce });
          dispatch(successCart(data.data));
          router.push('/order');
        } else {
          const data = await res.json();
          setDatamessage(data);
        }
      })
      .catch((err) => {
        console.error('Lỗi fetch API:', err);
      });
  };

  return (
    <div className='w-[75%] flex-row flex'>
      <ToastContainer />
      <div>
        <span className='uppercase font-medium text-xl'>Giỏ hàng</span>
        <div className='h-8 rounded-md flex flex-row bg-white items-center text-sm'>
          <div className='ml-2 w-[45%] flex items-center gap-3'>
            <Checkbox />
            <span>Tất cả sản phẩm</span>
          </div>
          <span className='text-gray-500 w-[15%]'>Đơn giá</span>
          <span className='text-gray-500 w-[15%]'>Số lượng</span>
          <span className='text-gray-500 w-[15%]'>Thành tiền</span>
          <span className='text-gray-500 w-[10%] pr-5 flex justify-end'>
            <TrashIcon className='size-5' />
          </span>
        </div>
        <div className='w-full flex flex-col bg-white mt-2 pt-5 rounded-md mb-5'>
          {data.map((product: any) => (
            <ItemCart key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className='w-[25%] mt-7 ml-5'>
        {/* Địa chỉ giao hàng */}
        <div className='bg-white rounded-md p-4'>
          {isEditing ? (
            <form onSubmit={(e) => { e.preventDefault(); setIsEditing(false); }}>
              <input className='w-full border px-2 py-1 rounded mb-2' value={addressInfo.name} onChange={(e) => setAddressInfo({ ...addressInfo, name: e.target.value })} />
              <input className='w-full border px-2 py-1 rounded mb-2' value={addressInfo.phone} onChange={(e) => setAddressInfo({ ...addressInfo, phone: e.target.value })} />
              <input className='w-full border px-2 py-1 rounded mb-2' value={addressInfo.address} onChange={(e) => setAddressInfo({ ...addressInfo, address: e.target.value })} />
              <button type='submit' className='bg-blue-500 text-white px-4 py-1 rounded'>Lưu</button>
            </form>
          ) : (
            <>
              <div className='flex justify-between'>
                <span className='text-gray-500'>Giao tới</span>
                <button onClick={() => setIsEditing(true)} className='text-blue-500 text-sm'>Thay đổi</button>
              </div>
              <span className='text-sm font-semibold'>{addressInfo.name} | {addressInfo.phone}</span>
              <div><span className='text-gray-500 text-sm'>{addressInfo.address}</span></div>
            </>
          )}
        </div>

        {/* Coupon */}
        <div className='bg-white mt-3 p-4 rounded-md'>
          <div className='flex justify-between items-center'>
            <span className='text-xs font-medium'>Tiki Khuyến Mãi</span>
            <div className='text-gray-500 flex items-center gap-1'>
              <span className='text-sm'>Có thể chọn 2</span>
              <Tooltip placement='bottom' title='Áp dụng tối đa 1 Mã giảm giá Sản Phẩm và 1 Mã Vận Chuyển'>
                <InformationCircleIcon className='size-4 cursor-pointer' />
              </Tooltip>
            </div>
          </div>
          <div className='flex flex-col gap-4 mt-3'>
            {ticketsData.coupons.map((coupon) => {
              const isSelected = selectedCoupons.includes(coupon.id);
              return (
                <div key={coupon.id} className='relative'>
                  <Image src={coupon.image} unoptimized className='mt-3 relative' width={286} height={60} alt='coupon' />
                  <div className='absolute top-1/2 -translate-y-1/2 flex items-center'>
                    <Image src={coupon.brand.logo} unoptimized className='ml-1.5 rounded-lg' width={44} height={44} alt={coupon.brand.name} />
                    <div className='text-xs font-medium ml-4'>Giảm {coupon.discount}%</div>
                    <div onClick={() => toggleSelect(coupon.id, coupon.discount)} className={`rounded-md text-white text-xs p-1 ml-16 px-4 cursor-pointer ${isSelected ? 'bg-gray-400' : 'bg-blue-500'}`}>
                      {isSelected ? 'Bỏ chọn' : 'Chọn'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className='text-blue-500 mt-5 flex items-center gap-2'>
            <TicketIcon className='size-5' />
            <span className='text-xs'>Chọn hoặc nhập khuyến mãi khác</span>
          </div>
        </div>

        {/* Tổng tiền */}
        <div className='bg-white p-4 mt-3'>
          <div className='flex justify-between'>
            <span className='text-gray-700 text-sm'>Tạm tính</span>
            <span className='text-sm'>{formatCurrency('vi-VN', 'VND', totalPrice)}<sup>₫</sup></span>
          </div>
          <div className='flex justify-between mt-2'>
            <span className='text-gray-700 text-sm'>Giảm giá</span>
            <span className='text-sm'>-{formatCurrency('vi-VN', 'VND', (totalDiscount / 100) * totalPrice)}<sup>₫</sup></span>
          </div>
          <hr className='my-5' />
          <div className='flex justify-between mt-2'>
            <span className='text-gray-700 text-sm'>Tổng tiền</span>
            <div className='flex flex-col items-end'>
              <span className='text-red-600 text-2xl'>{formatCurrency('vi-VN', 'VND', totalPrice - (totalDiscount / 100) * totalPrice)}<sup>₫</sup></span>
              <span className='text-xs text-gray-500'>(Đã bao gồm VAT nếu có)</span>
            </div>
          </div>
        </div>

        <button className='bg-red-500 mt-3 rounded-md text-white py-3 w-full' onClick={() => handleSubmit({ items, addressInfo })}>
          Mua hàng
        </button>
      </div>
    </div>
  );
}