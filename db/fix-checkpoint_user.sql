-- db/fix-checkpoint_user.sql
-- Script para actualizar la misma contraseña en las dos entradas de
-- 'checkpoint_user'@'localhost' y 'checkpoint_user'@'%' y reafirmar permisos.
-- IMPORTANTE: reemplaza 'TuNuevaContraseñaSegura' por la contraseña real antes de ejecutar.
-- Ejecuta este script con un usuario administrador (root) en MySQL Workbench.

-- EJEMPLO DE USO:
-- 1) Abre MySQL Workbench conectado como root.
-- 2) Abre este archivo y reemplaza TuNuevaContraseñaSegura por la contraseña deseada.
-- 3) Ejecuta todo el script.

-- Reemplaza el placeholder 'TuNuevaContraseñaSegura' por la contraseña real antes de ejecutar.

-- Actualizar contraseña y permisos para conexiones desde localhost
ALTER USER 'checkpoint_user'@'localhost' IDENTIFIED BY 'TuNuevaContraseñaSegura';
GRANT SELECT, INSERT, UPDATE, DELETE ON `checkpoint`.* TO 'checkpoint_user'@'localhost';

-- Actualizar contraseña y permisos para conexiones desde cualquier host
ALTER USER 'checkpoint_user'@'%' IDENTIFIED BY 'TuNuevaContraseñaSegura';
GRANT SELECT, INSERT, UPDATE, DELETE ON `checkpoint`.* TO 'checkpoint_user'@'%';

FLUSH PRIVILEGES;

-- Nota: si tu servidor requiere mysql_native_password, sustituye IDENTIFIED BY por:
-- IDENTIFIED WITH mysql_native_password BY 'TuNuevaContraseñaSegura'
