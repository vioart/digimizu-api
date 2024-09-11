const db = require('../config/database');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

// Ekstensi dayjs dengan plugin
dayjs.extend(utc);
dayjs.extend(timezone);
    
const absensiController = {
    getAllAbsensi: async (request, h) => {
        try {
            const [rows] = await db.query('SELECT * FROM absensi');
            return h.response({ success: true, data: rows, message: 'Attendance data retrieved successfully' }).code(200);
        } catch (error) {
            console.error(error);
            return h.response({ success: false, message: 'Failed to retrieve attendance data' }).code(500);
        }
    },
    createAbsensi: async (request, h) => {
        try {
            const { user_id, tanggal, waktu, foto, keterangan } = request.payload;

            // Validate input
            if (!user_id || !tanggal || !waktu || !foto) {
                return h.response({ status: 'fail', message: 'Please provide user_id, tanggal, waktu, and foto.' }).code(400);
            }

            // Format date and time in WIB (Jakarta timezone)
            const createdAt = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
            const updatedAt = createdAt;

            // SQL query to insert data into absensi table
            const query = `
                INSERT INTO absensi (user_id, tanggal, waktu, foto, keterangan, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const [result] = await db.query(query, [user_id, tanggal, waktu, foto, keterangan, createdAt, updatedAt]);

            return h.response({
                success: true,
                data: {
                    id: result.insertId,
                    user_id,
                    tanggal,
                    waktu,
                    foto,
                    keterangan,
                    created_at: createdAt,
                    updated_at: updatedAt
                },
                message: 'Attendance record successfully created',
            }).code(201);
        } catch (error) {
            console.error('Error creating attendance record:', error);
            return h.response({ status: 'fail', message: 'Failed to create attendance record' }).code(500);
        }
    },

    updateAbsensi: async (request, h) => {
        try {
            const { id } = request.params; // Get ID from URL
            const { user_id, tanggal, waktu, foto, keterangan } = request.payload;

            // Validate input
            if (!user_id || !tanggal || !waktu || !foto) {
                return h.response({ status: 'fail', message: 'Please provide user_id, tanggal, waktu, and foto.' }).code(400);
            }

            // Format updatedAt in WIB (Jakarta timezone)
            const updatedAt = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

            // SQL query to update attendance record
            const query = `
                UPDATE absensi
                SET user_id = ?, tanggal = ?, waktu = ?, foto = ?, keterangan = ?, updated_at = ?
                WHERE id = ?
            `;
            const [result] = await db.query(query, [user_id, tanggal, waktu, foto, keterangan, updatedAt, id]);

            if (result.affectedRows === 0) {
                return h.response({ status: 'fail', message: 'Attendance record not found' }).code(404);
            }

            return h.response({
                success: true,
                data: {
                    id,
                    user_id,
                    tanggal,
                    waktu,
                    foto,
                    keterangan,
                    updated_at: updatedAt
                },
                message: 'Attendance record successfully updated',
            }).code(200);
        } catch (error) {
            console.error('Error updating attendance record:', error);
            return h.response({ status: 'fail', message: 'Failed to update attendance record' }).code(500);
        }
    },

    deleteAbsensi: async (request, h) => {
        try {
            const { id } = request.params; // Get ID from URL

            // SQL query to delete attendance record
            const query = `
                DELETE FROM absensi WHERE id = ?
            `;
            const [result] = await db.query(query, [id]);

            if (result.affectedRows === 0) {
                return h.response({ status: 'fail', message: 'Attendance record not found' }).code(404);
            }

            return h.response({
                success: true,
                message: 'Attendance record successfully deleted',
            }).code(200);
        } catch (error) {
            console.error('Error deleting attendance record:', error);
            return h.response({ status: 'fail', message: 'Failed to delete attendance record' }).code(500);
        }
    }    

}

module.exports = absensiController;
