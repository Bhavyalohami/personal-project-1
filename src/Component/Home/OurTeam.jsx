import OwlCarousel from "react-owl-carousel";
import $ from 'jquery';
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import React, { useEffect, useState } from "react";
import { LuFacebook } from "react-icons/lu";
import { FaInstagram } from "react-icons/fa";
import { FiTwitter } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import BaseUrl from "../../Api/baseurl";

const OurTeam = () => {
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const response = await axios.get(`${BaseUrl}clinic/staff-list/`);
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="container mx-auto px-4">
      {data?.length > 0 ? (
        <OwlCarousel
          className="owl-theme"
          autoplay
          autoplaySpeed={1000}
          center={true}
          lazyLoad={true}
          loop
          margin={0}
          items={3}
          //  nav
          {...options}
        >
          {data?.length > 0
            ? data?.map((i, index) => {
                return (
                  <>
                    {i.status === 1 && (
                      <div key={index} className="item">
                        <Link to={`/profiledoctor/${i.id}`}>
                          <div className="block max-w-[18rem] rounded-lg bg-white text-surface ">
                            <div className="relative overflow-hidden bg-cover bg-no-repeat">
                              <img
                                className="rounded-lg w-[220px] h-[230px] object-fill"
                                src={i.image}
                                alt=""
                              />
                            </div>
                            <div className="py-2 px-2 ">
                              <p className="text-md text-black font-medium">
                                {i.fname + " "}
                                {i.lname}
                              </p>
                            </div>
                            <div className="px-2 ">
                              <p className="text-sm text-black font-normal">
                                {i.designation}
                              </p>
                            </div>
                            {/* <div className="px-2 py-2 ">
                              <p className="text-xs text-gray-600 font-normal">
                                {i.introduction
                                  .split(" ")
                                  .slice(0, 30)
                                  .join(" ") +
                                  (i.introduction.split(" ").length > 30
                                    ? "..."
                                    : "")}
                              </p>
                            </div> */}
                            <div className="px-2">
                              <div className="flex gap-4 mt-2 ">
                                <Link
                                  to="http://www.facebook.com"
                                  target="/blank"
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  <LuFacebook />
                                </Link>
                                <Link
                                  to="http://www.instagram.com"
                                  target="/blank"
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  <FaInstagram />
                                </Link>
                                <Link
                                  to="http://www.twitter.com"
                                  target="/blank"
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  <FiTwitter />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </>
                );
              })
            : ""}
        </OwlCarousel>
      ) : (
        ""
      )}
    </div>
  );
};
export default OurTeam;

const options = {
  margin: 0,
  responsiveClass: true,
  // nav: true,
  autoplay: true,
  autoplaySpeed: 1000,
  smartSpeed: 1000,
  responsive: {
    0: {
      items: 1,
    },
    400: {
      items: 1,
    },
    600: {
      items: 2,
    },
    700: {
      items: 2,
    },
    1000: {
      items: 3,
    },
    1300: {
      items: 4,
    },
    1600: {
      items: 4,
    },
  },
};

