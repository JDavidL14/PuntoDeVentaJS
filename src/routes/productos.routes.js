import { Router } from 'express';
import pool from '../database.js';


const router = Router();

// Renderizar formulario para agregar un producto, incluyendo las categorías
router.get('/addProducto', async (req, res) => {
    try {
        // Obtener las categorías de la tabla Categorias
        const [categorias] = await pool.query('SELECT CategoriaID, NombreCategoria FROM Categorias');
        
        // Renderizar el formulario de productos y pasar las categorías a la vista
        res.render('productos/addProducto', { categorias });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Procesar la inserción de un nuevo producto
router.post('/addProducto', async (req, res) => {
    try {
        const { Descripcion, PrecioUnitario, Impuestos, NumeroSerie, CategoriaID } = req.body;  // Obtenemos los campos del producto del cuerpo de la solicitud
        const newProducto = { Descripcion, PrecioUnitario, Impuestos, NumeroSerie, CategoriaID };  // Creamos el objeto nuevo producto
        await pool.query('INSERT INTO Productos SET ?', [newProducto]);  // Insertamos en la tabla Productos
        res.redirect('/listProducto');  // Redirigimos a la lista de productos
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mostrar la lista de productos
router.get('/listProducto', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT p.*, c.NombreCategoria FROM Productos p LEFT JOIN Categorias c ON p.CategoriaID = c.CategoriaID');  // Obtenemos todos los productos con sus categorías
        res.render('productos/listaProducto', { productos: result });  // Renderizamos la vista con los productos obtenidos
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Renderizar formulario para editar un producto
router.get('/editProducto/:ProductoID', async (req, res) => {
    try {
        const { ProductoID } = req.params;
        const [producto] = await pool.query('SELECT * FROM Productos WHERE ProductoID = ?', [ProductoID]);
        const editProducto = producto[0];
        const [categorias] = await pool.query('SELECT * FROM Categorias');
        res.render('productos/editProducto', { producto: editProducto, categorias });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Procesar la edición de un producto
router.post('/editProducto/:ProductoID', async (req, res) => {
    try {
        const { Descripcion, PrecioUnitario, Impuestos, NumeroSerie, CategoriaID } = req.body;  // Obtenemos los campos del producto del cuerpo de la solicitud
        const { ProductoID } = req.params;  // Obtenemos el ID del producto de los parámetros
        const editProducto = { Descripcion, PrecioUnitario, Impuestos, NumeroSerie, CategoriaID };  // Creamos el objeto producto a editar
        await pool.query('UPDATE Productos SET ? WHERE ProductoID = ?', [editProducto, ProductoID]);  // Actualizamos el producto en la tabla
        res.redirect('/listProducto');  // Redirigimos a la lista de productos
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Eliminar un producto
router.get('/deleteProducto/:ProductoID', async (req, res) => {
    try {
        const { ProductoID } = req.params;  // Obtenemos el ID del producto de los parámetros
        await pool.query('DELETE FROM Productos WHERE ProductoID = ?', [ProductoID]);  // Eliminamos el producto de la tabla
        res.redirect('/listProducto');  // Redirigimos a la lista de productos
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/ventas', (req, res) => {
    res.render('ventas/registrar-venta');
}); 


// Ruta para obtener la lista de productos
router.get('/buscar-productos', async (req, res) => {
    try {
        const [products] = await pool.query('SELECT ProductoID, Nombre, PrecioUnitario FROM Productos');
        res.json(products); // Devuelve la lista de productos en formato JSON
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
});



export default router;
