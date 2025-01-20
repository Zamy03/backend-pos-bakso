const supabase = require("../services/supabaseClient");
const bcrypt = require("bcrypt");

const getpg = async (req, res) => {
    try {
      // Ambil seluruh data pengguna dari tabel users
      const { data, error } = await supabase
        .from("users")
        .select("*");  // Ambil semua kolom (fields) di tabel users
  
      // Handle error jika ada
      if (error) {
        return res.status(400).json({ message: "Failed to retrieve users", error });
      }
  
      // Jika tidak ada data pengguna
      if (data.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }
  
      // Response sukses dengan data pengguna
      res.status(200).json({ message: "Users retrieved successfully", data });
    } catch (err) {
      // Handle error lainnya
      res.status(500).json({ message: "Internal server error", error: err.message });
    }
  };

//get pegawai by id
const getpgById = async (req, res) => {
    const { id } = req.params;  // Ambil ID dari parameter URL

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq('id', id)
        .single();  // Mengambil satu data saja

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User retrieved successfully', data });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
};

const addpg = async (req, res) => {
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

  const editpg = async (req, res) => {
    const { id } = req.params;  // Ambil ID dari parameter URL
    const { nama, no_hp, email, password, role } = req.body;  // Ambil data dari body
  
    // Validasi input
    if (!nama && !no_hp && !email && !password && !role) {
      return res.status(400).json({ message: "At least one field is required to update" });
    }
  
    try {
      // Jika password diberikan, hash password baru
      let hashedPassword = password;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }
  
      // Update data di tabel users
      const { data, error } = await supabase
        .from("users")
        .update({
          nama,
          no_hp,
          email,
          password: hashedPassword,
          role,
        })
        .eq('id', id);  // Menentukan ID user yang akan diperbarui
  
      // Handle error
      if (error) {
        return res.status(400).json({ message: "Update failed", error });
      }
  
      // Response sukses
    //   if (data.length === 0) {
    //     return res.status(404).json({ message: "User not found" });
    //   }
  
      res.status(200).json({ message: "User updated successfully", data });
    } catch (err) {
      // Handle error lainnya
      res.status(500).json({ message: "Internal server error", error: err.message });
    }
  };

  const deletepg = async (req, res) => {
    const { id } = req.params;  // Ambil ID dari parameter URL
  
    try {
      // Hapus user berdasarkan ID
      const { data, error } = await supabase
        .from("users")
        .delete()
        .eq('id', id);  // Menentukan ID user yang akan dihapus
  
      // Handle error
      if (error) {
        return res.status(400).json({ message: "Delete failed", error });
      }
  
      // Response sukses
    //   if (data.length === 0) {
    //     return res.status(404).json({ message: "User not found" });
    //   }
  
      res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      // Handle error lainnya
      res.status(500).json({ message: "Internal server error", error: err.message });
    }
  };
  
  module.exports = { getpg, addpg, editpg, deletepg };