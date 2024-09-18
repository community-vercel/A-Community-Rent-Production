"use client";
import Formlabel from "@/components/Formlabel";
import InputField from "@/components/InputField";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";

import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddBusinessZod } from "@/zod/AddBusinessZod";
import uploadImage from "@/utils/uploadImage";
import { useSelector } from "react-redux";
import SelectCountryDropdown from "@/components/SelectCountryDropdown";
import Image from "next/image";
import { extractImagePath } from "@/utils/extractImagePath";
import { XMarkIcon } from "@heroicons/react/16/solid";

import { 
  GetLanguages,CitySelect, StateSelect ,GetState,GetCity
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";


const Page = () => {
  const params = useParams();
  const router = useRouter();

  const { user_meta, user } = useSelector((state) => state.auth);

  const [categories, setCategories] = useState(null);
  
  console.log("Categories",categories)
  //data coming from category tabel stored
  const [selectedCategories, setSelectedCategories] = useState(null); // local selected form data stored
  const [selectedCategoriesDB, setSelectedCategoriesDB] = useState(null); // DB selected form data stored
  const selectInputRef = useRef();

  const [logo, setLogo] = useState(null); //for logo input
  const [images, setImages] = useState([]); // for images input
console.log("images",images)
  const [logoDB, setLogoDB] = useState(null); //for logo input
  const [imagesDB, setImagesDB] = useState([]); // for images input
  console.log("images my db",imagesDB)
  const [customErrors, setCustomErrors] = useState({}); // for files error

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [imagesSelected, setImagesSelected] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  
  // const handleKeyDown = (e) => {
  //   if (e.key === 'Enter' && currentTag.trim() !== '') {
  //     e.preventDefault();
  //     if (!tags.includes(currentTag.trim())) {
  //       setTags([...tags, currentTag.trim()]);
  //       setCurrentTag('');
  //     }
  //   }
  // };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && currentTag.trim() !== '') {
      e.preventDefault();
      const trimmedTag = currentTag.trim();
      // Add tag if it's not already in the list
      if (!tags.includes(trimmedTag)) {
        setTags(prevTags => [...prevTags, trimmedTag]);
        setCurrentTag(''); // Clear the input field
      }
    }
  };
  
  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };
  const [languageList, setLanguageList] = useState([]);
  const countryid = 233; 
  const [stateid, setstateid] = useState(0);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [logourl,SetLogoUrl]=useState()
  const [selectedStateDB, setSelectedStateDB] = useState({});
  const [selectedCityDB, setSelectedCityDB] = useState({});
  const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL
  useEffect(() => {
    // if (user && !user.id) router.push("/");
    GetLanguages().then((result) => {
      setLanguageList(result);
    });
    const getData = async () => {
      try {
        setLoading(true);
    
        // Define the business ID from the params (assuming `params.id` is set elsewhere)
        const businessId = params.id;
    
        const formData={
          id:businessId
        }
        // Fetch business details, categories, and tags from the Django API
        const response = await fetch(`${serverurl}get-specifibusiness/`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(formData),
      });

      const { data, ErrorCode, ErrorMsg } = await response.json();
      if (ErrorCode !== 0) {
          throw new Error(ErrorMsg);
        }
    console.log("data",data)
        const { business, categories, tags } = data;
        console.log("data bus",business,"cat",categories,"tags",tags)

        // Set business details in state
        setValue("b_name", data.name);
        setValue("b_description",data.description);
        setValue("b_email", data.email);
        setValue("b_phone",  data.phone);
        setValue("b_website",  data.website);
        setValue("b_location",  data.location);
        setValue("b_operating_hours",  data.operating_hours);
        setValue("b_zip",  data.zip);
        setValue("b_facebook",  data.socials?.facebook);
        setValue("b_instagram",  data.socials?.instagram);
        setValue("b_youtube",  data.socials?.youtube);
        setValue("b_tiktok",  data.socials?.tiktok);
        setValue("b_twitter",  data.socials?.twitter);
        setValue("b_discount_code",  data.discount_code);
        setValue("b_discount_message",  data.discount_message);
        setValue("b_language",  data.language);
        const processLogoUrl = (logoUrl) => {
          return logoUrl.replace('/api/', '');
        };
        
        // Construct the final logo URL
         const logoUrls = processLogoUrl(serverurl+data.logo);
         SetLogoUrl(logoUrls)

        setLogoDB(data.logo);
        setImagesDB( data.images);
    
        // Set current categories
        const currentCategories = categories.map((item) => ({
          label: item.category__name
          ,
          value: item.category__id
        }));
        setSelectedCategoriesDB(currentCategories);
        const tagsString = tags.join(',');

        // Set tags
        setValue("b_tags", tagsString);
        setTags(tags)
    
        // Set categories
        const reArrangeData = categories.map((item) => ({
          value: item.category__id,
          label: item.category__name
        }));
        
        setCategories(reArrangeData);
    
        // Fetch states and cities based on business details
        GetState(countryid).then((states) => {
          states.map(state => {
            if (state.name === data.state) {
              setSelectedStateDB(state);
              GetCity(countryid, state.id).then((cities) => {
                cities.map(city => {
                  if (city.name === data.city) {
                    setSelectedCityDB(city);
                  }
                });
              });
            }
          });
        });
    
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    
    // function to fill the form data from data base
    // const getData = async () => {
    //   try {
    //     // get all current buiness categories
    //     const { data, error } = await supabase
    //       .from("category_business")
    //       .select(`category(id,name)`)
    //       .eq("business_id", params.id);
    //     let currentCategories =
    //       data.length > 0 &&
    //       data.map((item) => {
    //         return { label: item?.category?.name, value: item?.category?.id };
    //       });
    //     setSelectedCategoriesDB(currentCategories);

    //     // get all available categories list
    //     const { data: allCats, error: alCatsError } = await supabase
    //       .from("category")
    //       .select();
    //     if (alCatsError) throw alCatsError;
    //     let reArrangeData = allCats.map((item) => {
    //       return { value: item?.id, label: item?.name };
    //     });
    //     setCategories(reArrangeData);

    //     // get tags
    //     const { data: tags_data, error: tag_error } = await supabase
    //       .from("tag_business")
    //       .select("*")
    //       .eq("business_id", params.id)
    //       .limit(1);
    //     if (!tag_error) {setValue("b_tags", tags_data.tag);}
        

    //     // get business details
    //     const { data: businessDetails, error: businessDetailsError } =
    //       await supabase
    //         .from("business")
    //         .select("*")
    //         .eq("id", params.id)
    //         .single();
    //     if (businessDetailsError) throw businessDetailsError;
    //     setValue("b_name", businessDetails.name);
    //     setValue("b_description", businessDetails.description);
    //     setValue("b_email", businessDetails.email);
    //     setValue("b_phone", businessDetails.phone);
    //     setValue("b_website", businessDetails.website);
    //     setValue("b_location", businessDetails.location);
    //     setValue("b_operating_hours", businessDetails.operating_hours);
    //     // setValue("b_state", businessDetails.state);
    //     // setValue("b_country", businessDetails.country);
    //     // setValue("b_city", businessDetails.city);
    //     setValue("b_zip", businessDetails.zip);
    //     setValue("b_facebook", businessDetails.socials?.facebook);
    //     setValue("b_instagram", businessDetails.socials?.instagram);
    //     setValue("b_youtube", businessDetails.socials?.youtube);
    //     setValue("b_tiktok", businessDetails.socials?.tiktok);
    //     setValue("b_twitter", businessDetails.socials?.twitter);
    //     setValue("b_discount_code", businessDetails.discount_code);
    //     setValue("b_discount_message", businessDetails.discount_message);
    //     setValue("b_language", businessDetails.language);

    //     setLogoDB(businessDetails.logo);
    //     setImagesDB(businessDetails.images);

    //     setLoading(false);
    //     console.log(businessDetails)

    //     GetState(countryid).then((states) => {
    //       states.map(state => {
    //         if(state.name === businessDetails.state) {
    //           setSelectedStateDB(state)
    //           GetCity(countryid, state.id).then((cities) => {
    //             cities.map(city =>{
    //               if(city.name === businessDetails.city){
    //                 setSelectedCityDB(city) 
    //               }
    //             })
    //           });
    //         }
    //       })
    //     });  

    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    getData();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    setValue,
  } = useForm({
    resolver: zodResolver(AddBusinessZod),
  });

  // update form data
  
  
  const onSubmit = async (formData) => {

    console.log("images",images)
    setAdding(true);

    try {
        const formDataToSend = new FormData();
        
        if (logo) {
            formDataToSend.append('logo', logo[0]);
        }
        else{
          formDataToSend.append('logo', logoDB);
        }
if(images){


       images.forEach(image => {
            formDataToSend.append('images', image);
        });
      }else{
        formDataToSend.append('images', imagesDB);

      }
      const tagsString = tags.join(","); // Convert tags array to comma-separated string

        // Prepare business data
        const businessData = {
            id: params.id,
            name: formData.b_name,
            description: formData.b_description,
            phone: formData.b_phone,
            email: formData.b_email,
            website: formData.b_website,
            operating_hours: formData.b_operating_hours,
            location: formData.b_location,
            city: selectedCity ? selectedCity : selectedCityDB.name,
            state: selectedState ? selectedState : selectedStateDB.name,
            country: formData.b_country,
            zip: formData.b_zip,
            user_id: user.id,
            socials: {
                facebook: formData.b_facebook,
                instagram: formData.b_instagram,
                youtube: formData.b_youtube,
                tiktok: formData.b_tiktok,
                twitter: formData.b_twitter,
            },
            discount_code: formData.b_discount_code,
            discount_message: formData.b_discount_message,
            language: formData.b_language,
            tags: formData.b_tags ? tagsString: [],
            categories: selectedCategories?selectedCategories.map(cat => cat.value):selectedCategoriesDB.map((ele) => ele),
        };

        formDataToSend.append('businessData', JSON.stringify(businessData));

        // Send form data to backend
        const response = await fetch(`${serverurl}update-businessdata/`, {
            method: 'POST',
            body: formDataToSend,
        });

        const result = await response.json();
        if (!response.ok || result.ErrorCode !== 0) {
            throw new Error(result.ErrorMsg || 'Failed to update business');
        }

        console.log("Business updated successfully");
        router.push(`/places/category/business/${params.id}`);
    } catch (error) {
        console.log("Error:", error);
    } finally {
        setAdding(false);
    }
};


  const imgDelete = async (name) => {
    setImages(images.filter((file) => file.name != name));
    if (name.includes("business/")) {
      try {
        const response = await fetch(`${serverurl}delete-businessimage/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image_url: name,
                business_id: params.id
            }),
        });

        const result = await response.json();
        if (!response.ok || result.ErrorCode !== 0) {
            throw new Error(result.ErrorMsg || 'Failed to delete image');
        }

        console.log("Image deleted successfully", imagesDB);

        // Update state with new images list
        setImagesDB(prevImagesDB => prevImagesDB.filter((img) => img !== name));
        setImages(prevImages => prevImages.filter((file) => file.name !== name));
        
    } catch (error) {
        console.error("Error:", error);
    }
    }
    else{
      setImages(images.filter((file) => file.name != name));

    
    
  }
};


  return (
    <>
      {loading ? (
        <div className="">Loading ... </div>
      ) : (
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
              <Formlabel text="Update Logo" forLabel="logo" />
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
              {logoDB ? (
                <div className="flex gap-4 items-center">
                  <span>Current logo:</span>
                  <Image
                    src={logourl}
                    alt=""
                    className="w-14 h-14 my-4 rounded-full bg-white d-flex p-1"
                    width={100}
                    height={100}
                  />
                </div>
              ) : logo && logo.length > 0 && <div className="flex gap-4 items-center">
              <span>Current logo:</span>
              <Image
                src={URL.createObjectURL(logo[0])}
                alt=""
                className="w-14 h-14 my-4 rounded-full bg-white d-flex p-1"
                width={100}
                height={100}
              />
            </div>}
              {customErrors.logo && (
                <span className="text-red-400 text-sm pl-1">
                  {customErrors.logo}
                </span>
              )}
            </div>

            <div className="mb-5">
              <Formlabel text="Update Images" forLabel="images" />
              <input
                id="images"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  setImages([...images, ...Array.from(e.target.files)]);
                  setImagesSelected([
                    ...imagesSelected,
                    ...Array.from(e.target.files),
                  ]);
                  setCustomErrors({
                    ...customErrors,
                    images: "",
                  });
                }}
                className="rounded-full  outline-none shadow-formFeilds text-text-gray text-sm py-4 bg-white pl-5 pr-5 border-2 border-[#E4E4E4] w-full"
                type="file"
                name="images"
                multiple
              />
              {(imagesDB || images.length > 0) && (
                <div className="">
                  <span className="inline-block mt-4 mb-1">
                    Current Images:
                  </span>
                  <div className="flex gap-4 items-center flex-wrap">
                    {[...images].map((item, index) => (
                      <>
                        {item && (
                          <div className="relative h-full" key={index}>
                            <Image
                              key={index}
                              src={
                                typeof item == "string"
                                  ? item
                                  : URL.createObjectURL(item)
                              }
                              alt=""
                              className="aspect-square rounded-sm  bg-white d-flex p-1"
                              width={180}
                              height={180}
                            />
                            <XMarkIcon
                              className="w-4 h-4 absolute top-3 right-2 cursor-pointer bg-white text-black rounded-full"
                              onClick={() =>
                                imgDelete(
                                  typeof item == "string" ? item : item.name
                                )
                              }
                            />
                          </div>
                        )}
                      </>
                    ))}

                    {imagesDB &&
                      imagesDB.length > 0 &&
                      [...imagesDB].map((item, index) => (
                        <>
                          {item && (
                            <div className="relative h-full" key={`index${index}`}>
                              <Image
                                key={index}
                                src={
                                  typeof item == "string"
                                    ? serverurl+'media/'+item
                                    : URL.createObjectURL(item)
                                }
                                alt=""
                                className="aspect-square rounded-sm  bg-white d-flex p-1"
                                width={180}
                                height={180}
                              />
                              <XMarkIcon
                                className="w-4 h-4 absolute top-3 right-2 cursor-pointer bg-white text-black rounded-full"
                                onClick={() =>
                                  imgDelete(
                                    typeof item == "string" ? item : item.name
                                  )
                                }
                              />
                            </div>
                          )}
                        </>
                      ))}
                  </div>
                </div>
              )}
              {customErrors.images && (
                <span className="text-red-400 text-sm pl-1">
                  {customErrors.images}
                </span>
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

                defaultValue={selectedStateDB}
              /> 
            </div>

            <div className="mb-5">
              <Formlabel text="City" forLabel="b_city" />
              <CitySelect
                required
                countryid={countryid}
                stateid={stateid ? stateid : selectedStateDB.id}
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
                defaultValue={selectedCityDB}
              />
            </div>

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
                  defaultValue={
                    selectedCategoriesDB.length > 0 &&
                    selectedCategoriesDB.map((ele) => ele)
                  }
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
            
{/* 
            <div className="mt-5">
              <Formlabel text="Tags (comma seperated)" forLabel="b_tags" />
              <InputField
                inputId="b_tags"
                inputName="b_tags"
                inputType="textarea"
                register={register}
                error={""}
              ></InputField>
            </div> */}

            <button
              type="submit"
              className="rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full disabled:bg-gray-600"
              disabled={adding}
            >
              {adding ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Page;
