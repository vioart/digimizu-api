const Joi = require('joi');
const candidateController = require('../controllers/candidateController');
const absensiController = require('../controllers/absensiController');
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/auth');


const apiRoutes = [
    // Information API
    {
        method: 'GET', 
        path: '/',
        handler: async (request, h) => {
            try {
                const welcomeMessage = 'Welcome to our Digimizu API!';
                return h.response({ success: true, message: welcomeMessage}).code(200);
            } catch {
                return h.response({ error: 'Failed to retrive homepage.'}.code(500));
            }
        },
    },
    {
        method: 'GET', 
        path: '/api/v1',
        handler: async (request, h) => {
            try {
                const apiInfo = {
                    name: 'Anecma API',
                    version: '1.0.0',
                    description:
                        "A RESTful API for manage internship selection, intern data, and web attendance ."
                };
                return h.response(apiInfo).code(200);
            } catch {
                return h.response({ error: 'Failed to retrieve API information.' }).code(500);
            }
        },
    },
    {
        method: 'GET',
        path: '/user',
        handler: userController.getUser,
    },
    {
        method: 'POST',
        path: '/user',
        options: {
            payload: {
              multipart: true,
            },
            // pre: [verifyToken],
            validate: {
              payload: Joi.object({
                nama: Joi.string().allow('').label('nama'),
                email: Joi.string().allow('').label('email'),
                password: Joi.string().allow('').label('password'),
                asal_instansi: Joi.string().allow('').label('asal_instansi'),
                image: Joi.string().allow('').label('image'),
                is_active: Joi.boolean().label('image'),
                test_score: Joi.number().integer().label('test_score'),
              }),
              failAction: async (request, h, err) => {
                throw err;
              },
            },
        },
        handler: userController.createUser,
    },
    {
        method: 'PUT',
        path: '/user',
        options: {
            payload: {
              multipart: true,
            },
            // pre: [verifyToken],
            validate: {
              payload: Joi.object({
                nama: Joi.string().allow('').label('nama'),
                email: Joi.string().allow('').label('email'),
                password: Joi.string().allow('').label('password'),
                asal_instansi: Joi.string().allow('').label('asal_instansi'),
                image: Joi.string().allow('').label('image'),
                test_score: Joi.number().integer().label('test_score')
              }),
              failAction: async (request, h, err) => {
                throw err;
              },
            },
        },
        handler: userController.createUser,
    },
    {
      method: 'DELETE',
      path: '/user/{id}',
      options: {
          validate: {
              params: Joi.object({
                  id: Joi.number().integer().required().label('id')
              }),
              failAction: async (request, h, err) => {
                  throw err;
              },
          },
      },
      handler: userController.deleteUser,
    },
    {
        method: 'POST',
        path: '/candidate',
        options: {
            payload: {
              multipart: true,
            },
            // pre: [verifyToken],
            validate: {
              payload: Joi.object({
                nama: Joi.string().allow('').label('nama'),
                email: Joi.string().allow('').label('email'),
                password: Joi.string().allow('').label('password'),
                asal_instansi: Joi.string().allow('').label('asal_instansi'),
                image: Joi.string().allow('').label('image'),
                test_score: Joi.number().integer().label('test_score')
              }),
              failAction: async (request, h, err) => {
                throw err;
              },
            },
        },
        handler: candidateController.createProspectiveApprentice,
    },
    {
        method: 'PUT',
        path: '/candidate/{id}',
        options: {
            payload: {
                multipart: true,
            },
            // pre: [verifyToken],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().label('id')
                }),
                payload: Joi.object({
                    nama: Joi.string().allow('').label('nama'),
                    email: Joi.string().allow('').label('email'),
                    password: Joi.string().allow('').label('password'),
                    asal_instansi: Joi.string().allow('').label('asal_instansi'),
                    image: Joi.string().allow('').label('image'),
                    test_score: Joi.number().integer().label('test_score'),
                    test_date: Joi.number().integer().label('test_date'),
                }),
                failAction: async (request, h, err) => {
                    throw err;
                },
            },
        },
        handler: candidateController.updateProspectiveApprentice,
    },
    {
      method: 'DELETE',
      path: '/candidate/{id}',
      options: {
          validate: {
              params: Joi.object({
                  id: Joi.number().integer().required().label('id')
              }),
              failAction: async (request, h, err) => {
                  throw err;
              },
          },
      },
      handler: candidateController.deleteProspectiveApprentice,
    },
    {
        method: 'GET',
        path: '/absensi',
        handler: absensiController.getAllAbsensi,
    },
    {
        method: 'POST',
        path: '/absensi',
        options: {
            payload: {
                multipart: true,
            },
            validate: {
                payload: Joi.object({
                    user_id: Joi.number().integer().required().label('user_id'),
                    tanggal: Joi.string().required().label('tanggal'),
                    waktu: Joi.string().required().label('waktu'),
                    foto: Joi.string().allow('').label('foto'),
                    keterangan: Joi.string().allow('').label('keterangan'),
                }),
                failAction: async (request, h, err) => {
                    throw err;
                },
            },
        },
        handler: absensiController.createAbsensi,
    },
    {
        method: 'PUT',
        path: '/absensi/{id}',
        options: {
            payload: {
                multipart: true,
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().label('id'),
                }),
                payload: Joi.object({
                    user_id: Joi.number().integer().label('user_id'),
                    tanggal: Joi.string().label('tanggal'),
                    waktu: Joi.string().label('waktu'),
                    foto: Joi.string().allow('').label('foto'),
                    keterangan: Joi.string().allow('').label('keterangan'),
                }),
                failAction: async (request, h, err) => {
                    throw err;
                },
            },
        },
        handler: absensiController.updateAbsensi,
    },
    {
        method: 'DELETE',
        path: '/absensi/{id}',
        options: {
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().label('id')
                }),
                failAction: async (request, h, err) => {
                    throw err;
                },
            },
        },
        handler: absensiController.deleteAbsensi,
    },
  

]

module.exports = apiRoutes;