import { GoArrowDownRight } from "react-icons/go";
import { Link } from "react-router-dom";
import { MdPhoneInTalk } from "react-icons/md";

const AboutUs = () => {
    return (
        <div className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 py-16">
            <div className="container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 grid grid-cols-1 lg:grid-cols-2 gap-8">

                <div className="flex flex-col items-center">
                    <img className="h-80 w-96 lg:self-start" src="/assets/Home/aboutus/about1.png" alt="AboutUs1"/>
                    <img className="h-80 w-96 lg:self-end mt-16" src="/assets/Home/aboutus/about2.png" alt="AboutUs2"/>
                    <div className="absolute mt-72 ml-44 bg-[#ffffff] p-2 sm:p-2 md:p-4 rounded-lg">
                        <div className="flex items-center font-inter text-base lg:text-lg font-bold leading-6 lg:leading-[27px] text-left text-[#1B3C74]"> <MdPhoneInTalk className="h-[34px] w-[34px] p-1 rounded mr-2 text-[#ffffff] bg-[#F16163]"/>Free Consultation</div>
                        <div className="font-inter text-base lg:text-base font-medium leading-6 text-left text-[#77829D]">Consultation with the best</div>
                    </div>
                </div>

                
                <div className="flex flex-col justify-center">
                    <div className="text-[#1030A4] font-inter text-[20px] font-medium lg:text-xl leading-[24.2px] lg:leading-[28px] text-left">About Us</div>
                    <div className="font-inter text-[36px] lg:text-[48px] font-semibold leading-43.57 lg:leading-[58px] text-left mt-2 lg:mt-4">Patient-Centered-Care</div>
                    <div className="font-inter text-[20px] lg:text-lg font-normal leading-7 lg:leading-[32px] text-left mt-4 lg:mt-8">We are dedicated to providing exceptional dental care in a warm and welcoming environment. Our team of experienced, compassionate, and highly skilled professionals is here to ensure your dental experience is comfortable and stress-free.</div>

                    <div className="font-inter text-[24px] lg:text-[32px] font-semibold leading-10 lg:leading-[40px] text-left mt-8 lg:mt-12">Our Mission</div>
                    <div className="font-inter text-[20px] lg:text-lg font-normal leading-7 lg:leading-[32px] text-left mt-2 lg:mt-4">At 57Dentcare, our mission is to promote optimal oral health and create lasting, confident smiles. </div>
                    <Link to="/about" className="flex mt-8 lg:mt-12 w-full lg:w-[230px] h-[75px] p-[25px] rounded-[35px] border-[2px] border-red-600 shadow-2xl bg-red-600 hover:bg-red-500 text-[#ffffff] font-poppins text-[20px] lg:text-lg font-semibold leading-7 lg:leading-[32px] tracking-wide text-center justify-center items-center opacity-[65%] shadow-xl shadow-red-600/70">Learn More<GoArrowDownRight className="h-8 w-8 stroke-1"/></Link>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;
