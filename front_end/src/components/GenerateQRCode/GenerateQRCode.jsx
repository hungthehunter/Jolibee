import { QRCode } from 'qrcode.react';

const GenerateQRCode = ({ tableNumber }) => {
  const url = `https://yourdomain.com/order?table=${tableNumber}`;
  return <QRCode value={url} size={200} />;
};

export default GenerateQRCode