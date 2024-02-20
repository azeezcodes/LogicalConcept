"use client";
import { useEffect, useState, useRef } from "react";
type Product = {
   id: number;
   title: string;
   description: string;
   price: number;
   discountPercentage: number;
   rating: number;
   stock: number;
   brand: string;
   category: string;
   thumbnail: string;
   images: string[];
}[];
const InfiniteScroll = () => {
   const [data, setData] = useState<Product>([]);
   const [loadingMore, setLoadingMore] = useState(true);
   const [page, setPage] = useState(0);

   const elementRef = useRef(null);

   function onIntersection(entries: any) {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && loadingMore) {
         fetchData();
      }
   }

   useEffect(() => {
      const observer = new IntersectionObserver(onIntersection);
      if (observer && elementRef.current) {
         observer.observe(elementRef.current);
      }
      return () => {
         if (observer) {
            observer.disconnect();
         }
      };
   }, [data]);

   // https://jsonplaceholder.typicode.com/comments : does not support limitations
   const fetchData = async () => {
      try {
         const response = await fetch(
            `https://dummyjson.com/products?limit=10&skip=${page * 10}`
         );
         const result = await response.json();

         if (result.products.length == 0) {
            setLoadingMore(false);
         } else {
            setData((prev) => [...prev, ...result.products]);
            setPage((prev) => prev + 1);
         }
      } catch (error: any) {
         setLoadingMore(false);
         console.log(error.message);
      }
   };

   console.log(data);

   return (
      <div className="px-10 md:px-16 py-10">
         <p className="text-center font-black text-xl mt-4">
            Infinite scrolling with loader
         </p>

         <div className="grid grid-cols-2 md:grid-cols-4 mt-6 gap-4 ">
            {data &&
               data.map((a, i) => (
                  <div
                     className="rounded flex flex-col gap-6 items-center p-10 border bg-gray-200 border-gray-400  "
                     key={i}
                  >
                     <p className="text-lg">{a.id}</p>
                     <p className=" text-center md:text-lg text-sm font-bold">{a.title}</p>
                  </div>
               ))}
         </div>
         {loadingMore && (
            <p
               ref={elementRef}
               className="italic text-center font-bold text-xl mt-7"
            >
               Loading ...... worked on by azeezcodes
            </p>
         )}
      </div>
   );
};

export default InfiniteScroll;
