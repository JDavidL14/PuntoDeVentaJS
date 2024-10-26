import { Router } from 'express';
import pool from '../database.js';

const router = Router();

// Renderizar formulario para agregar un usuario
router.get('/addUsuario', (req, res) => {
    res.render('usuarios/addUsuario');  // Cambié a 'usuarios/addUsuario'
});

// Procesar la inserción de un nuevo usuario
router.post('/addUsuario', async (req, res) => {
    try {
        const { NombreUsuario, Contrasena, Rol, Nombre, Apellido, Email, Telefono } = req.body;  // Obtenemos los datos del usuario del cuerpo de la solicitud
        const newUsuario = { NombreUsuario, Contrasena, Rol, Nombre, Apellido, Email, Telefono };  // Creamos el objeto nuevo usuario
        await pool.query('INSERT INTO usuarios SET ?', [newUsuario]);  // Insertamos en la tabla usuarios
        res.redirect('/listUsuario');  // Redirigimos a la lista de usuarios
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mostrar la lista de usuarios
router.get('/listUsuario', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM usuarios');  // Obtenemos todos los usuarios
        res.render('usuarios/listaUsuario', { usuarios: result });  // Renderizamos la vista con los usuarios obtenidos
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Renderizar formulario para editar un usuario
router.get('/editUsuario/:Id', async (req, res) => {
    try {
        const { Id } = req.params;  // Obtenemos el ID del usuario de los parámetros
        const [usuario] = await pool.query('SELECT * FROM usuarios WHERE Id = ?', [Id]);  // Buscamos el usuario por su ID
        const editUsuario = usuario[0];  // Asignamos el primer resultado a la variable editUsuario
        res.render('usuarios/editUsuario', { usuario: editUsuario });  // Renderizamos la vista de edición
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Procesar la edición de un usuario
router.post('/editUsuario/:Id', async (req, res) => {
    try {
        const { NombreUsuario, Contrasena, Rol, Nombre, Apellido, Email, Telefono } = req.body;  // Obtenemos los datos del usuario del cuerpo de la solicitud
        const { Id } = req.params;  // Obtenemos el ID del usuario de los parámetros
        const editUsuario = { NombreUsuario, Contrasena, Rol, Nombre, Apellido, Email, Telefono };  // Creamos el objeto usuario a editar
        await pool.query('UPDATE usuarios SET ? WHERE Id = ?', [editUsuario, Id]);  // Actualizamos el usuario en la tabla
        res.redirect('/listUsuario');  // Redirigimos a la lista de usuarios
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Eliminar un usuario
router.get('/deleteUsuario/:Id', async (req, res) => {
    try {
        const { Id } = req.params;  // Obtenemos el ID del usuario de los parámetros
        await pool.query('DELETE FROM usuarios WHERE Id = ?', [Id]);  // Eliminamos el usuario de la tabla
        res.redirect('/listUsuario');  // Redirigimos a la lista de usuarios
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
