import { Router } from 'express';
import pool from '../database.js';

const router = Router();

// Ruta para renderizar el formulario de agregar categoría
router.get('/addCategoria', (req, res) => {
    res.render('categorias/addCategoria');
});

// Ruta para agregar una nueva categoría
router.post('/addCategoria', async (req, res) => {
    try {
        const { NombreCategoria, Descripcion } = req.body;
        const newCategoria = {
            NombreCategoria,
            Descripcion
        };
        await pool.query('INSERT INTO Categorias SET ?', [newCategoria]);
        res.redirect('/listCategoria');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ruta para listar todas las categorías
router.get('/listCategoria', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM Categorias');
        res.render('categorias/listaCategoria', { categorias: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ruta para renderizar el formulario de edición de categoría
router.get('/editCategoria/:CategoriaID', async (req, res) => {
    try {
        const { CategoriaID } = req.params;

        // Consultar la categoría específica
        const [categoriaResult] = await pool.query('SELECT * FROM Categorias WHERE CategoriaID = ?', [CategoriaID]);
        const categoria = categoriaResult[0];  // La primera fila será la categoría que editamos

        // Renderizar la vista 'editCategoria' con los datos de la categoría
        res.render('categorias/editCategoria', { categoria });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ruta para actualizar una categoría existente
router.post('/editCategoria/:CategoriaID', async (req, res) => {
    try {
        const { NombreCategoria, Descripcion } = req.body;
        const { CategoriaID } = req.params;
        const editCategoria = {
            NombreCategoria,
            Descripcion
        };
        await pool.query('UPDATE Categorias SET ? WHERE CategoriaID = ?', [editCategoria, CategoriaID]);
        res.redirect('/listCategoria');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ruta para eliminar una categoría
router.get('/deleteCategoria/:CategoriaID', async (req, res) => {
    try {
        const { CategoriaID } = req.params;
        await pool.query('DELETE FROM Categorias WHERE CategoriaID = ?', [CategoriaID]);
        res.redirect('/listCategoria');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
