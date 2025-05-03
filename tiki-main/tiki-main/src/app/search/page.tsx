'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CardProduct } from '@/components/shared/CardProduct';

export default function Page({ params }: { params: { slug: any } }) {
  const { slug } = params;
  const [data, setData] = useState([]);
  const searchParams = useSearchParams();
  const name = searchParams.get('name');

  useEffect(() => {
   
    const fetchData = async () => {
      let url = '';
      if (!name) {
     const   url = `http://localhost:8080/get-product`;
      } else {
        url = `http://localhost:8080/search-product?name=${encodeURIComponent(name)}`;
      }
      console.log({url})
      const res = await fetch(url);
      const result = await res.json();
      setData(result);
    };

    fetchData();
  }, [name, slug]); // ← Thêm dependency để re-run nếu query name hoặc slug đổi

  return (
    <nav>
      <div className='flex flex-row gap-1 mb-5 container flex-wrap align'>
        {data.map((product: any, index) => (
          <CardProduct className='w-[25%] ' key={index} data={product} />
        ))}
      </div>
    </nav>
  );
}
