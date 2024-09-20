"use client";
import SubHeaderComponent from "@/components/datatable-components/SubHeaderComponent";
import Loader from "@/components/Loader";
import { supabase } from "@/lib/supabase";
import {
  EnvelopeIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from "@heroicons/react/16/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { Bounce, toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const { user, user_meta } = useSelector((state) => state.auth);
const [error,setError]=useState("")
  const [loading, setLoading] = useState(true);
  const [selectedRowsState, setSelectedRows] = useState(false);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const openModal = (id) => {
    console.log("Hi",id)
    setDeleteId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setDeleteId(null);
  };

  const confirmDelete = () => {
    if (deleteId) {
      handleDelete(deleteId);
    }
    closeModal(); // Close the modal after deletion
  };
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row.location,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => {
        if(row.approved == '0') return 'PENDING'
        if(row.approved == '1') return 'APPROVED'
        if(row.approved == '2') return 'REJECTED'
      },
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          {/* Always show EyeIcon */}
          <Link
            href={`/places/category/business/${row.id}`}
            className="underline mr-4"  // Add margin-right for spacing
          >
            <EyeIcon className="w-5 h-5" />
          </Link>
    
          {/* Conditionally show Edit and Delete buttons if user exists */}
       {/* Conditionally show Edit and Delete buttons if user exists */}
{(user.role === 1 || user.role === '1' || user.id === row.user_id) && (
  <>
    {/* Edit Business */}
    <Link
      href={`/dashboard/business/update/${row.id}`}
      className="underline mr-4"  // Add margin-right for spacing
    >
      <PencilIcon className="w-5 h-5" />
    </Link>

    {/* Delete Business */}
    <button
      className="bg-red-500 text-white w-7 h-7 rounded-full flex justify-center items-center"
      onClick={() => openModal(row.id)} // Open modal on click
    >
      <TrashIcon className="w-4 h-4" />
    </button>
  </>
)}

        </>
      ),
    }
    
    
    
  ];

  const [business, setBusiness] = useState([]);
  console.log("my",business)
  const [filterText, setFilterText] = useState("");
  const filteredItems = business.filter(
    (item) =>
      (item.name &&
        item.name.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.email &&
        item.email.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.location &&
        item.location.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.phone &&
        item.phone.toLowerCase().includes(filterText.toLowerCase()))
  );
  const handleDelete = async (id) => {


console.log("id",id)

    try {
      const response = await fetch(`${serverurl}archive-business/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      });
  
      const result = await response.json();
      if (response.ok){
        console.log("New Log",result)
        getBusinesses()
        setToggleClearRows(!toggledClearRows)
        toast.success('Deleted Sucessfully', {
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
      } else {
        toast.error(result.ErrorMsg || 'Failed to update businesses', {
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
      // if (response.ok) {
      //   router.push("/");
      // } else {
      //   console.error(result.ErrorMsg || 'Failed to archive business');
      // }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };
  // useEffect(() => {
  //   if (!user && user_meta.role !== "super_admin") router.push("/");
  //   getBusinesses();
  // }, []);

  // useEffect(() => {
  //   if (!user && user_meta.role !== "super_admin") router.push("/"); 
  // }, [user]);
  useEffect(() => {
    // Redirect if user is not defined or has no ID
    // if (!user || !user.id) {
    //   router.push("/");
    //   return;
    // }
    getBusinesses();
  }, []);
    const getBusinesses = async () => {
      try {
        let response;
        const headers = { 'Content-Type': 'application/json' };
        const url = `${serverurl}get-business/`;
        
        const options = {
          method: 'GET',
          headers,
        };

        response = await fetch(url, options);
        
        const result = await response.json();
        
        if (response.ok) {
          setBusiness(result.data);
        } else {
          setError(result.error || 'Failed to fetch businesses');
        }
      } catch (error) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

 

  // select selected rows
  const onSelectRowChange = ({ selectedRows }) => {
    console.log(selectedRows);
    setSelectedRows(selectedRows);
  };

  
  const selectStatus = async (e) => {
    try {
      console.log(e.target.value);
      let updateArray = [];
      
      if (e.target.value === "approve") {
        updateArray = selectedRowsState.map((row) => ({
          id: row.id,
          approved: "1",
        }));
      } else if (e.target.value === "pending") {
        updateArray = selectedRowsState.map((row) => ({
          id: row.id,
          approved: "0",
        }));
      } else if (e.target.value === "reject") {
        updateArray = selectedRowsState.map((row) => ({
          id: row.id,
          approved: "2",
        }));
      } else if (e.target.value === "delete") {
        updateArray = selectedRowsState.map((row) => ({
          id: row.id,
          isArchived: true,
        }));
      } else if (e.target.value === "featured") {
        updateArray = selectedRowsState.map((row) => ({
          id: row.id,
          isFeatured: true,
        }));
      } else if (e.target.value === "unfeatured") {
        updateArray = selectedRowsState.map((row) => ({
          id: row.id,
          isFeatured: false,
        }));
      }
  
      if (updateArray.length > 0) {
        console.log(updateArray);
  
        const response = await fetch(`${serverurl}update-businesses/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateArray),
        });
  
        const result = await response.json();
        if (result.ErrorCode===0) {
          console.log("New Log",result)
          getBusinesses()
          setToggleClearRows(!toggledClearRows)
          toast.success('Updated', {
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
        } else {
          toast.error(result.ErrorMsg || 'Failed to update businesses', {
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
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  // select status change
  // const selectStatus = async (e) => {
  //   try {
  //     console.log(e.target.value);
  //     let upddateArray = [];
  //     if (e.target.value === "approve") {
  //       upddateArray = selectedRowsState.map((row) => {
  //         return { id: row.id, approved: "1" };
  //       });
  //     }
  //     if (e.target.value === "pending") {
  //       upddateArray = selectedRowsState.map((row) => {
  //         return { id: row.id, approved: "0" };
  //       });
  //     }
  //     if (e.target.value === "reject") {
  //       upddateArray = selectedRowsState.map((row) => {
  //         return { id: row.id, approved: "2" };
  //       });
  //     }
  //     if (e.target.value === "delete") {
  //       upddateArray = selectedRowsState.map((row) => {
  //         return { id: row.id, isArchived: true };
  //       });
  //     }

  //     if (e.target.value === "featured") {
  //       upddateArray = selectedRowsState.map((row) => {
  //         return { id: row.id, isFeatured: true };
  //       });
  //     }

  //     if (e.target.value === "unfeatured") {
  //       upddateArray = selectedRowsState.map((row) => {
  //         return { id: row.id, isFeatured: false };
  //       });
  //     }

  //     if (upddateArray.length > 0) {
  //       console.log(upddateArray);

  //       const { data, error } = await supabase
  //         .from("business")
  //         .upsert(upddateArray)
  //         .select();

  //       if(error) throw error
  //       getBusinesses()
  //       setToggleClearRows(!toggledClearRows)
  //       toast.success('Updated', {
  //         position: "bottom-center",
  //         autoClose: 3000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: false,
  //         draggable: false,
  //         progress: undefined,
  //         theme: "light",
  //         transition: Bounce,
  //         });
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // };

  return (
    <>
    {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">Are you sure you want to delete this item?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={closeModal} // Close modal if No is clicked
              >
                No
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={confirmDelete} // Confirm deletion if Yes is clicked
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <Loader />
      ) : (
        <div className="w-[95%] mx-auto pb-20">
          
          <div className="flex justify-end flex-wrap my-6">

            {user.role&&
            (
              <Link
              href="/dashboard/business/add"
              className="bg-primary text-white text-center text-sm rounded-full py-2 px-9 border-8 border-white"
            >
              Add
            </Link>
            )}
          
          </div>
          
          <div className="mt-5">
            <DataTable
              title={
                <div className="pt-7">
                  <h1 className="text-2xl font-bold">Businesses</h1>
                  
                 
                  <div className="flex justify-between flex-wrap items-center w-full">
                    <select
                      onChange={selectStatus}
                      className="outline-none text-sm border border-gray-300 p-2 pr-4 cursor-pointer"
                    >
                      <option className="cursor-pointer" value="none">
                        Actions
                      </option>
                      {user_meta.role == 1 && (
                        <>
                        <option className="cursor-pointer" value="featured">
                          Featured
                        </option>
                        <option className="cursor-pointer" value="unfeatured">
                          Unfeatured
                        </option>
                        <option className="cursor-pointer" value="approve">
                          Approve
                        </option>
                        <option className="cursor-pointer" value="pending">
                          Pending
                        </option>
                        <option className="cursor-pointer" value="reject">
                          Reject
                        </option>
                        <option className="cursor-pointer" value="delete">
                        Delete
                      </option>
                        </>
                      )}
                      
                      
                    </select>
                    <SubHeaderComponent
                      filterText={filterText}
                      setFilterText={setFilterText}
                    />
                  </div>

                </div>
              }
              columns={columns}
              data={filteredItems}
              persistTableHead
              highlightOnHover
              fixedHeader

              clearSelectedRows={toggledClearRows}
              selectableRows
              onSelectedRowsChange={onSelectRowChange}
            />
          </div>
        </div>
      )}
      
    </>
  );
};

export default Page;
