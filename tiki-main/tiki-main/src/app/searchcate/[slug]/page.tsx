'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CardProduct } from '@/components/shared/CardProduct';

export default function Page({ params }: { params: { slug: any } }) {
  const { slug } = params;
  console.log(slug)
  const [data, setData] = useState([]);
  const searchParams = useSearchParams();
  const name = searchParams.get('name');

  useEffect(() => {

    const fetchData = async () => {
      
     
     const url = `http://localhost:8080/get-products-cate/${slug}`;
     
   
      const res = await fetch(url);
      const result = await res.json();
      console.log({result})
      setData(result.data);
    };

    fetchData();
  }, [name, slug]); // ← Thêm dependency để re-run nếu query name hoặc slug đổi

  return (
    <nav>
      <div className='flex flex-row flex-wrap gap-2 mb-5'>
        {data.map((product: any, index) => (
          <CardProduct className='w-[23%]' key={index} data={product} />
        ))}
      </div>
    </nav>
  );
}
