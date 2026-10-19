# SARMedix · Órbita 02

## Ajuste fino: iconografía y ubicación actual

Se conserva Órbita 2. Los accesos principales y la navegación comparten seis símbolos SVG locales en `Views/Shared/_ModuleIcons.cshtml`: usuario con escudo (usuarios/permisos), caja (productos), flechas y reloj (movimientos/historial), escudo con cápsula (controlados), pin con cruz (sectores) y estantería (inventario). El layout incluye la biblioteca una sola vez; los símbolos son decorativos y las etiquetas de los enlaces se mantienen.

El módulo activo usa un fondo azul más contrastado, borde claro, barra lateral luminosa y texto de mayor peso. La subopción activa usa una superficie clara de alto contraste. El grupo expandido tiene un tratamiento intermedio independiente del activo. No se cambió la detección de rutas, permisos ni la apertura de submenús.

Archivos de este ajuste: `_Layout.cshtml`, `_Sidebar.cshtml`, `Bienvenida.cshtml`, `Lotes.cshtml`, `sarmedix-orbita-v2.css`, nueva parcial `_ModuleIcons.cshtml`, generador `design/phase-one/preview.mjs`, las tres demostraciones HTML y esta documentación. No se modificaron scripts de aplicación. El generador refleja ahora también la subopción de Inventario activa, sin alterar el comportamiento real.

Comprobados los seis símbolos y todas sus referencias en los tres HTML, además de un único módulo y subopción activos en las demostraciones de inventario. Pendiente la inspección visual en navegador de los iconos a tamaños reales y de los estados normal, hover, foco, expandido y activo, incluyendo pantallas pequeñas y movimiento reducido.

## Revisar

Abrir `index.html`, `inventory.html` o `empty.html` directamente en un navegador. Son demostraciones autocontenidas con datos ficticios, sin ASP.NET, servidor ni MySQL. Las operaciones están bloqueadas en la demostración. Los HTML de la fase uno se conservan para comparación.

## Evolución

- Cabecera luminosa, navegación azul tinta con mayor contraste y tamaño de lectura.
- Bienvenida con auroras lentas, cristal orbital, anillos ópticos y composición de mayor escala.
- Tarjetas con aparición escalonada breve, inclinación máxima de 1,5 grados y luz contextual; operativas desde el primer momento.
- Inventario con cabecera orbital, tabla de mayor tamaño tipográfico, bandas discretas, indicadores de cantidad y resaltado de fila por hover/foco. Las filas no se desplazan ni animan continuamente.
- Panel de alertas, confirmación de cierre, botones e indicadores con superficies y transiciones coherentes.
- Control global de efectos sincronizado con el botón original de Bienvenida. Se respeta movimiento reducido, se excluye inclinación en dispositivos táctiles y se cancelan cuadros pendientes al salir del elemento.
- Clases reutilizables `.sm-field` y `.sm-button` preparadas para la futura migración de formularios. No se migraron masivamente las otras pantallas ni se agregaron filtros ficticios al inventario real.

## Archivos

Aplicación: modificados `_Layout.cshtml`, `Bienvenida.cshtml`, `Lotes.cshtml`; añadidos `sarmedix-orbita-v2.css` y `sarmedix-orbita-v2.js`. La nueva capa rediseña el sidebar mediante CSS, sin cambiar su lógica ni su archivo Razor. El arte orbital, CSS y JavaScript originales de Órbita permanecen intactos.

Herramientas: generador y verificador de vistas previas de `design/phase-one` aceptan `--v2`; nuevos HTML, documentación y prueba de movimiento en este directorio.

## Verificación

```powershell
node design/phase-one/verify.mjs
node --check LoginSARMedix/wwwroot/js/sarmedix-orbita-v2.js
node design/phase-two/check-motion.mjs
node design/phase-one/preview.mjs --v2
node design/phase-one/check-preview.mjs --v2
dotnet build LoginSARMedix/LoginSARMedix.csproj --no-restore -p:NuGetAudit=false -v:minimal
```

Resultados: 72 archivos protegidos sin cambios respecto al estado inicial registrado; contratos de scripts, atributos funcionales y condiciones Razor conservados; 30 bloques JavaScript de las vistas previas con sintaxis válida; identificadores únicos; prueba aislada de pausa, sincronización, movimiento reducido, inclinación limitada y cancelación correcta. Compilación: cero errores y dos advertencias CS8604 del controlador no modificado, líneas 142 y 143.

Las comprobaciones son estáticas y de comportamiento aislado, no equivalen a pruebas integradas de permisos, formularios, escáner o base de datos. No se ejecutó ASP.NET ni se usó Git.

## Revisión manual pendiente

La apertura automatizada del navegador fue rechazada en la fase anterior; no se reintentó ni se usaron mecanismos alternativos. Falta verificar el renderizado real en escritorio, tablet y móvil; el confort de movimiento y legibilidad con usuarios; contraste efectivo de superficies compuestas; teclado y foco en alertas/modales; impresión; y regresión funcional por roles en un entorno expresamente autorizado. Ningún cambio adicional de vistas se hará como parte de esta fase.
