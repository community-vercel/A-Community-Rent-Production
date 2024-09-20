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
import AddressInput from "@/components/AdressInput";
export default function Profile() {
  console.log("Hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
  const params = useParams();
  const { user, user_meta } = useSelector((state) => state.auth);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState();
  const [rolesFromApi, setRolesFromApi] = useState([]);
  const [checkedRoles, setCheckedRoles] = useState({});
  const [address, setAddress] = useState('');

  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(UserZod),
  });

  // Hardcoded roles
  const hardcodedRoles = ["events", "business", "community", "rent", "job"];
  const handleAddressSelected = (place) => {
    setAddress(place.formatted_address);
  };
  
  useEffect(() => {
    console.log("Form data",user.id)

    // Check if params.id is not equal to user.id before performing the checks
    if (!user || !user.role===1) {
      // Redirect if user.id doesn't exist or if user_meta.role is not 1
     
        router.push("/");
      
    }
    
    // Fetch user details regardless of the condition
    fetchUserDetails();
  }, []);
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
 // Adding dependencies for better control
  

  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;

  const fetchUserDetails = async () => {
    const formdata = { id: user.id };
    console.log("Form data",formdata)
    try {
      const response = await fetch(`${serverurl}get-users/`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(formdata)
      });
      const result = await response.json();
      if (response.ok) {
        setValue("phone", result.data?.phone);
        setValue("address", result.data?.address);
        // setValue("role", result.data?.role || '');
        setRole(result.data?.role || '');
        setRolesFromApi(result.data?.roles || []); // Set roles from API
        setActive(result.data?.active || false);
        setValue("email", result.data?.email);
        setValue("name", result.data?.fullname);
        setLoading(false);
      } else {
        console.error(result.ErrorMsg);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const onSubmit = async (formData) => {
    console.log(formData, checkedRoles);
    
    
    const requestBody = {
      ...formData,
      id:params.id,
      roles: Object.keys(checkedRoles).filter(role => checkedRoles[role]).map(role => ({ role, status: "pending" }))
    };
  
    try {
      if (params.id) {
        // If params.id is present, update the existing user
        const response = await fetch(`${serverurl}update-user/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        
        const result = await response.json();
        
        if (response.ok) {
          console.log('User updated successfully:', result);

          if(result.ErrorCode==="0"|| result.ErrorCode===0){
            toast.success(result.ErrorMsg, { position: "top-right" }); // Show success toast

            router.push('/dashboard/users')

        }
          // Handle successful update, e.g., show a success message and redirect
        } else {
          toast.error(result.ErrorMsg, { position: "top-right" }); // Show success toast

          // Handle the error
        }
      } else {
        // If params.id is not present, create a new user
        const response = await fetch(`${serverurl}add-user/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        
        const result = await response.json();
        
        if (response.ok) {
          console.log('User created successfully:', result);
          // Handle successful creation, e.g., show a success message and redirect
        } else {
          console.error('Error creating user:', result.ErrorMsg);
          // Handle the error
        }
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      // Handle the error
    }
  };
  

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
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
                disabled
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
            <div className="mb-5">
              <Formlabel text="Address" />
              <AddressInput onAddressSelected={handleAddressSelected} />
              <input
                type="hidden"
                name="address"
                value={address}
              />
            </div>
            {/* <div className="">
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
            </div> */}

            <button
              type="submit"
              className="rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full"
            >
              Update
            </button>
          </form>
        </div>
      )}
    </>
  );
};
