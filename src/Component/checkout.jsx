// import React, { useState, useEffect } from "react";
// import { CardElement } from "@stripe/react-stripe-js";
// import {
//   PaymentElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import Swal from "sweetalert2";
// import axios from "axios";
// const CheckoutForm = () => {
//   const [message, setMessage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const { userType } = useParams();
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();
//   const [paymentStatus, setPaymentStatus] = useState(false);
//   const paymentElementOptions = {
//     layout: "tabs",
//   };

//   useEffect(() => {
//     if (!stripe) {
//       console.log("Stripe.js has not yet loaded.");
//       return;
//     }
//     const clientSecret = new URLSearchParams(window.location.search).get(
//       "payment_intent_client_secret"
//     );

//     if (!clientSecret) {
//       console.log("Failed to retrieve payment intent client secret.");
//       return;
//     }

//     stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
//       console.log(paymentIntent.status, "paymentIntent");
//       switch (paymentIntent.status) {
//         case "succeeded":
//           navigate("/");
//           setMessage("Payment succeeded!");
//           console.log("hitted");
          
//           Swal.fire({
//             title: "Payment succeeded!",
//             icon: "success",
//             confirmButtonText: "Close",
//           });

//           break;

//         case "processing":
//           navigate("/");
//           setMessage("Your payment is processing.");
//           Swal.fire({
//             title: "Your payment is processing",
//             icon: "warning",
//             confirmButtonText: "Close",
//           });

//           break;
//         case "requires_payment_method":
//           navigate("/");
//           setMessage("Your payment was not successful, please try again.");
//           Swal.fire({
//             title: "Your payment was not successful, please try again",
//             icon: "error",
//             confirmButtonText: "Close",
//           });

//           break;
//         default:
//           navigate("/");
//           setMessage("Something went wrong.");
//           Swal.fire({
//             title: "Something went wrong",
//             icon: "error",
//             confirmButtonText: "Close",
//           });

//           break;
//       }
//     });
//   }, [stripe]);
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!stripe || !elements) {
//       return;
//     }

//     setIsLoading(true);

//     const { error } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         return_url: `http://192.168.1.25:3000/`,
//       },
//     });
//     Swal.fire({
//       title: "Payment succeeded!",
//       icon: "success",
//       confirmButtonText: "Close",
//     });
//     if (error.type === "card_error" || error.type === "validation_error") {
//       setMessage(error.message);
//       Swal.fire({
//         title: error.message,
//         icon: "warning",
//         confirmButtonText: "Close",
//       });
//     } else {
//       console.log(error.message);
//       Swal.fire({
//         title: error.message,
//         icon: "warning",
//         confirmButtonText: "Close",
//       });
//       setMessage("An unexpected error occurred.");
//     }

//     setIsLoading(false);
//   };
//   return (
//     <>
//       <div
//         className=""
//         style={{
//           padding: "40px",
//           margin: "auto",
//           marginTop: "100px",
//           marginBottom: "100px",
//           width: "600px",
//           boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
//           borderRadius: "5px",
//           display: `${paymentStatus} && none`,
//         }}
//       >
//         <form id="payment-form" onSubmit={handleSubmit}>
//           <PaymentElement
//             id="payment-element"
//             options={paymentElementOptions}
//           />
//           <button
//             className="payButtonStripe flex w-full justify-center items-center mt-4"
//             disabled={isLoading || !stripe || !elements}
//             id="submit"
//           >
//             <span
//               id="button-text"
//               className="p-2 bg-blue-700 hover:bg-blue-600 text-white font-medium rounded-md"
//             >
//               {isLoading ? (
//                 <div className="spinner" id="spinner"></div>
//               ) : (
//                 "Pay now"
//               )}
//             </span>
//           </button>
//         </form>
//       </div>

//       {/* Show any error or success messages */}
//       {/* {message && (
//             <>
//               <div id="payment-message" className="stripePaymentMessage"></div>
//               <Link to={userType === "candidate" ? "/candidates/myaccount" : "/user/myprofile"} className="navButton1">My Profile</Link>
//             </>
//           )} */}
//     </>
//   );
// };


import React, { useState, useEffect } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import BaseUrl from "../Api/baseurl"; 
import axios from "axios";
import dayjs from "dayjs"
import Cookies from "js-cookie";

const CheckoutForm = ({ appointmentDetails }) => {
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [paymentStatus, setPaymentStatus] = useState();
  // const formDatatoSend =(JSON.stringify({appointmentDetails}));
  // console.log(formDatatoSend, "Booking Data");
  

  // useEffect(() => {
    
  //   if (paymentStatus === "succeeded") {
  //     console.log("Enter Success");
      
  //     fetch(BaseUrl + "clinic/submit-appointment/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: appointmentDetails,
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log("API hit");
          
  //         if (data.success) {
  //           Swal.fire({
  //             title: "Appointment Booked!",
  //             icon: "success",
  //             confirmButtonText: "Close",
  //           });
  //         } else {
  //           Swal.fire({
  //             title: "Booking failed. Please try again.",
  //             icon: "error",
  //             confirmButtonText: "Close",
  //           });
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error booking appointment:", error);
  //         Swal.fire({
  //           title: "Something went wrong. Please try again.",
  //           icon: "error",
  //           confirmButtonText: "Close",
  //         });
  //       });
  //   }
  // }, [paymentStatus]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!stripe || !elements) {
  //     return;
  //   }

  //   setIsLoading(true);
  //   console.log("check")

  //   const { error } = await stripe.confirmPayment({
  //     elements,
  //     confirmParams: {
  //       return_url: `http://192.168.1.25:3000/`, 
  //     },
  //   });
  //   console.log("Payment Status");
    
  //   if (error) {
  //     setMessage(error.message);
  //     Swal.fire({
  //       title: error.message,
  //       icon: "warning",
  //       confirmButtonText: "Close",
  //     });
  //     setIsLoading(false);
  //   } else {
  //     console.log("Payment Completed");
      
  //     setPaymentStatus("succeeded");
  //     Swal.fire({
  //       title: "Payment Completed",
  //       icon: "success",
  //       confirmButtonText:"Close",
  //     }) 
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!stripe || !elements) {
      return;
    }
  
    setIsLoading(true);
  
    // Use `redirect: 'if_required'` to prevent an immediate redirect
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Include the return_url here, as it's required by Stripe
        return_url: `http://192.168.1.25:3000/`, 
      },
      redirect: 'if_required', // Only redirect if necessary (e.g., for 3D Secure)
    });
  
    console.log("Payment Status");
  
    if (error) {
      setMessage(error.message);
      Swal.fire({
        title: error.message,
        icon: "warning",
        confirmButtonText: "Close",
      }).then(() => {
        setIsLoading(false);
        window.location.href = "http://192.168.1.25:3000/";
      });
    } else {
  
      setPaymentStatus("succeeded");
      Swal.fire({
        title: "Payment Completed",
        icon: "success",
        confirmButtonText: "Close",
      }).then(async() => {
        appointmentDetails.payment_status = 1;
        const token = Cookies.get("patient_token");
        try {
          const response = await axios.post(`${BaseUrl}clinic/submit-appointment/`,appointmentDetails,{
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                  },
                });
          Swal.fire({
                  title: "Success!",
                  html: `
                    <div style="text-align:left">
                      <p style="font-weight:bold color:blue">Your appointment is scheduled for:</p>
                      <p><strong>Name:</strong> ${appointmentDetails.name}</p>
                      <p><strong>Date:</strong> ${dayjs(appointmentDetails.date).format(
                        "DD MMMM YYYY"
                      )}</p>
                      <p><strong>Time:</strong> ${appointmentDetails.time}</p>
                      <p><strong>Location:</strong> ${appointmentDetails.location}</p>
                      <p><strong>Department:</strong> ${appointmentDetails.department}</p>
                      <p><strong>Doctor:</strong> ${appointmentDetails.doctor}</p>
                    </div>`,
                  icon: "success",
                  confirmButtonText: "Done",
                })
        } catch (error) {
          console.error(error);
        }
        
        window.location.href = "http://192.168.1.25:3000/";
      });
    }
  };
  

  
  

  return (
    <>
      <div
        style={{
          padding: "40px",
          margin: "auto",
          marginTop: "100px",
          marginBottom: "100px",
          width: "600px",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          borderRadius: "5px",
        }}
      >
        <form id="payment-form" onSubmit={handleSubmit}>
          <PaymentElement id="payment-element" />
          <button
            className="payButtonStripe flex w-full justify-center items-center mt-4"
            disabled={isLoading || !stripe || !elements}
            id="submit"
          >
            <span
              id="button-text"
              className="p-2 bg-blue-700 hover:bg-blue-600 text-white font-medium rounded-md"
            >
              {isLoading ? (
                <div className="spinner" id="spinner"></div>
              ) : (
                "Pay now"
              )}
            </span>
          </button>
        </form>
      </div>
    </>
  );
};

export default CheckoutForm;

