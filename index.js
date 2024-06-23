const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Validator = require("validatorjs");
const config = require("./config");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const PORT = 4000;

require("dotenv").config();
let tokenSecret = process.env.JWT_SECRET || "jwtSecret";

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    tlsAllowInvalidCertificates: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
    process.exit(1);
  });

const userSchema = new mongoose.Schema({
  id: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  mobile: { type: String, unique: true },
  password: String,
});

const ratingSchema = new mongoose.Schema({
  breweryId: String,
  rating: [
    {
      userId: String,
      stars: { type: Number, min: 1, max: 5 },
      description: String,
    },
  ],
});

const User = mongoose.model("User", userSchema);
const Rating = mongoose.model("Rating", ratingSchema);

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) return res.status(403).send("No token provided");

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, tokenSecret, (err, decoded) => {
    if (err) return res.status(500).send("Failed to authenticate token");
    req.userId = decoded.id;
    next();
  });
};

app.post("/register", async (req, res) => {
  const validation = new Validator(req.body, {
    username: "required",
    email: "required|email",
    mobile: "required|min:10|max:10",
    password: "required|min:6",
  });
  if (validation.fails()) {
    return res.status(400).send(Object.values(validation.errors.all())[0][0]);
  }

  const { username, email, mobile, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = uuid.v4();

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(401).send("Username is already taken");
  }

  const existingUserEmail = await User.findOne({ email });
  const existingUserMobile = await User.findOne({ mobile });
  if (existingUserEmail || existingUserMobile) {
    return res.status(401).send("User email or mobile already exists");
  }

  const newUser = new User({
    id,
    username,
    email,
    mobile,
    password: hashedPassword,
  });
  newUser
    .save()
    .then((user) =>
      res.status(200).json({
        userId: user.id,
        username: user.username,
        id: user._id.toString(),
      })
    )
    .catch((err) => res.status(500).send("Error registering"));
});

app.post("/login", async (req, res) => {
  const validation = new Validator(req.body, {
    username: "required",
    password: "required",
  });
  if (validation.fails()) {
    return res.status(400).send(Object.values(validation.errors.all())[0][0]);
  }

  const { username, password } = req.body;
  User.findOne({ username })
    .then(async (user) => {
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send("Invalid username or password");
      }

      const token = jwt.sign({ id: user._id }, tokenSecret, {
        expiresIn: 86400,
      });
      res.status(200).json({
        userId: user.id,
        username: user.username,
        id: user._id.toString(),
        token,
      });
    })
    .catch((err) => res.status(500).send("Error logging in"));
});

app.get("/search", async (req, res) => {
  const validation = new Validator(req.query, {
    type: "required|in:by_city,by_name,by_type",
    query: "required",
  });
  if (validation.fails()) {
    return res.status(400).send(Object.values(validation.errors.all())[0][0]);
  }

  const { type, query } = req.query;
  try {
    try {
      const { data } = await axios.get(
        `https://api.openbrewerydb.org/v1/breweries?${type}=${query}`
      );

      return res.json(data);
    } catch (error) {
      return res.status(401).send(error.response.data.errors[0]);
    }
  } catch (error) {
    return res.status(500).send("Internal error");
  }
});

app.get("/brewery/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(
      `https://api.openbrewerydb.org/breweries/${id}`
    );
    const reviews = await Rating.findOne({ breweryId: id });
    return res.json({
      ...response.data,
      reviews: reviews ? reviews.rating : [],
    });
  } catch (error) {
    return res.status(500).send("Error fetching brewery details");
  }
});

app.post("/brewery/:id/review", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { stars, description } = req.body;
  const userId = req.userId;
  try {
    let breweryRating = await Rating.findOne({ breweryId: id });
    if (!breweryRating) {
      breweryRating = new Rating({ breweryId: id, rating: [] });
    }
    breweryRating.rating.push({ userId, stars, description });
    await breweryRating.save();
    return res.status(200).send("Review added successfully");
  } catch (error) {
    return res.status(500).send("Error adding review");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
