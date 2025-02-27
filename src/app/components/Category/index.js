'use client';

import { useRouter } from 'next/navigation';

export default function Category({ value }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products/category/${value.toLowerCase()}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="flex justify-center items-center bg-gray-100 w-32 h-32 text-black rounded-md hover:bg-gray-200 cursor-pointer"
    >
      <p>{value}</p>
    </div>
  );
}
