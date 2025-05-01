import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import React, { useContext, useEffect, useState } from "react";
import * as PaymentService from "../../services/PaymentService";
import { OrderContext } from "../../utils";
import * as Message from '../MessageComponent/MessageComponent';
const PayPalComponent = ({ onSuccess }) => {
  const [clientId, setClientId] = useState("");
  const { totalPrice } = useContext(OrderContext);

  useEffect(() => {
    const fetchConfig = async () => {
      const config = await PaymentService.getConfig();
      const PAYPAL_CLIENT = config.data; 
      setClientId(PAYPAL_CLIENT);
    };
    fetchConfig();
  }, []);
  

  if (!clientId) return <div>Loading PayPal...</div>;

  return (
    <PayPalScriptProvider options={{ "client-id": clientId, currency: "USD" }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: totalPrice.toFixed(2) } }], 
          });
        }}
        onApprove={async (data, actions) => {
          const details = await actions.order.capture();
          Message.toastSuccess("Transaction completed:", details)
          onSuccess?.(); // Gọi callback khi thành công
        }}
        onError={(err) => Message.toastError("PayPal error", err)}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalComponent;
