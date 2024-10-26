import { Router } from 'express';
import pool from '../database.js';

const router = Router();

// Renderizar formulario para agregar un banco
router.get('/addBanco', (req, res) => {
    res.render('bancos/addBanco');  // Cambié a 'bancos/add'
});

// Procesar la inserción de un nuevo banco
router.post('/addBanco', async (req, res) => {
    try {
        const { NombreBanco } = req.body;  // Obtenemos el nombre del banco del cuerpo de la solicitud
        const newBanco = { NombreBanco };  // Creamos el objeto nuevo banco
        await pool.query('INSERT INTO Bancos SET ?', [newBanco]);  // Insertamos en la tabla Bancos
        res.redirect('/listBanco');  // Redirigimos a la lista de bancos
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mostrar la lista de bancos
router.get('/listBanco', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM Bancos');  // Obtenemos todos los bancos
        res.render('bancos/listaBanco', { bancos: result });  // Renderizamos la vista con los bancos obtenidos
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Renderizar formulario para editBanco un banco
router.get('/editBanco/:BancoID', async (req, res) => {
    try {
        const { BancoID } = req.params;  // Obtenemos el ID del banco de los parámetros
        const [banco] = await pool.query('SELECT * FROM Bancos WHERE BancoID = ?', [BancoID]);  // Buscamos el banco por su ID
        const editBanco = banco[0];  // Asignamos el primer resultado a la variable editBanco
        res.render('bancos/editBanco', { banco: editBanco });  // Renderizamos la vista de edición
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Procesar la edición de un banco
router.post('/editBanco/:BancoID', async (req, res) => {
    try {
        const { NombreBanco } = req.body;  // Obtenemos el nombre del banco del cuerpo de la solicitud
        const { BancoID } = req.params;  // Obtenemos el ID del banco de los parámetros
        const editBanco = { NombreBanco };  // Creamos el objeto banco a editBancoar
        await pool.query('UPDATE Bancos SET ? WHERE BancoID = ?', [editBanco, BancoID]);  // Actualizamos el banco en la tabla
        res.redirect('/listBanco');  // Redirigimos a la lista de bancos
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Eliminar un banco
router.get('/deleteBanco/:BancoID', async (req, res) => {
    try {
        const { BancoID } = req.params;  // Obtenemos el ID del banco de los parámetros
        await pool.query('delete FROM Bancos WHERE BancoID = ?', [BancoID]);  // Eliminamos el banco de la tabla
        res.redirect('/listBanco');  // Redirigimos a la lista de bancos
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
