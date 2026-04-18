'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import 'aos/dist/aos.css';

import Hero from '@/components/sections/Hero';
import Vision from '@/components/sections/Vision';
import CoreValues from '@/components/sections/CoreValues';
import Ecosystem from '@/components/sections/Ecosystem';
import Membership from '@/components/sections/Membership';

export default function PublicSite() {
  const router = useRouter();

  useEffect(() => {
    const initAOS = async () => {
      const AOS = (await import('aos')).default;
      AOS.init({ duration: 800, once: true });
    };
    initAOS();
  }, []);

  // Thay vì mở Pop-up, ta điều hướng thẳng khách sang trang Đăng ký xịn sò
  const handleJoinClick = () => {
    router.push('/dang-ky');
  };

  return (
    <>
      {/* Truyền hàm chuyển trang xuống cho các nút bấm bên trong */}
      <Hero openRegisterModal={handleJoinClick} />
      <Vision />
      <CoreValues />
      <Ecosystem />
      <Membership openRegisterModal={handleJoinClick} />
    </>
  );
}