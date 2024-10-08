"use client";
import Formlabel from "@/components/Formlabel";
import InputField from "@/components/InputField";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";

import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddBusinessZod } from "@/zod/AddBusinessZod";
import uploadImage from "@/utils/uploadImage";
import { useSelector } from "react-redux"; 
import Image from "next/image"; 
import { XMarkIcon } from "@heroicons/react/16/solid";

import { 
  GetLanguages,CitySelect, StateSelect 
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";


const Page = () => {
  const router = useRouter();

  const { user_meta, user } = useSelector((state) => state.auth);
  console.log("user",user)
  const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL

  const [loading, setLoading] = useState(false);
const[message,setMessage]=useState("");
  const [languageList, setLanguageList] = useState([]);
  const countryid = 233;
  const [stateid, setstateid] = useState(0);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [tags, setTags] = useState([]);
const [currentTag, setCurrentTag] = useState('');

const handleKeyDown = (e) => {
  if (e.key === 'Enter' && currentTag.trim() !== '') {
    e.preventDefault();
    if (!tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  }
};

const removeTag = (index) => {
  setTags(tags.filter((_, i) => i !== index));
};

  const [categories, setCategories] = useState(null); //data coming from category tabel stored
  const [selectedCategories, setSelectedCategories] = useState(null); // local selected form data stored
  const selectInputRef = useRef();
console.log("Current Tags",tags)
  const [logo, setLogo] = useState(null);
  const [images, setImages] = useState(null);
  const [imagesSelected, setImagesSelected] = useState([]);

  const [customErrors, setCustomErrors] = useState({});

  // useEffect(() => {
  //   if (user && !user.id) router.push("/");
  //   const getCategories = async () => {
  //     try {
  //       const { data, error } = await supabase.from("category").select();
  //       if (error) throw error;
  //       let reArrangeData = data.map((item) => {
  //         return { value: item?.id, label: item?.name };
  //       });
  //       setCategories(reArrangeData);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   getCategories();

   
  // }, []);
  useEffect(() => {
    if (user && !user.id) router.push("/");

    const  getCategories = async () => {
      try {
        const response = await fetch(`${serverurl}get-categories/`);
        const result = await response.json();
        if (response.ok) {
          let reArrangeData = result.map((item) => {
            return { value: item?.id, label: item?.name };
          });
          setCategories(reArrangeData); 
               } else {
          setError(result.error || 'Failed to fetch categories');
        }
      } catch (error) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    getCategories();
    GetLanguages().then((result) => {
      setLanguageList(result);
    });
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(AddBusinessZod),
  });

  // const onSubmit = async (formData) => {
  //   try {
  //     setLoading(true)
  //     if (!logo)
  //       return setCustomErrors({
  //         ...customErrors,
  //         logo: "Please selecet logo.",
  //       });
  //     if (!imagesSelected)
  //       return setCustomErrors({
  //         ...customErrors,
  //         images: "Please selecet images.",
  //       });
  //     let socials = {
  //       facebook:formData.b_facebook,
  //       instagram:formData.b_instagram,
  //       youtube:formData.b_youtube,
  //       tiktok:formData.b_tiktok,
  //       twitter:formData.b_twitter,
  //     }
  //     let businessData = {
  //       name: formData.b_name,
  //       description: formData.b_description,
  //       phone: formData.b_phone,
  //       email: formData.b_email,
  //       website: formData.b_website,
  //       operating_hours: formData.b_operating_hours,
  //       location: formData.b_location,
  //       city: selectedCity,
  //       state: selectedState,
  //       // country: formData.b_country,
  //       zip:formData.b_zip,
  //       discount_code:formData.b_discount_code,
  //       discount_message:formData.b_discount_message,
  //       user_id: user.id,
  //       socials,
  //       language:formData.b_language
  //     };
  //     if (user_meta.pre_approved == true) businessData.approved = 1;
  //     const { data: b_data, error: b_error } = await supabase
  //       .from("business")
  //       .insert(businessData)
  //       .select()
  //       .single();
  //     if (b_error) throw b_error;
  //     // check if form has categories selected, if have then add to category_business relation
  //     if (selectedCategories && b_data) {
  //       let transformCats = selectedCategories.map((cat) => {
  //         return { category_id: cat.value, business_id: b_data.id };
  //       });
  //       const { error: cat_error } = await supabase
  //         .from("category_business")
  //         .insert(transformCats);
  //       if (cat_error) throw cat_error;
  //       setSelectedCategories([]);
  //       console.log("business category added");
  //     } else {
  //       console.log("some error in category and business");
  //     }
  //     // check if form has tags added, if have then add to tag_business relation
  //     if (formData.b_tags && b_data) { 
  //       const { error: tag_error } = await supabase
  //         .from("tag_business")
  //         .insert({ tag:formData.b_tags, business_id: b_data.id });
  //       if (tag_error) throw tag_error;
  //       console.log("business tags added");
  //     }
  //     // upload logo
  //     const uploadBusinessLogo = await uploadImage(
  //       b_data.id,
  //       logo,
  //       "business",
  //       `${b_data.id}/`
  //     );
  //     if (uploadBusinessLogo.error) throw uploadBusinessLogo.error;
  //     console.log(uploadBusinessLogo);
  //     // upload business images
  //     const uploadBusinessImages = await uploadImage(
  //       b_data.id,
  //       imagesSelected,
  //       "business",
  //       `${b_data.id}/`
  //     );
  //     if (uploadBusinessImages.error) throw uploadBusinessImages.error;
  //     console.log(uploadBusinessImages);
  //     let imagesUploadArr = uploadBusinessImages
  //       .map((img) => img.url)
  //       .join(",");
  //     console.log(imagesUploadArr);
  //     // updating business table with logo and business images url
  //     const { data: updateImgsData, error: updateImgsError } = await supabase
  //       .from("business")
  //       .update({ logo: uploadBusinessLogo[0].url, images: imagesUploadArr })
  //       .eq("id", b_data.id)
  //       .select();
  //     console.log("business added");
  //     reset();
  //     setSelectedCategories([]);
  //     selectInputRef.current.clearValue();
  //     setImagesSelected([])
  //     setImages(null)
  //     setLogo(null)
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const onSubmit = async (formData) => {
    try {
        setLoading(true);

        if (!logo) {
            return setCustomErrors({
                ...customErrors,
                logo: "Please select a logo.",
            });
        }
        if (!imagesSelected) {
            return setCustomErrors({
                ...customErrors,
                images: "Please select images.",
            });
        }

        // Construct form data for the request
        let formDataToSend = new FormData();
        formDataToSend.append('b_name', formData.b_name);
        formDataToSend.append('b_description', formData.b_description);
        formDataToSend.append('b_phone', formData.b_phone);
        formDataToSend.append('b_email', formData.b_email);
        formDataToSend.append('b_website', formData.b_website);
        formDataToSend.append('b_operating_hours', formData.b_operating_hours);
        formDataToSend.append('b_location', formData.b_location);
        formDataToSend.append('b_city', selectedCity);
        formDataToSend.append('b_state', selectedState);
        formDataToSend.append('b_zip', formData.b_zip);
        formDataToSend.append('b_discount_code', formData.b_discount_code);
        formDataToSend.append('b_discount_message', formData.b_discount_message);
        formDataToSend.append('user_id', user.id);
        formDataToSend.append('b_language', formData.b_language);
        formDataToSend.append('b_facebook', formData.b_facebook);
        formDataToSend.append('b_instagram', formData.b_instagram);
        formDataToSend.append('b_youtube', formData.b_youtube);
        formDataToSend.append('b_tiktok', formData.b_tiktok);
        formDataToSend.append('b_twitter', formData.b_twitter);
        formDataToSend.append('approved', user_meta.pre_approved ? '1' : '0');

        // Append categories and tags
        selectedCategories.forEach(cat => formDataToSend.append('categories', cat.value));
        const tagsString = tags.join(","); // Convert tags array to comma-separated string

        formDataToSend.append('b_tags', tagsString);

        // Append logo and images
        formDataToSend.append('logo', logo[0]);
        imagesSelected.forEach(image => formDataToSend.append('images', image));

        // Send request
        const response = await fetch(`${serverurl}create-business/`, {
            method: 'POST',
            body: formDataToSend,
        });

        const result = await response.json();

        if (result.ErrorCode === 0) {
            console.log("Business created successfully", result.data);
            reset();
            setSelectedCategories([]);
            selectInputRef.current.clearValue();
            setImagesSelected([]);
            setImages(null);
            setLogo(null);
            router.push('/dashboard/business/')
        } else {
            console.error(result.ErrorMsg);
            setCustomErrors({ ...customErrors, form: result.ErrorMsg });
        }
    } catch (error) {
        console.error("Error creating business:", error);
    } finally {
        setLoading(false);
    }
};

  
  const imgDelete = (name) => {
    console.log(name)
    setImagesSelected(imagesSelected.filter(file=>file.name != name))
  }

  return (
    <div className="p-7 b__Add">
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="">
          <Formlabel text="Name" forLabel="b_name" />
          <InputField
            inputId="b_name"
            inputName="b_name"
            inputType="text"
            register={register}
            error={errors.b_name}
          ></InputField>
        </div>

        <div className="mb-5">
          <Formlabel text="Logo" forLabel="logo" />
          <input
            id="logo"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              setLogo(Array.from(e.target.files));
              setCustomErrors({
                ...customErrors,
                logo: "",
              });
            }}
            className="rounded-full  outline-none shadow-formFeilds text-text-gray text-sm py-4 bg-white pl-5 pr-5 border-2 border-[#E4E4E4] w-full"
            type="file"
            name="logo"
          />
          {customErrors.logo && (
            <span className="text-red-400 text-sm pl-1">
              {customErrors.logo}
            </span>
          )}

          {logo &&
            [...logo].map((file, i) => (
              <Image
                key={i}
                src={URL.createObjectURL(file)}
                alt=""
                width={70}
                height={70}
                className="bg-white rounded-sm p-1 mt-2"
              />
            ))}
        </div>

        <div className="mb-5">
          <Formlabel text="Images" forLabel="images" />
          <input
            id="images"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              setImages(Array.from(e.target.files));
              setCustomErrors({
                ...customErrors,
                images: "",
              });
              setImagesSelected([
                ...imagesSelected,
                ...Array.from(e.target.files),
              ]);
              console.log([...imagesSelected, ...Array.from(e.target.files)]);
            }}
            className="rounded-full  outline-none shadow-formFeilds text-text-gray text-sm py-4 bg-white pl-5 pr-5 border-2 border-[#E4E4E4] w-full"
            type="file"
            name="images"
            multiple
          />
          {customErrors.images && (
            <span className="text-red-400 text-sm pl-1">
              {customErrors.images}
            </span>
          )}

          {imagesSelected && (
            <div className="flex gap-3 flex-wrap">
              {[...imagesSelected].map((file, i) => (
                <div className="relative h-full" 
                key={i}>
                  <Image
                  src={URL.createObjectURL(file)}
                  alt=""
                  width={150}
                  height={150}
                  className="bg-white rounded-sm p-1 mt-2 object-cover"
                />
                <XMarkIcon className="w-4 h-4 absolute top-3 right-2 cursor-pointer bg-white text-black rounded-full" onClick={()=>imgDelete(file.name)}/>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="">
          <Formlabel text="Description" forLabel="b_description" />
          <InputField
            inputId="b_description"
            inputName="b_description"
            inputType="textarea"
            register={register}
            error={errors.b_description}
          ></InputField>
        </div>
        <div className="">
          <Formlabel text="Email" forLabel="b_email" />
          <InputField
            inputId="b_email"
            inputName="b_email"
            inputType="email"
            register={register}
            error={errors.b_email}
          ></InputField>
        </div>

        <div className="mb-5">
          <Formlabel text="Language" forLabel="b_language" />
          <select
            id="b_language"
            className={`rounded-full border-2 border-[#E4E4E4] w-full  outline-none shadow-formFeilds text-text-gray text-sm p-4 bg-white`}
            placeholder="Please select country"
            {...register('b_language')}
          >
            {languageList.map((item, index) => (
              <option key={index} value={item.id}>
                {item.name}
              </option>
            ))}
          </select> 
        </div>


        <div className="mb-5">
          <Formlabel text="State" forLabel="b_state" />
          <StateSelect
            required
            countryid={countryid}
            onTextChange = {(e)=>{
              if(!e.target.value){
                setstateid('');
                setSelectedState('');
              }
            }}
            onChange={(e) => {
              console.log(e);
              setstateid(e.id);
              setSelectedState(e.name);
            }}
            placeHolder="Select State"
            inputClassName="outline-none shadow-formFeilds text-sm font-inter !border-transparent w-full"
          /> 
        </div>

        <div className="mb-5">
          <Formlabel text="City" forLabel="b_city" />
          <CitySelect
            required
            countryid={countryid}
            stateid={stateid}
            onTextChange = {(e)=>{
              if(!e.target.value){ 
                setSelectedCity('');
              }
            }}
            onChange={(e) => {
              console.log(e);
              setSelectedCity(e.name);
            }}
            placeHolder="Select City"
            inputClassName="outline-none shadow-formFeilds text-sm font-inter !border-transparent w-full"
          />
        </div>

        <div className="">
          <Formlabel text="Zipcode" forLabel="b_zip" />
          <InputField
            inputId="b_zip"
            inputName="b_zip"
            inputType="text"
            register={register}
            error={errors.b_zip}
          ></InputField>
        </div>

        {/*<div className="">
          <Formlabel text="City" forLabel="b_city" />
          <InputField
            inputId="b_city"
            inputName="b_city"
            inputType="text"
            register={register}
            error={errors.b_city}
          ></InputField>
        </div>
        <div className="">
          <Formlabel text="State" forLabel="b_state" />
          <InputField
            inputId="b_state"
            inputName="b_state"
            inputType="text"
            register={register}
            error={errors.b_state}
          ></InputField>
        </div>
         <div className="">
          <Formlabel text="Country" forLabel="b_country" />
          <SelectCountryDropdown
            inputId="b_country"
            inputName="b_country"
            register={register}
            error={errors.b_country}
          />
        </div> */}

        <div className="">
          <Formlabel text="Address" forLabel="b_location" />
          <InputField
            inputId="b_location"
            inputName="b_location"
            inputType="text"
            register={register}
            error={errors.b_location}
          ></InputField>
        </div>
        <div className="">
          <Formlabel text="Phone No." forLabel="b_phone" />
          <InputField
            inputId="b_phone"
            inputName="b_phone"
            inputType="text"
            register={register}
            error={errors.b_phone}
          ></InputField>
        </div>

        <div className="">
          <Formlabel text="Website" forLabel="b_website" />
          <InputField
            inputId="b_website"
            inputName="b_website"
            inputType="text"
            register={register}
            error={errors.b_website}
          ></InputField>
        </div>

        <div className="">
          <Formlabel text="Facebook" forLabel="b_facebook" />
          <InputField
            inputId="b_facebook"
            inputName="b_facebook"
            inputType="text"
            register={register}
            error={errors.b_facebook}
          ></InputField>
        </div>

        <div className="">
          <Formlabel text="Instagram" forLabel="b_instagram" />
          <InputField
            inputId="b_instagram"
            inputName="b_instagram"
            inputType="text"
            register={register}
            error={errors.b_instagram}
          ></InputField>
        </div>

        <div className="">
          <Formlabel text="Youtube" forLabel="b_youtube" />
          <InputField
            inputId="b_youtube"
            inputName="b_youtube"
            inputType="text"
            register={register}
            error={errors.b_youtube}
          ></InputField>
        </div>

        <div className="">
          <Formlabel text="Tiktok" forLabel="b_tiktok" />
          <InputField
            inputId="b_tiktok"
            inputName="b_tiktok"
            inputType="text"
            register={register}
            error={errors.b_tiktok}
          ></InputField>
        </div>

        <div className="">
          <Formlabel text="Twitter" forLabel="b_twitter" />
          <InputField
            inputId="b_twitter"
            inputName="b_twitter"
            inputType="text"
            register={register}
            error={errors.b_twitter}
          ></InputField>
        </div>

        <div className="">
          <Formlabel text="Operating Hours" forLabel="b_operating_hours" />
          <InputField
            inputId="b_operating_hours"
            inputName="b_operating_hours"
            inputType="text"
            register={register}
            error={""}
          ></InputField>
        </div>

        <div className="">
          <Formlabel text="Discount Code" forLabel="b_discount_code" />
          <InputField
            inputId="b_discount_code"
            inputName="b_discount_code"
            inputType="text"
            register={register}
            error={""}
          ></InputField>
        </div>

        <div className="">
          <Formlabel text="Discount Message" forLabel="b_discount_message" />
          <InputField
            inputId="b_discount_message"
            inputName="b_discount_message"
            inputType="text"
            register={register}
            error={""}
          ></InputField>
          <span className="flex mb-5 -mt-3 text-gray-600 text-sm pl-4">Use [code] to show discount code in your discount message.</span>
        </div>

        {categories && (
          <div className="">
            <Formlabel text="Select Categories" forLabel="b_categories" />
            <Select
              isMulti
              ref={selectInputRef}
              name="b_categories"
              options={categories}
              className="cursor-pointer"
              classNamePrefix="select_custom"
              onChange={(e) => {
                setSelectedCategories(e);
              }}
            />
          </div>
        )}

<div className="mt-5">
  <label htmlFor="b_tags" className="block text-sm font-medium text-gray-700">
    Tags
  </label>
  <div className="mt-1 flex flex-wrap gap-2 border border-gray-300 rounded-md p-2 bg-white">
    {tags.map((tag, index) => (
      <span key={index} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
        {tag}
        <button
          type="button"
          onClick={() => removeTag(index)}
          className="ml-2 text-blue-500 hover:text-blue-700"
        >
          &times;
        </button>
      </span>
    ))}
    <input
      id="b_tags"
      name="b_tags"
      type="text"
      value={currentTag}
      onChange={(e) => setCurrentTag(e.target.value)}
      onKeyDown={handleKeyDown}
      className="flex-1 outline-none p-1"
      placeholder="Add a tag and press Enter"
    />
  </div>
</div>



        <button
          type="submit"
          className="rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full disabled:cursor-progress"
          disabled={loading}
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default Page;
