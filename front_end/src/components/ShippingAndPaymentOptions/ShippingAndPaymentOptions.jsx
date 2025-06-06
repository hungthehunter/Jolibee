import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PayPalComponent from "../../components/PaypalComponent/PaypalComponent";
import orderContent from "../../contant/orderContent";
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

const generateTableUrl = (tableNumber) => {
  return `${window.location.origin}/order?table=${tableNumber}`;
};

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const table = params.get('table');
    if (table) {
      setShippingMethod("EAT_IN");
      setTableNumber(table);
    }
  }, [location, setShippingMethod]);

  return (
    <div className="p-3 mt-3 border rounded bg-blue-50">
      <h5 className="mb-2 font-semibold">Shipping method</h5>

      <label className="flex flex-col mt-2">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="shipping"
            value="GO_JEK"
            checked={shippingMethod === "GO_JEK"}
            onChange={() => setShippingMethod("GO_JEK")}
          />
          <span className="font-bold text-orange-500">{orderContent.delivery.gojeck}</span>
        </div>
        <span className="ml-6 text-sm text-gray-600">Economical Delivery</span>
      </label>

      <label className="flex flex-col mt-2">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="shipping"
            value="FAST"
            checked={shippingMethod === "FAST"}
            onChange={() => setShippingMethod("FAST")}
          />
          <span className="font-bold text-blue-600">{orderContent.delivery.fast}</span>
        </div>
        <span className="ml-6 text-sm text-gray-600">Fast Delivery</span>
      </label>

      {/* Phần mới: ăn tại bàn */}
      <label className="flex flex-col mt-2">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="shipping"
            value="EAT_IN"
            checked={shippingMethod === "EAT_IN"}
            onChange={() => setShippingMethod("EAT_IN")}
          />
          <span className="font-bold text-green-600">{orderContent.delivery.eatin}</span>
        </div>
        <span className="ml-6 text-sm text-gray-600">Order on site (scan QR)</span>
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
          {/* Nếu đã nhập số bàn thì hiện QR luôn */}
          {tableNumber && (
            <div className="mt-4 flex flex-col items-center">
              <QRCodeSVG value={generateTableUrl(tableNumber)} min={1} max={50} size={150} />
            </div>
          )}
        </div>
      )}

      <h5 className="mt-4 mb-2 font-semibold">Payment method</h5>

      <label className="block mb-2">
        <input
          type="radio"
          name="payment"
          value="CASH"
          checked={paymentMethod === "CASH"}
          onChange={() => setPaymentMethod("CASH")}
        />
        <span className="ml-2">Cash on delivery</span>
      </label>

      <label className="block mb-2">
        <input
          type="radio"
          name="payment"
          value="PAYPAL"
          checked={paymentMethod === "PAYPAL"}
          onChange={() => setPaymentMethod("PAYPAL")}
        />
        <span className="ml-2">Cash on PayPal</span>
      </label>

      {paymentMethod === "PAYPAL" && (
        <div className="mt-4">
          <PayPalComponent onSuccess={onPaypalSuccess}  />
        </div>
      )}
    </div>
  );
};

export default ShippingAndPaymentOptions;
