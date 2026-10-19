# Órbita 2.0 · Cuatro ajustes visuales

Implementados exclusivamente en SARMedix-Codex. No se modificaron backend, configuración, lógica, permisos, rutas, formularios, tablas, scroll interno, vistas de historiales, escáner futurista, miniórbitas ni impresión funcional. No se ejecutaron commit, push o pull.

## ECG del footer

El parcial existente _OrbitPulse ahora dibuja una señal decorativa con P y T curvas, QRS pronunciado y segmentos de reposo. Dos grupos idénticos de tres latidos permiten desplazar el trazado 600 unidades SVG en 18 segundos, con velocidad constante y continuidad al reiniciar. No representa mediciones clínicas.

Ocupa el 84 % del ancho interior del footer y 48 px de alto. Muestra tres ciclos en escritorio y dos en móvil, sin estirar su altura. El contenedor recorta el trazado extendido para evitar desbordamientos. Resplandor cian tenue mediante un segundo trazo translúcido, sin filtros animados. Se mantienen la pausa global, movimiento reducido y exclusión de impresión, así como la exclusión del footer decorativo en etiquetas.

## Cápsula única en Productos

Se retiraron las dos inserciones de cápsula pequeña del área de información y se reemplazaron los dos emojis de reserva de imagen por _OrbitCapsule: una rama editable y otra de solo lectura. Se conserva exactamente la condición existente de imagen_url.

- Sin foto: una sola cápsula holográfica en el área de imagen, hasta 94 px de ancho.
- Con foto: únicamente la fotografía original, sin cápsula decorativa adicional.
- Insumos: sin cambios.

El SVG utiliza gradiente translúcido, volumen, borde luminoso, reflejo y sombra suave; cada instancia tiene un identificador de gradiente único. Flota 3 px en 10 s. Se conserva el límite de ocho tarjetas por grilla con animación continua; las demás se animan al pasar el puntero o al recibir foco dentro de la tarjeta. Nombre, principio activo, concentración, código y estados permanecen intactos. El emoji del selector «Medicamentos» no se cambió: no pertenece a las tarjetas ni duplica su imagen.

## Iconografía de accesos

Se amplió la biblioteca _ModuleIcons y sólo se cambiaron las referencias SVG de las tarjetas. Tamaño, contenedor, grosor y estilo compartidos se conservan. La revisión encontró diez tarjetas de submódulos en estas tres vistas.

| Tarjeta | Icono | Destino conservado |
|---|---|---|
| Crear Usuario | Persona con signo + | CrearUsuario |
| Listado de Usuarios | Grupo de personas | Usuarios |
| Usuarios Inactivos | Persona con símbolo de desactivación | ListadoEliminarUsuarios |
| Roles y Permisos | Escudo de autorización | RolesPermisos |
| Registrar Producto | Caja con signo + | CrearProducto |
| Listado de Productos | Catálogo | ListadoProductos2 |
| Asignar medicamentos | Etiqueta de lote | Lotes |
| Historial General | Bitácora y reloj | Historial |
| Historial de Usuarios | Persona y reloj | HistorialUsuarios |
| Historial de Productos | Caja y reloj | HistorialProductos |

«Asignar medicamentos» mantiene el enlace real a Lotes; no se creó una acción nueva. No se cambiaron textos ni condiciones de permisos.

## Indicadores de Medicamentos Controlados

Las tres tarjetas mantienen sus elementos article y sus variables reales totalMedicamentos, totalLotes y stockRegistrado. No se añadieron enlaces, botones, roles interactivos ni tabindex.

Se igualaron la paleta, fondo claro, borde fino, sombra y radio de 18 px con los accesos a submódulos. Iconos en contenedores de 52 × 52 px y SVG de 29 px: cápsula/candado, etiqueta de lote e inventario. Se conserva el tamaño numérico de 30 px y su jerarquía. Grilla adaptable, separación de 18 px y hover de borde/sombra, sin desplazamiento ni cursor de acción. Los textos largos pueden ajustarse dentro de su columna. El resto del módulo permanece intacto.

## Archivos modificados (10)

- LoginSARMedix/Views/Shared/_OrbitPulse.cshtml
- LoginSARMedix/Views/Shared/_OrbitCapsule.cshtml
- LoginSARMedix/Views/Shared/_ModuleIcons.cshtml
- LoginSARMedix/Views/Home/Productos.cshtml
- LoginSARMedix/Views/Home/Modulos/UsuariosPermisos.cshtml
- LoginSARMedix/Views/Home/Modulos/Productos.cshtml
- LoginSARMedix/Views/Home/Modulos/MovimientoHistorial.cshtml
- LoginSARMedix/Views/Home/Modulos/MedicamentosControlados.cshtml
- LoginSARMedix/wwwroot/css/orbit-resources.css
- LoginSARMedix/wwwroot/css/sarmedix-system.css

Se reutilizaron hojas y parciales existentes. No se añadió JavaScript de producción. Los archivos nuevos de design/visual-refinement son evidencia y pruebas: baseline.json, changed.json, icon-map.json, verify.cjs, browser-check.cjs, dos capturas y este documento.

## Pruebas ejecutadas

- Compilación `dotnet build LoginSARMedix.slnx --no-restore`: 0 errores; dos advertencias CS8604 preexistentes en HomeController.cs, líneas 142–143.
- `node design/visual-refinement/verify.cjs`: diez archivos dentro del alcance; 159 archivos preexistentes idénticos al inicio de esta iteración. Verifica controles, tablas, imágenes, scripts, CSS local, condiciones de permisos, enlaces y variables de indicadores. También verifica preservación de las reglas del escáner y resolución de los diez iconos.
- Edge headless / Playwright sobre fragmentos de las vistas reales con sus estilos: anchos 1440, 768, 390 y 320 px para Productos, footer e indicadores; accesos a submódulos a 1440, 390 y 320 px. Sin desbordamiento horizontal ni invasión de la columna de texto por cápsulas o iconos en esas muestras.
- Foto y cápsula mutuamente excluyentes en tarjetas editables y de solo lectura. Cápsula dentro del espacio de imagen.
- ECG medido al 84 % y 48 px. Comparación raster de ambos extremos del ciclo con diferencia normalizada de 0,0000006505, atribuible al suavizado de píxeles y menor que la tolerancia de 0,001. Geometría repetida sin salto de posición.
- Indicadores sin controles de navegación y con número de 30 px. Contenedores de iconos de accesos de 52 × 52 px.
- Animaciones activas normalmente, detenidas por pausa global y movimiento reducido, decoraciones ocultas en impresión. Sin errores JavaScript en las muestras.
- Inspección visual de products-ecg.png e icons-stats.png. Son muestras desconectadas, con textos/fotos/números de prueba, no datos reales.

Para repetir la prueba de navegador: definir CODEX_NODE_MODULES con la carpeta node_modules que contiene Playwright y ejecutar `node design/visual-refinement/browser-check.cjs`. Usa Edge instalado y bloquea peticiones externas; no inicia SARMedix ni MySQL.

## Pendiente

Validar las páginas completas con sesión y datos reales, sidebar, nombres muy largos, fotografías diversas y zoom. Confirmar filtros, navegación por permisos, scrolls y flujos de guardado en el entorno habitual. No se ejercitaron operaciones de negocio ni se accedió a MySQL: preservar el código no sustituye esas pruebas funcionales. Tampoco se midió rendimiento en equipos modestos.
