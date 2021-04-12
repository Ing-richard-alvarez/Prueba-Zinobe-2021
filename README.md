# Prueba desarrollador semi-senior php

A continuación les indicaré el paso a paso para poner en marcha este proyecto. cabe mencionar que es necesario ubicar este repositorio en un lugar que sea fácil de ubicar, pues necesitaremos acceder al repositorio desde la terminal de comandos y desde nuestro editor de texto.

## Instalación de dependencias

primero instalemos los paquetes de composer necesarios para nuestro proyecto con el siguiente comando:

```bash
composer install
```

Luego procedemos a instalar todas las dependencias que necesitamos para trabajar del lado del frontend con el siguiente comando:

```bash
yarn install
```

## Configuración de la base de datos
En este paso necesitamos crear una base de datos en Mysql, talvez algunos tenga alguna aplicación del lado del cliente como mysql workbench, heidisql etc.

una vez que tengamos creada la base de datos, abrimos la terminal de comando, nos ubicamos en la ruta donde se encuentra nuestro repositorio y nos movemos al directorio config que se encuentra en la raiz de nuestro proyecto, para eso ejecutamos el siguiente comando:

```bash
cd config
```

una vez que estemos en el directorio config, procedemos a copiar el archivo database-example.php con el siguiente comando:

```bash
cp database-example.php database.php
```

ahora tendremos dentro del directorio config un archivo database.php, es allí donde tendremos que añadir los datos de nuestra base de datos, por ejemplo tendremos que añadir, el host de la base de datos, nombre, usuario, contraseña etc.

```php

// database.php
defined("DBDRIVER")or define('DBDRIVER','mysql');
defined("DBHOST")or define('DBHOST','host_database');
defined("DBNAME")or define('DBNAME','name_database');
defined("DBUSER")or define('DBUSER','user_database');
defined("DBPASS")or define('DBPASS','password_database');
```

## Compilación y arranque del proyecto
para compilar el proyecto es necesario correr los siguientes

```bash
yarn run dev
```

el comando anterior es para compilar nuestro assets(javascript & css files). si queremos compilar nuestro assets en tiempo real podemos ejecutar el siguiente comando.

```bash
yarn run watch
```

para arrancar el proyecto nos ubicamos en la raiz de nuestro repositorio desde la terminal y ejecutamos el siguiente comando:
```bash
php -S 127.0.0.1:8000
```
## Licensia
[MIT](https://choosealicense.com/licenses/mit/)
