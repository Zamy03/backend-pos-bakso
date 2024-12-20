const supabase = require("../services/supabaseClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Register user
const register = async (req, res) => {
  const { nama, no_hp, email, password, role } = req.body;

  // Validasi input
  if (!nama || !no_hp || !email || !password) {
    return res.status(400).json({ message: "Fields nama, no_hp, email, and password are required" });
  }

  // Tetapkan default role menjadi 'pelanggan' jika tidak diberikan
  const userRole = role || "kasir";

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert data ke tabel users
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          nama,
          no_hp,
          email,
          password: hashedPassword,
          role: userRole,
        },
      ]);

    // Handle error
    if (error) {
      return res.status(400).json({ message: "Registration failed", error });
    }

    // Response sukses
    res.status(201).json({ message: "User registered successfully", data });
  } catch (err) {
    // Handle error lainnya
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email) // Gunakan eq untuk kondisi
      .limit(1)
      .single(); // Ambil satu user langsung

    if (error || !users) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, users.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: users.id, email: users.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// Protected route
const protectedRoute = (req, res) => {
  res.status(200).json({ message: "Access granted", user: req.user });
};

module.exports = { register, login, protectedRoute };
