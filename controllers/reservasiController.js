const supabase = require('../services/supabaseClient');

// Mendapatkan semua reservasi dengan nama pelanggan
const getAllReservasi = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('reservasi')
            .select(`
                *,
                pelanggan (nama)
            `);
        if (error) throw error;
        
        // const reservasiWithPelanggan = data.map(reservasi => ({
        //     ...reservasi,
        //     nama: reservasi.pelanggan ? reservasi.pelanggan.nama : null
        // }));

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mendapatkan reservasi berdasarkan ID dengan nama pelanggan
const getReservasiById = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('reservasi')
            .select(`
                *,
                pelanggan (nama)
            `)
            .eq('id_reservasi', id)
            .single();
        if (error) throw error;


        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Menambahkan reservasi baru
const addReservasi = async (req, res) => {
    const {
        tanggal_reservasi,
        waktu_reservasi,
        no_meja,
        jumlah_tamu,
        status,
        request,
        id_pelanggan,
    } = req.body;
    try {
        const { data, error } = await supabase
            .from('reservasi')
            .insert([{ tanggal_reservasi, waktu_reservasi, no_meja, jumlah_tamu, status, request, id_pelanggan }])
            .select(`
                *,
                pelanggan (nama)
            `);
        if (error) throw error;


        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Memperbarui reservasi berdasarkan ID
const updateReservasi = async (req, res) => {
    const { id } = req.params;
    const {
        tanggal_reservasi,
        waktu_reservasi,
        no_meja,
        jumlah_tamu,
        status,
        request,
        id_pelanggan,
    } = req.body;
    try {
        const { data, error } = await supabase
            .from('reservasi')
            .update({ tanggal_reservasi, waktu_reservasi, no_meja, jumlah_tamu, status, request, id_pelanggan })
            .eq('id_reservasi', id)
            .select(`
                *,
                pelanggan (nama)
            `);
        if (error) throw error;



        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Menghapus reservasi berdasarkan ID
const deleteReservasi = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('reservasi')
            .delete()
            .eq('id_reservasi', id);
        if (error) throw error;
        res.status(200).json({ message: 'Reservasi deleted successfully', data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllReservasi, getReservasiById, addReservasi, updateReservasi, deleteReservasi };
