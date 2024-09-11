const jwt = require('jsonwebtoken');

const verifyToken = async (request, h) => {
    try {
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            return h.response({ success: false, message: 'No token provided.' }).code(401).takeover();
        }

        // Decode JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Simpan hasil decoding di request.auth.credentials agar bisa diakses di rute
        request.auth = { credentials: decoded };

        return h.continue;
    } catch (error) {
        return h.response({ success: false, message: 'Invalid token.' }).code(401).takeover();
    }
};

module.exports = verifyToken;
