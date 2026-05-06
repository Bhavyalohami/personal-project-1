import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { Link } from "react-router-dom";


const BlogSlider = () => {
    return (
        <div className="container mx-auto px-4">
      {data.length > 0 ? (
        <OwlCarousel
          className="owl-theme"
          autoplay
          autoplaySpeed={1000}
          center={true}
          lazyLoad={true}
          loop
          margin={0}
          items={5}
          //  nav
          {...options}
        >
          {data.length > 0
            ? data.map((i,index) => {
                return (
                  <>
                  <Link to='/blog'>
                    <div key={index} className="item" >
                      <div className="block max-w-full md:max-w-[17rem] xl:max-w-[22rem] rounded-lg bg-white text-surface ">
                      <div className="flex flex-col px-8 py-6 bg-[#E6F6FE] rounded-xl">
                        <img className="w-full h-full self-center" src={i.img} alt="" />
                        <div className="flex justify-between items-center w-full">
                        <button className="w-[97px] h-[39px] text-[#ffffff] bg-[#011632] rounded mt-4 py-1.5 font-medium">{i.btn}</button>
                        <span className="text-[#011632] font-general-sans text-sm font-normal leading-6 tracking-tighter text-right mt-4">{i.Author}</span>
                        </div>
                        <span className="text-[#011632] w-full  font-general-sans text-base font-medium leading-27.9 tracking-wide text-left mt-4">{i.title}</span>
                        <p className="text-[#3C4959] font-general-sans text-base font-normal leading-27.9 tracking-wide text-left mt-2">{i.Description}</p>
                    </div>
                      </div>
                    </div>
                    </Link>
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
}

export default BlogSlider;



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
        items: 1,
      },
      760: {
        items: 2,
      },
      1000: {
        items: 3,
      },
      1300:{
        items:3,
      },
      1600: {
        items:3,
      },
    },
  };
  
  const data = [
    {
      img: "/brand/blog-skin-care-teal.png",
      btn: `Self Care`,
      title: `Points towards personal care.`,
      Description: `Lorem ipsum dolor sit amet consectetur.`,
      Author: `~Anita Jackson`,
    },
    {
      img: "/brand/blog-skin-care-teal.png",
      btn: `Dental`,
      title: `Care of your Teeth to and Smile`,
      Description: `Lorem ipsum dolor sit amet consectetur.`,
      Author: `~Tom Willson`,
    },
    {
      img: "/brand/blog-skin-care-teal.png",
      btn: `Mental`,
      title: `Solving your mental problems`,
      Description: `Lorem ipsum dolor sit amet consectetur.`,
      Author: `~Peter `,
    },
  ];
  
