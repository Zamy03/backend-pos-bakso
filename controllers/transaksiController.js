require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Get All transaksi
const getAllTransaksi = async (req, res) => {
    try{
        const { data, error } = await supabase
            .from ('transaksi')
            .select('*');
        
        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'error fetching transaksi', error: error.message })
    }
}

const { v4: uuidv4 } = require('uuid'); // Untuk generate transaksi_id unik

const createBatchTransaksi = async (req, res) => {
    const { id_pelanggan, items } = req.body; // `items` adalah daftar menu dengan jumlah barang
    const id_user = req.user?.id; // Pastikan `req.user` ada

    // Validasi input
    if (!id_pelanggan || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Invalid input, items should be a non-empty array' });
    }

    try {
        // Periksa apakah pelanggan ada
        const { data: pelanggan, error: errorPelanggan } = await supabase
            .from('pelanggan')
            .select('*')
            .eq('id', id_pelanggan)
            .single();

        if (errorPelanggan || !pelanggan) {
            return res.status(404).json({ message: 'Pelanggan not found' });
        }

        // Ambil semua ID menu dari items
        const menuIds = items.map(item => item.id_menu);

        // Periksa semua menu yang diperlukan
        const { data: menus, error: errorMenus } = await supabase
            .from('menu')
            .select('id_menu, nama_menu, harga')
            .in('id_menu', menuIds);

        if (errorMenus) {
            return res.status(500).json({ message: 'Error fetching menus', error: errorMenus.message });
        }

        // Temukan menu yang tidak ada
        const missingMenus = menuIds.filter(
            id_menu => !menus.some(menu => menu.id_menu === id_menu)
        );

        if (missingMenus.length > 0) {
            return res.status(404).json({
                message: 'Some menus were not found',
                missingMenus,
            });
        }

        // Inisialisasi transaksi batch
        const transaksiData = items.map(item => {
            const menu = menus.find(menu => menu.id_menu === item.id_menu);
            const gross_amount = item.jumlah * menu.harga;

            return {
                transaksi_id: uuidv4(), // Generate ID unik untuk setiap transaksi
                id_pelanggan,
                id_menu: menu.id_menu,
                nama_menu: menu.nama_menu,
                jumlah: item.jumlah,
                gross_amount,
                id_user,
            };
        });

        // Insert semua transaksi sekaligus
        const { data, error } = await supabase
            .from('transactions')
            .insert(transaksiData)
            .select(); // Mengembalikan data transaksi yang baru dibuat

        if (error) {
            throw error;
        }

        // Hitung total gross_amount keseluruhan transaksi
        const total_gross_amount = transaksiData.reduce(
            (total, item) => total + item.gross_amount,
            0
        );

        return res.status(201).json({
            message: 'Batch transaction created successfully',
            total_gross_amount,
            data,
        });
    } catch (error) {
        console.error(error); // Logging untuk debug
        return res.status(500).json({
            message: 'Error creating batch transaction',
            error: error.message || 'Unknown error',
        });
    }
};


module.exports = { getAllTransaksi, createBatchTransaksi };