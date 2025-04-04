const express = require('express');
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
const routes = require('./routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
dotenv.config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.send('Hello World');
})



routes(app);

// Connect to MongoDB
mongoose.connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Failed to connect to MongoDB',err);
  });

  

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})