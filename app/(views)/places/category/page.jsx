import React from "react";
import { BB } from "@/assets";
import TopBanner from "@/components/TopBanner";
import CardService from "@/components/CardService";
import Pagination from "@/components/Pagination";

const page = () => {
  return (
    <div>
      <TopBanner
        invert
        back
        img={BB}
        label="Free Listing"
        heading="Beauty & Spa"
        btnTxt={
          <>
            + List your business <span className="font-bold">for free</span>
          </>
        }
      />

      <div className="flex flex-col-reverse md:flex-row gap-10 px-7 py-16 md:gap-4">
        <div className="md:w-[75%]">
          <div className="flex gap-x-4 gap-y-5 flex-wrap">
            <CardService />
            <CardService />
            <CardService />
            <CardService />
            <CardService />
            <CardService />
            <CardService />
          </div>
          <Pagination />
        </div>

        <div className="md:w-[25%] sticky">
          <form className="p-8 bg-white rounded-3xl">
            <div className="flex flex-col gap-3 mb-7">
              <label htmlFor="states" className="text-base font-semibold">
                State
              </label>
              <select
                id="states"
                name="state"
                className="rounded-full outline-none shadow-formFeilds text-sm py-4 px-5 border-2 border-[#E4E4E4] w-full"
              >
                <option value="">Select state</option>
                <option value="alabama">Alabama</option>
                <option value="alaska">Alaska</option>
                <option value="arizona">Arizona</option>
                <option value="arkansas">Arkansas</option>
                <option value="california">California</option>
                <option value="colorado">Colorado</option>
                <option value="connecticut">Connecticut</option>
                <option value="delaware">Delaware</option>
                <option value="florida">Florida</option>
                <option value="georgia">Georgia</option>
                <option value="hawaii">Hawaii</option>
                <option value="idaho">Idaho</option>
                <option value="illinois">Illinois</option>
                <option value="indiana">Indiana</option>
                <option value="iowa">Iowa</option>
                <option value="kansas">Kansas</option>
                <option value="kentucky">Kentucky</option>
                <option value="louisiana">Louisiana</option>
                <option value="maine">Maine</option>
                <option value="maryland">Maryland</option>
                <option value="massachusetts">Massachusetts</option>
                <option value="michigan">Michigan</option>
                <option value="minnesota">Minnesota</option>
                <option value="mississippi">Mississippi</option>
                <option value="missouri">Missouri</option>
                <option value="montana">Montana</option>
                <option value="nebraska">Nebraska</option>
                <option value="nevada">Nevada</option>
                <option value="new-hampshire">New Hampshire</option>
                <option value="new-jersey">New Jersey</option>
                <option value="new-mexico">New Mexico</option>
                <option value="new-york">New York</option>
                <option value="north-carolina">North Carolina</option>
                <option value="north-dakota">North Dakota</option>
                <option value="ohio">Ohio</option>
                <option value="oklahoma">Oklahoma</option>
                <option value="oregon">Oregon</option>
                <option value="pennsylvania">Pennsylvania</option>
                <option value="rhode-island">Rhode Island</option>
                <option value="south-carolina">South Carolina</option>
                <option value="south-dakota">South Dakota</option>
                <option value="tennessee">Tennessee</option>
                <option value="texas">Texas</option>
                <option value="utah">Utah</option>
                <option value="vermont">Vermont</option>
                <option value="virginia">Virginia</option>
                <option value="washington">Washington</option>
                <option value="west-virginia">West Virginia</option>
                <option value="wisconsin">Wisconsin</option>
                <option value="wyoming">Wyoming</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 mb-7">
              <label htmlFor="city" className="text-base font-semibold">
                City
              </label>
              <select
                id="city"
                name="City"
                className="rounded-full outline-none shadow-formFeilds text-sm py-4 px-5 border-2 border-[#E4E4E4] w-full"
              >
                <option value="">Select state</option>
                <option value="alabama">Alabama</option>
                <option value="alaska">Alaska</option>
                <option value="arizona">Arizona</option>
                <option value="arkansas">Arkansas</option>
                <option value="california">California</option>
                <option value="colorado">Colorado</option>
                <option value="connecticut">Connecticut</option>
                <option value="delaware">Delaware</option>
                <option value="florida">Florida</option>
                <option value="georgia">Georgia</option>
                <option value="hawaii">Hawaii</option>
                <option value="idaho">Idaho</option>
                <option value="illinois">Illinois</option>
                <option value="indiana">Indiana</option>
                <option value="iowa">Iowa</option>
                <option value="kansas">Kansas</option>
                <option value="kentucky">Kentucky</option>
                <option value="louisiana">Louisiana</option>
                <option value="maine">Maine</option>
                <option value="maryland">Maryland</option>
                <option value="massachusetts">Massachusetts</option>
                <option value="michigan">Michigan</option>
                <option value="minnesota">Minnesota</option>
                <option value="mississippi">Mississippi</option>
                <option value="missouri">Missouri</option>
                <option value="montana">Montana</option>
                <option value="nebraska">Nebraska</option>
                <option value="nevada">Nevada</option>
                <option value="new-hampshire">New Hampshire</option>
                <option value="new-jersey">New Jersey</option>
                <option value="new-mexico">New Mexico</option>
                <option value="new-york">New York</option>
                <option value="north-carolina">North Carolina</option>
                <option value="north-dakota">North Dakota</option>
                <option value="ohio">Ohio</option>
                <option value="oklahoma">Oklahoma</option>
                <option value="oregon">Oregon</option>
                <option value="pennsylvania">Pennsylvania</option>
                <option value="rhode-island">Rhode Island</option>
                <option value="south-carolina">South Carolina</option>
                <option value="south-dakota">South Dakota</option>
                <option value="tennessee">Tennessee</option>
                <option value="texas">Texas</option>
                <option value="utah">Utah</option>
                <option value="vermont">Vermont</option>
                <option value="virginia">Virginia</option>
                <option value="washington">Washington</option>
                <option value="west-virginia">West Virginia</option>
                <option value="wisconsin">Wisconsin</option>
                <option value="wyoming">Wyoming</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 mb-7">
              <label htmlFor="community" className="text-base font-semibold">
                Community
              </label>
              <select
                id="community"
                name="community"
                className="rounded-full outline-none shadow-formFeilds text-sm py-4 px-5 border-2 border-[#E4E4E4] w-full"
              >
                <option value="">Select community</option>
                <option value="arabs-in-usa">Arabic Communities</option>
                <option value="egyptian-in-boston">Egyptians in USA</option>
                <option value="jordans-in-california">Jordanians in USA</option>
                <option value="moroccans-in-california">
                  Moroccans in USA
                </option>
                <option value="syrians-in-california">Syrians in USA</option>
                <option value="iraqis-in-california">Iraqis in USA</option>
                <option value="lebanese-in-california">Lebanese in USA</option>
                <option value="japanese-communities">Japanese Community</option>
                <option value="spanish-communities">Spanish Communities</option>
                <option value="portuguese-communities">
                  Portuguese Communities
                </option>
                <option value="french-communities">French communities</option>
                <option value="english-communities">English Communities</option>
                <option value="algerians-in-usa">Algerians in USA</option>
                <option value="saudis-in-usa">Saudis in USA</option>
                <option value="yemenis-in-usa">Yemenis in USA</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 mb-7">
              <label className="text-base font-semibold">Language</label>
              <div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="some_id"
                    className="appearance-none w-4 h-4 cursor-pointer outline-1 outline outline-gray-200 border-[3px] border-transparent bg-white mt-1 shrink-0 checked:border-white checked:bg-primary  "
                  />
                  <label htmlFor="some_id" className="cursor-pointer">
                    Arabic
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="some_id1"
                    className="appearance-none w-4 h-4 cursor-pointer outline-1 outline outline-gray-200 border-[3px] border-transparent bg-white mt-1 shrink-0 checked:border-white checked:bg-primary  "
                  />
                  <label htmlFor="some_id1" className="cursor-pointer">
                    Arabic
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="some_id2"
                    className="appearance-none w-4 h-4 cursor-pointer outline-1 outline outline-gray-200 border-[3px] border-transparent bg-white mt-1 shrink-0 checked:border-white checked:bg-primary  "
                  />
                  <label htmlFor="some_id2" className="cursor-pointer">
                    Arabic
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="some_id3"
                    className="appearance-none w-4 h-4 cursor-pointer outline-1 outline outline-gray-200 border-[3px] border-transparent bg-white mt-1 shrink-0 checked:border-white checked:bg-primary  "
                  />
                  <label htmlFor="some_id3" className="cursor-pointer">
                    Arabic
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="some_id4"
                    className="appearance-none w-4 h-4 cursor-pointer outline-1 outline outline-gray-200 border-[3px] border-transparent bg-white mt-1 shrink-0 checked:border-white checked:bg-primary  "
                  />
                  <label htmlFor="some_id4" className="cursor-pointer">
                    Arabic
                  </label>
                </div>
              </div>
            </div>

            <button className="bg-primary duration-300 text-white mb-3 px-6 py-3 rounded-full w-full hover:opacity-60">Search</button>
            <button className="border-2 duration-300 border-primary text-primary px-6 py-3 rounded-full w-full hover:bg-primary hover:text-white">Reset Filters</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
