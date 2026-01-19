import { Link, useNavigate } from 'react-router-dom';
import { FaFacebookF } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { BsFillTelephonePlusFill } from "react-icons/bs";
import AppointmentModal from "./appointmentmodal";
import { useState, useEffect } from 'react';
import axios from 'axios'
import BaseUrl from '../../Api/baseurl';
import Swal from "sweetalert2"
import Cookies from "js-cookie";

const Footer = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(window.location.pathname);
  };
  const [data, setData] = useState({
    new_logo : "",
    facebook_url : "",
    twitter_url : "",
    instagram_url : "",
    linkedin_url : "",
    timings_weekday : "",
    timings_weekend : "",
    company_name : "",
    contact_number : "",
    email_address : "",
    address : "",
  });

  const active = window.location.pathname;

  const fetchData = async () => {
    const apiUrl =  `${BaseUrl}clinic/configurations/`
    // const token = localStorage.getItem('auth_token') 
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          // Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
        setData(response.data,"data");
    } catch (error) {
        console.error('Error:', error);
    }
  }
  
  useEffect(() => {
    fetchData();
  },[])

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
    <div className="bg-gray-200">
      {data && (
      <div className="container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 ">
        <div className="flex items-center justify-between h-24 sm:h-32">
          <div className="!w-2/5 md:!w-1/3 lg:!w-1/6 ">
            <Link to='/'><img src={data.new_logo} /></Link>
          </div>
          {/* Navigation links hidden on medium screens */}
          <nav className="hidden lg:flex flex-grow justify-center space-x-10">
            <Link to="/about" onClick={() => handleTabClick('about')} className={`font-medium  ${activeTab === 'about' || active === '/about' ? 'text-blue-800' : 'text-black'}`}>
              About Us
            </Link>
            <Link to="/services" onClick={() => handleTabClick('services')} className={`font-medium  ${activeTab === 'services' || active === '/services' ? 'text-blue-800' : 'text-black'}`}>
              Services
            </Link>
            <Link to="/blog" onClick={() => handleTabClick('blog')} className={`font-medium  ${activeTab === 'blog' || active === '/blog' ? 'text-blue-800' : 'text-black'}`}>
              Blog
            </Link>
            <Link to="/contactus" onClick={() => handleTabClick('contactus')} className={`font-medium  ${activeTab === 'contactus' || active === '/contactus' ? 'text-blue-800' : 'text-black'}`}>
              Contact Us
            </Link>
          </nav>
          <div className=" md:flex content-center items-center flex-shrink-0">
            <Link
              className="py-2 px-3 ml-3 sm:ml-3 md:ml-0 text-[12px] sm:text-[16px] md:text-[24px] bg-[#1030A4] text-white rounded-[5px] hover:bg-blue-700 font-semibold"
              aria-disabled='true'
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              onClick={handleBookAppointment}
            >
              Book Appointment
            </Link>
            <AppointmentModal modalOpen={modalOpen} setModalOpen={setModalOpen}/>
          </div>
        </div>
        <hr className='w-full font-bold' />

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-y-8 py-8 px-2'>
          <div className='flex flex-col'>
            <div class="font-roboto text-2xl font-semibold leading-6 text-left pb-6">Opening Hours</div>
            <div class="font-roboto text-base font-[16px] leading-6 text-left">Weekdays:<span class="font-roboto text-gray-400 text-base font-medium leading-6 ml-2">{data.timings_weekday}</span></div>
            <div class="font-roboto text-base font-[16px] leading-6 text-left mt-2">Weekend:<span class="font-roboto text-gray-400 text-base font-medium leading-6 ml-2">{data.timings_weekend}</span></div>
          </div>

          <div className='flex flex-col justify-self-none sm:justify-self-none lg:justify-self-center'>
            <div class="font-roboto text-2xl font-semibold leading-6 text-left pb-6">Address</div>
            <div className='font-roboto text-base font-[16px] leading-6 text-left w-60'>{data.address}</div>
          </div>

          <div className='flex flex-col justify-self-none lg:justify-self-end'>
            <div class="font-roboto text-2xl font-semibold leading-6 text-left pb-6"> Contact</div>
            <div className='flex items-center font-roboto text-base font-[16px] leading-6 text-left'> <CiMail className='mr-2'/>{data.email_address}</div>
            <div className='flex items-center font-roboto text-base font-[16px] leading-6 text-left mt-2'> <BsFillTelephonePlusFill className='mr-2'/>(+91) {data.contact_number}</div>
          </div>
        </div>

        <hr className='w-full font-bold' />

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-y-8 py-8 px-2'>
          <div>
            <Link to="/privacypolicy" class="font-roboto text-sm font-normal leading-5 text-left no-underline hover:underline">Privacy Policy</Link>
            <Link to="/termsofservice" class="font-roboto text-sm font-normal leading-5 text-left no-underline hover:underline ml-4">Terms of Service</Link>
          </div>

          <div className='flex justify-none sm:justify-none lg:justify-center text-center'>
            <p>
            © Copyright @ 2026  | <a target='_blank' rel="noreferrer" href='https://logicspice.com/doctor-appointment-scheduling-software' className='hover:text-blue-800'>Doctor Appointment Scheduling Software</a> by Logicspice. All Rights Reserved
            </p>
          </div>

          <div className='flex gap-4 justify-none sm:justify-none lg:justify-end'>
            <Link to={data.facebook_url} target='_blank'><FaFacebookF className='hover:text-gray-600'/></Link>
            <Link to={data.instagram_url} target='_blank'><FaInstagram className='hover:text-gray-600'/></Link>
            <Link to={data.twitter_url} target='_blank'><FaTwitter className='hover:text-gray-600'/></Link>
            <Link to={data.linkedin_url} target='_blank'><FaLinkedin className='hover:text-gray-600'/></Link>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}

export default Footer;