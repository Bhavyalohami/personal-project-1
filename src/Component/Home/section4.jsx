import React from "react";
import { GoArrowRight } from "react-icons/go";
import { Link } from "react-router-dom";

const Section4 = () => {
    return (
        <div className="flex flex-col items-center pt-9">
            <h2 className="text-[#007E85] font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold pb-4">
                Services we provide
            </h2>
            <p className="text-[#555555] font-dm-sans text-base md:text-lg font-normal text-center leading-8 w-full md:w-1/2">
                Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar
                elementum tempus hac tellus libero accumsan.
            </p>

            <div className="container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 mt-9">
                <div className="flex flex-col bg-white py-6 rounded-lg">
                <img src="/brand/service-icon-teal.png" alt="" />
                    <h3 className="text-[#007E85] font-dm-sans text-xl font-bold leading-7 mb-2 md:mb-4 pt-6">
                        Dental treatments
                    </h3>
                    <p className="text-[#555555] font-dm-sans text-base md:text-lg font-normal leading-8 mb-4 md:mb-6">
                        Lorem ipsum dolor sit amet consecte tur adipiscing elit semper
                        dalaracc lacus vel facilisis volutpat est velitolm.
                    </p>
                    <Link
                        to="#"
                        className="flex items-center text-[#007E85] font-poppins text-lg font-medium mt-auto"
                    >
                        Learn More <GoArrowRight />
                    </Link>
                </div>

                <div className="flex flex-col bg-white py-6 rounded-lg">
                <img src="/brand/service-icon-teal.png" alt="" />
                    <h3 className="text-[#007E85] font-dm-sans text-xl font-bold leading-7 mb-2 md:mb-4 pt-6">
                        Bones treatments
                    </h3>
                    <p className="text-[#555555] font-dm-sans text-base md:text-lg font-normal leading-8 mb-4 md:mb-6">
                        Lorem ipsum dolor sit amet consecte tur adipiscing elit semper
                        dalaracc lacus vel facilisis volutpat est velitolm.
                    </p>
                    <Link
                        to="#"
                        className="flex items-center text-[#007E85] font-poppins text-lg font-medium mt-auto"
                    >
                        Learn More <GoArrowRight />
                    </Link>
                </div>

                <div className="flex flex-col bg-white py-6 rounded-lg">
                <img src="/brand/service-icon-teal.png" alt="" />
                    <h3 className="text-[#007E85] font-dm-sans text-xl font-bold leading-7 mb-2 md:mb-4 pt-6">
                        Diagnosis
                    </h3>
                    <p className="text-[#555555] font-dm-sans text-base md:text-lg font-normal leading-8 mb-4 md:mb-6">
                        Lorem ipsum dolor sit amet consecte tur adipiscing elit semper
                        dalaracc lacus vel facilisis volutpat est velitolm.
                    </p>
                    <Link
                        to="#"
                        className="flex items-center text-[#007E85] font-poppins text-lg font-medium mt-auto"
                    >
                        Learn More <GoArrowRight />
                    </Link>
                </div>

                <div className="flex flex-col bg-white py-6 rounded-lg">
                <img src="/brand/service-icon-teal.png" alt="" />
                    <h3 className="text-[#007E85] font-dm-sans text-xl font-bold leading-7 mb-2 md:mb-4 pt-6">
                        Cardiology
                    </h3>
                    <p className="text-[#555555] font-dm-sans text-base md:text-lg font-normal leading-8 mb-4 md:mb-6">
                        Lorem ipsum dolor sit amet consecte tur adipiscing elit semper
                        dalaracc lacus vel facilisis volutpat est velitolm.
                    </p>
                    <Link
                        to="#"
                        className="flex items-center text-[#007E85] font-poppins text-lg font-medium mt-auto"
                    >
                        Learn More <GoArrowRight />
                    </Link>
                </div>

                <div className="flex flex-col bg-white py-6 rounded-lg">
                <img src="/brand/service-icon-teal.png" alt="" />
                    <h3 className="text-[#007E85] font-dm-sans text-xl font-bold leading-7 mb-2 md:mb-4 pt-6">
                        Surgery
                    </h3>
                    <p className="text-[#555555] font-dm-sans text-base md:text-lg font-normal leading-8 mb-4 md:mb-6">
                        Lorem ipsum dolor sit amet consecte tur adipiscing elit semper
                        dalaracc lacus vel facilisis volutpat est velitolm.
                    </p>
                    <Link
                        to="#"
                        className="flex items-center text-[#007E85] font-poppins text-lg font-medium mt-auto"
                    >
                        Learn More <GoArrowRight />
                    </Link>
                </div>

                <div className="flex flex-col bg-white py-6 rounded-lg">
                <img src="/brand/service-icon-teal.png" alt="" />
                    <h3 className="text-[#007E85] font-dm-sans text-xl font-bold leading-7 mb-2 md:mb-4 pt-6">
                        Eye care
                    </h3>
                    <p className="text-[#555555] font-dm-sans text-base md:text-lg font-normal leading-8 mb-4 md:mb-6">
                        Lorem ipsum dolor sit amet consecte tur adipiscing elit semper
                        dalaracc lacus vel facilisis volutpat est velitolm.
                    </p>
                    <Link
                        to="#"
                        className="flex items-center text-[#007E85] font-poppins text-lg font-medium mt-auto"
                    >
                        Learn More <GoArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Section4;
