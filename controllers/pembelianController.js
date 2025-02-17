const supabase = require('../services/supabaseClient');

// Mendapatkan semua pembelian bahan baku
const getAllPembelianBahanBaku = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('pembelian_bahan_baku')
            .select('*, bahan_baku (nama_bahan)');
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
            .select('*, bahan_baku (nama_bahan)')
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
        // Menambahkan pembelian bahan baku
        const { data, error } = await supabase
            .from('pembelian_bahan_baku')
            .insert([{ jumlah, satuan, harga_total, nama_supplier, tanggal_pembelian, id_bahan }])
            .select('*');
        if (error) throw error;

        // Mendapatkan stok saat ini
        const { data: bahan, error: fetchError } = await supabase
            .from('bahan_baku')
            .select('stok')
            .eq('id_bahan', id_bahan)
            .single();
        if (fetchError) throw fetchError;

        // Menambahkan stok baru
        const stokBaru = bahan.stok + jumlah;

        // Update stok bahan baku
        const { error: updateError } = await supabase
            .from('bahan_baku')
            .update({ stok: stokBaru })
            .eq('id_bahan', id_bahan);
        if (updateError) throw updateError;

        res.status(201).json(data);
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

module.exports = { getAllPembelianBahanBaku, getPembelianBahanBakuById, addPembelianBahanBaku, deletePembelianBahanBaku };
