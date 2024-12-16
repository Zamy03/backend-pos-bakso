const supabase = require("../services/supabaseClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Register user
const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([{ email, password: hashedPassword }]);

  if (error) {
    return res.status(400).json({ message: "Registration failed", error });
  }

  res.status(201).json({ message: "User registered successfully" });
};

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .filter("email", "eq", email)
    .limit(1);

  if (error || users.length === 0) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const user = users[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(200).json({ message: "Login successful", token });
};

// Protected route
const protectedRoute = (req, res) => {
  res.status(200).json({ message: "Access granted", user: req.user });
};

module.exports = { register, login, protectedRoute };
