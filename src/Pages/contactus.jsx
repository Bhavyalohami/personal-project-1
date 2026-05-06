import axios from "axios";
import { GoArrowDownRight } from "react-icons/go";
// import { Link } from "react-router-dom"; 
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react";
import Swal from "sweetalert2";
import React, { useEffect } from "react";
import BaseUrl from "../Api/baseurl";
import { MdLocalPhone } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";


const ContactUs = () => {
  const [data, setData] = useState({
    email_address: "",
    address: "",
    contact_number: "",
  });
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    phone: "",
  });

  const [errorData, setErrorData] = useState({
    nameError: "",
    emailError: "",
    subjectError: "",
    messageError: "",
    captchaError: "",
    phoneError: "",
  });

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const { name, email, subject, message, phone } = contactData;
    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    // const captcha = document.getElementById("captcha").value;
    // const captchaError = document.getElementById("recaptcha-error");
    // captchaError.textContent = '';
    let errors = {
      nameError: "",
      emailError: "",
      subjectError: "",
      messageError: "",
      captchaError: "",
      phoneError: "",
    };
    // if (captcha === undefined) {
    //     captchaError.textContent = 'Please verify the captcha.';
    //     console.log(captchaError.textContent);
    //     isValid = false;
    // }
    if (name === "") {
      errors.nameError = "Please enter Name";
      isValid = false;
    }

    if (subject === "") {
      errors.subjectError = "Please enter Subject";
      isValid = false;
    }

    if (email === "") {
      errors.emailError = "Please enter a valid email address.";
      isValid = false;
    } else if (!email.match(validRegex)) {
      errors.emailError = "Invalid email address.";
      isValid = false;
    }

    if (message === "") {
      errors.messageError = "Please enter Message";
      isValid = false;
    }
    if (phone === "") {
      errors.phoneError = "Please enter valid Contact Number";
      isValid = false;
    } else if (phone.length !== 10) {
      errors.phoneError = "Please enter 10-digit Contact Number";
      isValid = false;
    }
    if (!isCaptchaVerified) {
      errors.captchaError = "Please verify the captcha.";
      isValid = false;
    }

    setErrorData(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return; // Prevent submission if form is invalid
    if (!isCaptchaVerified) return; // Prevent)

    try {
      await axios.post(
        `${BaseUrl}clinic/submit-contact/`,
        contactData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      Swal.fire({
        title: "Success!",
        text: "Your contact information has been submitted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      setContactData({
        name: "",
        email: "",
        subject: "",
        message: "",
        phone: "",
      });
      setErrorData({
        nameError: "",
        emailError: "",
        subjectError: "",
        messageError: "",
        captchaError: "",
        phoneError: "",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: `There was an issue submitting your contact information: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setContactData({ ...contactData, [name]: value });
    setErrorData({
      ...errorData,
      [`${name}Error`]: "",
    });
  };

  const handleCaptchaChange = (value) => {
    setIsCaptchaVerified(true);
    errorData.captchaError = "";
    // if (value) {
    //   setErrorData({ ...errorData, errorData: "" });
    // }
  };

  const fetchData = async () => {
    const apiUrl = `${BaseUrl}clinic/address/`;
    // const token = localStorage.getItem('auth_token')
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          // Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      // console.log(response.data);
      setData(response.data, "data");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className=" bg-[#F2EFEA] pt-6">
        <div className="container grid grid-cols-2 mx-auto px-4 sm:px-8 lg:px-32 xl:px-48">
          <div className="flex flex-col justify-center items-start text-black font-black text-lg sm:text-xl md:text-3xl lg:text-7xl">
            Contact Us
          </div>
          <div className="flex flex-col justify-center items-end">
            <img src="/brand/auth-care-teal.png" alt="" />
          </div>
        </div>
      </div>

      <div className="container sticky mt-[-30px] lg:mt-[-90px] mx-auto px-4 sm:px-8 lg:px-32 xl:px-48">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col bg-white justify-center border border-gray-200  pb-12 !pt-0 lg:!pt-10 rounded-2xl !mx-0 lg:!mx-24"
        >
          <div className="flex flex-col md:flex-row px-6 xl:px-32">
            <div className="flex flex-col w-full md:w-1/2 mt-4">
              <span className="font-poppins text-base font-normal leading-relaxed text-left text-[#274760]">
                Name
                <span className="text-red-500">*</span>
              </span>
              <input
                onChange={handleChange}
                id="nameapi"
                placeholder="Your Name"
                value={contactData.name}
                name="name"
                className="border-[1.5px] border-solid border-opacity-50 border-blue-500 px-3 py-2 rounded-lg"
              />
              <span className="error-message text-[#fc0000]">
                {errorData.nameError}
              </span>
            </div>
            <div className="flex flex-col ml-0 md:ml-6 w-full md:w-1/2 mt-4">
              <span className="font-poppins text-base font-normal leading-relaxed text-left text-[#274760]">
                Email
                <span className="text-red-500">*</span>
              </span>
              <input
                onChange={handleChange}
                id="emailapi"
                placeholder="example@gmail.com"
                value={contactData.email}
                name="email"
                className="border-[1.5px] border-solid border-opacity-50  border-blue-500 px-3 py-2 rounded-lg"
              />
              <span className="error-message text-[#fc0000]">
                {errorData.emailError}
              </span>
            </div>
          </div>

          <div className="flex gap-4 flex-col md:flex-row mt-4 px-6 xl:px-32">
            <div className="flex flex-col w-full md:w-1/2 ">
              <span className="font-poppins text-base font-normal leading-relaxed text-left text-[#274760]">
                Subject
                <span className="text-red-500">*</span>
              </span>
              <input
                onChange={handleChange}
                id="subjectapi"
                placeholder="Your Subject"
                value={contactData.subject}
                name="subject"
                className="border-[1.5px]  border-solid border-opacity-50 border-blue-500 px-3 py-2 rounded-lg"
              />
              <span className="error-message text-[#fc0000]">
                {errorData.subjectError}
              </span>
            </div>
            <div className="flex flex-col w-full md:w-1/2 ">
              <span className="font-poppins text-base font-normal leading-relaxed text-left text-[#274760]">
                Contact Number
                <span className="text-red-500">*</span>
              </span>
              <input
                onChange={handleChange}
                // type='text'
                pattern="\d*"
                inputMode="numeric"
                id="phoneapi"
                placeholder="(+91) Your Conatct Number"
                value={contactData.phone}
                name="phone"
                className="border-[1.5px]  border-solid border-opacity-50 border-blue-500 px-3 py-2 rounded-lg"
              />
              <span className="error-message text-[#fc0000]">
                {errorData.phoneError}
              </span>
            </div>
          </div>

          <div className="flex flex-col mt-4 px-6 xl:px-32">
            <span
              htmlFor="messageapi"
              className="font-poppins text-base font-normal leading-relaxed text-left text-[#274760]"
            >
              Message
              <span className="text-red-500">*</span>
            </span>
            <textarea
              onChange={handleChange}
              id="messageapi"
              name="message"
              value={contactData.message}
              className="border-[1.5px] h-[120px] border-solid border-opacity-50 border-blue-500 px-3 py-2 rounded-lg"
            />
            <span className="error-message text-[#fc0000]">
              {errorData.messageError}
            </span>
          </div>

          <div className="scale-[0.8] mt-4 flex flex-col ml-[-10px] sm:ml-[-30px] md:ml-[-50px] xl:ml-[20px]  2xl:ml-[-5px] flex items-start w-full">
            <ReCAPTCHA
              sitekey="6Lc4RyEqAAAAAKpyye27qavRHxgswURGIuebcTmE"
              onChange={(value) => handleCaptchaChange(value)}
              id="captcha"
            />
            <span className="text-xl text-[#fc0000]" id="recaptcha-error">
              {errorData.captchaError}
            </span>
          </div>

          <div className="px-6 lg:px-32">
            <button className="flex mt-8 lg:mt-12 w-full lg:w-[150px] h-[55px] p-[25px] rounded-[35px] border-[2px] border-red-600 shadow-2xl bg-red-600 hover:bg-red-500 text-[#ffffff] font-poppins text-[20px] lg:text-lg font-semibold leading-7 lg:leading-[32px] tracking-wide text-center justify-center items-center opacity-[65%] shadow-xl shadow-red-600/70">
              Submit
              <GoArrowDownRight className="h-8 w-8 stroke-1" />
            </button>
          </div>
        </form>
      </div>

      <div className="container flex flex-col lg:flex-row mx-auto px-4 sm:px-8 lg:px-32 xl:px-48  my-16">
        {data && (
          <div className="flex flex-col items-center lg:items-start w-full lg:w-1/3">
            <span className="font-inter text-2xl font-semibold leading-10 text-left text-[#274760]">
              Contact Info
            </span>
            <img className="mt-10" src="/brand/service-icon-teal.png" alt="" />

            <span className="flex items-center justify-center text-center font-inter text-lg font-semibold leading-tight text-left text-[#274760] mt-6">
              <MdLocalPhone className="mr-1 text-[18px]" />
              Phone Number
            </span>
            <span className="font-poppins text-base font-normal leading-relaxed text-left text-[#274760] ml-6">
              (+91) {data.contact_number}
            </span>

            <span className="flex items-center justify-center text-center font-inter text-lg font-semibold leading-tight text-left text-[#274760] mt-6">
              <MdEmail className="mr-1 text-[18px]" />
              Email Us
            </span>
            <span className="font-poppins text-base font-normal leading-relaxed text-left text-[#274760] ml-6">
              {data.email_address}
            </span>

            <span className="flex items-center justify-center text-center font-inter text-lg font-semibold leading-tight text-left text-[#274760] mt-6">
              <FaLocationDot className="mr-1 text-[18px]" />
              Our Location
            </span>
            <span className="font-poppins text-base font-normal leading-relaxed text-left text-[#274760] ml-6">
              {data.address}
            </span>
          </div>
        )}
        <div className="flex w-full lg:w-2/3 pl-0 lg:pl-8 mt-6 lg:mt-0">
          {/* <div id="map" className="h-96"></div> */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28474.825843946717!2d75.7683882!3d26.8605163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db501daebe0ab%3A0x9bf33abbdc8d0f98!2sAmar%20Medical%20%26%20Research%20Centre!5e0!3m2!1sen!2sin!4v1721126403454!5m2!1sen!2sin"
            className="w-full rounded-2xl"
            title="Clinic location map"
          ></iframe>
        </div>
      </div>

      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-6 mx-auto px-4 sm:px-8 lg:px-32 xl:px-48  my-20">
        <div>
          <img className="w-full" src="/brand/auth-care-teal.png" alt="" />
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-[#011632] font-inter text-4xl font-bold leading-[52.5px] text-center">
            Frequently Asked Question
          </span>
          <p className="text-[#011632] font-inter text-center text-lg font-normal leading-7.9 tracking-wide w-2/3 mt-2">
            We use only the best quality materials on the market in order to
            provide the best products to our patients.
          </p>

          <div
            className="accordion w-full mt-8"
            id="accordionPanelsStayOpenExample"
          >
            <div className="accordion-item">
              <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                <button
                  className="accordion-button"
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
                className="accordion-collapse collapse show visible"
                aria-labelledby="panelsStayOpen-headingOne"
              >
                <div className="accordion-body">
                  <p className="">
                    Most email marketing platforms provide analytics that offer
                    insights into metrics such as open rates, click-through
                    rates, and even the specific actions taken by recipients.
                    These tools utilize tracking pixels or similar technologies
                    to detect when an email is opened and often provide
                    anonymized data on recipient engagement. While this data can
                    inform your marketing strategy and help tailor future
                    campaigns, it's important to balance the use of such
                    information with respect for recipient privacy and
                    compliance with data protection regulations like GDPR.
                  </p>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                <button
                  className="accordion-button collapsed"
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
                className="accordion-collapse collapse visible"
                aria-labelledby="panelsStayOpen-headingTwo"
              >
                <div className="accordion-body">
                  <p>
                    These programs often include discounted pricing or special
                    offers to support the work of non-profits. It's best to
                    check with the specific software provider or service you're
                    interested in to inquire about any available discounts or
                    support for non-profit organizations. Many companies are
                    committed to supporting non-profits and may have specific
                    policies or programs in place to assist them.
                  </p>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="panelsStayOpen-headingThree">
                <button
                  className="accordion-button collapsed"
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
                className="accordion-collapse collapse visible"
                aria-labelledby="panelsStayOpen-headingThree"
              >
                <div className="accordion-body">
                  <p>
                    Becoming a member of an organization or community can be
                    highly beneficial for several reasons. Firstly, membership
                    often grants access to a wealth of resources and specialized
                    services that non-members may not have. This could include
                    exclusive content, discounted rates on products or services,
                    or access to expert advice and support.
                  </p>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="panelsStayOpen-headingFour">
                <button
                  className="accordion-button collapsed"
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
                className="accordion-collapse collapse visible"
                aria-labelledby="panelsStayOpen-headingFour"
              >
                <div className="accordion-body">
                  <p>
                    Health issues are undeniably a significant concern that
                    impacts individuals, communities, and societies at large.
                    From chronic diseases to mental health challenges, the
                    spectrum of health issues spans a wide range of conditions
                    that can affect quality of life, productivity, and overall
                    well-being. Access to healthcare services, affordability of
                    treatments, and preventive measures are critical factors in
                    addressing these issues effectively.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
