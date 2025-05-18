import { QRCodeSVG } from 'qrcode.react';
import { useState } from "react";

const AdminGenerateQR = () => {
  const [tableNumber, setTableNumber] = useState(1);

  const handleTableChange = (e) => {
    setTableNumber(e.target.value);
  };

  const url = `${window.location.origin}/order?table=${tableNumber}`;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create QR on table</h1>

      <div className="flex items-center gap-4 mb-6">
        <label className="font-semibold">Choose table number:</label>
        <input
          type="number"
          min={1}
          max={50}
          value={tableNumber}
          onChange={handleTableChange}
          className="p-2 border rounded w-24"
        />
      </div>

      <div className="flex flex-col items-center">
        <QRCodeSVG value={url} size={200} />
        <p className="mt-4 text-blue-600">Link test: {url}</p>
      </div>
    </div>
  );
};

export default AdminGenerateQR;
