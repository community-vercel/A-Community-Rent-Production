"use client";
import React, { useEffect, useState } from "react";
import { BB } from "@/assets";
import TopBanner from "@/components/TopBanner";
import CardService from "@/components/CardService";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import Checkbox from "@/components/Checkbox";

import { CitySelect, StateSelect,GetLanguages } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

const Page = () => {
  const [category, setCategory] = useState(null);

  const [businesses, setBusinesses] = useState([]);

  const [loading, setLoading] = useState(true);
  const params = useParams();
  const { user } = useSelector((state) => state.auth);

  // for state and city,language library
  const countryid = 233;
  const [stateid, setstateid] = useState(0);
  const [languageList, setLanguageList] = useState([]);
  // for search
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedLangauge, setSelectedLangauge] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [selectedCity, setSelectedCity] = useState("");
   const [discount, setDiscount] = useState(false);
  const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL

  // for infinite scroll
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchCategoryAndBusinesses();
      GetLanguages().then((result) => {
        setLanguageList(result);
      });
    }
  }, [params.id]);
  async function fetchCategoryAndBusinesses() { 
    try {
      setLoading(true); 
      const { from, to } = getFromTo();
      const formData = {
        id: params.id,
        from: from,
        to: to
      };
      const response = await fetch(`${serverurl}get-category-businesses/`,{
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(formData),
    });
      
      const result = await response.json();
      
      if (result.ErrorCode === 0) {
        setCategory(result.data[0]); // Assuming category name exists
        setBusinesses(result.data.filter((item) => item.business_id != null));
        setPage(page + 1);
      } else {
        console.error(result.ErrorMsg);
      }
      
    } catch (error) {
      //error.message);
    } finally {
      setLoading(false);
    }
  }
  async function fetchMoreBusiness() {
    try {
      //'runn...');
      const { from, to } = getFromTo();
      const formData = {
        id: params.id,
        from: from,
        to: to
      };
  
      // Fetch businesses for this category with pagination
      const response = await fetch(`${serverurl}fetch-more-businesses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });
      
      const result = await response.json();
  
      if (result.ErrorCode === 0) {
        setBusinesses([
          ...businesses,
          ...result.data.filter((item) => item.business_id != null),
        ]);
  
        // Increment page or handle pagination
        setPage((page) => page + 1);
  
        // Check if more businesses are available (optional)
        if (result.data.length === 0) {
          setHasMore(false);
        }
  
      } else {
        console.error(result.ErrorMsg);
      }
      
    } catch (error) {
      //error.message);
    }
  }
  

  const getFromTo = () => {
    const item_per_page = 2;
    let from = page * item_per_page;
    let to = from + item_per_page;
    if (page > 0) from += 1;
    return { from, to };
  };

  const hanndleDiscountChange = () => {
    setDiscount(!discount);
  };
  const handleSubmit = async (e) => {

    e.preventDefault();
  
  
    // Build query parameters
    const requestBody = {
      category_id: params.id,
      state: selectedState || '',
      city: selectedCity || '',
      language:selectedLangauge || '',
      rating: selectedRating || '',
      discount: discount ? 'true' : 'false'
    };
  
    try {
      setLoading(true);
  
      // Fetch data from API
      const response = await fetch(`${serverurl}search-businesses/`,{
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
      const result = await response.json();
  
      if (response.ok) {
        //"Fetched results:", selectedState);


        setBusinesses(result.data);
    
      } else {
        console.error("Error fetching results:", result.ErrorMsg);
      }
    } catch (error) {
      console.error("Error fetching results:", error.message);
    } finally {
      setLoading(false);
    }
  };
  
const resetForm = async () => {
    try {
      // Reset form fields
      setSelectedCity('');
      setSelectedState('');
      setSelectedRating('');
      setSelectedLangauge('');
      setDiscount(false);
      setstateid('');
      setPage(1);
  
      // Fetch initial businesses for the category
      const formData = {
        id: params.id,
        from: 0, // Starting index
        to: 9   // Ending index (you can adjust this as needed)
      };
  
      const response = await fetch(`${serverurl}get-category-businesses/`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok && result.ErrorCode === 0) {
        setSelectedState(selectedState)
        setBusinesses(result.data); // Set businesses data
        setHasMore(result.data.length >= 10); // Check if there are more records to load
      } else {
        console.error(result.ErrorMsg || 'Failed to fetch data');
      }
  
    } catch (error) {
      console.log('Error resetting form:', error);
    }
  };
  
  return (
    <>
      {loading ? (
        <div className="">Loading</div>
      ) : (
        <div>
          <TopBanner
            invert
            back
            img={category ? `${serverurl}media/`+category.cover : BB}
            label="Free Listing"
            heading={category?category.category_name:"Category"}
            btnTxt={
              <>
                + List your business <span className="font-bold">for free</span>
              </>
            }
          />


          <div className="flex flex-col-reverse md:flex-row gap-10 px-7 py-16 md:gap-4">
            {businesses.length > 0 ? (
              <div className="md:w-[75%]">
                <InfiniteScroll
                  dataLength={page * 10} 
                  next={fetchMoreBusiness}
                  hasMore={hasMore}
                  loader={<div>  </div>} 
                >
                  <div className="flex gap-x-4 gap-y-5 flex-wrap">
                    {businesses.map((item) => (
                      <CardService
                        business={item
                        }
                        key={item.business_id
                        }
                        user_id={user.id}
                      />
                    ))}
                  </div>
                </InfiniteScroll>
              </div>
            ) : (
              <div className="md:w-[75%] m-5">No business.</div>
            )}
            <div className="md:w-[25%] sticky">
              <form
                className="p-8 bg-white rounded-3xl"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col gap-3 mb-7">
                  <label htmlFor="states" className="text-base font-semibold  ">
                    State
                  </label>
                  <StateSelect
                    countryid={countryid}
                    onTextChange = {(e)=>{
                      if(!e.target.value){
                        setstateid('');
                        setSelectedState('');
                      }
                    }}
                    onChange={(e) => {
                      //e);
                      setstateid(e.id);
                      setSelectedState(e.name);
                    }}
                    placeHolder="Select State"
                    inputClassName="outline-none shadow-formFeilds text-sm font-inter !border-transparent w-full"
                  />
                </div>

                <div className="flex flex-col gap-3 mb-7">
                  <label htmlFor="states" className="text-base font-semibold">
                    City
                  </label>
                  <CitySelect
                    countryid={countryid}
                    stateid={stateid}
                    
                    onTextChange = {(e)=>{
                      if(!e.target.value){ 
                        setSelectedCity('');
                      }
                    }}
                    onChange={(e) => {
                      //e);
                      setSelectedCity(e.name);
                    }}
                    placeHolder="Select City"
                    inputClassName="outline-none shadow-formFeilds text-sm font-inter !border-transparent w-full"
                  />
                </div>

                <div className="flex flex-col gap-3 mb-7">
                  <label htmlFor="city" className="text-base font-semibold">
                    Rating
                  </label>
                  <select
                    id="rating"
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="outline-none shadow-formFeilds text-sm py-3 rounded-md px-2 border-[1px] border-[#ccc] w-full"
                  >
                    <option value="">All Ratings</option>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} Star
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-3 mb-7">
                  <label htmlFor="Langauge" className="text-base font-semibold">
                  Langauge
                  </label>
                  <select
                    id="language"
                    value={selectedLangauge}
                    onChange={(e) => setSelectedLangauge(e.target.value)}
                    className="outline-none shadow-formFeilds text-sm py-3 rounded-md px-2 border-[1px] border-[#ccc] w-full"
                  >
                    <option value="">All Langauges</option>
                    {languageList.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-7">
                  <Checkbox
                    checkboxId="discount"
                    checkboxLable="Have Disounts?"
                    chkd={discount}
                    handleChange={hanndleDiscountChange}
                  />
                </div>

                
                <button type="submit" className="bg-primary duration-300 text-white mb-3 px-6 py-3 rounded-full w-full hover:opacity-60">
                  Search
                </button>
                <button type="button" onClick={resetForm} className="border-2 duration-300 border-primary text-primary px-6 py-3 rounded-full w-full hover:bg-primary hover:text-white">
                  Reset Filters
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
