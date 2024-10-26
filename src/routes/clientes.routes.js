import { Router } from 'express';
import pool from '../database.js';

const router = Router();

// Ruta para agregar un nuevo cliente
router.post('/addCliente', async (req, res) => {
    try {
        const { Nombre, Direccion, Telefono, Correo, Sexo, NIT, CUI, SeguroMedico, NumeroPoliza } = req.body;
        const newCliente = {
            Nombre, Direccion, Telefono, Correo, Sexo, NIT, CUI, SeguroMedico, NumeroPoliza
        };
        await pool.query('INSERT INTO Clientes SET ?', [newCliente]);
        res.redirect('/listCliente');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ruta para listar todos los clientes
router.get('/listCliente', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM Clientes');
        res.render('clientes/listaCliente', { clientes: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ruta para renderizar el formulario de edición de cliente
router.get('/editCliente/:ClienteID', async (req, res) => {
    try {
        const { ClienteID } = req.params;

        // Consultar el cliente específico
        const [clienteResult] = await pool.query('SELECT * FROM Clientes WHERE ClienteID = ?', [ClienteID]);
        const cliente = clienteResult[0];  // La primera fila será el cliente que editamos

        // Renderizar la vista 'editCliente' con los datos del cliente
        res.render('clientes/editCliente', { cliente });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ruta para actualizar un cliente existente
router.post('/editCliente/:ClienteID', async (req, res) => {
    try {
        const { Nombre, Direccion, Telefono, Correo, Sexo, NIT, CUI, SeguroMedico, NumeroPoliza } = req.body;
        const { ClienteID } = req.params;
        const editCliente = {
            Nombre, Direccion, Telefono, Correo, Sexo, NIT, CUI, SeguroMedico, NumeroPoliza
        };
        await pool.query('UPDATE Clientes SET ? WHERE ClienteID = ?', [editCliente, ClienteID]);
        res.redirect('/listCliente');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ruta para eliminar un cliente
router.get('/deleteCliente/:ClienteID', async (req, res) => {
    try {
        const { ClienteID } = req.params;
        await pool.query('DELETE FROM Clientes WHERE ClienteID = ?', [ClienteID]);
        res.redirect('/listCliente');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
