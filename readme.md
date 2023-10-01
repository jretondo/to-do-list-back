# Backend de To Do List
# Desafío de código - Sooft Technology

Este es el backend de la aplicación To Do List construida con Node.js, Express y Typescript. Aquí encontrarás instrucciones sobre cómo configurar la base de datos en SQL Server, cómo arrancar el proyecto y como acceder a la documentación.

## Configuración de la Base de Datos

Antes de arrancar el proyecto, asegúrate de tener una base de datos SQL Server configurada. A continuación, se muestran los pasos para generar la base de datos:

1. **Crea una base de datos**: Ejecuta el siguiente script en SQL Server Management Studio o mediante una herramienta de línea de comandos:

    ```sql
    CREATE DATABASE [to-do-list]
    CONTAINMENT = NONE
    ON  PRIMARY 
    ( NAME = N'to-do-list', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\to-do-list.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
    LOG ON 
    ( NAME = N'to-do-list_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\to-do-list_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
    WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
    GO
    ```

2. **Crea un usuario en la Base de Datos de SQL Server**: Primero deberas generar un Login nuevo (con nombre de susario y contraseña). Luego de este login nuevo deberás crear un usuario con acceso a la base de datos recién creada. Por ejemplo:

    ```sql
    CREATE LOGIN NewAdminName WITH PASSWORD = 'ABCD'
    GO
    ```

    ```sql
    Use "to-do-list";
    GO

    IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = N'NewAdminName')
    BEGIN
    CREATE USER [NewAdminName] FOR LOGIN [NewAdminName]
    EXEC sp_addrolemember N'db_owner', N'NewAdminName'
    END;
    GO
    ```

3. **Datos iniciales (opcional)**: Si es necesario, puedes cargar datos iniciales en la base de datos ejecutando un script:

   ```bash
   npm run example
    ```
**Ojo**: Este script elimina toda la base de datos y sus registros! Solo se puede ejecutar cuando se está en el entorno de desarrollo y no prosucción.

## Arranque del Proyecto

Siga estos pasos para arrancar el proyecto:

1. **Instala las dependencias**:

   ```bash
   npm install
    ```
2. **Inicie el proyecto en modo de desarrollo**:

   ```bash
   npm run dev
    ```
