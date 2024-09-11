const db = require('../config/database');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

// Ekstensi dayjs dengan plugin
dayjs.extend(utc);
dayjs.extend(timezone);
    
const userController = {
    getUser: async (request, h) => {
        try {
          const [rows] = await db.query('SELECT id, name, email, password, asal_instansi, image, role, is_active, created_at, updated_at FROM users');
          return h.response({ success: true, data: rows, message: 'data received successfully' }).code(200);
        } catch (error) {
          console.error(error);
          return h.response({ success: false, message: 'Failed to retrieve user data.' }).code(500);
        }
    },
    createUser: async (request, h) => {
        try {
            const {
                nama, email, password, asal_instansi, image, role, is_active
            } = request.payload;

            // Validasi input
            if (!email || !password) {
                return h.response({
                    status: 'fail',
                    message: 'Please provide email, and password.'
                }).code(400);
            }

            // Format waktu dalam zona waktu WIB (Jakarta)
            const createdAt = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
            const updatedAt = createdAt;

            // Query SQL untuk menambahkan data ke tabel users
            const query = `
                INSERT INTO users (nama, email, password, asal_instansi, image,role, is_active, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            // Menjalankan query dengan data dari payload
            const [result] = await db.query(query, [nama, email, password, asal_instansi, image, role, is_active, createdAt, updatedAt]);

            // Response jika berhasil menambahkan data
            return h.response({
                success: true,
                data: {
                    id: result.insertId,
                    nama,
                    email,
                    asal_instansi,
                    image,
                    role,
                    is_active,
                    created_at: createdAt,
                    updated_at: updatedAt
                },
                message: 'User data successfully added.',
            }).code(201);
        } catch (error) {
            console.error('Error adding user data:', error);
            return h.response({ status: 'fail', message: 'Failed to add user data.' }).code(500);
        }
    },
    updateUser: async (request, h) => {
        try {
            const { id } = request.params;  // Mendapatkan ID dari parameter URL
            const {
                nama, email, password, asal_instansi, image, role, is_active
            } = request.payload;
    
            // Validasi input
            if (!email || !password) {
                return h.response({
                    status: 'fail',
                    message: 'Please provide email and password.'
                }).code(400);
            }
    
            // Format waktu untuk zona waktu WIB (Jakarta)
            const updatedAt = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    
            // Query SQL untuk memperbarui data di tabel users
            const query = `
                UPDATE users
                SET nama = ?, email = ?, password = ?, asal_instansi = ?, image = ?, role = ?, is_active = ?, updated_at = ?
                WHERE id = ?
            `;
    
            // Menjalankan query dengan data dari payload dan ID
            const [result] = await db.query(query, [nama, email, password, asal_instansi, image, role, is_active, updatedAt, id]);
    
            if (result.affectedRows === 0) {
                return h.response({ status: 'fail', message: 'User not found.' }).code(404);
            }
    
            // Response jika berhasil memperbarui data
            return h.response({
                success: true,
                data: {
                    id,
                    nama,
                    email,
                    asal_instansi,
                    image,
                    role,
                    is_active,
                    updated_at: updatedAt
                },
                message: 'User data successfully updated.',
            }).code(200);
        } catch (error) {
            console.error('Error updating user data:', error);
            return h.response({ status: 'fail', message: 'Failed to update user data.' }).code(500);
        }
    },
    deleteUser: async (request, h) => {
        try {
            const { id } = request.params;  // Mendapatkan ID dari parameter URL
    
            // Query SQL untuk menghapus data di tabel users
            const query = `
                DELETE FROM users
                WHERE id = ?
            `;
    
            // Menjalankan query dengan ID dari parameter
            const [result] = await db.query(query, [id]);
    
            // Jika tidak ada data yang dihapus (ID tidak ditemukan)
            if (result.affectedRows === 0) {
                return h.response({ status: 'fail', message: 'User not found.' }).code(404);
            }
    
            // Response jika berhasil menghapus data
            return h.response({
                success: true,
                message: 'User data successfully deleted.',
            }).code(200);
        } catch (error) {
            console.error('Error deleting user data:', error);
            return h.response({ status: 'fail', message: 'Failed to delete user data.' }).code(500);
        }
    }, 
}

module.exports = userController;
