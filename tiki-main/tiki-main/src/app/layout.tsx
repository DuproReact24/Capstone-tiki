import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { Header, Footer } from '@/components/shared';
import StoreProvider from '@/providers/StoreProvider';
import ToastProvider from '@/lib/react-toastify/ToastProvider';
import ClientWrapper from '@/components/ClientWrapper/ClientWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tiki - Mua hàng giá tốt, hàng chuẩn, ship nhanh',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <link rel='icon' href='/favicon.png' />
      <body className={inter.className}>
        <ToastProvider>
        <StoreProvider>
<ClientWrapper>
<Header />
        <main className='flex justify-center flex-col mt-5 w-full'>
   
        
          <div className='w-full flex justify-center flex-col items-center ml-0'>
          
          {children}
     
          </div>
  
         
        </main>
        <Footer />
</ClientWrapper>
      </StoreProvider>
          </ToastProvider>
  
 
       
      </body>
    </html>
  );
}
