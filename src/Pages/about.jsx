import { useEffect, useState } from "react";
import { GoArrowDownRight } from "react-icons/go";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import BaseUrl from "../Api/baseurl";
import Swal from "sweetalert2";
import LoaderH from "../Component/Loader/loader";
const About = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    intrest: "",
  });

  const [text, setText] = useState(
    "In times like today, your health is very important, especially since the number of COVID-19 cases is increasing day by day, so we are ready to help you with your health consultation. In times like today, your health is very important, especially since the number of COVID-19 cases is increasing day by day, so we are ready to help you with your health consultation. In times like today, your health is very important, especially since the number of COVID-19 cases is increasing day by day, so we are ready to help you with your health consultation. In times like today, your health is very important, especially since the number of COVID-19 cases is increasing day by day, so we are ready to help you with your health consultation. In times like today, your health is very important, especially since the number of COVID-19 cases is increasing day by day, so we are ready to help you with your health consultation. In times like today, your health is very important, especially since the number of COVID-19 cases is increasing day by day, so we are ready to help you with your health consultation."
  );
  const [img, setImg] = useState("/assets/About/button1.png");

  const handleClick = (val) => {
    switch (val) {
      case 1:
        setText(
          "In times like today, your health is very important, especially since the number of COVID-19 cases is increasing day by day, so we are ready to help you with your health consultation. In times like today, your health is very important, especially since the number of COVID-19 cases is increasing day by day, so we are ready to help you with your health consultation. In times like today, your health is very important, especially since the number of COVID-19 cases is increasing day by day, so we are ready to help you with your health consultation. In times like today, your health is very important, especially since the number of COVID-19 cases is increasing day by day, so we are ready to help you with your health consultation. In times like today, your health is very important, especially since the number of COVID-19 cases is increasing day by day, so we are ready to help you with your health consultation. In times like today, your health is very important, especially since the number of COVID-19 cases is increasing day by day, so we are ready to help you with your health consultation."
        );
        setImg("/assets/About/button1.png");
        setActiveTab(1);
        break;
      case 2:
        setText(
          "Cras ullamcorper, tortor in laoreet dapibus, mi augue luctus lacus, quis interdum elit sem et diam. Maecenas et augue at libero tempus laoreet. Curabitur augue dui, molestie nec tempus at, malesuada in nisl. Cras nec rhoncus nibh. Vestibulum laoreet arcu luctus metus sodales feugiat. Nulla nec magna mattis, ullamcorper dolor quis, congue libero. Etiam mollis magna non pellentesque dapibus. Curabitur quis dui pulvinar, consectetur tortor non, congue ex. Maecenas ultrices lorem enim. Aliquam fringilla, lorem non ultricies sollicitudin, mi dui interdum ligula, nec sollicitudin tellus ex vel risus. Vestibulum tempus, velit eu tristique bibendum, lorem lectus iaculis eros, tristique scelerisque ante est vel erat. Quisque gravida est tellus, sed maximus sapien fermentum mattis. Sed euismod, ipsum at placerat pulvinar, dolor neque molestie nisi, vel laoreet magna erat et orci. Aenean ultricies ac est sit amet convallis. Mauris fringilla, lectus eget ornare faucibus, nulla ipsum dignissim nunc, in aliquet diam lorem sit amet mi. Aliquam quis quam elit."
        );
        setImg("/assets/About/button2.png");
        setActiveTab(2);
        break;
      case 3:
        setText(
          "Etiam aliquet varius urna elementum ornare. Duis purus ligula, scelerisque vel dapibus a, fringilla bibendum est. Mauris sed ante et ante molestie interdum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum ligula turpis, sollicitudin non sollicitudin sit amet, interdum quis lectus. Curabitur cursus est nec odio lobortis consequat. Sed finibus purus purus, id mollis ligula posuere ac. Morbi consequat arcu eget ligula maximus luctus. Proin posuere lectus tellus, id pulvinar eros egestas eu. Suspendisse efficitur eu massa at pharetra. Pellentesque vulputate tincidunt arcu, sit amet semper tortor sollicitudin at. Aliquam non dignissim nibh. Aenean a leo porta, tempor odio non, volutpat lacus. Sed sed finibus erat, nec aliquam leo. Etiam augue erat, sagittis in blandit eget, fermentum et enim. Vivamus volutpat convallis ante id pellentesque."
        );
        setImg("/assets/About/button1.png");
        setActiveTab(3);
        break;
      default:
        setText("");
        setImg("");
        break;
    }
  };

  const handleCaptchaChange = (value) => {
    setIsCaptchaVerified(true);
    const captchaError = document.getElementById("recaptcha-error");
    captchaError.textContent = "";
  };

  const handleInputChange = (e) => {
    const fnameError = document.getElementById("fname-error");
    const intrestError = document.getElementById("intrest-error");
    const emailError = document.getElementById("emailid-error");
    const phoneError = document.getElementById("phoneno-error");

    const { id, value } = e.target;
    switch (id) {
      case "fname":
        const searchInput = document.getElementById("fname");
        searchInput.addEventListener("input", function (e) {
          const searchText = e.target.value.trim();
          fnameError.textContent = "";
        });
        break;
      case "intrest":
        const searchInput1 = document.getElementById("intrest");
        searchInput1.addEventListener("input", function (e) {
          const searchText = e.target.value.trim();
          intrestError.textContent = "";
        });
        break;
      case "emailid":
        const searchInput2 = document.getElementById("emailid");
        searchInput2.addEventListener("input", function (e) {
          const searchText = e.target.value.trim();
          emailError.textContent = "";
        });
        break;
      case "phoneno":
        const searchInput3 = document.getElementById("phoneno");
        searchInput3.addEventListener("input", function (e) {
          const searchText = e.target.value.trim();
          phoneError.textContent = "";
        });
        break;
      default:
        break;
    }
  };
  const validateForm = async () => {
    const fnameInput = document.getElementById("fname");
    const intrestInput = document.getElementById("intrest");
    const emailInput = document.getElementById("emailid");
    const phoneInput = document.getElementById("phoneno");
    const captchaInput = document.getElementById("captcha");
    const fname = fnameInput.value;
    const intrest = intrestInput.value;
    const email = emailInput.value;
    const phone = phoneInput.value;
    const captcha = captchaInput.value;
    const fnameError = document.getElementById("fname-error");
    const intrestError = document.getElementById("intrest-error");
    const emailError = document.getElementById("emailid-error");
    const phoneError = document.getElementById("phoneno-error");
    const captchaError = document.getElementById("recaptcha-error");

    fnameError.textContent = "";
    intrestError.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";
    captchaError.textContent = "";

    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    let isValid = true;

    if (fname === "") {
      fnameError.textContent = "Please enter First Name";
      isValid = false;
    }

    if (intrest === "") {
      intrestError.textContent = "Please enter Area of Interest";
      isValid = false;
    }

    if (email === "") {
      emailError.textContent = "Please enter a valid email address.";
      isValid = false;
    } else if (!email.match(validRegex)) {
      emailError.textContent = "Invalid email address.";
      isValid = false;
    }

    if (phone === "") {
      phoneError.textContent = "Please enter Phone Number";
      isValid = false;
    } else if (!/^\d{10}$/.test(phone)) {
      phoneError.textContent = "Please enter a 10-digit Phone Number";
      isValid = false;
    }

    if (!isCaptchaVerified) {
      captchaError.textContent = "Please verify the captcha.";
      isValid = false;
    }

    if (isValid) {
      formData.name = fname;
      formData.contact = phone;
      formData.email = email;
      formData.intrest = intrest;
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const reponse = await axios.post(
          `${BaseUrl}clinic/consultation-query/`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        Swal.fire({
          title: "Success!",
          text: "Your Consultation Query has been raised successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        window.location.reload();
        setLoading(false);

      } catch (error) {
        console.error(error);
      }
    }
    return isValid;
  };

  return loading === false ? (
    <div>
      <div className="bg-[#F2EFEA] pt-6">
        <div className="container grid grid-cols-2 mx-auto px-4 sm:px-8 lg:px-32 xl:px-48">
          <div className="flex flex-col justify-center items-start text-black font-black text-lg sm:text-xl md:text-3xl lg:text-7xl">
            About Us
          </div>
          <div className="flex flex-col justify-center items-end">
            <img src="/assets/Mainabout.png" alt="" />
          </div>
        </div>
      </div>

      {/* <div className=" container  mx-auto  px-4 sm:px-8 lg:px-32 xl:px-48 grid grid-cols-5 items-center justify-center gap-8 md:gap-12 lg:gap-28 xl:gap-32 py-6 sm:py-8 md:py-12 lg:py-20">
        <img src="/assets/About/s1.png" alt="" />

        <img src="/assets/About/s2.png" alt="" />

        <img src="/assets/About/s3.png" alt="" />

        <img src="/assets/About/s4.png" alt="" />

        <img src="/assets/About/s5.png" alt="" />
      </div> */}

      <div className=" container grid grid-cols-1 md:grid-cols-2  px-4 sm:px-8 lg:px-32 xl:px-48 my-4 lg:my-16">
        <div className="flex flex-col py-4 md:py-2">
          <div className="text-[#1030A4] text-[12px] font-medium sm:text-[28px] ">
            About
          </div>
          <div className="py-2">
            <p className="text-black font-black text-5xl md:text-3xl md:leading-[2.0rem] lg:text-5xl lg:leading-[3rem] xl:text-6xl xl:leading-[4rem] ">
              We Are Ready to
            </p>
            <p className="bg-gradient-to-r from-[#1030A4] to-[#7283C0] text-transparent opacity-80 bg-clip-text font-black text-5xl md:text-3xl md:leading-[2.0rem] lg:text-5xl lg:leading-[3rem] xl:text-6xl xl:leading-[4rem]">
              Help Your Health
            </p>
            <p className="text-black font-black text-5xl md:text-3xl md:leading-[2.0rem] lg:text-5xl lg:leading-[2.8rem] xl:text-6xl xl:leading-[4rem]">
              Problems
            </p>
          </div>
          <div className="py-[4px] md:py-[0px]">
            <p className="text-md font-medium text-justify md:text-xs md:leading-[1rem] md:w-[350px] lg:text-sm lg:leading-[1.5rem] lg:w-[400px] xl:text-lg xl:leading-[1.8rem] xl:w-[500px]">
              In times like today, your health is very important, especially
              since the number of COVID-19 cases is increasing day by day, so we
              are ready to help you with your health consultation.
            </p>
          </div>
          <div className="flex column-3 gap-12 py-2 md:py-1 xl:py-4">
            <div className="md:h-[50px] md:w-[50px] lg:h-[75px] lg:w-[75px]">
              <text className="font-poppins text-xl md:text-2xl lg:text-4xl font-extrabold leading-9 text-[#172048]">
                200<span className="text-[#00617e]">+</span>
              </text>
              <p className="py-2 text-gray-600 font-medium leading-none md:text-[10px] md:py-1  lg:text-[15px] lg:py-1">
                Active Doctor
              </p>
            </div>
            <div className="md:h-[50px] md:w-[50px] lg:h-[75px] lg:w-[75px]">
              <text className="font-poppins text-xl md:text-2xl lg:text-4xl font-extrabold leading-9 text-[#172048]">
                15K<span className="text-[#00617e]">+</span>
              </text>
              <p className="py-2 text-gray-600 font-medium leading-none md:text-[10px] md:py-1  lg:text-[15px] lg:py-1">
                Active User
              </p>
            </div>
            <div className="md:h-[50px] md:w-[50px] lg:h-[75px] lg:w-[75px]">
              <text className="font-poppins text-xl md:text-2xl lg:text-4xl font-extrabold leading-9 text-[#172048]">
                50<span className="text-[#00617e]">+</span>
              </text>
              <p className="py-2 text-gray-600 font-medium leading-none md:text-[10px] md:py-1  lg:text-[15px] lg:py-1">
                Active Pharmacy
              </p>
            </div>
          </div>
        </div>
        <div className="p-2">
          <img src="/assets/About/about1.png" alt="" />
        </div>
      </div>

      <div className="container  grid grid-cols-1 md:grid-cols-2 mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 my-8">
        <div className="flex justify-center items-center">
          <div>
            <text className="font-inter text-[22px] font-medium leading-6 text-left ">
              <span className="font-inter text-6xl lg:text-9xl font-bold leading-tight text-[#1030A4] mr-2">
                50+
              </span>
              Years of Experience
            </text>
            <p className=" font-inter text-[18px] leading-[21px] tracking-wider text-left text-[#A9A9A9]">
              In times like today, your health is very important, especially
              since the number of COVID-19 cases is increasing day by day, so we
              are ready to help you with your health consultation. In times like
              today, your health is very important, especially since the number
              of COVID-19 cases is increasing day by day, so we are ready to
              help you with your health consultation. In times like today, your
              health is very important, especially since the number of COVID-19
              cases is increasing day by day, so we are ready to help you with
              your health consultation. In times like today, your health is very
              important, especially since the number of COVID-19 cases is
              increasing day by day, so we are ready to help you with your
              health consultation.{" "}
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <img
            className="h-auto md:h-1/2"
            src="/assets/About/about2.png"
            alt=""
          />
        </div>
      </div>

      <div className="container flex flex-col-reverse lg:flex-row items-center justify-center mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 my-20">
        <div className=" px-2 mt-6 lg:mt-0  w-full lg:w-1/3 hidden sm:flex">
          <img src={img} alt="" className="max-w-full h-auto" />
        </div>

        <div className=" lg:ml-4 flex flex-col self-start w-full lg:w-2/3">
          <div className="flex mb-4">
            <button
              className={`font-medium text-xl text-left w-1/3 border-b-[3px]  hover:border-blue-900 hover:text-blue-900  ${
                activeTab === 1
                  ? "text-blue-900 border-blue-900"
                  : "text-gray-400 border-gray-400"
              }`}
              onClick={() => handleClick(1)}
            >
              Our Goal
            </button>
            <button
              className={`font-medium text-xl text-left w-1/3 border-b-[3px]  hover:border-blue-900 hover:text-blue-900  ${
                activeTab === 2
                  ? "text-blue-900 border-blue-900"
                  : "text-gray-400 border-gray-400"
              }`}
              onClick={() => handleClick(2)}
            >
              Our Vision
            </button>
            <button
              className={`font-medium text-xl text-left w-1/3 border-b-[3px]  hover:border-blue-900 hover:text-blue-900  ${
                activeTab === 3
                  ? "text-blue-900 border-blue-900"
                  : "text-gray-400 border-gray-400"
              }`}
              onClick={() => handleClick(3)}
            >
              Our Motive
            </button>
          </div>
          <p className="font-inter text-[18px] gap-[2px] font-normal tracking-wider leading-5 text-left text-[#A9A9A9]">
            {text}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 flex flex-col items-center  mb-12 rounded-[15px] shadow-lg">
        <div class="font-sans text-[48px] font-bold leading-[72px] bg-gradient-to-r from-blue-700 via-blue-500 to-red-500 text-transparent bg-clip-text pt-20 text-center">
          Get started with Doctor’s Consultation
        </div>
        <p class="font-poppins text-[18px] text-center font-medium leading-8  text-[#C4C4C4] pt-4 w-full xl:w-3/5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sodales morbi
          tristique libero urna sem vitae. Viverra facilisis rhoncus et, nibh
          nullam vitae laoreet.
        </p>

        <Link
          type="button"
          className="flex my-14  w-full lg:w-1/3 xl:w-1/4 h-[75px] p-[25px] rounded-[35px] border-[2px] border-red-600 shadow-2xl bg-red-600 hover:bg-red-500 text-[#ffffff] font-poppins text-[20px] lg:text-lg font-semibold leading-7 lg:leading-[32px] tracking-wide text-center justify-center items-center opacity-[75%] shadow-xl shadow-red-600/70"
          data-bs-toggle="modal"
          data-bs-target="#bookModal"
        >
          Get Consultation
          <GoArrowDownRight className="h-8 w-8 stroke-1" />
        </Link>
        <div
          class="modal fade"
          id="bookModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered modal-xl ">
            <div class="modal-content grid grid-cols-3">
              <div className="hidden lg:flex">
                <img className="h-full" src="/assets/About/modal.png" />
              </div>
              <div className="col-span-3 lg:col-span-2 py-8 px-8">
                <div class="modal-header flex items-center justify-center border-none">
                  <h1
                    class="modal-title font-poppins text-3xl font-semibold leading-9 absolute "
                    id="exampleModalLabel"
                  >
                    Get Consultation
                  </h1>
                  <button
                    type="button"
                    class="btn-close font-medium bg-[#051efc] rounded-md"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body grid grid-cols-2 gap-2">
                  <div className="mb-2.5">
                    <input
                      onChange={handleInputChange}
                      className="pt-1 px-3 w-full lg:w-[90%] xl:w-[310px] h-[44px] border border-gray-300 rounded-[10px]"
                      id="fname"
                      placeholder="Full Name*"
                    />
                    <span
                      id="fname-error"
                      class="text-[13px] text-[#fc0000]"
                    ></span>
                  </div>
                  <div className="mb-2.5">
                    <input
                      onChange={handleInputChange}
                      className="pt-1 px-3 w-full lg:w-[90%] xl:w-[310px] h-[44px] border border-gray-300 rounded-[10px]"
                      id="intrest"
                      placeholder="I'm intrested in*"
                    />
                    <span
                      id="intrest-error"
                      class="text-[13px] text-[#fc0000]"
                    ></span>
                  </div>
                  <div>
                    <input
                      onChange={handleInputChange}
                      className="pt-1 px-3 w-full lg:w-[90%] xl:w-[310px] h-[44px] border border-gray-300 rounded-[10px]"
                      id="emailid"
                      placeholder="Email*"
                    />
                    <span
                      id="emailid-error"
                      class="text-[13px] text-[#fc0000]"
                    ></span>
                  </div>
                  <div>
                    <input
                      onChange={handleInputChange}
                      className="pt-1 px-3 w-full lg:w-[90%] xl:w-[310px] h-[44px] border border-gray-300 rounded-[10px]"
                      id="phoneno"
                      placeholder="Phone Number*"
                    />
                    <span
                      id="phoneno-error"
                      class="text-[13px] text-[#fc0000]"
                    ></span>
                  </div>
                  <div className="scale-[0.65] flex flex-col  ml-[-35px] lg:ml-[-40px] xl:ml-[-60px]  flex items-start w-full">
                    <ReCAPTCHA
                      sitekey="6Lc4RyEqAAAAAKpyye27qavRHxgswURGIuebcTmE"
                      onChange={handleCaptchaChange}
                      id="captcha"
                    />
                    <span
                      className="text-red-500 font-medium text-[20px] mt-1"
                      id="recaptcha-error"
                    ></span>
                  </div>
                </div>

                <div class="modal-footer border-none flex items-center justify-center">
                  <button
                    className="opacity-[70%] w-full sm:w-1/2 flex font-poppins text-base font-semibold leading-7 tracking-wide text-center justify-center items-center shadow-2xl bg-red-600 hover:bg-red-500 text-[#ffffff] py-2.5 rounded-[30px] shadow-xl shadow-red-600/70"
                    onClick={() => validateForm()}
                  >
                    Get Consultation
                    <GoArrowDownRight className="h-6 w-6 stroke-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <LoaderH />
  );
};

export default About;
