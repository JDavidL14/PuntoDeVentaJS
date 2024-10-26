import express, { json } from 'express';
import { engine } from 'express-handlebars';
import morgan from 'morgan';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars'; 
import clientesRoutes from './routes/clientes.routes.js';
import bancosRoutes from './routes/bancos.routes.js';
import categoriasRoutes from './routes/categorias.routes.js';
import productosRoutes from './routes/productos.routes.js';
import pagosRoutes from './routes/pagos.routes.js';
import loginRoutes from './routes/login.routes.js';
import session from 'express-session';
import registrarVentasRoutes from './routes/registrar-venta.js'
import reporteVentas from './routes/reporte-ventas.routes.js'
import usuariosRoutes from './routes/usuarios.routes.js'


// Inicialización
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuración de sesión
app.use(session({
    secret: '2C44-4D44-WppQ38S',  
    resave: false,                
    saveUninitialized: false      
}));

// Middleware de autenticación
const auth = (req, res, next) => {
    if (req.session.isAuthenticated) {
        return next(); 
    } else {
        return res.redirect('/login');  // Si no está autenticado, redirigir al login
    }
};

// Configuración
app.set('port', process.env.PORT || 3000);
app.set('views', join(__dirname, 'views'));
app.use(express.static(join(__dirname, 'public')));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: {
        eq: (a, b) => a === b
    }
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.get('/login', (req, res) => {
    res.render('login');
});



// Ruta para procesar el login (sin protección)
app.use(loginRoutes);
app.use(registrarVentasRoutes)

// Aplicar middleware de autenticación
app.use(auth);

// Rutas protegidas
app.get('/', (req, res) => {
    res.render('index');
});



// Rutas adicionales protegidas
app.use(clientesRoutes);
app.use(bancosRoutes);
app.use(categoriasRoutes);
app.use(productosRoutes);
app.use(pagosRoutes);
app.use(reporteVentas);
app.use(usuariosRoutes);
//app.use(ventasRoutes)
//app.use(registrarVentasRoutes)

// Helpers de Handlebars
handlebars.registerHelper('ifCond', (v1, v2, options) => {
    return (v1 === v2) ? options.fn(this) : options.inverse(this);
});

handlebars.registerHelper('formatDate', (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
});

// Archivos públicos
app.use(express.static(join(__dirname, 'public')));

// Ejecutar servidor
app.listen(app.get('port'), () =>
    console.log('Server listening on port', app.get('port'))
);
