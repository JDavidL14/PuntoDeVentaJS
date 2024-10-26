import {Router} from 'express'
import pool from '../database.js'

const router = Router();

router.get('/index',(req,res)=>{
    res.render('layouts/index');
});

router.post('/login', async (req, res) => {
    console.log('datos reci', req.body);
    try {
        const { Email, Contrasena } = req.body;

        const [rows] = await pool.query('SELECT * FROM usuarios WHERE Email = ? AND Contrasena = ?', [Email, Contrasena]);

        if (rows.length > 0) {
            req.session.user = rows[0]; 
            req.session.isAuthenticated = true; 
            console.log('Usuario autenticado');
            res.redirect('/');
        } else {
            console.log('Email o contraseña incorrectos');
            res.status(401).json({ message: 'Email o contraseña incorrectos' });
        }       
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log('Error:', err.message);
    }
});


router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/login'); 
    });
});

export default router;