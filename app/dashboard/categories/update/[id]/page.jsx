"use client";
import Formlabel from "@/components/Formlabel";
import InputField from "@/components/InputField";
import Message from "@/components/Message";
import useUser from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddCategoryZod } from "@/zod/AddCategoryZod";
import useAuth from "@/hooks/useAuth";
import uploadImage from "@/utils/uploadImage";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
  import 'react-toastify/dist/ReactToastify.css';
import { extractImagePath } from "@/utils/extractImagePath";

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const params = useParams();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailDB, setThumbnailDB] = useState(null);
  const [cover, setCover] = useState(null);
  const [coverDB, setCoverDB] = useState(null);
  console.log("data from aoi",coverDB,thumbnailDB)
  const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL

  useEffect(() => {
    // if (auth && !auth.user?.id) router.push("/");

    // function to fill the form data from data base
    const getData = async () => {
      try {
        // get all current buiness categories
        const requestBody = JSON.stringify({ category_id: params.id });

        const response = await fetch(`${serverurl}get-category/`, {
          method: 'POST', // Use POST method
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody, // Send request body as JSON
        });

        const result = await response.json();
        console.log("data from aoi",result)
        console.log("data from aoi",result.data.name)

        if (response.ok) {
        setValue("category", result.data.name);
        setThumbnailDB(result.data.thumbnail);
        setCoverDB(result.data.cover); 
        setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm({
    resolver: zodResolver(AddCategoryZod),
  });

  const onSubmit = async (formData) => {
    setMessage("");
    
    try {
      // Create a new FormData object to handle file uploads
      const formDat = new FormData();
      
      formDat.append("category_id", params.id);
      formDat.append("name", formData.category ? formData.category : category?.name);
      
      // Check if the thumbnail is newly uploaded or use the existing one from the database
      if (thumbnail && thumbnail[0]) {
        formDat.append("thumbnail", thumbnail[0]);
      } else if (thumbnailDB) {
        formDat.append("thumbnail", thumbnailDB);  // Or handle this in a way suitable to your backend if it requires a URL string or a file.
      }
  
      // Check if the cover is newly uploaded or use the existing one from the database
      if (cover && cover[0]) {
        formDat.append("cover", cover[0]);
      } else if (coverDB) {
        formDat.append("cover", coverDB);
      }
      
      const response = await fetch(`${serverurl}update-category/`, {
        method: 'POST', 
        body: formDat, 
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setMessage("Category updated successfully!");
        router.push('/dashboard/categories');
      } else {
        setMessage(result.error || "Failed to update category");
      }
    } catch (error) {
      setMessage("An unexpected error occurred: " + error.message);
    }
  };
  

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="p-7">
          {message && <Message message={message} />}
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div className="">
              <Formlabel text="Category" forLabel="category" />
              <InputField
                inputId="category"
                inputName="category"
                inputType="text"
                register={register}
                error={errors.category}
              ></InputField>
            </div>

            <div className="mb-5">
              <Formlabel text="Thumbnail" forLabel="thumbnail" />
              <input
                id="thumbnail"
                onChange={(e) => setThumbnail(Array.from(e.target.files))}
                className="rounded-full  outline-none shadow-formFeilds text-text-gray text-sm py-4 bg-white pl-5 pr-5 border-2 border-[#E4E4E4] w-full"
                type="file"
                name="thumbnail"
                accept="image/jpeg,image/png,image/webp"
              />
              {thumbnailDB && (
                <div className="flex gap-4 items-center">
                  <span>Current Thumbnail:</span>
                  <Image src={`${serverurl}media/${thumbnailDB}`}
                  
                      alt=""
                    className="aspect-square my-4 rounded-sm  bg-white d-flex p-1"
                    width={180}
                    height={180}
                  />
                </div>
              )}
            </div>

            <div className="mb-5">
              <Formlabel text="Cover" forLabel="cover" />
              <input
                id="cover"
                onChange={(e) => setCover(Array.from(e.target.files))}
                className="rounded-full  outline-none shadow-formFeilds text-text-gray text-sm py-4 bg-white pl-5 pr-5 border-2 border-[#E4E4E4] w-full"
                type="file"
                name="cover"
                accept="image/jpeg,image/png,image/webp"
              />
              {coverDB && (
                <div className="flex gap-4 items-center">
                <div className="flex gap-4 items-center">
                  <span>Current Cover:</span>
                  <Image
 src={`${serverurl}media/${coverDB}`}                    
  alt=""
                    className="aspect-square my-4 rounded-sm  bg-white d-flex p-1"
                    width={180}
                    height={180}
                  />
                  </div>
                </div>
              )}
            </div>

            <div className=" flex justify-end">
              <button
                type="submit"
                className="max-w-[300px] rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Page;
