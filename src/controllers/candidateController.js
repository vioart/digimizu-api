const db = require('../config/database');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

// Ekstensi dayjs dengan plugin
dayjs.extend(utc);
dayjs.extend(timezone);
    
const candidateController = {
    getProspectiveApprentice: async (request, h) => {
        try {
          const [rows] = await db.query('SELECT id, name, email, password, asal_instansi, image, test_score, test_date, created_at, updated_at FROM calon-magang');
          return h.response({ success: true, data: rows, message: 'data received successfully' }).code(200);
        } catch (error) {
          console.error(error);
          return h.response({ success: false, message: 'Failed to retrieve Prospective Apprentice data.' }).code(500);
        }
    },
    createProspectiveApprentice: async (request, h) => {
        try {
            const {
                nama, email, password, asal_instansi, image, test_score
            } = request.payload;

            // Validasi input
            if (!email || !password) {
                return h.response({
                    status: 'fail',
                    message: 'Please provide email, and password.'
                }).code(400);
            }

            // Format waktu dalam zona waktu WIB (Jakarta)
            const test_date = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD');
            const createdAt = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
            const updatedAt = createdAt;

            // Query SQL untuk menambahkan data ke tabel users
            const query = `
                INSERT INTO \`calon-magang\` (nama, email, password, asal_instansi, image, test_score, test_date, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            // Menjalankan query dengan data dari payload
            const [result] = await db.query(query, [nama, email, password, asal_instansi, image, test_score, test_date, createdAt, updatedAt]);

            // Response jika berhasil menambahkan data
            return h.response({
                success: true,
                data: {
                    id: result.insertId,
                    nama,
                    email,
                    asal_instansi,
                    image,
                    test_score,
                    test_date,
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
    updateProspectiveApprentice: async (request, h) => {
        try {
            const { id } = request.params;  // Mendapatkan ID dari parameter URL
            const {
                nama, email, password, asal_instansi, image, test_score
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

            // Query SQL untuk memperbarui data di tabel calon-magang
            const query = `
                UPDATE \`calon-magang\`
                SET nama = ?, email = ?, password = ?, asal_instansi = ?, image = ?, test_score = ?, updated_at = ?
                WHERE id = ?
            `;

            // Menjalankan query dengan data dari payload dan ID
            const [result] = await db.query(query, [nama, email, password, asal_instansi, image, test_score, updatedAt, id]);

            if (result.affectedRows === 0) {
                return h.response({ status: 'fail', message: 'Candidate not found.' }).code(404);
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
                    test_score,
                    updated_at: updatedAt
                },
                message: 'Candidate data successfully updated.',
            }).code(200);
        } catch (error) {
            console.error('Error updating candidate data:', error);
            return h.response({ status: 'fail', message: 'Failed to update candidate data.' }).code(500);
        }
    },
    deleteProspectiveApprentice: async (request, h) => {
        try {
            const { id } = request.params;  // Mendapatkan ID dari parameter URL

            // Query SQL untuk menghapus data di tabel calon-magang
            const query = `
                DELETE FROM \`calon-magang\`
                WHERE id = ?
            `;

            // Menjalankan query dengan ID dari parameter
            const [result] = await db.query(query, [id]);

            // Jika tidak ada data yang dihapus (ID tidak ditemukan)
            if (result.affectedRows === 0) {
                return h.response({ status: 'fail', message: 'Candidate not found.' }).code(404);
            }

            // Response jika berhasil menghapus data
            return h.response({
                success: true,
                message: 'Candidate data successfully deleted.',
            }).code(200);
        } catch (error) {
            console.error('Error deleting candidate data:', error);
            return h.response({ status: 'fail', message: 'Failed to delete candidate data.' }).code(500);
        }
    },

}

module.exports = candidateController;
