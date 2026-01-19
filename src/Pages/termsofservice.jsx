// import axios from "axios";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import parse from 'html-react-parser';

// const TermsofService = () => {
//     const [data, setData] = useState([]);
//     const getData = async () => {
//         const apiUrl = 'http://127.0.0.1:8000/clinic/managepages/terms-of-service';
//         // const token = Cookies.get('token'); 
//         const token = localStorage.getItem('auth_token');
//         try {
//             const response = await axios.get(apiUrl, {
//                 headers: {
//                     Authorization: `Token ${token}`,
//                 },
//             });
//             console.log(response.data);
//             setData(response.data);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         getData();
//     }, []);
//     return (
//         <div>
//             <div className=" bg-[#F2EFEA] py-24">
//                 <div className="container  mx-auto px-4 sm:px-8 lg:px-32 xl:px-48">
//                     <div className="flex flex-col justify-center items-center">
//                         <text className="text-[#011632] font-inter text-[52px] font-bold leading-62.4 tracking-tighter text-center">Terms Of Service</text>
//                         {/* <p className="text-[#3C4959] font-inter text-base font-normal leading-7 tracking-tight text-center w-full lg:w-1/3 xl:w-1/4"> This page is a document for a doctors' consultation website is essential to set clear expectations between the service provider and users.</p> */}
//                     </div>
//                 </div>
//             </div>


//             {/* <div className="container  mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 py-16">
//                 <p className="font-inter text-[18px] font-normal leading-7 text-left mb-4">Welcome to <span className="text-blue-800"><Link>www.doctors-consultation.com</Link></span>. By accessing or using our Site and services, you agree to comply with and be bound by these Terms and Conditions ("Terms"). Please read them carefully. If you do not agree to these Terms, you should not use our Site.</p>
                
//                 <text className=" font-semibold font-inter text-[20px] leading-7 text-left">Acceptance of Terms</text>
//                 <p className="font-inter text-[18px] font-normal leading-7 text-left mb-4">By using our services, you confirm that you are at least 18 years old or have the consent of a parent or guardian. You agree to these Terms and our Privacy Policy, which is incorporated herein by reference.</p>
                
//                 <text className=" font-semibold font-inter text-[20px] leading-7 text-left">Services Provided</text>
//                 <p className="font-inter text-[18px] font-normal leading-7 text-left"><span className="text-blue-800"><Link>www.doctors-consultation.com</Link></span> provides an online platform that allows users to:</p>
//                 <p className="font-inter text-[18px] font-normal leading-7 text-left">• Schedule consultations with licensed healthcare professionals.</p>
//                 <p className="font-inter text-[18px] font-normal leading-7 text-left">• Access health-related information and resources.</p>
//                 <p className="font-inter text-[18px] font-normal leading-7 text-left mb-4">• Communicate with healthcare providers through secure messaging.</p>

//                 <text className=" font-semibold font-inter text-[20px] leading-7 text-left">User Obligations</text>
//                 <p className="font-inter text-[18px] font-normal leading-7 text-left">When using our Site, you agree to:</p>
//                 <p className="font-inter text-[18px] font-normal leading-7 text-left">• Provide accurate, current, and complete information during registration and consultations.</p>
//                 <p className="font-inter text-[18px] font-normal leading-7 text-left">• Maintain the confidentiality of your account information and password.</p>
//                 <p className="font-inter text-[18px] font-normal leading-7 text-left">• Notify us immediately of any unauthorized use of your account or any other breach of security.</p>
//                 <p className="font-inter text-[18px] font-normal leading-7 text-left mb-4">• Use our services only for lawful purposes and in accordance with these Terms.</p>

//                 <text className=" font-semibold font-inter text-[20px] leading-7 text-left">Appointment Scheduling</text>
//                 <p className="font-inter text-[18px] font-normal leading-7 text-left">• Appointments can be scheduled through our Site based on the availability of the healthcare professionals.</p>
//                 <p className="font-inter text-[18px] font-normal leading-7 text-left mb-4">• We reserve the right to cancel or reschedule appointments due to unforeseen circumstances or provider availability.</p>

//                 <text className=" font-semibold font-inter text-[20px] leading-7 text-left">Fees and Payment</text>
//                 <p className="font-inter text-[18px] font-normal leading-7 text-left">• Fees for consultations will be clearly stated at the time of booking. Payment is required at the time of booking via our accepted payment methods.</p>
//                 <p className="font-inter text-[18px] font-normal leading-7 text-left mb-4">• All fees are non-refundable unless otherwise stated.</p>

//                 <text className=" font-semibold font-inter text-[20px] leading-7 text-left">No Medical Advice</text>
//                 <p className="font-inter text-[18px] font-normal leading-7 text-left">• The information provided on our Site is for informational purposes only and should not be considered medical advice.</p>
//                 <p className="font-inter text-[18px] font-normal leading-7 text-left mb-4">• Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition.</p>

//                 <text className=" font-semibold font-inter text-[20px] leading-7 text-left">Limitation of Liability</text>
//                 <p className="font-inter text-[18px] font-normal leading-7 text-left mb-4">• To the fullest extent permitted by law, [Website Name], its affiliates, and its service providers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or goodwill, arising from or related to your use of our Site or services.</p>
            
//                 <text className=" font-semibold font-inter text-[20px] leading-7 text-left">Indemnification</text>
//                 <p className="font-inter text-[18px] font-normal leading-7 text-left mb-4">You agree to indemnify, defend, and hold harmless [Website Name], its affiliates, and their respective officers, directors, employees, agents, and licensors from any claims, liabilities, damages, losses, and expenses (including reasonable attorneys' fees) arising out of or related to your use of our Site, violation of these Terms, or violation of any rights of another party.</p>

//                 <text className=" font-semibold font-inter text-[20px] leading-7 text-left">Termination</text>
//                 <p className="font-inter text-[18px] font-normal leading-7 text-left mb-4">We reserve the right to terminate or suspend your access to our Site and services, without prior notice or liability, for any reason, including if you breach these Terms.</p>

//                 <text className=" font-semibold font-inter text-[20px] leading-7 text-left">Governing Law</text>
//                 <p className="font-inter text-[18px] font-normal leading-7 text-left mb-4">These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law principles.</p>
//             </div> */}
//             <div className="container  mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 py-16">
//             {data ? parse(data.content) : <p>Loading...</p>}
//             </div>
//         </div>
//     )
// }

// export default TermsofService;
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';
import BaseUrl from "../Api/baseurl";
import Cookies from 'js-cookie';
import Loader from '../Component/Loader/loader'

const TermsofService = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const getData = async () => {
        const apiUrl = `${BaseUrl}clinic/managepages/terms-of-service`;
        // const token = localStorage.getItem('auth_token');
        // const token = Cookies.get('token');
        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    // Authorization: `Token ${token}`,
                },
            });
            setData(response.data);
        } catch (error) {
            setError('Failed to fetch terms of service.');
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <div className="bg-[#F2EFEA] py-24">
                <div className="container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48">
                    <div className="flex flex-col justify-center items-center">
                        <h1 className="text-[#011632] font-inter text-[52px] font-bold leading-62.4 tracking-tighter text-center">{data?.title}</h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 py-16">
                {data ? parse(data.content) : <Loader />}
            </div>
        </div>
    );
}

export default TermsofService;
