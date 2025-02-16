const supabase = require('../services/supabaseClient');

// Mendapatkan semua pembelian bahan baku
const getAllPembelianBahanBaku = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('pembelian_bahan_baku')
            .select('*');
        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mendapatkan pembelian bahan baku berdasarkan ID
const getPembelianBahanBakuById = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('pembelian_bahan_baku')
            .select('*')
            .eq('id_pembelian_bahan_baku', id)
            .single();
        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Menambahkan pembelian bahan baku baru
const addPembelianBahanBaku = async (req, res) => {
    const { jumlah, satuan, harga_total, nama_supplier, tanggal_pembelian, id_bahan } = req.body;
    try {
        const { data, error } = await supabase
            .from('pembelian_bahan_baku')
            .insert([{ jumlah, satuan, harga_total, nama_supplier, tanggal_pembelian, id_bahan }])
            .select('*');
        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Memperbarui pembelian bahan baku berdasarkan ID
const updatePembelianBahanBaku = async (req, res) => {
    const { id } = req.params;
    const { jumlah, satuan, harga_total, nama_supplier, tanggal_pembelian, id_bahan } = req.body;
    try {
        const { data, error } = await supabase
            .from('pembelian_bahan_baku')
            .update({ jumlah, satuan, harga_total, nama_supplier, tanggal_pembelian, id_bahan })
            .eq('id_pembelian_bahan_baku', id)
            .select('*');
        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Menghapus pembelian bahan baku berdasarkan ID
const deletePembelianBahanBaku = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('pembelian_bahan_baku')
            .delete()
            .eq('id_pembelian_bahan_baku', id);
        if (error) throw error;

        res.status(200).json({ message: 'Pembelian bahan baku deleted successfully'});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllPembelianBahanBaku, getPembelianBahanBakuById, addPembelianBahanBaku, updatePembelianBahanBaku, deletePembelianBahanBaku };
