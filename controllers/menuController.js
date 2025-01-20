const supabase = require('../services/supabaseClient');

// Mendapatkan semua menu dengan nama kategori
const getAllMenus = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('menu')
            .select('*'); // Tidak perlu relasi dengan tabel kategori
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mendapatkan menu berdasarkan ID dengan nama kategori
const getMenuById = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('menu')
            .select('*') // Tidak ada relasi lagi
            .eq('id_menu', id)
            .single();
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Menambahkan menu baru
const addMenu = async (req, res) => {
    const { nama_menu, kategori, harga, tersedia } = req.body; // Menggunakan nama_kategori langsung
    try {
        const { data, error } = await supabase
            .from('menu')
            .insert([{ nama_menu, kategori, harga, tersedia }])
            .select();
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Memperbarui menu berdasarkan ID
const updateMenu = async (req, res) => {
    const { id } = req.params;
    const { nama_menu, kategori, harga, tersedia } = req.body; // Menyertakan nama_kategori
    try {
        const { data, error } = await supabase
            .from('menu')
            .update({ nama_menu, kategori, harga, tersedia })
            .eq('id_menu', id)
            .select();
        if (error) throw error;
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Menghapus menu berdasarkan ID
const deleteMenu = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('menu')
            .delete()
            .eq('id_menu', id);
        if (error) throw error;
        res.status(200).json({ message: 'Menu deleted successfully', data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { getAllMenus, getMenuById, addMenu, updateMenu, deleteMenu };
