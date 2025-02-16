const supabase = require('../services/supabaseClient');

// Mendapatkan semua bahan baku
const getAllBahanBaku = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('bahan_baku')
            .select('*');
        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mendapatkan bahan baku berdasarkan ID
const getBahanBakuById = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('bahan_baku')
            .select('*')
            .eq('id_bahan', id)
            .single();
        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Menambahkan bahan baku baru
const addBahanBaku = async (req, res) => {
    const { nama_bahan, stok, satuan } = req.body;
    try {
        const { data, error } = await supabase
            .from('bahan_baku')
            .insert([{ nama_bahan, stok, satuan, created_at: new Date(), updated_at: new Date() }])
            .select('*');
        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Memperbarui bahan baku berdasarkan ID
const updateBahanBaku = async (req, res) => {
    const { id } = req.params;
    const { nama_bahan, stok, satuan } = req.body;
    try {
        const { data, error } = await supabase
            .from('bahan_baku')
            .update({ nama_bahan, stok, satuan, updated_at: new Date() })
            .eq('id_bahan', id)
            .select('*');
        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Menghapus bahan baku berdasarkan ID
const deleteBahanBaku = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('bahan_baku')
            .delete()
            .eq('id_bahan', id);
        if (error) throw error;

        res.status(200).json({ message: 'Bahan baku deleted successfully'});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllBahanBaku, getBahanBakuById, addBahanBaku, updateBahanBaku, deleteBahanBaku };