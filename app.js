const dotenv = require("dotenv");
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const authMiddleware = require("./Controllers/UserHandling/JWTAuth")

const userRoutes = require("./Routes/UserRoutes");

const express = require("express");

const app = express();

dotenv.config(); 

const URI = process.env.MONGO_URI;

//Establishing Mongoose Connection
mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use(cors());
app.use(express.json());
app.use(mongoSanitize());

app.use("/users", userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
