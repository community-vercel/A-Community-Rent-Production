"use client";
import Formlabel from "@/components/Formlabel";
import InputField from "@/components/InputField";
import Message from "@/components/Message";
import useUser from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddCategoryZod } from "@/zod/AddCategoryZod";
import useAuth from "@/hooks/useAuth";
import uploadImage from "@/utils/uploadImage";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const [message, setMessage] = useState(null);
  const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL
console.log("Auth",auth)
  if (auth && !auth.user?.id) router.push("/");

  const [thumbnail, setThumbnail] = useState(null);
  const [cover, setCover] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(AddCategoryZod),
  });

  const onSubmit = async (formData) => {
    console.log("data",thumbnail)
    setMessage("");
    try {
      if (!thumbnail) return setMessage("Please select a thumbnail");
      if (!cover) return setMessage("Please select a cover");

      // Create FormData object to send data and files
      const form = new FormData();
      form.append("userid",auth.user?.id)
      form.append("category", formData.category);
      form.append("thumbnail", thumbnail[0]); // assuming single file
      form.append("cover", cover[0]); // assuming single file
     

      const response = await fetch(`${serverurl}add-category/`, {
   
        method: "POST",
        body: form,
      });

      const result = await response.json();

      if (response.ok) {
        
        toast.success(result.ErrorMsg, { position: "top-right" }); // Show success toast
        setMessage(result.ErrorMsg);
        router.push('/')
        // Reset form or redirect as needed
      } else {
        toast.error(result.error || "An error occurred", { position: "top-right" }); // Show error toast
        setMessage(result.error || "An error occurred");
      }
    } catch (error) {
      toast.error("An unexpected error occurred", { position: "top-right" });
      setMessage("An unexpected error occurred");
      console.error(error);
    }
    // try {
    //   if (!thumbnail) return setMessage("Please select thumbnail");
    //   if (!cover) return setMessage("Please select cover");

    //   const { data: catData, error } = await supabase
    //     .from("category")
    //     .insert({ name: formData.category })
    //     .select()
    //     .single();
    //   if (error) throw error;

    //   const uploadResultThumb = await uploadImage(
    //     catData.id,
    //     thumbnail,
    //     "category",
    //     "category-images"
    //   );
    //   if(uploadResultThumb.error) throw error 
    //   console.log(uploadResultThumb);

    //   const uploadResultCover = await uploadImage(
    //     catData.id,
    //     cover,
    //     "category",
    //     "category-images"
    //   );
    //   if(uploadResultCover.error) throw error 
    //   console.log(uploadResultCover);
 
      
    //   const { data:updateImgsData, error:updateImgsError } = await supabase
    //   .from('category')
    //   .update({ thumbnail: uploadResultThumb[0].url, cover:uploadResultCover[0].url})
    //   .eq('id', catData.id)
    //   .select()

    //   if(updateImgsError) {
    //     throw new Error('Error while inserting images') 
    //     console.log(updateImgsError)
    //   }
    //   console.log(updateImgsData)
    //   setMessage("Added Successfully");
    // } catch (error) {
    //   if (error.message.includes("duplicate"))
    //     return setMessage("Category already exists!");
    //   setMessage(error.message);
    // }
  };

 

  return (
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
        </div>

        <div className=" flex justify-end">
          <button
            type="submit"
            className="max-w-[300px] rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
