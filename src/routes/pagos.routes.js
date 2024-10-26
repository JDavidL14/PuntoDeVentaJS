import { Router } from 'express';
import pool from '../database.js';

const router = Router();

// Renderizar formulario para agregar un pago
router.get('/addPago', async (req, res) => {
    try {
        const [bancos] = await pool.query('SELECT * FROM Bancos');  // Obtenemos todos los bancos
        const [ventas] = await pool.query('SELECT * FROM Ventas');  // Obtenemos todas las ventas
        res.render('pagos/addPago', { bancos, ventas });  // Renderizamos la vista con los bancos y ventas obtenidos
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Procesar la inserción de un nuevo pago
router.post('/addPago', async (req, res) => {
    try {
        const { VentaID, FechaPago, FormaPago, MontoPagado, NumeroReferencia, BancoID } = req.body;  // Obtenemos los campos del cuerpo de la solicitud
        const newPago = { VentaID, FechaPago, FormaPago, MontoPagado, NumeroReferencia, BancoID };  // Creamos el objeto nuevo pago
        await pool.query('INSERT INTO Pagos SET ?', [newPago]);  // Insertamos en la tabla Pagos
        res.redirect('/listPago');  // Redirigimos a la lista de pagos
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mostrar la lista de pagos
router.get('/listPago', async (req, res) => {
    try {
        // Modificamos la consulta para incluir el nombre del banco
        const [result] = await pool.query(`
            SELECT p.*, b.NombreBanco
            FROM Pagos p
            LEFT JOIN Bancos b ON p.BancoID = b.BancoID
        `);  // Obtenemos todos los pagos junto con el nombre del banco
        res.render('pagos/listaPago', { pagos: result });  // Renderizamos la vista con los pagos obtenidos
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Renderizar formulario para editar un pago
router.get('/editPago/:PagoID', async (req, res) => {
    try {
        const { PagoID } = req.params;  // Obtenemos el ID del pago de los parámetros
        const [pago] = await pool.query('SELECT * FROM Pagos WHERE PagoID = ?', [PagoID]);  // Buscamos el pago por su ID
        const editPago = pago[0];  // Asignamos el primer resultado a la variable editPago
        const [bancos] = await pool.query('SELECT * FROM Bancos');  // Obtenemos todas las categorías para seleccionar
        const [ventas] = await pool.query('SELECT * FROM Ventas');  // Obtenemos todas las ventas
        res.render('pagos/editPago', { pago: editPago, bancos, ventas });  // Renderizamos la vista de edición
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Procesar la edición de un pago
router.post('/editPago/:PagoID', async (req, res) => {
    try {
        const { VentaID, FechaPago, FormaPago, MontoPagado, NumeroReferencia, BancoID } = req.body;  // Obtenemos los campos del cuerpo de la solicitud
        const { PagoID } = req.params;  // Obtenemos el ID del pago de los parámetros
        const editPago = { VentaID, FechaPago, FormaPago, MontoPagado, NumeroReferencia, BancoID };  // Creamos el objeto pago a editar
        await pool.query('UPDATE Pagos SET ? WHERE PagoID = ?', [editPago, PagoID]);  // Actualizamos el pago en la tabla
        res.redirect('/listPago');  // Redirigimos a la lista de pagos
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Eliminar un pago
router.get('/deletePago/:PagoID', async (req, res) => {
    try {
        const { PagoID } = req.params;  // Obtenemos el ID del pago de los parámetros
        await pool.query('DELETE FROM Pagos WHERE PagoID = ?', [PagoID]);  // Eliminamos el pago de la tabla
        res.redirect('/listPago');  // Redirigimos a la lista de pagos
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
