'use client';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { Input } from './Input';
import {
  MagnifyingGlassIcon,
  HomeIcon,
  ShoppingCartIcon,
  CheckBadgeIcon,
  CubeIcon,
  TruckIcon,
  TagIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/20/solid';
import { MapPinIcon, FaceSmileIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth, setNameUser } from '@/features/login/loginSlice';
import { RootState } from '@/lib/store';
import { useAppSelector } from '@/lib/hooks';

export const Header = () => {
  const router = useRouter();
  const refSearch = useRef<any>();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenOtp, setIsModalOpenOtp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 phút
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const locationData: Record<string, Record<string, string[]>> = {
    'Hồ Chí Minh': {
      'Bình Tân': ['An Lạc A', 'Bình Trị Đông', 'Tân Tạo'],
      'Quận 1': ['Bến Nghé', 'Nguyễn Thái Bình'],
    },
    'Hà Nội': {
      'Cầu Giấy': ['Dịch Vọng', 'Nghĩa Tân'],
      'Ba Đình': ['Kim Mã', 'Liễu Giai'],
    },
  };

  const [isOpen, setIsOpen] = useState(false); // Quản lý popup
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  const [phone, setPhone] = useState<string>('');

  const dispatch = useDispatch();
  const handleSearch = () => {  
    router.push(`/search?name=${refSearch.current.value}`);
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const phoneRegex = /^0\d{9}$/;

    if (phoneRegex.test(value)) {
      setPhone(value);
    } else {
      console.log('Số điện thoại không hợp lệ');
    }
  };
  const handleSubmit = async (phone: Number) => {
    try {
      await fetch('http://localhost:8080/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setIsModalOpenOtp(true);
        })
        .catch((err) => {
          console.error('Lỗi rồi:', err);
        });
    } catch (error) {}
  };
  const handleFind =(id:any)=>{
    router.push(`searchcate/${id}`)
  }

  const [data,setData] = useState<any>([])
  const handleChangeOtp = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    // Chỉ cho phép số
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };
  const handleSubmitOtp = async (phone: string, code: string) => {
    try {
      const res = await fetch('http://localhost:8080/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone,
          code,
        }),
      });
      const data = await res.json();

      if (data.status === 200) {
        dispatch(
          setAuth({
            user: {
              id: data.data.res.id,
              phone: data.data.res.phone,
            },
            token: data.data.access_token,
          }),
        );
        setIsModalOpenOtp(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userFromLocalStorage = localStorage.getItem('persist:root');

      if (userFromLocalStorage) {
        const user = JSON.parse(userFromLocalStorage);

        const newUser = JSON.parse(user.auth);

        dispatch(setNameUser({ user: newUser.user?.phone }));
      }
    }
    if (isModalOpenOtp) {
      setTimeLeft(300); // reset về 5 phút
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsModalOpenOtp(false); // tắt modal khi hết giờ
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current!);
    }

    return () => clearInterval(timerRef.current!);
  }, [isModalOpenOtp]);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    // Lấy dữ liệu từ localStorage nếu có
    const savedAddress = localStorage.getItem('address');
    if (savedAddress) {
      const parsedAddress = JSON.parse(savedAddress);
      setProvince(parsedAddress.province);
      setDistrict(parsedAddress.district);
      setWard(parsedAddress.ward);
    }
  }, []);
   useEffect(() => { 
    fetch('http://localhost:8080/get-cate',
      {
        method: 'GET',
       }
    ).then(async(res) => { 
      
      const data = await res.json();
     
      setData(data.data)
     })
    },[])

   
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  const user = useAppSelector((state: any) => state.auth.nameUser);

  const [isMounted, setIsMounted] = useState(false);

  if (!isMounted) return null;
  return (
    <div className='bg-white border-b border-gray-200'>
      <nav className='flex flex-row items-center h-fit gap-1 justify-center pt-3 border-b pb-2.5'>
        <Link
          href='/'
          className='w-fit flex items-center justify-center flex-col mr-10'
        >
          <Image
            src='/logo.png'
            alt='Tiki'
            width={96}
            height={40}
            className=''
            unoptimized
          />
          <span className='text-[#053B8E] font-semibold text-sm mt-1'>
            Tốt & Nhanh
          </span>
        </Link>
        <div className='flex flex-col'>
          <div className='flex flex-row'>
            <Input
              ref={refSearch}
              onKeyUp={(event) => {
                if (event.key === 'Enter') {
                  handleSearch();
                }
              }}
              button={
                <button
                  onClick={() => {
                    handleSearch();
                  }}
                >
                  Tìm kiếm
                </button>
              }
              className='w-[58rem]'
              icon={<MagnifyingGlassIcon className='size-5 text-gray-500' />}
              placeholder='Bạn tìm kiếm gì hôm nay?'
            />

            <div className='flex flex-row gap-2 self-start ml-20'>
              <Link
                href='/'
                className='flex flex-row gap-1 cursor-pointer hover:bg-[#0a68ff33] font-medium w-fit p-2 rounded text-sm items-center justify-center'
              >
                <HomeIcon className='size-6 text-[#0560D9]' />
                <span className='text-blue-500'>Trang chủ</span>
              </Link>
              <div
                onClick={() => {
                  if (user) {
                    setIsModalOpen(false);
                  } else {
                    setIsModalOpen(true);
                  }
                }}
                className='relative flex flex-row gap-1 cursor-pointer hover:bg-[#0a68ff33]  w-fit p-2 rounded text-sm items-center justify-center '
              >
                <FaceSmileIcon className='size-6 text-gray-500' />

                {user == null ? (
                  <span className='text-gray-500'>login</span>
                ) : (
                  <div className='relative'>
                    <span className='text-gray-500'>{user}</span>
                    {/* Thêm menu logout */}
                    <div className='absolute left-0 w-full bg-white p-2 rounded shadow-md opacity-0 hover:opacity-100 transition-opacity duration-300 top-full mt-3'>
                      <span
                        onClick={() => {
                          window.localStorage.removeItem('persist:root');
                          window.location.reload();
                        }}
                        className='text-gray-500 cursor-pointer hover:text-red-500'
                      >
                        Logout
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <Link
                href='/cart'
                className='ml-10 relative  flex flex-row gap-1 cursor-pointer hover:bg-[#0a68ff33] w-fit p-2 rounded text-sm items-center justify-center before:w-[1px] before:h-3/6 before:absolute before:bg-[#BFC4CC] before:-left-5'
              >
                <ShoppingCartIcon className='size-6 text-[#0560D9]' />
              </Link>
            </div>
          </div>

          <div className='flex flex-row justify-between mt-2.5'>
            <div className='flex gap-3'>
             {data?.map((item:any,index:any) => { 
            
            return <>
            <a className='text-gray-500 lowercase cursor-pointer text-sm' onClick={() => { handleFind(item.id) }}>
            {item.name}
             </a></>
              })}
           
            </div>
            <div className='text-sm flex '>
              <MapPinIcon className='size-5 text-gray-500' />
              <span
  className="block cursor-pointer"
  onClick={() => setIsOpen(true)}
>
  Giao đến
  {district ? `Q. ${district},` : ''}  {/* Nếu có district từ state hoặc localStorage */}
  {ward ? ` P. ${ward},` : ''}  {/* Nếu có ward từ state hoặc localStorage */}
  {province}  {/* Tỉnh */}
</span>
              {isOpen && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
                  <div className='bg-white p-6 rounded-lg w-96'>
                    <h2 className='text-xl mb-4'>Chọn Địa Chỉ Giao Hàng</h2>
                    {/* Tỉnh / Thành */}
                    <select
                      value={province}
                      onChange={(e) => {
                        setProvince(e.target.value);
                        setDistrict('');
                        setWard('');
                      }}
                      className='border border-gray-300 rounded px-3 py-2 w-full mb-4'
                    >
                      <option value=''>Chọn Tỉnh / Thành</option>
                      {Object.keys(locationData).map((prov) => (
                        <option key={prov} value={prov}>
                          {prov}
                        </option>
                      ))}
                    </select>

                    {/* Quận / Huyện */}
                    {province && (
                      <select
                        value={district}
                        onChange={(e) => {
                          setDistrict(e.target.value);
                          setWard('');
                        }}
                        className='border border-gray-300 rounded px-3 py-2 w-full mb-4'
                      >
                        <option value=''>Chọn Quận / Huyện</option>
                        {Object.keys(locationData[province]).map((dist) => (
                          <option key={dist} value={dist}>
                            {dist}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Phường / Xã */}
                    {district && (
                      <select
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                        className='border border-gray-300 rounded px-3 py-2 w-full mb-4'
                      >
                        <option value=''>Chọn Phường / Xã</option>
                        {locationData[province][district].map((ward) => (
                          <option key={ward} value={ward}>
                            {ward}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Các nút điều khiển */}
                    <div className='mt-4 flex justify-end'>
                      <button
                        onClick={() => setIsOpen(false)} // Đóng popup
                        className='bg-gray-500 text-white px-4 py-2 rounded mr-2'
                      >
                        Hủy
                      </button>

                      <button
                        onClick={() => {
                          // Lưu địa chỉ vào localStorage
                          const address = {
                            province,
                            district,
                            ward,
                          };
                          localStorage.setItem(
                            'address',
                            JSON.stringify(address),
                          ); // Chuyển object thành string
                          setIsOpen(false); // Đóng popup
                        }}
                        className='bg-blue-500 text-white px-4 py-2 rounded'
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div></div>
        </div>
      </nav>
      <div className='flex flex-row gap-5 mt-2.5 items-center justify-start ml-56 mb-2.5'>
        <span className='font-semibold text-sm text-[#033A8C]'>Cam kết</span>
        <div className='flex flex-row gap-1  items-center cursor-pointer'>
          <CheckBadgeIcon className='size-5 text-[#0560D9]' />
          <span className='text-xs'>100% hàng thật</span>
        </div>
        <div className='text-gray-200'>|</div>
        <div className='flex flex-row gap-1 items-center cursor-pointer'>
          <CurrencyDollarIcon className='size-5 text-[#0560D9]' />
          <span className='text-xs'>Hoàn 200% nếu hàng giả</span>
        </div>

        <div className='text-gray-200'>|</div>
        <div className='flex flex-row gap-1 items-center cursor-pointer'>
          <CubeIcon className='size-5 text-[#0560D9]' />
          <span className='text-xs'>30 ngày đổi trả</span>
        </div>

        <div className='text-gray-200'>|</div>
        <div className='flex flex-row gap-1 items-center cursor-pointer'>
          <TruckIcon className='size-5 text-[#0560D9]' />
          <span className='text-xs'>Giao nhanh 2h</span>
        </div>

        <div className='text-gray-200'>|</div>
        <div className='flex flex-row gap-1 items-center cursor-pointer'>
          <TagIcon className='size-5 text-[#0560D9]' />
          <span className='text-xs'>Giá siêu rẻ</span>
        </div>
        <Modal
          closable={false}
          title={null}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          className=''
          width={950}
        >
          <div className='w-full flex flex-row relative '>
            <div
              onClick={() => {
                setIsModalOpen(false);
              }}
              className='w-10 h-10 bg-white rounded-full flex justify-center absolute items-center -top-3 -right-3 cursor-pointer font-bold'
            >
              X
            </div>

            <div className='p-16 flex flex-col mb-5 w-[70%]'>
              <div className='flex flex-col gap-5 mb-20'>
                <span className='text-3xl font-semibold'>Xin chào,</span>
                <span className='text-sm '>Đăng nhập hoặc Tạo tài khoản</span>

                {isModalOpenOtp ? (
                  <div className='flex gap-3 justify-center '>
                    {otp.map((_, index) => (
                      <input
                        key={index}
                        type='text'
                        maxLength={1}
                        name={`otp-${index}`}
                        value={otp[index]} // để giữ lại giá trị đã nhập
                        onChange={(e) => handleChangeOtp(e, index)}
                        ref={(el: HTMLInputElement | null) => {
                          inputsRef.current[index] = el;
                        }}
                        className='w-10 h-10 border border-gray-300 text-center text-xl'
                      />
                    ))}
                    <div className='flex justify-end items-end h-[40px] '>
                      <span className='text-sm text-red-500 align-bottom'>
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <input
                    type='number'
                    className='outline-none border-b border-blue-500 py-2 text-2xl w-full'
                    placeholder='Số điện thoại'
                    onChange={handleFormChange}
                  />
                )}

                {isModalOpenOtp ? (
                  <div
                    className=' cursor-pointer bg-red-500 p-2 text-white rounded-md flex items-center justify-center text-xl'
                    onClick={() => {
                      handleSubmitOtp(phone, otp.join(''));
                    }}
                  >
                    Gửi Otp
                  </div>
                ) : (
                  <div
                    className=' cursor-pointer bg-red-500 p-2 text-white rounded-md flex items-center justify-center text-xl'
                    onClick={() => {
                      handleSubmit(+phone);
                    }}
                  >
                    Tiếp Tục
                  </div>
                )}

                <span className='text-blue-500 cursor-pointer justify-self-center self-center'>
                  Đăng nhập bằng email
                </span>
              </div>
              <div className='self-center w-full flex flex-col gap-3'>
                <div className='flex flex-row gap-2 w-full items-center justify-center'>
                  <div className='h-[1px] bg-gray-100 w-[20%]'></div>
                  <div className='text-gray-500'>Hoặc tiếp tục bằng</div>
                  <div className='h-[1px] bg-gray-100 w-[20%]'></div>
                </div>
                <div className='flex flex-row gap-3 justify-center'>
                  <Image
                    alt='gg'
                    src='/gg.png'
                    width={60}
                    height={60}
                    unoptimized
                  />
                  <Image
                    alt='fb'
                    src='/fb.png'
                    width={60}
                    height={60}
                    unoptimized
                  />
                </div>
                <span className='w-[85%] mt-5 text-xs text-gray-500'>
                  Bằng việc tiếp tục, bạn đã đọc và đồng ý với điều khoản sử
                  dụng và Chính sách bảo mật thông tin cá nhân của Tiki
                </span>
              </div>
            </div>
            <div className='bg-sky-100 w-[30%] rounded-lg'>
              <div className='flex flex-col justify-center items-center h-full'>
                <Image
                  className='h-fit mb-7 '
                  src='/login.png'
                  width={200}
                  height={100}
                  alt='login'
                  unoptimized
                />
                <div className='text-blue-600 flex flex-col gap-2 justify-center items-center'>
                  <span className='text-lg font-semibold'>
                    Mua sắm tại Tiki
                  </span>
                  <span className='text-sm font-medium'>
                    Siêu ưu đãi mỗi ngày
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
