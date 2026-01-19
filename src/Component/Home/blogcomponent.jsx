import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import parse from "html-react-parser";
import BaseUrl from "../../Api/baseurl";

const BlogComponent = () => {
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const response = await axios.get(`${BaseUrl}clinic/blogs-list/`);
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 py-16">
      <text className="font-inter text-4xl font-semibold leading-8 text-left">
        Blog
      </text>

      <div className="grid grid-cols-1 sm:grid-cols-1 mg:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 pt-10">
        {data.slice(0, 1)?.map((i, index) => {
          return (
            <div className="flex flex-col pr-0 md:pr-12 lg:pr-12">
              <img className="h-[200px] object-cover rounded-xl" src={i.image} />
              <text className="font-inter text-base font-semibold leading-5 text-[#1030A4] mt-4">
                {i.author} • {i.date}
              </text>
              <Link to="/blog">
                <div className="w-full flex items-center justify-between">
                  <text className="font-inter text-xl font-semibold leading-8 text-left mt-2">
                    {i.name}
                  </text>
                  <MdArrowOutward className="text-xl " />
                </div>
              </Link>
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
                    return `${plainText.split(" ").slice(0, 12).join(" ")}...`;
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
                    return `${plainText.split(" ").slice(0, 12).join(" ")}...`;
                  })()
                ) : (
                  <span>Loading...</span>
                )}
              </p>

              {/* <div className="flex items-center gap-8 mt-4">
                <Link className="flex justify-center h-[24px] w-[67px] bg-[#F9F5FF] rounded-lg ">
                  <text className="text-[#6941C6]">Tools</text>
                </Link>
                <Link className="flex justify-center h-[24px] w-[83px] bg-[#EEF4FF] rounded-lg">
                  <text className="text-[#3538CD]">Research</text>
                </Link>
                <Link className="flex justify-center h-[24px] w-[106px] bg-[#FDF2FA] rounded-lg">
                  <text className="text-[#C11574]">Medicine</text>
                </Link>
              </div> */}
            </div>
          );
        })}

        <div className="flex flex-col mt-8 md:mt-8 lg:mt-8 xl:mt-0">
          {data.slice(1, 3)?.map((i, index) => {
            return (
              <div className="flex flex-col md:flex-row lg:flex-row mb-4    ">
                <img
                  className="h-[200px] min-w-[320px]  w-[320px] rounded-xl"
                  src={i.image}
                />

                <div className="flex flex-col pl-0 md:pl-8 lg:pl-8 mt-8 md:mt-0 lg:mt-0">
                  <text className="font-inter text-base font-semibold leading-5 text-[#1030A4]">
                    {i.author} • {i.date}
                  </text>
                  <Link to="/blog">
                    <text className="font-inter text-xl font-semibold leading-8 text-left mt-2">
                      {i.name}
                    </text>
                  </Link>
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
                  {/* <div className="flex gap-8 mt-4">
                    <Link className="flex justify-center h-[24px] w-[67px] bg-[#F0F9FF] rounded-lg">
                      <text className="text-[#026AA2]">Tips</text>
                    </Link>
                    <Link className="flex justify-center h-[24px] w-[83px] bg-[#FDF2FA] rounded-lg">
                      <text className="text-[#C11574]">Health</text>
                    </Link>
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BlogComponent;
