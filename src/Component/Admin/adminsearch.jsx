import { CiSearch } from "react-icons/ci";
import { PiChatsCircle } from "react-icons/pi";
import { FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import Cookies from 'js-cookie';
import BaseUrl from '../../Api/baseurl';


const AdminSearch = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        image : "",
        fname : "",
      });

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isSuperuser, setIsSuperuser] = useState(false);
    const [isStaff, setIsStaff] = useState(false);
    useEffect(() => {
        const superuser = Cookies.get("is_superuser") === "true";
        const staff = Cookies.get("is_staff") === "true";
        setIsSuperuser(superuser);
        setIsStaff(staff);
        if(superuser){
            fetchData();
        }
      }, [isSuperuser]);
    const handleLogout = (tab) => {
        Cookies.remove('username');
        Cookies.remove('token');
        Cookies.remove("is_superuser");
        Cookies.remove("is_staff");
        Cookies.remove("is_vendor");
        Cookies.remove("status");
        Cookies.remove("roles");
        Cookies.remove("subroles");
        navigate("/admin/login");
    }

    const fetchData = async () => {
        const apiUrl = `${BaseUrl}clinic/admin/`;
        // const token = localStorage.getItem('auth_token');
        const token = Cookies.get('token') 
        try {
          const response = await axios.get(apiUrl, {
            headers: {
              Authorization: `Token ${token}`,
            //   'Content-Type': 'application/json',
            },
          });
  
            setData(response.data,"data");
        } catch (error) {
            console.error('Error:', error);
        }
      }
       

    return (
        <div className="w-full flex items-center justify-around">
            {/* <div className="container m-0 p-0 relative flex items-center w-full md:w-2/3">
                <input className="w-full h-[50px] px-4 self-center border border-black-800 rounded" type="text" placeholder="Search" />
                <Link className="flex absolute right-[10px] items-center"><CiSearch className="text-3xl" /></Link>
            </div> */}
            <div className="w-0 md:w-full gap-8 flex justify-end">
                {/* <Link className="hidden md:flex items-center"><PiChatsCircle className="text-4xl" /></Link> */}
                <Link to='/admin/notification' className="hidden md:flex items-center"><FaBell className="text-3xl" /></Link>
                <div className="flex flex-col">
                    <Link onClick={() => setDropdownOpen(!dropdownOpen)} className="">
                        {data && (
                        <div className="hidden md:flex items-center gap-3 px-3 rounded-lg  border-2 border-black-800 p-2">
                            <img src={data.image} className="w-[40px] h-[40px] rounded-full " alt="profile" /><div className="font-medium flex items-center"> {data.fname} <RiArrowDownSLine  className="text-[20px] ml-1"/></div>
                        </div>
                        )}
                    </Link>
                    {dropdownOpen && (
                        <div className="mt-2 !w-48 absolute z-1 right-[32px] top-[83px] rounded-lg w-full bg-gray-100 shadow-lg">
                            <Link
                                to="/admin/myprofile"
                                className={`block  px-4 py-2 font-semibold text-[#113C54] rounded-t-lg hover:bg-gray-300`}
                                onClick={() => ('myprofile')}

                            >
                                My Profile
                            </Link>
                            <hr className="text-black-800 border-[2px] mx-4" />
                            <Link
                                to="/admin/changepassword"
                                className={`block px-4 py-2 font-semibold text-[#113C54]  hover:bg-gray-300`}
                                onClick={() => ('changepassword')}

                            >
                                Change Password
                            </Link>
                            <hr className="text-black-800 border-[2px] mx-4" />
                            <Link
                                to="/admin/login"
                                className={`block px-4 py-2 font-semibold text-[#113C54] rounded-b-lg hover:bg-gray-300`}
                                onClick={() => handleLogout()}

                            >
                                Log Out
                            </Link>

                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminSearch;