import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import parse from 'html-react-parser';
import BaseUrl from "../../Api/baseurl";
const BlogPage = () => {
    const { id } = useParams();
    const [data, setData]=useState([]);
    const getData = async (id) => {
    
        // const apiUrl = `http://127.0.0.1:8000/clinic/blogs-list/${id}/`;
        const apiUrl = `${BaseUrl}clinic/blogs-list/${id}/`;

        
        try {
          const response = await axios.get(apiUrl, {

            
          });
          
          setData(response.data);
          
          
        } catch (error) {
          console.error(error)
        }
      };
    
      useEffect(() => {
        getData(id);
      }, [id]);
      const description = typeof data.text === 'string' ? data.text : '';

    return (
        <div>
            <div className="container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 py-12">
                <div className="flex flex-col">
                    <text className="font-inter text-base font-semibold leading-5 text-[#1030A4] mt-4">{data.author}  <span className="text-gray-800">{"  "+data.date}</span></text>
                    <p className="font-inter text-4xl font-bold leading-8 text-left mt-4">{data.name}</p>
                    <img className="mt-4 self-center min-w-[300px] sm:min-w-[550px] lg:min-w-[800px] xl:min-w-[1000px] 2xl:min-w-[1200px] max-h-[500px]" src={data.image} alt="" />
                    <p className="font-roboto text-base font-normal leading-6 text-left text-[#666666] mt-4">{parse(description)}</p>
                    {/* <p className="font-roboto text-base font-normal leading-6 text-left text-[#666666]">where our dedicated team of experienced healthcare professionals provides comprehensive and compassionate care tailored to meet your unique needs. We offer a wide range of services, including primary care for general health concerns and chronic disease management, specialty care in areas such as cardiology, endocrinology, and gastroenterology, and paediatric care from infancy through adolescence. Our women's health services encompass gynecological exams, prenatal and postnatal care, and menopause management, while our state-of-the-art diagnostic facilities provide laboratory testing, imaging services, and advanced diagnostic tools. We emphasize preventive care through regular screenings, vaccinations, and lifestyle counselling, and offer comprehensive mental health services, including counseling, therapy, and medication management. At [Your Medical Practice Name], your health is our top priority, and we strive to create a welcoming and supportive environment where you feel comfortable and cared for. Schedule an appointment today and experience the difference in quality healthcare.</p>

                    <div className="w-full !px-4 lg:!px-32 py-8">
                        <p className="font-raleway text-3xl italic font-normal leading-10 text-left text-[#666666] mb-2 border-l-8 border-indigo-500 px-4">“At here, we are committed to providing comprehensive and compassionate care, putting your health and well-being at the forefront of everything we do..”</p>
                        <text className="font-roboto text-base font-bold leading-6 text-left px-4">– Dr. Ryan Grouse •</text>
                    </div>

                    <p className="font-roboto text-base font-normal leading-6 text-left text-[#666666]">More than 3 billion people already benefit from AI-powered features in Google Workspace, whether it’s using Smart Compose in Gmail or auto-generated summaries in Google Docs. Now, we’re excited to take the next step and bring a limited set of trusted testers a new set of features that makes the process of writing even easier. In Gmail and Google Docs, you can simply type in a topic you’d like to write about, and a draft will be instantly generated for you. So if you’re a manager onboarding a new employee, Workspace saves you the time and effort involved in writing that first welcome email. From there, you can elaborate upon or abbreviate the message or adjust the tone to be more playful or professional — all in just a few clicks. We’ll be rolling out these new experiences to testers in the coming weeks.</p>
                    <img className="mt-4 !mx-2 lg:!mx-44" src="/assets/Blog/Blogpage/blogpage2.png" alt="" />

                    <p className="font-roboto text-lg font-normal leading-7 text-left mt-4">At Doctor’s Consultation, your health is our top priority. We strive to create a welcoming and supportive environment where you feel comfortable and cared for. Schedule an appointment today and experience the difference in quality healthcare.</p> */}
                </div>


                {/* <div className="flex flex-col items-center justify-center py-12">
                    <text className="self-start font-inter text-6xl font-bold leading-tight text-left">Popular Post</text>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 py-12">
                        <div>
                            <img className="w-full mb-4" src="/assets/Blog/Blogpage/pp1.png" alt="" />
                            <text className="font-inter text-base font-semibold leading-5 text-[#1030A4] mt-4">Dr. Marilyn Levin <span className="ml-4">4 July 2024</span></text>
                            <p className="font-raleway text-3xl font-bold leading-tight text-left mt-4">Who is the best singer on chart?Know him?</p>
                            <p className="font-roboto text-base font-normal leading-6 text-left text-[#666666] mt-2 mb-4">chart by Billboard which ranks the all-time greatest artists based on their performance on the weekly Billboard Hot 100 and  </p>
                            <Link className="font-roboto text-base font-bold leading-6 text-left text-[#7C4EE4] underline">Read More...</Link>
                        </div>

                        <div>
                            <img className="w-full mb-4" src="/assets/Blog/Blogpage/pp2.png" alt="" />
                            <text className="font-inter text-base font-semibold leading-5 text-[#1030A4] mt-4">Dr. Leo Arcand <span className="ml-4">1 July 2024</span></text>
                            <p className="font-raleway text-3xl font-bold leading-tight text-left mt-4">Ai in Brain Surgery</p>
                            <p className="font-roboto text-base font-normal leading-6 text-left text-[#666666] mt-2 mb-4">The rise of Super AIs has been met by a rise in tools for creating, testing, and management view of disruptive innovation via workplace diversity and empowerment.  </p>
                            <Link className="font-roboto text-base font-bold leading-6 text-left text-[#7C4EE4] underline">Read More...</Link>
                        </div>

                        <div>
                            <img className="w-full mb-4" src="/assets/Blog/Blogpage/pp3.png" alt="" />
                            <text className="font-inter text-base font-semibold leading-5 text-[#1030A4] mt-4">Dr. Gregory House <span className="ml-4">15 July 2024</span></text>
                            <p className="font-raleway text-3xl font-bold leading-tight text-left mt-4">Make some drinks with chocolates chocolates and milk</p>
                            <p className=" font-roboto text-base font-normal leading-6 text-left text-[#666666] mt-2 mb-4">Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment. survival strategies to ensure proactive  </p>
                            <Link className="font-roboto text-base font-bold leading-6 text-left text-[#7C4EE4] underline">Read More...</Link>
                        </div>
                    </div>

                    <Link className="w-[164px] h-[53px] bg-[#7C4EE4] text-[#ffffff] font-bold rounded flex items-center justify-center">Load More</Link>
                </div> */}
            </div>
        </div>
    )
}

export default BlogPage;