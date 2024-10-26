import { Router } from 'express';
import pool from '../database.js';

const router = Router();

// Ruta para mostrar el formulario de registrar venta
router.get('/registrar-venta', (req, res) => {
    res.render('ventas/registrar-venta');
});

router.post('/addVenta', async (req, res) => {
    const {
        ClienteID,
        FormaPago,
        NumeroFacturaTicket,
        Descuento,
        Total,
        EsCredito,
        CuentaCorriente,
        productos // Asegúrate de que esto está llegando
    } = req.body;

    // Obtener la fecha y hora actual
    const FechaHora = new Date();

    try {
        // Verificar si el ClienteID existe
        const [cliente] = await pool.query('SELECT * FROM Clientes WHERE ClienteID = ?', [ClienteID]);
        if (cliente.length === 0) {
            return res.status(400).json({ message: 'Cliente no encontrado' });
        }

        // Verificar si productos está definido y es un arreglo
        if (!productos || !Array.isArray(JSON.parse(productos))) {
            return res.status(400).json({ message: 'Productos no proporcionados o no es un arreglo' });
        }

        const productosArray = JSON.parse(productos); // Asegúrate de parsear el JSON

        // Inserta la venta en la base de datos
        const [result] = await pool.query(
            `INSERT INTO Ventas (ClienteID, FechaHora, FormaPago, NumeroFacturaTicket, Descuento, Total, EsCredito, CuentaCorriente) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [ClienteID, FechaHora, FormaPago, NumeroFacturaTicket, Descuento, Total, EsCredito ? 1 : 0, CuentaCorriente]
        );

        const VentaID = result.insertId; 

        const detalles = productosArray.map(producto => [
            VentaID,
            producto.ProductoID,
            producto.Cantidad,
            producto.PrecioUnitario,
            producto.Impuesto != null ? producto.Impuesto : 0.12 // Asegúrate de que 'Impuesto' esté definido en los productos
        ]);

        await pool.query(
            `INSERT INTO DetallesVenta (VentaID, ProductoID, Cantidad, PrecioUnitario, Impuesto) 
             VALUES ?`,
            [detalles]
        );
        res.redirect('/listVenta');
        //res.status(201).json({ message: 'Venta registrada con éxito', VentaID });
    } catch (error) {
        console.error('Error registrando la venta:', error);
        res.status(500).json({ message: 'Error al registrar la venta', error: error.message });
    }
});

// Ruta para buscar un producto por su ProductoID
router.get('/buscar-producto/:ProductoID', async (req, res) => {
    const { ProductoID } = req.params;

    try {
        const [rows] = await pool.query('SELECT ProductoID, Descripcion AS Nombre, PrecioUnitario AS Precio FROM Productos WHERE ProductoID = ?', [ProductoID]);

        if (rows.length > 0) {
            res.json(rows[0]); // Si encuentra el producto, devuelve el primer resultado
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al buscar producto:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Ruta para mostrar la lista de ventas
router.get('/listVenta', async (req, res) => {
    try {
        const [ventas] = await pool.query('SELECT * FROM Ventas ORDER BY FechaHora DESC'); // Obtener todas las ventas ordenadas por fecha
        res.render('ventas/lista-venta', { ventas }); // Renderiza la vista con las ventas
    } catch (error) {
        console.error('Error al obtener ventas:', error);
        res.status(500).json({ message: 'Error al obtener ventas', error: error.message });
    }
});

export default router;
