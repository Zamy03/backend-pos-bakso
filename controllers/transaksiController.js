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

// Get by ID

// Create transaksi
const createTransaksi = async (req, res) => {
    const { id_pelanggan, id_menu, jumlah, gross_amount } = req.body;
    const id_user = req.user?.id; // Pastikan req.user ada

    // Validasi input
    if (!id_pelanggan || !id_menu || !jumlah || !gross_amount) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    if (isNaN(jumlah) || isNaN(gross_amount)) {
        return res.status(400).json({ message: 'Jumlah and gross_amount must be numbers' });
    }

    try {
        // Ambil data pelanggan
        const { data: pelanggan, error: errorPelanggan } = await supabase
            .from('pelanggan')
            .select('*')
            .eq('id', id_pelanggan)
            .single();

        if (errorPelanggan || !pelanggan) {
            return res.status(404).json({ message: 'Pelanggan not found' });
        }

        // Ambil data menu
        const { data: menu, error: errorMenu } = await supabase
            .from('menu')
            .select('*')
            .eq('id', id_menu)
            .single();

        if (errorMenu || !menu) {
            return res.status(404).json({ message: 'Menu not found' });
        }

        // Ambil data user
        const { data: user, error: errorUser } = await supabase
            .from('users')
            .select('*')
            .eq('id', id_user)
            .single();

        if (errorUser || !user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const id_transaksi = `TX-${nanoid(4)}-TX-${nanoid(8)}`;

        // Masukkan transaksi dengan nama_menu dari tabel menu
        const { data, error } = await supabase
            .from('transactions')
            .insert([
                {
                    id_transaksi,
                    id_pelanggan,
                    id_menu,
                    nama_menu: menu.nama_menu, // Mengambil nama_menu dari tabel menu
                    jumlah,
                    gross_amount,
                    id_user,
                },
            ])
            .select(); // Mengembalikan data transaksi yang baru dibuat

        if (error) {
            throw error;
        }

        return res.status(201).json({ message: 'Transaction created successfully', data });
    } catch (error) {
        console.error(error); // Logging untuk debug
        return res.status(500).json({
            message: 'Error creating transaction',
            error: error.message || 'Unknown error',
        });
    }
};


