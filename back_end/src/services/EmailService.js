const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();

const sendEmailCreateOrder = async (email, orderItems) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let listItem = '';
  const attachImage = [];
  orderItems.forEach((order) => {
    listItem += `<div>
                  <div> Bạn đặt sản phẩm ${order.name} thành công với số lượng: <b>${order.amount}</b> và giá trị là <b>${order.price} VND</b> </div>
                  <div><img src=${order.image} alt='sản phẩm'/></div>
                </div>`;
    attachImage.push({ filename: `${order.name}.jpg`, path: order.image });
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_ACCOUNT, 
      to: 'quynhnhule0905@gmail.com',
      subject: "Order Confirmation", // Subject line
      text: "Thank you for your order!", // plain text body
      html: `<b>Thank you for your order!</b><br><div>${listItem}</div>`, // html body
      attachments: attachImage, // Attach images
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

module.exports = {
  sendEmailCreateOrder
};
