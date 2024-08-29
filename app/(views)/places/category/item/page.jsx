import { inner, twitter } from "@/assets";
import ListTopBanner from "@/components/ListTopBanner";
import { MapPinIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div>
      <ListTopBanner
        img={inner}
        heading="Lone Star Driving School"
        label="Automotive"
        website="google.com"
        call="+1233456778"
        direction="#"
      />

      <div className="px-7 py-16 flex flex-col lg:flex-row gap-5">
        <div className="md:flex-[25%]">
          <div className=" bg-white p-8 rounded-3xl">
            <div className="flex gap-3 items-center">
              <div className="p-1 rounded-md bg-[#F1F3F6]">
                <MapPinIcon className="w-7 h-7 text-primary" />
              </div>
              <span className="text-[#1E1E1F] text-sm  leading-6">
                417 West Parker Road, Houston Philadelphia, TX, USA, 77091
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-5 text-text-color">
                Social Media
              </h3>
              <Link
                href="#"
                className="p-2 inline-block rounded-md w-9 h-9 bg-[#F1F3F6]"
              >
                <Image src={twitter} alt="" />
              </Link>
            </div>
          </div>
        </div>

        <div className="md:flex-[75%] ">
          <div className="bg-white p-8 rounded-3xl">
            <h3 className="text-xl font-bold mb-3 text-text-color">
              Business Details
            </h3>
            <p className="text-sm leading-6">
              ABOUT
              <br />
              Lone Star Driving School is rated the #5 best driving school in
              the city of Houston by YELP! Teaching and driving students for
              over 20 years, the school Director Mr. Tucker, is one of the best
              and knowledgeable driver’s education teachers in the city. We have
              been teaching teens and adults for many years! READ OUR GOOGLE
              REVIEWS!
            </p>
          </div>

          <div className="bg-white mt-7 p-8 rounded-3xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d27681.669739967132!2d-95.406134!3d29.858254!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1720607927415!5m2!1sen!2sus"
              width="100%"
              height="450"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
