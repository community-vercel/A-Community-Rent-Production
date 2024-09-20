"use client";

import Formlabel from "@/components/Formlabel";
import InputField from "@/components/InputField";
import { UserIcon, LockClosedIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import Message from "@/components/Message";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginZod } from "@/zod/LoginZod";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

import {
  setUser,
  setSession,
  setIsAuthenticated,
  setUserMeta,
} from "@/store/slices/authslice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { google } from "@/assets";
import { Bounce, toast } from "react-toastify";


export default function Home() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(LoginZod),
  });

  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const user_meta = useSelector((state) => state.auth.user_meta);

  const [checkIfRoleExits, setCheckIfRoleExits] = useState(true);
  const [checkboxRole, setCheckboxRole] = useState('user');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Client-side code
      toast.success('Toast notification works!', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
    }
  }, []);
  


  useEffect(() => {
    if (user && user.id && user_meta.role===1) {
      router.push("/dashboard/business");

    }
    if (user && user.id && user_meta.role===3) {
      router.push("/places");

    }
  }, [user]);
  const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL
  const onSubmit = async (formData) => {
    try {
      const payload = {
        username: formData.email,
        password: formData.password,
      
      };
      const response = await fetch(`${serverurl}login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();





console.log("Response",data)
      // if (!response.ok) {
        
      //     toast.error(data.ErrorMsg || 'Failed to Login', {
      //       position: "bottom-center",
      //       autoClose: 3000,
      //       hideProgressBar: false,
      //       closeOnClick: true,
      //       pauseOnHover: false,
      //       draggable: false,
      //       progress: undefined,
      //       theme: "light",
      //     });
       
      //   throw new Error('Login failed');
      // }

if(data.ErrorCode==0 || data.ErrorCode=='0' ){
  toast.success('Login Sucessfully', {
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });
 
 
      dispatch(setUser({ user: data.user }));
      dispatch(setSession({ session: data.session }));
      dispatch(setIsAuthenticated({ isAuthenticated: true }));
      dispatch(setUserMeta({ user_meta: data.user_meta }));
      if(data.user.role == '1'){
        router.push("/dashboard/business");
      } if(usermetaData.role == '3'){
        router.push("/places");
      }
    router.push("/");
}

else{
  setMessage(data.ErrorMsg)
  toast.error(data.ErrorMsg || 'Failed to Login', {
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "light",
  });

}

      // Handle successful login (e.g., redirect or store token)
     

    } catch (err) {
        // setMessage(err.message)

      toast.error(err.message || 'Failed to Login', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
   
      setError(err.message);
    }
  }
  //   // try {
  //   //   const { data, error: authError } = await supabase.auth.signInWithPassword(
  //   //     {
  //   //       email: formData.email,
  //   //       password: formData.password,
  //   //     }
  //   //   );
  //   //   if (authError) throw authError;
  //   //   dispatch(setUser({ user: data.user }));
  //   //   dispatch(setSession({ session: data.session }));
  //   //   dispatch(setIsAuthenticated({ isAuthenticated: true }));
  //   //   console.log("login successful");

  //   //   const { data: usermetaData, error } = await supabase
  //   //     .from("user_meta")
  //   //     .select("*")
  //   //     .eq("user_id", data.user.id)
  //   //     .single();
  //   //   if (usermetaData && usermetaData.id) {
  //   //     dispatch(setUserMeta({ user_meta: usermetaData }));
  //   //     dispatch(setIsAuthenticated({ isAuthenticated: true }));
  //   //     if(usermetaData.role == 'super_admin'){
  //   //       router.push("/dashboard/business");
  //   //     }else{
  //   //       router.push("/");
  //   //     }
  //   //   } else {
  //   //     setCheckIfRoleExits(false);
  //   //   }
  //   //   console.log(usermetaData, error);
  //   // } catch (error) {
  //   //   setMessage(error.message);
  //   //   console.error("login error", error);
  //   // }
  // };

  const signInWithGoogle = async (e) => {
    e.preventDefault();
    console.log(process.env.NEXT_PUBLIC_SITE_URL + "oauth");
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: process.env.NEXT_PUBLIC_SITE_URL + "oauth",
        },
      });
      if (error) throw error;
      console.log("ologin clicked ",data);
    } catch (error) {
      setMessage(error.message);
      console.error("ologin error", error);
    }
  };

  const handleSubmitRole = async (e) => {
    e.preventDefault();
    console.log(checkboxRole);
    const { data,error } = await supabase
      .from("user_meta")
      .insert({ role: checkboxRole, user_id: user.id }).select().single();
    if (error) throw error;
    dispatch(setUserMeta({ user_meta:data }));
    dispatch(setIsAuthenticated({ isAuthenticated: true }));
    console.log("role added");
    if(data.role == '1'){
      router.push("/dashboard/business");
    }else{
      router.push("/");
    }
  };

  return (
    <>
      {/* {!checkIfRoleExits && (
        <form onSubmit={handleSubmitRole}>
          <h3 className="text-2xl">Please complete your profile</h3>
          <div className="my-5">
            <Formlabel text="Register as" />
            <div className="flex gap-4">
              <div className="flex gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="user"
                  id="user"
                  name="role"
                  defaultChecked={true}
                  onChange={() => setCheckboxRole("user")}
                />
                <label htmlFor="user">User</label>
              </div>
              <div className="flex gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="business"
                  id="business"
                  onChange={() => setCheckboxRole("business")}
                />
                <label htmlFor="business">Business</label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-full uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full"
          >
            Confirm
          </button>
        </form>
      )} */}

      {/* {checkIfRoleExits && ( */}
        <form
          className="max-w-lg mx-auto w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          {message && <Message message={message} />}

          <div className="">
            <Formlabel text="Email" forLabel="email" />
            <InputField
              inputId="email"
              inputName="email"
              inputType="email"
              register={register}
              error={errors.email}
            >
              <UserIcon />
            </InputField>
          </div>

          <div className="">
            <Formlabel text="Password" forLabel="password" />
            <InputField
              inputId="password"
              inputName="password"
              inputType="password"
              register={register}
              error={errors.password}
            >
              <LockClosedIcon />
            </InputField>
          </div>

          <button
            type="submit"
            className="rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full"
          >
            Log In
          </button>
          <div className="flex justify-between mb-5">
            <Link
              href="/register"
              className="text-primary text-xs font-semibold"
            >
              Register
            </Link>
            <Link href="/forgetpassword" className="text-xs text-text-gray">
              Lost your password?
            </Link>
          </div>
          <button
            type="button"
            onClick={signInWithGoogle}
            className="flex gap-2 p-3 text-center justify-center rounded-lg mb-4 border border-text-gray w-full"
          >
            <Image src={google} alt="" className="w-5 h5" /> <span>Google</span>
          </button>
        </form>
      {/* )} */}
      
    </>
  );
}
