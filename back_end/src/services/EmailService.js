const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config()

const sendEmailCreateOrder = async(email,orderItems)=>{
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.MAIL_ACCOUNT,
    pass: process.env.MAIL_PASSWORD,
  },
});

let listItem=''
const attachImage = []
orderItems.forEach((order)=>{
  listItem += `<div>
<div> bạn đặt sản phẩm ${order.name} thành công với số lượng: <b>${order.amount}</b> và giá trị là <b>${order.price}VND</b> </div>
<div><img src=${order.image} alt='sản phẩm'/></div>
  </div>
  `
  attachImage.push({path: order.image})
})

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT, // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<b>Hello world?</b>${orderItems}`, // html body
 attachments: attachImage,
  });

}





module.exports =({
    sendEmailCreateOrder
})