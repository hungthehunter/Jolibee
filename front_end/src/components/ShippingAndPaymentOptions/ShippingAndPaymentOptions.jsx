import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import PayPalComponent from "../../components/PaypalComponent/PaypalComponent";
import { orderConstant } from "../../utils";

const ShippingAndPaymentOptions = ({
  shippingMethod,
  setShippingMethod,
  paymentMethod,
  setPaymentMethod,
  onPaypalSuccess,
  tableNumber,
  setTableNumber,
}) => {
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);

  const generateTableUrl = (tableNumber) => {
    return `${window.location.origin}/order?table=${tableNumber}`;
  };

  useEffect(() => {
    if (
      shippingMethod === "EAT_IN" &&
      tableNumber &&
      user?.id &&
      order?.orderItems?.length > 0
    ) {
      const key = `order_data_table_${tableNumber}`;
      const orderData = {
        orderItems: order.orderItems,
        shippingAddress: {
          fullname: user.name,
          address: user.address,
          city: user.city,
          country: "Việt Nam",
          phone: user.phone,
        },
        paymentMethod,
        itemPrice: order.itemPrice || 0,
        shippingPrice: order.shippingPrice || 0,
        taxPrice: order.taxPrice || 0,
        totalPrice: order.totalPrice || 0,
        user: user.id,
        isPaid: false,
      };

      localStorage.setItem(key, JSON.stringify({ user, order: orderData }));
      console.log(`Order data saved for table ${tableNumber}:`, orderData);
      console.log(`Order data saved in localStorage with key: ${key}`);
      console.log(`Order data saved in localStorage:`, user);
    }
  }, [tableNumber, shippingMethod, user, order, paymentMethod]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const table = params.get("table");
    if (table) {
      setShippingMethod("EAT_IN");
      setTableNumber(table);
    }
  }, [location, setShippingMethod]);

  return (
    <div className="p-3 mt-3 border rounded bg-blue-50">
      <h5 className="mb-2 font-semibold">Shipping method</h5>

      {/* ...các phương thức giao hàng khác */}
      <label className="flex flex-col mt-2">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="shipping"
            value="EAT_IN"
            checked={shippingMethod === "EAT_IN"}
            onChange={() => setShippingMethod("EAT_IN")}
          />
          <span className="font-bold text-green-600">
            {orderConstant.delivery.eatin}
          </span>
        </div>
        <span className="ml-6 text-sm text-gray-600">
          Order on site (scan QR)
        </span>
      </label>

      {shippingMethod === "EAT_IN" && (
        <div className="mt-2 ml-6">
          <label className="block mb-1 font-medium">Table number:</label>
          <input
            type="number"
            className="p-2 border rounded"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="Enter table number"
            required
          />
          {tableNumber && (
            <div className="mt-4 flex flex-col items-center">
              <QRCodeSVG
                value={generateTableUrl(tableNumber)}
                min={1}
                max={50}
                size={150}
              />
            </div>
          )}
        </div>
      )}

      <h5 className="mt-4 mb-2 font-semibold">Payment method</h5>

      {/* ...chọn payment method như trước */}
      {paymentMethod === "PAYPAL" && (
        <div className="mt-4">
          <PayPalComponent onSuccess={onPaypalSuccess} />
        </div>
      )}
    </div>
  );
};

export default ShippingAndPaymentOptions;
