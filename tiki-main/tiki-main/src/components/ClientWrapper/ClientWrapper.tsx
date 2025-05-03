'use client';
import { useEffect, useState } from 'react';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, []);

  return loading ? (
    <div className="flex justify-center items-center min-h-screen">
 <div className="animate-spin h-12 w-12 border-[6px] border-blue-500 border-t-transparent rounded-full"></div>
  </div>
  

  ) : (
    <>{children}</>
  );
}
