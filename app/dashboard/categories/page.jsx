"use client";
import SubHeaderComponent from "@/components/datatable-components/SubHeaderComponent";
import Loader from "@/components/Loader";
import { supabase } from "@/lib/supabase";
import { PencilSquareIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import useGetApi from "@/hooks/useGetApis";
const Page = () => {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState();
  const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL

// const { data, loading, error } = useGetApi('http://127.0.0.1:8000/get-categories/');
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    
    {
      name: "Actions",
      cell: (row) => (
        <>
        {user.role &&(
          <Link
            href={`/dashboard/categories/update/${row.id}`}
            className="underline"
          >
            <PencilSquareIcon className="w-5 h-5" />
          </Link>
        )}
          
          {/* {row.user_id == user.id ? (
            <Link
              href={`/dashboard/business/update/${row.id}`}
              className="underline"
            >
              <PencilSquareIcon className="w-5 h-5" />
            </Link>
          ) : (
            "No actions avaiable"
          )} */}
           
        </>
      ),
    },
  ];

  const [category, setCategory] = useState([]);
  const [filterText, setFilterText] = useState("");
  const filteredItems = category.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  useEffect(() => {
    // if (!user || !user.id) {
    //   router.push("/");
    //   return;
    // }
    const fetchCategories = async () => {
      try {
        let response;
        const headers = { 'Content-Type': 'application/json' };
        const url = user.role === '3' || user.role === 3
          ? `${serverurl}get-usercategory/`
          : `${serverurl}get-categories/`;
        
        const options = {
          method: user.role === '3' ||user.role === 3 ? 'POST' : 'GET',
          headers,
          ...(user.role === '3' || user.role === 3  && { body: JSON.stringify({ user_id: user.id }) })
        };

        response = await fetch(url, options);
        
        const result = await response.json();
        
        if (response.ok) {

          user.role===3 || user.role==='3'?setCategory(result.data):setCategory(result);
         



        } else {
          setError(result.error || 'Failed to fetch businesses');
        }
      } 
       catch (error) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-[95%] mx-auto">
          <div className="flex justify-end flex-wrap my-6">
            
          {user.role&&
            (
            <Link
              href="/dashboard/categories/add"
              className="bg-primary text-white text-center text-sm rounded-full py-2 px-9 border-8 border-white"
            >
              Add
            </Link>
            )}
          </div>
          <div className="mt-5">
            <DataTable
              title={
                <div className="flex justify-between flex-wrap items-center w-full">
                  <h1 className="text-2xl font-bold">Categories</h1>
                  <SubHeaderComponent
                    filterText={filterText}
                    setFilterText={setFilterText}
                  />
                </div>
              }
              columns={columns}
              data={filteredItems}
              persistTableHead
              striped
              highlightOnHover
              pointerOnHover
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
