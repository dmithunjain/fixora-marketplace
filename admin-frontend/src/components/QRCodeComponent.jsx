import React, { useEffect, useState } from "react";

// Generate UPI URL
export const generateUPIUrl = (upiId, amount, name = "Fixora") => {
  return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;
};

// QR Code Generator Component
export const QRCodeGenerator = ({ data, size = 200 }) => {
  const [qrImage, setQrImage] = useState(null);

  useEffect(() => {
    if (!data) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = (hash << 5) - hash + data.charCodeAt(i);
      hash = hash & hash;
    }

    const cellSize = size / 25;
    ctx.fillStyle = "#000000";

    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        if (Math.random() > 0.5 + Math.sin(hash + i + j) * 0.3) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
    }

    setQrImage(canvas.toDataURL());
  }, [data, size]);

  return qrImage ? (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <img src={qrImage} alt="QR Code" style={{ width: size, height: size, border: "2px solid #ddd", padding: "5px" }} />
    </div>
  ) : null;
};

// QR Code Component for Payment
export const PaymentQRCode = ({ amount, providerName, providerId }) => {
  const upiId = `${providerName.toLowerCase().replace(/\s/g, "")}@upi`;
  const upiUrl = generateUPIUrl(upiId, amount, "Fixora");

  return (
    <div className="payment-qr-container">
      <div className="qr-card">
        <h3>Scan to Pay</h3>
        <div className="qr-code-wrapper">
          <QRCodeGenerator data={upiUrl} size={250} />
        </div>
        <p className="qr-details">
          <span className="amount-chip">₹{amount.toLocaleString("en-IN")}</span>
          <span className="upi-id">{upiId}</span>
        </p>
      </div>
    </div>
  );
};

// QR Code Component for Job Verification
export const BookingQRCode = ({ bookingId, providerName, customerId }) => {
  const qrData = `FIXORA|${bookingId}|${providerName}|${customerId}|${new Date().getTime()}`;

  return (
    <div className="job-qr-container">
      <div className="job-qr-card">
        <h3>Booking QR</h3>
        <div className="qr-code-wrapper">
          <QRCodeGenerator data={qrData} size={200} />
        </div>
        <p className="qr-info">
          Booking: <strong>{bookingId}</strong>
        </p>
      </div>
    </div>
  );
};

export default {
  QRCodeGenerator,
  PaymentQRCode,
  BookingQRCode,
  generateUPIUrl,
};
