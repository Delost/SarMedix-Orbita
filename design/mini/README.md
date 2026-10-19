# SARMedix · Miniórbitas por módulo

Implementado exclusivamente en SARMedix-Codex. 31 pantallas asignadas explícitamente; ocho variantes. No hay coincidencias por prefijos de nombres ni dependencia de datos clínicos. Bienvenida conserva su composición, SVG y animación originales. Los hubs usan la variante de su módulo; no se añadió un segundo emblema general porque no existe otra pantalla general que lo necesite.

## Archivos de producción

- Modificado: LoginSARMedix/Views/Shared/_Layout.cshtml. Añade la hoja CSS, el parcial y el script al final del layout.
- Nuevo: LoginSARMedix/Views/Shared/_OrbitMini.cshtml. Mapeo pantalla → variante, selector y modo de ubicación, más SVG centralizado.
- Nuevo: LoginSARMedix/wwwroot/css/orbit-mini.css. Apariencia, ocho variantes, animaciones, pausa, movimiento reducido y exclusión en impresión.
- Nuevo: LoginSARMedix/wwwroot/js/orbit-mini.js. Monta únicamente el elemento decorativo en el encabezado asignado. Sin red, almacenamiento, temporizadores ni eventos en controles funcionales.

Revisados: layout, _ScreenIdentity, _OrbitalMark, _OrbitInstrument; metadatos y encabezados de las 31 vistas de la tabla; Bienvenida e InformeSalidasTurno; estilos site, sidebar, sarmedix-ui, sarmedix-orbita-v2, sarmedix-system, sarmedix-global, sarmedix-structural y sarmedix-refinement; script sarmedix-orbita-v2 y auditorías previas de design/global. Los archivos existentes ajenos al layout se verificaron contra SHA-256 capturado al comenzar esta tarea. No se modificaron las 31 vistas individuales.

## Ubicación

El parcial emite un template inerte. JavaScript clona una sola miniórbita dentro del encabezado existente, sin mover sus controles. Reserva 166 px a la derecha y al menos 128 px de alto, únicamente cuando hay espacio. Tamaño habitual 150 × 120 px. Se oculta bajo 1100 px de viewport, con encabezados de menos de 620 px o si detecta intersección con títulos/controles. ResizeObserver comprueba cambios de ancho sin bucles por cambios de altura. Revalida tras cargar las fuentes.

CrearRol y EditarRol usan el espacio bajo su descripción en la columna lateral. Dosificaciones reutiliza su espacio orbital existente: conserva el instrumento anterior y añade cápsula/etiqueta con base transparente. No se duplican controles de pausa. El componente es aria-hidden, no enfocable y no intercepta puntero.

Si JavaScript o ResizeObserver no están disponibles, no se muestra decoración ni se reserva espacio. No afecta al funcionamiento del sistema.

## Asignación explícita

| Pantalla | Variante | Ubicación |
|---|---|---|
| ModuloUsuariosPermisos | security | .submenu-titulo (heading) |
| Usuarios | security | .usuarios-titulo (heading) |
| ListadoEliminarUsuarios | security | .usuarios-titulo (heading) |
| CrearUsuario | security | .orbit-editor-heading (heading) |
| EditarUsuario | security | .orbit-editor-heading (heading) |
| RolesPermisos | security | h1.titulo (heading) |
| RolesInactivos | security | .titulo-roles-inactivos (heading) |
| CrearRol | security | .descripcion-crear-rol (below) |
| EditarRol | security | .descripcion-editar-rol (below) |
| ModuloProductos | inventory | .submenu-titulo (heading) |
| Productos | inventory | .productos-titulo (heading) |
| CrearProducto | inventory | .orbit-editor-heading (heading) |
| EditarProducto | inventory | .orbit-editor-heading (heading) |
| Lotes | trace | .sm-workspace-heading (heading) |
| CrearLote | trace | .entrada-encabezado (heading) |
| EditarLote | trace | .sm-edit-heading (heading) |
| ModuloMovimientoHistorial | transfer | .submenu-titulo (heading) |
| TrasladarStock | transfer | .traslado-encabezado (heading) |
| BajaInventario | transfer | .salida-titulo (heading) |
| SalidaExtraordinaria | transfer | .extra-titulo (heading) |
| Dosificaciones | preparation | .sm-dose-orbit (slot) |
| EntregaDosificacion | preparation | .scan-encabezado (heading) |
| ImprimirDosificacion | preparation | .print-controles (heading) |
| ModuloMedicamentosControlados | protection | .controlados-encabezado (heading) |
| Ubicaciones | distribution | .ubicaciones-encabezado (heading) |
| InventarioUbicacion | distribution | .inventario-encabezado-superior (heading) |
| Historial | memory | .sm-history-heading (heading) |
| HistorialUsuarios | memory | .sm-history-heading (heading) |
| HistorialProductos | memory | .sm-history-heading (heading) |
| HistorialSectores | memory | .sm-history-heading (heading) |
| HistorialSalidasTurno | memory | .turno-encabezado (heading) |

Sin nueva miniórbita: Bienvenida (mantiene la grande), Index, RecuperarContrasena, NuevaContrasena, VerificarCodigo y AccesoDenegado (composición de acceso existente), Error y el documento independiente InformeSalidasTurno (cabecera documental e impresión). ImprimirDosificacion está asignada pero la decoración se omite cuando falta espacio; eso ocurrió en la muestra de prueba. Nunca se imprime la nueva decoración.

## Movimiento y personalización

| Variante | Icono y efecto |
|---|---|
| security | Usuario y escudo; giro de 12 s, tres nodos secuenciales de 9 s, escudo con pulso de 8 s y conexión interior. |
| inventory | Caja farmacéutica; dos elipses cruzadas, nodo orbital de 12 s, flotación de 2 px en 9 s y marcas técnicas. |
| trace | Frasco y etiqueta; giro de 12 s, barrido de 8 s sobre la etiqueta, punto de verificación y marcas de trazabilidad. |
| transfer | Flechas opuestas; partículas que recorren la línea en sentidos contrarios en 10 s, flechas alternadas y anillo de 12 s. |
| preparation | Cápsula y etiqueta; órbita parcial de 12 s, barrido/pulso de 8 s y flotación de 2 px en 9 s. |
| protection | Cápsula y candado; giro más lento de 15 s, halo tenue y nodo de seguridad con pulso de 10 s. |
| distribution | Marcador y tres nodos conectados; partícula de ida y vuelta en 9 s, iluminación sincronizada con su paso y anillo de 15 s. |
| memory | Reloj estable, nodo orbital de 12 s y tres marcas de eventos secuenciales de 9 s. Misma variante en todos los historiales asignados. |

Para cambiar un icono, editar su caso en el switch SVG de _OrbitMini. Para asignar una pantalla, agregar su SmScreen exacto, variante, selector existente y modo heading/below/slot al primer switch. No usar selectores de formularios ni tablas como destino. Ajustar --mini-cycle para velocidad orbital y los keyframes sm-mini-* para barrido, pulso y flotación. Los colores están aislados bajo .sm-mini*. No es necesario editar cada vista.

Las animaciones usan transform y opacity. Sin filtros animados ni propiedades de layout animadas. La clase global sm-motion-paused y prefers-reduced-motion: reduce desactivan todas las animaciones del componente. El icono sigue visible estático. La hoja sólo selecciona el componente y sus hosts, sin cambiar tablas, scroll, filtros o controles.

## Verificación ejecutada

- dotnet build LoginSARMedix.slnx --no-restore: correcto. Primera compilación: 0 errores y 2 advertencias CS8604 preexistentes de HomeController (142–143). Última compilación incremental: 0 errores y 0 advertencias emitidas; no se corrigieron ni tocaron esas advertencias.
- node --check LoginSARMedix/wwwroot/js/orbit-mini.js: correcto.
- node design/mini/verify.cjs: 31 mapeos únicos, selectores presentes y montaje/ocultación/redimensionado mediante DOM simulado. Los 161 archivos anteriores distintos del layout conservan exactamente sus hashes (incluidos controladores, configuración, vistas, JS funcional y arte de Bienvenida).
- Edge headless con Playwright: ocho SVG, movimiento reducido, pausa global, tres modos de montaje, ocultación móvil, ausencia de overflow en muestras de montaje y ausencia de errores JS.
- 31 fragmentos de encabezados reales con sus estilos locales y globales: espacio reservado sin invadir títulos/controles visibles; 30 decoraciones visibles a 1440 px y una omitida por espacio (ImprimirDosificacion); ocultación a 390 px y en impresión.
- Inspección visual de gallery.png y history-heading.png. Las capturas son muestras locales, no páginas de producción; el encabezado aislado no incluye la biblioteca completa de iconos del layout.

Se detectó y corrigió una invasión del área de acciones de impresión durante las pruebas. La comprobación de espacio oculta ahora el componente en esa situación.

## Límites de la revisión

Las pruebas de navegador usan muestras desconectadas, no una sesión real de SARMedix ni renderizado de datos Razor. Falta revisión visual de páginas completas con sidebar, títulos y contenido reales en distintos tamaños/zoom, especialmente impresión, Lotes, Dosificaciones, InventarioUbicacion y roles. No se ejecutaron altas/bajas/ediciones, escáner, modales ni flujos con MySQL. Se preservó su código exacto; eso no equivale a una prueba funcional de esos flujos. Tampoco se midió rendimiento en hardware modesto. Las comprobaciones de fragmentos no certifican ausencia de overflow de toda la aplicación.

## Evidencias reproducibles

- baseline.json: hashes previos.
- mapping.json: tabla extraída del componente.
- verify.cjs: auditoría de preservación y asignaciones.
- browser-check.cjs: muestras de navegador; requiere Playwright y Edge instalados. Definir CODEX_NODE_MODULES con la carpeta node_modules que contiene playwright, luego ejecutar node design/mini/browser-check.cjs. No inicia SARMedix ni se conecta a MySQL.
- gallery.png y history-heading.png: capturas de muestras.

No se hicieron commits, push ni escrituras en GitHub. Los cambios preexistentes de controladores/configuración se conservaron.
