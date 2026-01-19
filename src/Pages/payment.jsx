import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { CardElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import BaseUrl from "../Api/baseurl";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "../Component/checkout";

const stripePromise = loadStripe("pk_test_51OJr08SHckEzL7TQ6pF3BxJ6Wi0PG3dpfBxFVvQZlCGyIhb6ySP7f5jfJo2klHGKrthrrdvH9bYbTS6CD2hzuHXi00HJ5f1Hy2");

const PaymentPage = () => {
  const [clientSecret, setClientSecret] = useState("");
 
  const location = useLocation();
  const { appointmentDetails } = location.state || {}; 

  const navigate = useNavigate();

  useEffect(() => {
    fetch(BaseUrl + "clinic/PayWithStripe/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: appointmentDetails.amount,
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret)); 
  }, []);

  if (!appointmentDetails) {
    return <div>Error: No appointment details found.</div>;
  }

  // const handleSubmit = async (event, stripe, elements) => {
  //   event.preventDefault();

  //   if (!stripe || !elements) {
  //     return; 
  //   }

  //   setLoading(true);

 
  //   const { error, paymentMethod } = await stripe.createPaymentMethod({
  //     type: "card",
  //     card: elements.getElement(CardElement),
  //   });

  //   if (error) {
  //     console.error(error);
  //     setLoading(false);
  //   } else {
      

  //     const paymentResponse = await fetch('/your-backend-endpoint', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ payment_method_id: paymentMethod.id }),
  //     });

  //     const paymentResult = await paymentResponse.json();
  //     if (paymentResult.success) {
  //       console.log('Payment successful!');
  //     } else {
  //       console.log('Payment failed!');
  //     }
  //     setLoading(false);
  //   }
  // };

  // Appearance settings for Stripe Elements

  const appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm appointmentDetails={appointmentDetails}/>
        </Elements>
      )}

      {!clientSecret && (
        <div className="pleaseWaitStripe">
          <img src="/Images/credit-card.gif" alt="payment" />
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
