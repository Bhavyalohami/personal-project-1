import { Link } from "react-router-dom";
import BlogSlider from "../Component/Home/blogslider";
import { MdArrowOutward } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import parse from "html-react-parser";
import BaseUrl from "../Api/baseurl";

const Blog = () => {
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const response = await axios.get(`${BaseUrl}clinic/blogs-list/`);
      setData(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className="container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 my-12">
        <div className="flex flex-col">
          <text className="font-general-sans text-center text-6xl font-semibold leading-74.4 tracking-tighter text-[#011632] text-center">
            Blogs
          </text>
          <p className="text-[#3C4959] font-general-sans text-center text-base  font-normal leading-27.9 tracking-wide mt-6">
            We use only the best quality materials on the market in order to
            provide the best products to our patients.
          </p>
          {/* <input className="w-[340px] h-[50px] px-4 self-center border border-black-800 mt-4 rounded" placeholder="Search" /> */}
        </div>
        <div className="mt-10">{/* <BlogSlider /> */}</div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 py-16">
        <text className="font-inter text-4xl font-semibold leading-8 text-left">
          Recent Blog Posts
        </text>

        <div className="grid grid-cols-1 sm:grid-cols-1 mg:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 pt-10">
          {data?.slice(0, 1)?.map((i, index) => {
            return (
              <div className="flex flex-col pr-0 md:pr-12 lg:pr-12">
                <Link to={`/blogpage/${i.id}/`}>
                  <img
                    className="h-[200px] object-cover w-full mb-6 rounded-xl"
                    src={i.image}
                    alt=""
                  />
                  <text className="font-inter text-base font-semibold leading-5 text-[#6941C6] ">
                    {i.author} •{i.date}
                  </text>
                  <div className="w-full flex items-center justify-between">
                    {/* <Link to={`/blogpage/${i.id}/`}> */}
                    <text className="font-inter text-xl font-semibold leading-8 text-left mt-2">
                      {i.name}
                    </text>

                    <MdArrowOutward className="text-xl " />
                  </div>
                  {/* <p className="font-inter text-[16px] text-[#667085] font-normal leading-6 text-left mt-2">
                    {data ? parse(i.text) : <p>Loading...</p>}
                  </p> */}
                  <p className="font-inter text-[16px] text-[#667085] font-normal leading-6 text-left mt-2">
                    {/* {data && i.text ? (
                      (() => {
                        // Parse the HTML to get a React element array
                        const parsedText = parse(i.text);

                        // Extract the plain text from the parsed elements
                        const extractText = (elements) => {
                          if (Array.isArray(elements)) {
                            return elements
                              .map((element) =>
                                typeof element === "string"
                                  ? element
                                  : element.props?.children
                              )
                              .join(" ");
                          }
                          return typeof elements === "string"
                            ? elements
                            : elements.props?.children || "";
                        };

                        // Get the plain text content
                        const plainText = extractText(parsedText);

                        // Split the plain text into words, take the first 12, and join them back with spaces
                        return `${plainText
                          .split(" ")
                          .slice(0, 12)
                          .join(" ")}...`;
                      })()
                    ) : (
                      <span>Loading...</span>
                    )} */}

                    {data && i.text ? (
                      (() => {
                        // Parse the HTML to get a React element array
                        const parsedText = parse(i.text);

                        // Extract the plain text from the parsed elements
                        const extractText = (elements) => {
                          if (Array.isArray(elements)) {
                            return elements
                              .map((element) => {
                                // Ensure we're getting the text content as a string
                                if (typeof element === "string") {
                                  return element;
                                }
                                // If it's a React element, recursively extract the text from its children
                                return element.props?.children
                                  ? extractText(element.props.children)
                                  : "";
                              })
                              .join(" "); // Join the text with spaces
                          }
                          // Base case: If it's just a string, return it
                          return typeof elements === "string" ? elements : "";
                        };

                        // Get the plain text content
                        const plainText = extractText(parsedText);

                        // Split the plain text into words, take the first 12, and join them back with spaces
                        return `${plainText
                          .split(" ")
                          .slice(0, 12)
                          .join(" ")}...`;
                      })()
                    ) : (
                      <span>Loading...</span>
                    )}
                  </p>

                  {/* <div className="flex items-center gap-8 mt-4">
                    <Link className="flex justify-center h-[24px] w-[67px] bg-[#F9F5FF] rounded-lg ">
                      <text className="text-[#6941C6]">Design</text>
                    </Link>
                    <Link className="flex justify-center h-[24px] w-[83px] bg-[#EEF4FF] rounded-lg">
                      <text className="text-[#3538CD]">Research</text>
                    </Link>
                    <Link className="flex justify-center h-[24px] w-[106px] bg-[#FDF2FA] rounded-lg">
                      <text className="text-[#C11574]">Presentation</text>
                    </Link>
                  </div> */}
                </Link>
              </div>
            );
          })}

          <div className="flex flex-col mt-8 md:mt-8 lg:mt-8 xl:mt-0">
            {data?.slice(1, 3)?.map((i, index) => {
              return (
                <Link to={`/blogpage/${i.id}/`}>
                  <div className="flex flex-col md:flex-row lg:flex-row mb-4">
                    <img
                      className="h-[200px] min-w-[320px] w-[320px] object-fill rounded-xl"
                      src={i.image}
                      alt=""
                    />

                    <div className="flex flex-col pl-0 md:pl-8 lg:pl-8 mt-8 md:mt-0 lg:mt-0">
                      <text className="font-inter text-base font-semibold leading-5 text-[#6941C6]">
                        {i.author} • {i.date}
                      </text>
                      <text className="font-inter text-xl font-semibold leading-8 text-left mt-2">
                        {i.name}
                      </text>
                      {/* <p className="font-inter text-[16px] text-[#667085] font-normal leading-6 text-left mt-2">
                        {data ? parse(i.text) : <p>Loading...</p>}
                      </p> */}
                      <p className="font-inter text-[16px] text-[#667085] font-normal leading-6 text-left mt-2">
                        {data && i.text ? (
                          (() => {
                            // Parse the HTML to get a React element array
                            const parsedText = parse(i.text);

                            // Extract the plain text from the parsed elements
                            const extractText = (elements) => {
                              if (Array.isArray(elements)) {
                                return elements
                                  .map((element) => {
                                    // Ensure we're getting the text content as a string
                                    if (typeof element === "string") {
                                      return element;
                                    }
                                    // If it's a React element, recursively extract the text from its children
                                    return element.props?.children
                                      ? extractText(element.props.children)
                                      : "";
                                  })
                                  .join(" "); // Join the text with spaces
                              }
                              // Base case: If it's just a string, return it
                              return typeof elements === "string"
                                ? elements
                                : "";
                            };

                            // Get the plain text content
                            const plainText = extractText(parsedText);

                            // Split the plain text into words, take the first 12, and join them back with spaces
                            return `${plainText
                              .split(" ")
                              .slice(0, 12)
                              .join(" ")}...`;
                          })()
                        ) : (
                          <span>Loading...</span>
                        )}
                      </p>

                      {/* <div className="flex gap-8 mt-4">
                        <Link className="flex justify-center h-[24px] w-[67px] bg-[#F0F9FF] rounded-lg">
                          <text className="text-[#026AA2]">Medicine</text>
                        </Link>
                        <Link className="flex justify-center h-[24px] w-[83px] bg-[#FDF2FA] rounded-lg">
                          <text className="text-[#C11574]">Research</text>
                        </Link>
                      </div> */}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 pb-16">
        <text className="font-inter text-4xl font-semibold leading-8 text-left">
          All Blog Posts
        </text>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-10">
          {data?.map((i, index) => {
            return (
              <Link to={`/blogpage/${i.id}/`}>
                <div className="flex flex-col">
                  <img
                    className="h-[236.66px] object-cover rounded-xl w-full xl:w-2/3"
                    src={i.image}
                    alt=""
                  />
                  <text className="font-inter text-base font-semibold leading-5 text-[#6941C6] mt-4">
                    {i.author} • {i.date}
                  </text>
                  <div className="w-full flex items-center justify-between">
                    <text className=" font-inter text-xl font-semibold leading-8 text-left mt-2">
                      {i.name}
                    </text>
                    <MdArrowOutward className="text-xl " />
                  </div>
                  <p className="font-inter text-[16px] text-[#667085] font-normal leading-6 text-left mt-2">
                    {/* {data && i.text ? (
                      // Extract plain text from parsed HTML
                      (() => {
                        // Parse the HTML
                        const parsedText = parse(i.text);

                        // Extract text from the parsed HTML elements
                        const extractText = (elements) => {
                          // If it's an array of React elements, extract text from each element
                          if (Array.isArray(elements)) {
                            return elements
                              .map((el) =>
                                typeof el === "string" ? el : el.props?.children
                              )
                              .join(" ");
                          }
                          // If it's a single text element
                          return typeof elements === "string"
                            ? elements
                            : elements.props?.children || "";
                        };

                        // Get the plain text
                        const plainText = extractText(parsedText);

                        // Split the text into words, take the first 12, and join them back with spaces
                        return `${plainText
                          .split(" ")
                          .slice(0, 12)
                          .join(" ")}...`;
                      })()
                    ) : (
                      <span>Loading...</span>
                    )} */}
                    {data && i.text ? (
                      (() => {
                        // Parse the HTML to get a React element array
                        const parsedText = parse(i.text);

                        // Extract the plain text from the parsed elements
                        const extractText = (elements) => {
                          if (Array.isArray(elements)) {
                            return elements
                              .map((element) => {
                                // Ensure we're getting the text content as a string
                                if (typeof element === "string") {
                                  return element;
                                }
                                // If it's a React element, recursively extract the text from its children
                                return element.props?.children
                                  ? extractText(element.props.children)
                                  : "";
                              })
                              .join(" "); // Join the text with spaces
                          }
                          // Base case: If it's just a string, return it
                          return typeof elements === "string" ? elements : "";
                        };

                        // Get the plain text content
                        const plainText = extractText(parsedText);

                        // Split the plain text into words, take the first 12, and join them back with spaces
                        return `${plainText
                          .split(" ")
                          .slice(0, 12)
                          .join(" ")}...`;
                      })()
                    ) : (
                      <span>Loading...</span>
                    )}
                  </p>

                  {/* <div className="flex items-center gap-8 mt-4">
                    <Link className="flex justify-center h-[24px] w-[83px] bg-[#EEF4FF] rounded-lg">
                      <text className="text-[#3538CD]">Leadership</text>
                    </Link>
                    <Link className="flex justify-center h-[24px] w-[106px] bg-[#FDF2FA] rounded-lg">
                      <text className="text-[#C11574]">Presentation</text>
                    </Link>
                  </div> */}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 my-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col items-center justify-start">
            <text className="text-[#011632] font-inter text-4xl font-bold text-left w-full leading-[52.5px] ">
              Frequently Asked Question
            </text>
            <p className="text-[#011632] font-inter text-left text-lg font-normal leading-7.9 tracking-wide w-full mt-4">
              We use only the best quality materials on the market in order to
              provide the best products to our patients.
            </p>

            <div
              class="accordion w-full  mt-8"
              id="accordionPanelsStayOpenExample"
            >
              <div class="accordion-item">
                <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseOne"
                    aria-expanded="true"
                    aria-controls="panelsStayOpen-collapseOne"
                  >
                    • Can I see who reads my email campaigns?
                  </button>
                </h2>
                <div
                  id="panelsStayOpen-collapseOne"
                  class="accordion-collapse collapse show visible"
                  aria-labelledby="panelsStayOpen-headingOne"
                >
                  <div class="accordion-body">
                    <p className="">
                      Most email marketing platforms provide analytics that
                      offer insights into metrics such as open rates,
                      click-through rates, and even the specific actions taken
                      by recipients. These tools utilize tracking pixels or
                      similar technologies to detect when an email is opened and
                      often provide anonymized data on recipient engagement.
                      While this data can inform your marketing strategy and
                      help tailor future campaigns, it's important to balance
                      the use of such information with respect for recipient
                      privacy and compliance with data protection regulations
                      like GDPR.
                    </p>
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseTwo"
                    aria-expanded="false"
                    aria-controls="panelsStayOpen-collapseTwo"
                  >
                    • Do you offer non-profit discounts?
                  </button>
                </h2>
                <div
                  id="panelsStayOpen-collapseTwo"
                  class="accordion-collapse collapse visible"
                  aria-labelledby="panelsStayOpen-headingTwo"
                >
                  <div class="accordion-body">
                    <p>
                      These programs often include discounted pricing or special
                      offers to support the work of non-profits. It's best to
                      check with the specific software provider or service
                      you're interested in to inquire about any available
                      discounts or support for non-profit organizations. Many
                      companies are committed to supporting non-profits and may
                      have specific policies or programs in place to assist
                      them.
                    </p>
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header" id="panelsStayOpen-headingThree">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseThree"
                    aria-expanded="false"
                    aria-controls="panelsStayOpen-collapseThree"
                  >
                    • Why you should become a member?
                  </button>
                </h2>
                <div
                  id="panelsStayOpen-collapseThree"
                  class="accordion-collapse collapse visible"
                  aria-labelledby="panelsStayOpen-headingThree"
                >
                  <div class="accordion-body">
                    <p>
                      Becoming a member of an organization or community can be
                      highly beneficial for several reasons. Firstly, membership
                      often grants access to a wealth of resources and
                      specialized services that non-members may not have. This
                      could include exclusive content, discounted rates on
                      products or services, or access to expert advice and
                      support.
                    </p>
                  </div>
                </div>
              </div>

              <div class="accordion-item">
                <h2 class="accordion-header" id="panelsStayOpen-headingFour">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseFour"
                    aria-expanded="false"
                    aria-controls="panelsStayOpen-collapseFour"
                  >
                    • Health issues really a concern?
                  </button>
                </h2>
                <div
                  id="panelsStayOpen-collapseFour"
                  class="accordion-collapse collapse visible"
                  aria-labelledby="panelsStayOpen-headingFour"
                >
                  <div class="accordion-body">
                    <p>
                      Health issues are undeniably a significant concern that
                      impacts individuals, communities, and societies at large.
                      From chronic diseases to mental health challenges, the
                      spectrum of health issues spans a wide range of conditions
                      that can affect quality of life, productivity, and overall
                      well-being. Access to healthcare services, affordability
                      of treatments, and preventive measures are critical
                      factors in addressing these issues effectively.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <img
              className="w-3/4 lg:w-full"
              src="/assets/Blog/blogfaq.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
