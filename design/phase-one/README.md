# SARMedix · Órbita · Fase 01

Primera propuesta implementada en el layout, navegación, bienvenida y listado de lotes.

## Revisar sin iniciar SARMedix

Abrir `index.html` directamente en un navegador. Los tres HTML incluyen los estilos y scripts locales; no necesitan servidor, conexión a Internet ni MySQL. La barra superior permite pasar a Inventario y al estado sin registros.

Los datos, usuario y perfil Administrador son ficticios. Las acciones operativas están deshabilitadas en esta demostración; los enlaces a pantallas fuera de la fase muestran un aviso. La campana muestra el estado vacío de demostración. El menú, los efectos, la pausa de movimiento y la confirmación de cierre conservan su presentación interactiva; confirmar cierre no envía datos.

La vista previa se genera a partir del marcado de las vistas intervenidas, no ejecuta Razor ni valida permisos reales. Su generador solo resuelve las ramas explícitas de demostración y no debe utilizarse como motor de plantillas.

## Identidad

- Azul tinta `#0C203D`, azul de acción `#245EE6`, superficies `#F3F6FB` y blanco.
- Marca orbital vectorial original, cristal translúcido y luz ambiental.
- Tarjetas con iluminación contextual al puntero y flecha direccional.
- Navegación con iconos vectoriales, indicador luminoso y submenús originales.
- Inventario legible: tabla desplazable, números tabulares, cantidades destacadas y acciones conservadas.
- Fuentes del sistema; sin dependencias, fuentes o servicios externos nuevos.
- Movimiento reducido, pausa de animación ambiental y foco de teclado visible.

## Archivos de aplicación

Modificados: `Views/Shared/_Layout.cshtml`, `Views/Shared/_Sidebar.cshtml`, `Views/Home/Bienvenida.cshtml`, `Views/Home/Lotes.cshtml`.

Nuevos: `Views/Shared/_OrbitalMark.cshtml`, `wwwroot/css/sarmedix-ui.css`, `wwwroot/js/sarmedix-ui.js`.

Las páginas piloto mantienen sus estilos anteriores y agregan una capa visual delimitada. Los estilos de las otras pantallas no se migraron; reciben el marco compartido. Las confirmaciones y notificaciones conservan sus manejadores originales. El JavaScript nuevo solo gestiona presentación y no realiza peticiones ni envíos de formularios.

## Verificaciones reproducibles desde la raíz del repositorio

```powershell
node design/phase-one/verify.mjs
node design/phase-one/preview.mjs
node design/phase-one/check-preview.mjs
node --check LoginSARMedix/wwwroot/js/sarmedix-ui.js
dotnet build LoginSARMedix/LoginSARMedix.csproj --no-restore -p:NuGetAudit=false -v:minimal
```

`baseline.json` contiene hashes del estado al iniciar esta fase, incluidas las modificaciones preexistentes, y contratos de las cuatro vistas. No almacena valores de configuración. La verificación compara 72 archivos protegidos y comprueba la conservación de los scripts originales, atributos funcionales, condiciones e inicialización Razor. No sustituye una prueba funcional completa.

Compilación inicial correcta con dos advertencias CS8604 en HomeController (líneas 142 y 143), archivo no modificado por esta fase. No se ejecutó ASP.NET ni se consultó la base de datos.

La apertura automatizada del navegador local fue rechazada por su control de permisos. Por ello no se certifican aquí capturas, renderizado en dispositivos ni pruebas interactivas en navegador. La revisión visual de escritorio/móvil, contraste final y prueba de regresión con roles reales quedan pendientes en un entorno autorizado.

No se realizaron commit, push ni pull. Se conservaron los cambios previos en HomeController, CrearLote, MovimientoHistorial, Ubicaciones y appsettings.json. La extensión a las otras vistas queda pendiente de revisión de esta fase.
