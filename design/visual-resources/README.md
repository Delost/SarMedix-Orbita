# Órbita 2.0 · Escáner, pulso y cápsulas

Integración real mediante parciales Razor en SARMedix-Codex. No se añadió JavaScript de producción. Las muestras de navegador son únicamente una forma de verificar la presentación de esa integración.

## Aplicación

| Recurso | Vistas / ubicación |
|---|---|
| Escáner futurista | CrearProducto y EditarProducto: bloque de código de barras / GTIN. |
| Escáner futurista | CrearLote: dentro de modoScanner; acompaña la visibilidad del modo escáner existente. |
| Escáner futurista | EditarLote: junto a la identificación por número de lote. Es decoración, no indica disponibilidad de lectura automática. |
| Escáner futurista | Dosificaciones: panel de preparación «Antes de imprimir», fuera del resumen dinámico. |
| Escáner futurista | EntregaDosificacion: estación de entrega, antes del formulario y fuera del resultado AJAX. |
| Pulso digital | Footer compartido de todas las vistas normales que usan _Layout: Bienvenida, módulos, listados, formularios, historiales, acceso y error. |
| Cápsulas holográficas | Productos: cada tarjeta de tipo Medicamento, en las ramas editable y de solo lectura, tenga o no fotografía. |

El pulso no se renderiza en ImprimirDosificacion. InformeSalidasTurno es un documento independiente y permanece intacto. AccesoDenegado también usa una página independiente sin el footer normal; no se modificó. Ningún recurso se añadió a modales. No se añadieron cápsulas a insumos ni a tablas de Medicamentos Controlados. No se repitió el escáner en listados que sólo muestran códigos y ya tienen miniórbita de módulo.

La cápsula es un motivo genérico de medicamento: no afirma que la forma farmacéutica real sea una cápsula. No sustituye nombre, concentración, principio activo, fotografía, código o estado.

## Archivos

Nuevos archivos de producción:

- LoginSARMedix/Views/Shared/_OrbitScanner.cshtml
- LoginSARMedix/Views/Shared/_OrbitPulse.cshtml
- LoginSARMedix/Views/Shared/_OrbitCapsule.cshtml
- LoginSARMedix/wwwroot/css/orbit-resources.css

Archivos existentes modificados únicamente mediante inserciones:

- LoginSARMedix/Views/Shared/_Layout.cshtml
- LoginSARMedix/Views/Home/CrearProducto.cshtml
- LoginSARMedix/Views/Home/EditarProducto.cshtml
- LoginSARMedix/Views/Home/CrearLote.cshtml
- LoginSARMedix/Views/Home/EditarLote.cshtml
- LoginSARMedix/Views/Home/Dosificaciones.cshtml
- LoginSARMedix/Views/Home/EntregaDosificacion.cshtml
- LoginSARMedix/Views/Home/Productos.cshtml

Evidencias y herramientas de revisión: design/visual-resources/baseline.json, changed.json, verify.cjs, browser-check.cjs, scanner.png, products.png y este README.

## Protecciones y movimiento

- Todo permanece en flujo normal, sin posición absoluta, z-index, superposición o traslado de controles. El footer conserva su lugar y pasa a apilar texto y pulso sólo cuando contiene el nuevo parcial y sólo en pantalla.
- Escáner de 132 × 48 px, limitado al ancho disponible. Se oculta a 480 px o menos. No se inserta sobre inputs, dentro de resultados AJAX ni en el resumen aria-live de preparación.
- Cápsula de 48 px de ancho dentro del área de información, antes del nombre; baja a 36 px en móvil. Su máximo es el ancho del contenedor. Las fotografías originales se conservan.
- Pulso de 200 px, limitado al ancho disponible, 140 px en móvil. No tiene significado de estado operativo o clínico.
- Los tres recursos usan aria-hidden, SVG no enfocable y pointer-events: none. No añaden campos ni acciones.
- CSS exclusivo para los nuevos componentes. Sin cambios en filtros, tablas, columnas, encabezados, scroll interno ni estilos locales preexistentes.
- Barrido del escáner: 7 s. Pulso: 12 s. Brillo de cápsula: 12 s. Sólo se animan transform y opacity. Las primeras ocho tarjetas por grilla animan continuamente; las restantes sólo en hover/foco dentro de la tarjeta. No hay temporizadores, peticiones ni bibliotecas nuevas.
- Reutiliza .sm-motion-paused y prefers-reduced-motion. La decoración queda estática al desactivar efectos. Los tres recursos se ocultan mediante @media print; el pulso además se excluye de la vista de etiquetas al renderizar Razor.

Personalización: modificar los SVG en cada parcial; ajustar tamaños, colores y duraciones en orbit-resources.css. La integración no requiere editar scripts de negocio.

## Verificaciones ejecutadas

1. `dotnet build LoginSARMedix.slnx --no-restore`: correcto, 0 errores y 2 advertencias CS8604 preexistentes en HomeController.cs, líneas 142–143. No se modificaron esos archivos ni advertencias.
2. `node design/visual-resources/verify.cjs`: correcto. Ocho vistas/layout con inserciones; 157 archivos preexistentes idénticos byte a byte respecto del inicio de esta tarea, incluidos backend, configuración, scripts y arte orbital. Preservación de etiquetas de controles/tablas, estilos locales y scripts. Las siete vistas funcionales recuperan su texto original al retirar los parciales nuevos y normalizar espacios.
3. Edge sin interfaz con Playwright sobre fragmentos reales y estilos existentes: seis ubicaciones del escáner a 1440, 768, 390 y 320 px; sin intersecciones con controles ni incremento del desbordamiento horizontal atribuible a la decoración. Ocultación del escáner en móvil.
4. Entrada de texto y foco en codigoScan en una muestra desconectada: conservados. No equivale a prueba del lector físico ni del procesamiento de Enter.
5. Tarjetas de medicamento editables, de solo lectura y con fotografía: cápsula dentro del área de información, separada del nombre y sin nuevo desbordamiento horizontal; footer en los cuatro anchos.
6. Las tres animaciones activas en condiciones normales, detenidas con movimiento reducido y pausa global; todos los recursos ocultos en impresión. Sin errores JavaScript en las muestras.
7. Inspección visual de scanner.png y products.png. Son fragmentos desconectados con contenido de prueba, no capturas de datos reales.

Para repetir el navegador: definir CODEX_NODE_MODULES apuntando a la carpeta node_modules con Playwright y ejecutar `node design/visual-resources/browser-check.cjs`. El script usa Edge instalado, bloquea peticiones externas y no inicia SARMedix ni MySQL.

## Pendiente de validación manual

Revisar páginas completas con sidebar, miniórbitas, datos reales, nombres largos, fotografías variadas y zoom del navegador. Probar lector físico, cambios entre modos manual/escáner, AJAX, validaciones, guardado, modales y navegación con roles reales en el entorno habitual. No se ejecutaron esas operaciones ni se accedió a MySQL. Tampoco se midió rendimiento en hardware modesto. Se preservó el código de tablas/filtros/scroll, pero no se ejercitaron sus flujos en una sesión autenticada.

No se ejecutó commit, push ni pull. No se modificó el proyecto SARMedix original.
