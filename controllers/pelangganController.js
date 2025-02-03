require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Get All Pelanggan
const getAllPelanggan = async (req, res) => {
    try{
        const { data, error } = await supabase
            .from ('pelanggan')
            .select('*');
        
        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'error fetching pelanggan', error: error.message })
    }
}

// Get by ID

const getPelangganById = async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('pelanggan')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        if (!data) return res.status(404).json({ message: 'pelanggan not found' });

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pelanggan by ID', error: error.message });
    }
};


// create pelanggan
const createPelanggan = async (req, res) => {
    const { nama, no_hp, alamat } = req.body;

    // Validasi: Pastikan semua field diisi
    if (!nama || !no_hp || !alamat) {
        return res.status(400).json({ message: 'All fields (nama, no_hp, alamat) are required' });
    }

    // Validasi: Pastikan nama hanya mengandung huruf dan spasi
    const isValidNama = /^[A-Za-z\s]+$/.test(nama);
    if (!isValidNama) {
        return res.status(400).json({
            message: 'Nama must only contain letters and spaces',
        });
    }

    // Validasi: Pastikan no_hp hanya berupa angka dan memiliki panjang minimal 10 digit
    const isValidNoHp = /^[0-9]{10,}$/.test(no_hp);
    if (!isValidNoHp) {
        return res.status(400).json({
            message: 'No_hp must be a valid number with at least 10 digits',
        });
    }

    try {
        // Cek apakah pelanggan dengan nama dan no_hp yang sama sudah ada
        const { data: existingPelanggan, error: fetchError } = await supabase
            .from('pelanggan')
            .select('*')
            .eq('nama', nama)
            .eq('no_hp', no_hp);

        if (fetchError) throw fetchError;

        if (existingPelanggan.length > 0) {
            return res.status(409).json({ message: 'Pelanggan already exists' });
        }

        // Insert pelanggan baru
        const { data, error } = await supabase
            .from('pelanggan')
            .insert([{ nama, no_hp, alamat }]);

        if (error) throw error;

        res.status(201).json({ message: 'Pelanggan created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating pelanggan', error: error.message });
    }
};

const updatePelanggan = async (req, res) => {
    const { id } = req.params; // ID pelanggan yang akan diupdate
    const { nama, no_hp, alamat } = req.body; // Data pelanggan yang akan diperbarui

    // Validasi input
    if (!nama || !no_hp || !alamat) {
        return res.status(400).json({
            message: 'nama, no_hp, dan alamat are required',
        });
    }

    try {
        // Update data pelanggan di tabel 'pelanggan'
        const { data, error } = await supabase
            .from('pelanggan') // Nama tabel
            .update({ nama, no_hp, alamat }) // Data yang akan diupdate
            .eq('id', id) // ID pelanggan untuk dicocokkan
            .select(); // Ambil data yang diupdate

        if (error) throw error; // Tangani error dari Supabase

        // Jika data tidak ditemukan, kembalikan status 404
        if (!data.length) {
            return res.status(404).json({
                message: 'Pelanggan not found',
            });
        }

        // Jika berhasil, kembalikan respons sukses
        res.status(200).json({
            message: 'Pelanggan updated successfully',
            data,
        });
    } catch (error) {
        // Tangani error umum lainnya
        res.status(500).json({
            message: 'Error updating pelanggan',
            error: error.message,
        });
    }
};

const deletePelanggan = async (req, res) => {
    const { id } = req.params;

    try {
        // Hapus data pelanggan dari tabel 'pelanggan'
        const { data, error } = await supabase
            .from('pelanggan') // Nama tabel
            .delete() // Hapus data
            .eq('id', id) // ID pelanggan yang akan dihapus
            .select(); // Ambil data yang dihapus

        if (error) throw error; // Tangani error dari Supabase

        // Jika data tidak ditemukan, kembalikan status 404
        if (!data.length) {
            return res.status(404).json({
                message: 'Pelanggan not found',
            });
        }

        // Jika berhasil, kembalikan respons sukses
        res.status(200).json({
            message: 'Pelanggan deleted successfully',
            data,
        });
    } catch (error) {
        // Tangani error umum lainnya
        res.status(500).json({
            message: 'Error deleting pelanggan',
            error: error.message,
        });
    }
};

module.exports = { getAllPelanggan, createPelanggan, getPelangganById, updatePelanggan, deletePelanggan }