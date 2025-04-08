const express = require("express");
const cors = require("cors");
const app = express();
const { User } = require("./models");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      throw { name: "BadRequest", message: "Email is required" };
    }
    if (!password) {
      throw { name: "BadRequest", message: "Password is required" };
    }
    const user = await User.create({ email, password });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    if (err.name === "BadRequest") {
      res.status(400).json({ message: err.message });
    } else if (err.name === "SequelizeUniqueConstraintError") {
      res.status(409).json({ message: "Email already exists" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
