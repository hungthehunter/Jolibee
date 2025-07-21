const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();

const app = express();
// const server = require("http").createServer(app);
const port = process.env.PORT || 3001;

// MIDDLEWARE setup
app.use(cors({
  origin: ["http://localhost:3000", "https://fantastyburger.vercel.app"],
  credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

// ROUTES
app.get("/", (req, res) => res.send("Hello World"));
routes(app);

// MONGODB connect
mongoose.connect(process.env.MONGO_DB)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Bắt đầu server Express + Socket.IO cùng cổng
app.listen(port, () => {
  console.log(`🚀 Server (Express + Socket.IO) running at http://localhost:${port}`);
});
