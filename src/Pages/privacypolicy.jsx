import { Link } from "react-router-dom";
import parse from 'html-react-parser';
import axios from "axios";
import { useEffect, useState } from "react";
import BaseUrl from "../Api/baseurl";
import Cookies from 'js-cookie';

const PrivacyPolicy = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const getData = async () => {
        const apiUrl = `${BaseUrl}clinic/managepages/privacy-policy`;
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
            <div className=" bg-[#F2EFEA] py-24">
                <div className="container  mx-auto px-4 sm:px-8 lg:px-32 xl:px-48">
                    <div className="flex flex-col justify-center items-center">
                        <text className="text-[#011632] font-inter text-[52px] font-bold leading-62.4 tracking-tighter text-center">{data ? parse(data.title) : <p>Loading...</p>}</text>
                        {/* <p className="text-[#3C4959] font-inter text-base font-normal leading-7 tracking-tight text-center w-full lg:w-1/3 xl:w-1/4">This page involves detailing how this website or data collects, uses, discloses, and protects users' personal information.</p> */}
                    </div>
                </div>
            </div>


            {/* <div className="container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 py-12">
                <div className="flex flex-col lg:flex-row items-center justify-center mb-4">
                    <div className="w-full lg:w-2/3 pr-12">
                        <p className="font-inter text-[18px] font-normal leading-7 text-left mb-4"> Doctor’s Consultation is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website<span className="text-blue-800"><Link to='https://google.com' target="_blank"> www.doctor’s-consultation.com</Link></span>, use our mobile application, or engage with our services. Please read this policy carefully to understand our views and practices regarding your personal data and how we will treat it.</p>
                        <text className="font-semibold font-inter text-[20px] leading-7 text-left ">Information We Collect</text>
                        <p className="font-inter text-[18px] font-normal leading-7 text-left">We may collect and process the following data about you:</p>
                        <p className="font-inter text-[18px] font-normal leading-7 text-left"><span className="font-medium">• Personal Information:</span> When you register, make a purchase, or interact with our services, we may collect personal information such as your name, email address, phone number, mailing address, payment information, and other details you provide</p>
                        <p className="font-inter text-[18px] font-normal leading-7 text-left"><span className="font-medium">• Usage Data:</span> We may collect information about how you use our website and services, including your IP address, browser type, operating system, pages visited, and the date and time of your visit.</p>
                        <p className="font-inter text-[18px] font-normal leading-7 text-left mb-4"><span className="font-medium">• Cookies and Tracking Technologies:</span> We use cookies, web beacons, and similar technologies to collect information about your interaction with our website and services.</p>

                        <text className=" font-semibold font-inter text-[20px] leading-7 text-left">How We Use Your Information</text>
                        <p className="font-inter text-[18px] font-normal leading-7 text-left">We may use the information we collect from you in the following ways:</p>
                        <p className="font-inter text-[18px] font-normal leading-7 text-left "><span className="font-medium">• To Provide and Maintain Our Services:</span> To provide, operate, and maintain our website and services.</p>
                        <p className="font-inter text-[18px] font-normal leading-7 text-left "><span className="font-medium">• To Improve Our Services:</span> To understand and analyze how you use our services, and to develop new products, services, and features.</p>
                        <p className="font-inter text-[18px] font-normal leading-7 text-left "><span className="font-medium">• To Communicate with You:</span> To send you updates, newsletters, marketing materials, and other information that may be of interest to you.</p>
                        <p className="font-inter text-[18px] font-normal leading-7 text-left "><span className="font-medium">• For Legal and Security Purposes:</span> To comply with legal obligations, resolve disputes, and enforce our agreements.</p>
                    </div>

                    <div className="w-full h-max lg:w-1/3 self-start flex flex-col lg:flex-row items-center">
                        <img className="" src="/assets/Privacy_policy/privacy.png" alt="" />
                    </div>
                </div>

                <text className=" font-semibold font-inter text-[20px] leading-7 text-left">How We Share Your Information</text>
                <p className="font-inter text-[18px] font-normal leading-7 text-left">We may collect and process the following data about you:</p>
                <p className="font-inter text-[18px] font-normal leading-7 text-left "><span className="font-medium">• Service Providers:</span> Third-party vendors and service providers who assist us in providing our services.</p>
                <p className="font-inter text-[18px] font-normal leading-7 text-left "><span className="font-medium">• Business Transfers:</span> In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business.</p>
                <p className="font-inter text-[18px] font-normal leading-7 text-left mb-4"><span className="font-medium">• Legal Requirements:</span> If required to do so by law or in response to valid requests by public authorities.</p>

                <text className=" font-semibold font-inter text-[20px] leading-7 text-left">Data Security</text>
                <p className="font-inter text-[18px] font-normal leading-7 text-left mb-4">We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no security system is impenetrable, and we cannot guarantee the absolute security of your data.</p>

                <text className=" font-semibold font-inter text-[20px] leading-7 text-left">Your Rights</text>
                <p className="font-inter text-[18px] font-normal leading-7 text-left mb-4">Depending on your location, you may have certain rights regarding your personal data, including the right to access, correct, delete, or restrict its use. To exercise these rights, please contact us at <span className="text-blue-800">info@doctorsconsulation.com</span>.</p>

                <text className=" font-semibold font-inter text-[20px] leading-7 text-left"> Third-Party Links</text>
                <p className="font-inter text-[18px] font-normal leading-7 text-left mb-4">Our website and services may contain links to third-party websites. We are not responsible for the privacy practices or content of these third-party sites.</p>
            </div> */}
            <div className="container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 py-16">
                {data ? parse(data.content) : <p>Loading...</p>}
            </div>
        </div>
    )
}

export default PrivacyPolicy;
