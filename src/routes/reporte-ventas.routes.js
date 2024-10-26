import { Router } from 'express';
import pool from '../database.js';

const router = Router();

router.get('/reporte-ventas', (req, res) => {
    res.render('reportes/reportes-ventas');  
});

router.get('/api/reporte-ventas', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT DATE(FechaHora) AS Fecha, SUM(Total) AS TotalVentas
            FROM Ventas
            GROUP BY DATE(FechaHora)
        `);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener el reporte de ventas:", error);
        res.status(500).json({ message: "Error al obtener el reporte de ventas" });
    }
});

router.get('/api/reporte-detalle-ventas', async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT P.ProductoID, P.Descripcion, DV.Cantidad, DV.PrecioUnitario,
                   DV.Cantidad * DV.PrecioUnitario AS TotalProducto
            FROM DetallesVenta DV
            JOIN Productos P ON DV.ProductoID = P.ProductoID;
        `);
        
        res.json(result);
    } catch (error) {
        console.error("Error al obtener los detalles de las ventas:", error);
        res.status(500).send("Error en el servidor.");
    }
});

router.get('/api/producto-mas-vendido', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT P.ProductoID, P.Descripcion, SUM(DV.Cantidad) AS TotalVendidos
            FROM DetallesVenta DV
            JOIN Productos P ON DV.ProductoID = P.ProductoID
            GROUP BY P.ProductoID
            ORDER BY TotalVendidos DESC
            LIMIT 1;
        `);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener el producto más vendido:", error);
        res.status(500).json({ message: "Error al obtener el producto más vendido" });
    }
});

router.get('/api/unidades-vendidas-por-categoria', async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT CA.NombreCategoria AS Categorias, SUM(DV.Cantidad) AS TotalUnidadesVendidas
            FROM DetallesVenta DV
            JOIN Productos P ON DV.ProductoID = P.ProductoID
            JOIN Categorias CA ON P.CategoriaID = CA.CategoriaID
            GROUP BY CA.NombreCategoria;
        `);
        res.json(result);
    } catch (error) {
        console.error("Error al obtener unidades vendidas por categoría:", error);
        res.status(500).json({ message: "Error al obtener unidades vendidas por categoría" });
    }
});

export default router;