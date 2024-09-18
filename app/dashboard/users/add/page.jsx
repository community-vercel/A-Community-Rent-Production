"use client";
import Formlabel from "@/components/Formlabel";
import InputField from "@/components/InputField";
import Loader from "@/components/Loader";
import { EnvelopeIcon, MapPinIcon, PhoneIcon, UserIcon } from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { UserZod } from "@/zod/UserZod";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const Page = () => {
  const params = useParams();
  const { user, user_meta } = useSelector((state) => state.auth);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState();
  const [rolesFromApi, setRolesFromApi] = useState([]);
  const [checkedRoles, setCheckedRoles] = useState({});

  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(UserZod),
  });

  // Hardcoded roles
  const hardcodedRoles = ["events", "business", "community", "rent", "job"];

  // Initialize checkboxes based on API roles and hardcoded roles
  useEffect(() => {
    if (rolesFromApi.length) {
      const initialCheckedRoles = hardcodedRoles.reduce((acc, role) => {
        const apiRole = rolesFromApi.find((r) => r.role === role && r.status === "pending");
        acc[role] = !!apiRole; // If role exists in API response, check it
        return acc;
      }, {});
      setCheckedRoles(initialCheckedRoles);
    }
  }, [rolesFromApi]);

  // Handle checkbox toggle
  const handleCheckboxChange = (roleName) => {
    setCheckedRoles((prev) => ({
      ...prev,
      [roleName]: !prev[roleName], // Toggle the checked state
    }));
  };

  useEffect(() => {
    if (!user.id || user_meta.role !== 1) {
      router.push("/");
    }
  }, []);

  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;

 

  const onSubmit = async (formData) => {
    console.log(formData, checkedRoles);
    
    
    const requestBody = {
      ...formData,
      id:params.id,
      roles: Object.keys(checkedRoles).filter(role => checkedRoles[role]).map(role => ({ role, status: "pending" }))
    };
  
    try {
     
        const response = await fetch(`${serverurl}add-user/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        
        const result = await response.json();
        
        if (response.ok) {
            if(result.ErrorCode==="0"|| result.ErrorCode===0){
                toast.success(result.ErrorMsg, { position: "top-right" }); // Show success toast
    
                router.push('/dashboard/users')
    
            }
          console.log('User created successfully:', result);
          // Handle successful creation, e.g., show a success message and redirect
        } else {
            toast.error(result.ErrorMsg, { position: "top-right" }); // Show success toast

          console.error('Error creating user:', result.ErrorMsg);
          // Handle the error
        }
      
    } catch (error) {
      console.error('Error in form submission:', error);
      // Handle the error
    }
  };
  

  return (

     
        <div className="p-7 bg-white">
          <h1 className="text-2xl font-bold mb-8">User Detail</h1>
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="">
              <Formlabel text="Email" forLabel="email" />
              <InputField
                inputId="email"
                inputName="email"
                inputType="email"
                register={register}
                error={errors.email}
                
              >
                <EnvelopeIcon />
              </InputField>
            </div>

            <div className="">
              <Formlabel text="Full Name" forLabel="name" />
              <InputField
                inputId="name"
                inputName="name"
                inputType="text"
                register={register}
                error={errors.name}
              >
                <UserIcon />
              </InputField>
            </div>

            <div className="">
              <Formlabel text="Phone No." forLabel="phone" />
              <InputField
                inputId="phone"
                inputName="phone"
                inputType="text"
                register={register}
                error={errors.phone}
              >
                <PhoneIcon />
              </InputField>
            </div>

            <div className="mb-5">
              <Formlabel text="Registered as:" />
              <div className="flex gap-4">
                <div className="flex gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="3"
                    id="user"
                    defaultChecked={role === 3} // Check 'User' if role is 3
                    {...register("role")}
                  />
                  <label htmlFor="user">User</label>
                </div>
                <div className="flex gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="2"
                    id="admin"
                    defaultChecked={role === 2} // Check 'Admin' if role is 2
                    {...register("role")}
                  />
                  <label htmlFor="admin">Admin</label>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <h3 className="mb-3">Roles</h3>
              {hardcodedRoles.map((role, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="checkbox"
                    id={role}
                    checked={checkedRoles[role] || false} // Check or uncheck based on state
                    onChange={() => handleCheckboxChange(role)} // Handle toggle
                  />
                  <label htmlFor={role}>{role}</label>
                </div>
              ))}
            </div>

            <div className="mt-8 mb-5 flex gap-2 items-center">
              <Formlabel text="Active:" />
              <input
                type="checkbox"
                {...register("active")}
                defaultChecked={active}
                className="mb-3"
              />
            </div>

            <div className="">
              <Formlabel text="Address" forLabel="address" />
              <InputField
                inputId="address"
                inputName="address"
                inputType="text"
                register={register}
                error={errors.address}
              >
                <MapPinIcon />
              </InputField>
            </div>

            <button
              type="submit"
              className="rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full"
            >
              Update
            </button>
          </form>
        </div>
     
  );
};

export default Page;
