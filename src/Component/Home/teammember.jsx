import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const TeamMembers = () => {
    return (
        <div className="flex flex-col items-center pt-9 bg-[#ECECEC]">
            <h2 className="text-[#007E85] font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold pb-4">
                Meet our team members
            </h2>
            <p className="text-[#555555] font-dm-sans text-base md:text-lg font-normal text-center leading-8 w-full md:w-1/3">
            Lorem ipsum dolor sit amet consectetur adipiscing elit volutpat gravida malesuada quam commodo id integer nam.
            </p>

            <div className="container mx-auto px-4 sm:px-8 lg:px-28 xl:px-44 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-8 md:gap-8 mt-9">
                
                <div className="flex flex-col items-center bg-[#ffffff] w-full xl:w-96 p-6 rounded-2xl">
                    <img src="/brand/doctor-avatar-teal.png" alt="John Carter" />
                    <span className="mt-12 font-dm-sans text-4xl font-bold leading-10 text-center text-[#007E85]">John Carter</span>
                    <span className="mt-2 font-dm-sans text-lg font-bold leading-5 tracking-wider text-center text-[#333333]">CEO & CO-FOUNDER</span>
                    <p className="mt-4 font-dm-sans text-base lg:text-lg font-normal leading-8 lg:leading-10 text-center text-[#555555]">Lorem ipsum dolor sit amet consecte adipiscing elit amet hendrerit pretium nulla sed enim iaculis mi.</p>

                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Link className="h-9 w-9 text-[#00A3FF]" to="#"><FaFacebookF /></Link>
                        <Link className="h-9 w-9 text-[#6CCAFF]" to="#"><FaTwitter /></Link>
                        <Link className="h-9 w-9 text-[#e30766]" to="#"><AiFillInstagram /></Link>
                        <Link className="h-9 w-9 text-[#0085FF]" to="#"><FaLinkedinIn /></Link>
                    </div>
                </div>

                <div className="flex flex-col items-center bg-[#ffffff] w-full xl:w-96 p-6 rounded-2xl">
                    <img src="/brand/doctor-avatar-teal.png" alt="Sophie Moore" />
                    <span className="mt-12 font-dm-sans text-4xl font-bold leading-10 text-center text-[#007E85]">Sophie Moore</span>
                    <span className="mt-2 font-dm-sans text-lg font-bold leading-5 tracking-wider text-center text-[#333333]">DENTAL SPECIALIST</span>
                    <p className="mt-4 font-dm-sans text-base lg:text-lg font-normal leading-8 lg:leading-10 text-center text-[#555555]">Lorem ipsum dolor sit amet consecte adipiscing elit amet hendrerit pretium nulla sed enim iaculis mi.</p>

                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Link className="h-9 w-9 text-[#00A3FF]" to="#"><FaFacebookF /></Link>
                        <Link className="h-9 w-9 text-[#6CCAFF]" to="#"><FaTwitter /></Link>
                        <Link className="h-9 w-9 text-[#e30766]" to="#"><AiFillInstagram /></Link>
                        <Link className="h-9 w-9 text-[#0085FF]" to="#"><FaLinkedinIn /></Link>
                    </div>
                </div>

                <div className="flex flex-col items-center bg-[#ffffff] w-full xl:w-96 p-6 rounded-2xl">
                    <img src="/brand/doctor-avatar-teal.png" alt="Matt Cannon" />
                    <span className="mt-12 font-dm-sans text-4xl font-bold leading-10 text-center text-[#007E85]">Matt Cannon</span>
                    <span className="mt-2 font-dm-sans text-lg font-bold leading-5 tracking-wider text-center text-[#333333]">ORTHOPEDIC</span>
                    <p className="mt-4 font-dm-sans text-base lg:text-lg font-normal leading-8 lg:leading-10 text-center text-[#555555]">Lorem ipsum dolor sit amet consecte adipiscing elit amet hendrerit pretium nulla sed enim iaculis mi.</p>

                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Link className="h-9 w-9 text-[#00A3FF]" to="#"><FaFacebookF /></Link>
                        <Link className="h-9 w-9 text-[#6CCAFF]" to="#"><FaTwitter /></Link>
                        <Link className="h-9 w-9 text-[#e30766]" to="#"><AiFillInstagram /></Link>
                        <Link className="h-9 w-9 text-[#0085FF]" to="#"><FaLinkedinIn /></Link>
                    </div>
                </div>

                <div className="flex flex-col items-center bg-[#ffffff] w-full xl:w-96 p-6 rounded-2xl">
                    <img src="/brand/doctor-avatar-teal.png" alt="Andy Smith" />
                    <span className="mt-12 font-dm-sans text-4xl font-bold leading-10 text-center text-[#007E85]">Andy Smith</span>
                    <span className="mt-2 font-dm-sans text-lg font-bold leading-5 tracking-wider text-center text-[#333333]">BRAIN SURGEON</span>
                    <p className="mt-4 font-dm-sans text-base lg:text-lg font-normal leading-8 lg:leading-10 text-center text-[#555555]">Lorem ipsum dolor sit amet consecte adipiscing elit amet hendrerit pretium nulla sed enim iaculis mi.</p>

                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Link className="h-9 w-9 text-[#00A3FF]" to="#"><FaFacebookF /></Link>
                        <Link className="h-9 w-9 text-[#6CCAFF]" to="#"><FaTwitter /></Link>
                        <Link className="h-9 w-9 text-[#e30766]" to="#"><AiFillInstagram /></Link>
                        <Link className="h-9 w-9 text-[#0085FF]" to="#"><FaLinkedinIn /></Link>
                    </div>
                </div>

                <div className="flex flex-col items-center bg-[#ffffff] w-full xl:w-96 p-6 rounded-2xl">
                    <img src="/brand/doctor-avatar-teal.png" alt="Lily Woods" />
                    <span className="mt-12 font-dm-sans text-4xl font-bold leading-10 text-center text-[#007E85]">Lily Woods</span>
                    <span className="mt-2 font-dm-sans text-lg font-bold leading-5 tracking-wider text-center text-[#333333]">HEART SPECIALIST</span>
                    <p className="mt-4 font-dm-sans text-base lg:text-lg font-normal leading-8 lg:leading-10 text-center text-[#555555]">Lorem ipsum dolor sit amet consecte adipiscing elit amet hendrerit pretium nulla sed enim iaculis mi.</p>

                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Link className="h-9 w-9 text-[#00A3FF]" to="#"><FaFacebookF /></Link>
                        <Link className="h-9 w-9 text-[#6CCAFF]" to="#"><FaTwitter /></Link>
                        <Link className="h-9 w-9 text-[#e30766]" to="#"><AiFillInstagram /></Link>
                        <Link className="h-9 w-9 text-[#0085FF]" to="#"><FaLinkedinIn /></Link>
                    </div>
                </div>

                <div className="flex flex-col items-center bg-[#ffffff] w-full xl:w-96 p-6 rounded-2xl">
                    <img src="/brand/doctor-avatar-teal.png" alt="Patrick Meyer" />
                    <span className="mt-12 font-dm-sans text-4xl font-bold leading-10 text-center text-[#007E85]">Patrick Meyer</span>
                    <span className="mt-2 font-dm-sans text-lg font-bold leading-5 tracking-wider text-center text-[#333333]">EYE SPECIALIST</span>
                    <p className="mt-4 font-dm-sans text-base lg:text-lg font-normal leading-8 lg:leading-10 text-center text-[#555555]">Lorem ipsum dolor sit amet consecte adipiscing elit amet hendrerit pretium nulla sed enim iaculis mi.</p>

                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Link className="h-9 w-9 text-[#00A3FF]" to="#"><FaFacebookF /></Link>
                        <Link className="h-9 w-9 text-[#6CCAFF]" to="#"><FaTwitter /></Link>
                        <Link className="h-9 w-9 text-[#e30766]" to="#"><AiFillInstagram /></Link>
                        <Link className="h-9 w-9 text-[#0085FF]" to="#"><FaLinkedinIn /></Link>
                    </div>
                </div>

            </div>
        </div>    
    );
}

export default TeamMembers;
