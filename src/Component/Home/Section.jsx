import axios from "axios";
import { useEffect, useState } from "react";
import { GoArrowDownRight } from "react-icons/go";
import BaseUrl from "../../Api/baseurl";
import Swal from "sweetalert2"
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Section = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const getData = async () => {
    const apiUrl = `${BaseUrl}clinic/configurations/`;
    // const token = localStorage.getItem('auth_token')
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          // Authorization: `Token ${token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const handleBookAppointment = () => {
    
    const token = Cookies.get("patient_token");
    if (!token) {
      Swal.fire({
        title: "You are not logged in!",
        text: "Would you like to continue as a guest or log in?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Continue as Guest",
        cancelButtonText: "Log In",
      }).then((result) => {
        if (result.isConfirmed) {
          setModalOpen(true);
        } else if (result.isDismissed) {
          navigate("/user/login");
        }
      });
    } else {
      
      setModalOpen(true);
    }
  };

  return (
    <>
      <div className="bg-[#F2EFEA]">
        <div className="bg-[#F2EFEA]  container grid grid-cols-2 gap-1 relative h-fit px-4 md:px-8 lg:px-32 xl:px-48">
          <div className="">
            <div
              className=" sec_block_1 bg-gradient-to-b from-[#1030A4] to-[#DEDEDE] inline-block text-transparent bg-clip-text
                          w-[200px]  leading-none font-black text-lg pt-[10px]  sm:text-3xl sm:w-[255px] sm:pt-[37px] lg:w-[470px] lg:text-6xl lg:py-8"
            >
              {data.slogan_title}
            </div>

            <div className=" sec_block_2 w-[150px] text-[8px] pt-[8px] leading-0 sm:w-[300px] sm:text-xs sm:pt-[10px] md:text-[0.9rem] md:leading-[1.25rem] md:py-[16px] lg:w-[510px] lg: h-[48px]  lg:text-base xl:h-[85px] xl:pt-[23px]">
              <p>{data.slogan_text}</p>
            </div>
            <div className=" sec_block_3 pt-[16px] sm:pt-[34px] md:pt-[80px] lg:pt-[67px] lg:pb-[80]  ">
              <button
                className=" sec_button relative px-0 py-0  text-white opacity-[70%]"
                onClick={handleBookAppointment}
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                <span className="sec_block_3_1 bg-red-500 relative text-sm py-[8px] px-[8px] font-bold rounded-2xl flex items-center shadow-md shadow-red-500 sm:px-[12px] sm:py-[7px] lg:py-[12px] lg:px-[12px] xl:py-[12px] xl:px-[12px] xl:pl-[24px] xl:pr-[24px] ">
                  <span className="relative sm:text-[1rem] lg:text-xl  flex justify-center items-center">
                    Book Now{" "}
                    <GoArrowDownRight className="sectionarrow h-8 w-8 stroke-1" />
                  </span>
                </span>
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <img src="/assets/Home/Section1/main.png" alt="" />

            {/* <div className="w-32 bg-white px-4 py-2 rounded-[10px] text-sm font-bold text-[#1030A4]  absolute  mt-[-555px] shadow-lg shadow-[#DEDEDE]">
              <p>+50 years of Experiences</p>
            </div>
            <div className="w-32 bg-white px-4 py-2 rounded-[10px] text-sm font-bold text-[#1030A4]  absolute  mt-[-133px] ml-[420px] shadow-lg shadow-[#DEDEDE] opacity-[75%]">
              <p>Best in Neurology</p>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Section;
