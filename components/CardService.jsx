"use client";
import { dummy } from "@/assets";
import {
  ArrowUpCircleIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  HeartIcon,
  PhoneIcon,
  ReceiptPercentIcon,
  StarIcon,
} from "@heroicons/react/16/solid";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { supabase } from "@/lib/supabase";

const CardService = ({business, user_id = null, favoritePageHide = null }) => {
  const [stats, setStats] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL

  console.log("card usineees",business)

  useEffect(() => {
    async function getStats() {
      try {
        if (business.business_id) {
          const formData = {
            business_id_param: business.business_id
          };
    
          const response = await fetch(`${serverurl}get-business-rating-stats/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
    
          const result = await response.json();
    
          if (result.ErrorCode === 0) {
            setStats(result.data.stats);
          } else {
            console.error(result.ErrorMsg);
          }
          const apiUrl = `${serverurl}check-toggle-favorite/`;
    
          if (user_id && !favoritePageHide){
            // Send a POST request to check and toggle favorite
            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: user_id,
                business_id: business.business_id,
              }),
            });
      
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to toggle favorite');
            
            setIsFavorite(result.is_favorite);
          } else if (favoritePageHide) {
            setIsFavorite(!isFavorite);
            favoritePageHide(business.business_id);
          }
          // if (user_id && !favoritePageHide) {
          //   const { data: haveData, error: haveError } = await supabase
          //     .from("favorite")
          //     .select("*")
          //     .eq("user_id", user_id)
          //     .eq("business_id", business)
          //     .single();

          //   if (haveData && haveData.id) {
          //     setIsFavorite(!isFavorite);
          //   }
          // }else if(favoritePageHide){
          //   setIsFavorite(!isFavorite);
          // }
        }
      } catch (error) {}
    }

    getStats();
  }, []);

  // const toggleFavorite = async () => {
  //   try {
  //     setIsFavorite(!isFavorite);
  //     if (favoritePageHide) {
  //       favoritePageHide(business);
  //       const { data: delData, error: delError } = await supabase
  //         .from("favorite")
  //         .delete()
  //         .eq("business_id", business.id)
  //         .eq("user_id", user_id)
  //         .select();
  //       if (delError) throw error;
  //     } else {
  //       const { data: haveData, error: haveError } = await supabase
  //         .from("favorite")
  //         .select("*")
  //         .eq("user_id", user_id)
  //         .eq("business_id", business.id)
  //         .single();

  //       if (haveData && haveData.id) {
  //         const { data: delData, error: delError } = await supabase
  //           .from("favorite")
  //           .delete()
  //           .eq("id", haveData.id)
  //           .select();
  //         if (delError) throw error;
  //       } else {
  //         const { data, error } = await supabase
  //           .from("favorite")
  //           .insert({ user_id, business_id: business.id })
  //           .select();
  //         if (error) throw error;
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const toggleFavorite = async () => {
    try {
      // Toggle the local favorite state
      setIsFavorite(!isFavorite);
  
      // Define the URL for the API endpoint
      const apiUrl = `${serverurl}toggle-favorite/`;
  
      if (favoritePageHide) {
        // If there's a function to handle hiding the favorite on the page, call it
        favoritePageHide(business.business_id);
  
        // Send a POST request to remove the favorite
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user_id,
            business_id: business.business_id,
          }),
        });
  
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to remove favorite');
  
      } else {
        // Check if the favorite exists
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user_id,
            business_id: business.business_id,
          }),
        });
  
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to add favorite');
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div className="flex-[170px] lg:w-[24%] lg:flex-[24%] p-8 bg-white rounded-3xl border-[1px] border-transparent hover:border-secondary">
      {business.isFeatured && (
        <div className="flex gap-1 items-center mb-2 text-green-400"> 
        <ArrowUpCircleIcon className="w-5 h-7" />
          <span>Featured</span>
        </div>
      )}
      {business.discount_code && <div className="flex gap-1 items-center mb-2 text-green-400">
        <ReceiptPercentIcon className="w-5 h-7" />
          <span>Offering Discounts</span>
        </div>}
      <Link
        href={`/places/category/business/${business.business_id}`}
        className="flex justify-between items-start gap-4"
      >
        <div className="">
          <h2 className="text-base text-text-color mb-1 font-semibold">
            {business.business_name}
          </h2>
          {business && business.description ? (
  <p className="text-sm text-[#050505] mb-5 break-all">
    {business.description.slice(0, 90) + '...'}
  </p>
) : (
  <p className="text-sm text-[#050505] mb-5 break-all">
""
  </p>
)}

        </div>
        <div className=" ">
  <Image
    src={business.logo && business.logo.includes('media') ? 
      `${serverurl}${business.logo}` : 
      `${serverurl}media/${business.logo}`}
    className="w-[70px] min-w-[70px] h-[70px] object-cover rounded-full"
    alt=""
    width={100}
    height={100}
  />

        </div>
      </Link>
      <ul className="mt-2 mb-7">
        {business.phone && (
          <li>
            <Link
              href={`tel:${business.phone}`}
              className="flex gap-3 text-[#050505] text-[15px] mb-2"
            >
              <PhoneIcon className="w-6 h-6 text-text-gray" />
              <span>{business.phone}</span>
            </Link>
          </li>
        )}

        {business.website && (
          <li>
            <Link
              href={`${business.website}`}
              className="flex gap-3 text-[#050505] text-[15px] mb-2"
            >
              <GlobeAltIcon className="w-6 h-6 text-text-gray" />
                      <span>{business.website} </span>
              
            </Link>
          </li>
        )}

        {business.email && (
          <li>
            <Link
              href={`mailto:${business.email}`}
              className="flex gap-3 text-[#050505] text-[15px] mb-2"
            >
              <EnvelopeIcon className="w-6 h-6 text-text-gray" />
                           <span>{business.email} </span>
              
            </Link>
          </li>
        )}
      </ul>

      <div className="flex justify-between">
        <StarRating rating={stats ? stats.avg_rating : 0} />
        {user_id ? (
          <button
            className={`w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center`}
            onClick={toggleFavorite}
          >
            <HeartIcon className={`w-7 h-7 ${isFavorite && "text-red-500"}`} />
          </button>
        ) : (
          <Link
            href="/login"
            className={`w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center`}
          >
            <HeartIcon className={`w-7 h-7`} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default CardService;
