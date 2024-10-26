create database puntodeventa;

use puntodeventa;

CREATE TABLE Clientes (
ClienteID INT AUTO_INCREMENT PRIMARY KEY,
Nombre VARCHAR(100) NOT NULL,
Direccion VARCHAR(255),
Telefono VARCHAR(20),
Correo VARCHAR(100),
Sexo ENUM('M', 'F', 'Otro'),
NIT VARCHAR(20),
CUI VARCHAR(20),
SeguroMedico VARCHAR(50),
NumeroPoliza VARCHAR(50)
);
-- Tabla de Categorías

CREATE TABLE Categorias (
CategoriaID INT AUTO_INCREMENT PRIMARY KEY,
NombreCategoria VARCHAR(100) NOT NULL,
Descripcion TEXT
);
-- Tabla de Productos
CREATE TABLE Productos (
ProductoID INT AUTO_INCREMENT PRIMARY KEY,
Descripcion TEXT,
PrecioUnitario DECIMAL(10, 2) NOT NULL,
Impuestos DECIMAL(5, 2) NOT NULL,
NumeroSerie VARCHAR(100),
CategoriaID INT,
FOREIGN KEY (CategoriaID) REFERENCES Categorias(CategoriaID)
);
-- Tabla de Ventas
CREATE TABLE Ventas (
VentaID INT AUTO_INCREMENT PRIMARY KEY,
ClienteID INT,
FechaHora DATETIME NOT NULL,
FormaPago ENUM('Efectivo', 'Tarjeta', 'Transferencia') NOT NULL,
NumeroFacturaTicket VARCHAR(50),
Descuento DECIMAL(5, 2),
Total DECIMAL(10, 2) NOT NULL,
EsCredito BOOLEAN DEFAULT 0,
CuentaCorriente VARCHAR(100),
FOREIGN KEY (ClienteID) REFERENCES Clientes(ClienteID)
);
-- Tabla de Detalles de Venta
CREATE TABLE DetallesVenta (
DetalleVentaID INT AUTO_INCREMENT PRIMARY KEY,
VentaID INT,
ProductoID INT,
Cantidad INT NOT NULL,
PrecioUnitario DECIMAL(10, 2) NOT NULL,
Impuesto DECIMAL(5, 2) NOT NULL,
Descuento DECIMAL(5, 2),
NumeroSerie VARCHAR(100),
FOREIGN KEY (VentaID) REFERENCES Ventas(VentaID),
FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
);
-- Tabla de Devoluciones
CREATE TABLE Devoluciones (
DevolucionID INT AUTO_INCREMENT PRIMARY KEY,
VentaID INT,
Fecha DATE NOT NULL,
Motivo TEXT,
ProductoID INT,

CantidadDevuelta INT NOT NULL,
NumeroSerie VARCHAR(100),
FOREIGN KEY (VentaID) REFERENCES Ventas(VentaID),
FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
);
-- Tabla de Pagos
CREATE TABLE Pagos (
PagoID INT AUTO_INCREMENT PRIMARY KEY,
VentaID INT,
FechaPago DATE NOT NULL,
FormaPago ENUM('Efectivo', 'Tarjeta', 'Transferencia') NOT NULL,
MontoPagado DECIMAL(10, 2) NOT NULL,
NumeroReferencia VARCHAR(100),
BancoID INT,
FOREIGN KEY (VentaID) REFERENCES Ventas(VentaID),
FOREIGN KEY (BancoID) REFERENCES Bancos(BancoID)
);
-- Tabla de Bancos
CREATE TABLE Bancos (
BancoID INT AUTO_INCREMENT PRIMARY KEY,
NombreBanco VARCHAR(100) NOT NULL
);
-- Tabla de Inventario
CREATE TABLE Inventario (
InventarioID INT AUTO_INCREMENT PRIMARY KEY,
ProductoID INT,
CantidadInicial INT NOT NULL,
CantidadVendida INT NOT NULL,
CantidadRecibida INT NOT NULL,
CantidadExistente INT NOT NULL,
FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
);