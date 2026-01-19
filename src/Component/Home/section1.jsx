

const Section1 = () => {
  return (
    <div className="container mx-auto mt-0 px-4 md:px-8 md:!mt-[-50px] lg:px-32 xl:px-48  ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        <div className="mt-20 sm:mt-20 md:mt-0 top-7 flex items-center">
          <div className=" p-4 md:p-6 ">
            <p className="font-semibold text-lg leading-loose">Why Choose Us?</p>
            <p className="text-sm ">
              We are dedicated to providing exceptional treatments care in a warm and welcoming environment.
            </p>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
          <div className="bg-white">
            <span>
              <img src="/assets/Home/Section1/icon1.png" alt="Customer Service Icon" />
            </span>
            <p className="font-semibold text-md leading-loose">Free Consultation</p>
            <p className="text-sm md:text-sm line-clamp-3">
              We offer flexible appointment scheduling and free to accommodate your busy life.
            </p>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
          <div className="bg-white">
            <span>
              <img src="/assets/Home/Section1/icon2.png" alt="Doctor Icon" />
            </span>
            <p className="font-semibold text-md leading-loose">Best Expert</p>
            <p className="text-sm md:text-sm">
              Our team of experienced dentists and dental professionals boasts years of expertise in various areas of dentistry.
            </p>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
          <div className="bg-white">
            <span >
              <img src="/assets/Home/Section1/icon3.png" alt="Rating Icon" />
            </span>
            <p className="font-semibold text-md leading-loose">High User Rating</p>
            <p className="text-sm md:text-sm">
              We offer the latest techniques and materials for restoring damaged teeth, ensuring your dental health is fully optimized.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section1;

