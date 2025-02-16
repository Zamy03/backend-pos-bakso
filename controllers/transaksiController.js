require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Get All transaksi
const getAllTransaksi = async (req, res) => {
    try{
        const { data, error } = await supabase
            .from ('transactions')
            .select('*');
        
        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'error fetching transaksi', error: error.message })
    }
}

const { v4: uuidv4 } = require('uuid'); // Untuk generate transaksi_id unik


const createTransaksi = async (req, res) => {
    try {
        console.log("Incoming request:", req.body);

        // Ambil token dari header
        const token = req.headers.authorization;
        if (!token) {
            console.log("Token missing!");
            return res.status(401).json({ message: 'Unauthorized, token is required' });
        }

        // Verifikasi token dan dapatkan id_user
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        
        const id_user = decoded.id;
        if (!id_user) {
            console.log("Token does not contain id_user");
            return res.status(401).json({ message: 'Unauthorized, invalid token' });
        }

        // Ambil data transaksi dari body request
        const { id_menu, jumlah } = req.body;

        // Validasi input
        if (!id_menu || !jumlah || typeof jumlah !== 'number' || jumlah <= 0) {
            console.log("Invalid input:", req.body);
            return res.status(400).json({ message: 'Invalid input, id_menu and jumlah are required, and jumlah must be a positive number' });
        }

        console.log("Fetching menu for id_menu:", id_menu);

        // Ambil informasi menu dari database
        const { data: menu, error: errorMenu } = await supabase
            .from('menu')
            .select('id_menu, nama_menu, harga')
            .eq('id_menu', id_menu)
            .single();

        if (errorMenu) {
            console.error("Error fetching menu:", errorMenu);
            return res.status(500).json({ message: 'Error fetching menu', error: errorMenu.message });
        }

        if (!menu) {
            console.log("Menu not found for id_menu:", id_menu);
            return res.status(404).json({ message: 'Menu not found' });
        }

        console.log("Menu found:", menu);

        // Hitung total harga
        const total_harga = jumlah * menu.harga;

        // Buat data transaksi
        const transaksiData = {
            transaksi_id: uuidv4(),
            id_menu: menu.id_menu,
            nama_menu: menu.nama_menu,
            jumlah,
            total_harga,
            id_user,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        console.log("Inserting transaction:", transaksiData);

        // Masukkan data transaksi ke dalam tabel `transaksi`
        const { data, error } = await supabase
            .from('transactions')
            .insert([transaksiData]);

        if (error) {
            console.error("Supabase Insert Error:", error);
            return res.status(500).json({ message: 'Error inserting transaction', error: error.message });
        }

        console.log("Transaction successfully created:", transaksiData);

        return res.status(201).json({
            message: 'Transaction created successfully',
            transaksi: transaksiData,
        });
    } catch (error) {
        console.error("Error Detail:", error);
        return res.status(500).json({ message: 'Error creating transaction', error: error.message || error });
    }
};



module.exports = { getAllTransaksi, createTransaksi };