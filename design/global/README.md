# SARMedix · Órbita 2.0 — Entrega visual global

## Resultado y alcance real

Se revisaron **49 archivos Razor**: vistas, layout, parciales y componente de alertas. El inventario identifica **40 declaraciones de formulario**, **15 raíces de modal** y **220 controles de acción/navegación**. Las instancias repetidas por filas de la base de datos no se cuentan como archivos o formularios diferentes.

Se modificaron 42 archivos Razor, se creó `sarmedix-global.css` y se retiró el bloque duplicado de botones de `sarmedix-system.css`. Los siete archivos Razor restantes son parciales artísticos o de infraestructura revisados y conservados. El detalle por elemento está en [COVERAGE.md](COVERAGE.md), las 220 acciones en [ACTIONS.md](ACTIONS.md) y la lista exacta de archivos en [CHANGED.md](CHANGED.md).

**La implementación y auditoría estática están terminadas. La validación visual en navegador y las pruebas funcionales integradas están pendientes.** El navegador disponible agotó el tiempo de conexión al servidor local de pruebas estáticas; no se obtuvieron capturas verificadas. No se afirma que la interfaz haya pasado QA visual completo.

## Sistema visual y componentes compartidos

La referencia artística sigue siendo Bienvenida. Se conservan el azul profundo, las superficies luminosas, la marca, el instrumento orbital, los iconos SVG y las composiciones aprobadas de Lotes, Dosificaciones e Historial.

El nuevo sistema global define tokens de tinta, azul, fondo, borde, radio, sombra y duración. Las anotaciones `data-orbit-action` desacoplan el estilo de las clases que manipula el JavaScript existente:

| Variante | Propósito |
|---|---|
| primary | Crear, registrar, guardar, confirmar operaciones ordinarias |
| secondary | Editar, volver, consultar y reimprimir |
| quiet | Buscar, filtrar, limpiar filtros y paginar |
| warning | Desactivar, salir, trasladar y confirmaciones compartidas de atención |
| danger | Eliminar y registrar baja |
| icon | Campana, cerrar y menú compacto |
| navigation | Tarjetas, enlaces de navegación, logo y salto al contenido |

Se unificaron normal, hover, focus, active, disabled y soporte visual para `aria-busy` cuando exista. No se añadió un estado de carga que deshabilite envíos ni se inventaron decisiones de éxito/error. Los estados generados por AJAX siguen dependiendo de los scripts originales.

La hoja global se carga al final del layout y en las dos páginas independientes. Sus selectores tienen alcance explícito y prioridad suficiente para resolver estilos locales antiguos. Se retiró el bloque anterior de acciones de la hoja de sistema; el CSS local restante conserva reglas de visibilidad, estructura, errores e impresión que no se pueden borrar indiscriminadamente. Hay una autoridad global para la presentación de las acciones, sin modificar las clases funcionales.

## Composiciones y formularios reconstruidos

- **Acceso:** portal de identidad y credenciales en dos zonas para login, recuperación y código; nueva contraseña combina panel de identidad y formulario. No se añaden pasos de autenticación.
- **Usuarios:** identidad personal y perfil de acceso en fieldsets independientes. Se conserva orden de campos, roles, validaciones AJAX y navegación. El mensaje de error de EditarUsuario que antes usaba `alert()` ahora se presenta en un bloque `role="alert"`, bajo la misma condición Razor y con el mismo mensaje del servidor; ya no exige cerrar una ventana nativa.
- **Roles y permisos:** definición de rol junto a contexto lateral; mesa de permisos con selector/gestión y matriz de capacidades. La confirmación de desactivación conserva su funcionamiento y envío.
- **Productos:** ficha dividida entre identificación/presentación y contenido/inventario. No se cambian los bloques condicionales Medicamento/Insumo, unidades, códigos ni stock mínimo. El catálogo usa imagen lateral y datos compactos.
- **Lotes:** se conserva la composición aprobada de recepción, edición y fichas. Sus acciones pasan a la misma familia que el resto del sistema.
- **Sectores:** atlas de tarjetas, menús comunes y formularios laterales para nombre/tipo. La confirmación sigue separada y conserva las reglas de eliminación/inactivación.
- **Movimientos:** zona editable y panel de revisión contrastado para traslado, baja y salida extraordinaria. No se alteran cantidades, selección de lotes, destinos, motivos ni cálculos.
- **Controlados:** el modal divide información del medicamento/lote/stock y campos de registro; mantiene la segunda confirmación. Las tablas anidadas, filas de detalle y selectores originales permanecen.
- **Dosificaciones y entrega:** la mesa aprobada conserva su proceso. La entrega dispone de estación de lectura y panel de resultado contiguos; el escáner mantiene autofocus y Enter. Imprimir sigue separado del descuento por entrega.
- **Historiales:** consolas laterales para Usuarios y Productos, banda de consulta por sector y agrupación temporal para salidas del turno. Tablas compactas, fechas y acciones comunes; no se modifican los registros.
- **Listados y estados:** directorios de usuarios activos/inactivos, roles inactivos e inventario reciben cabeceras semánticas y tablas compactas. Estados vacíos, badges, mensajes y controles comparten reglas.
- **Errores:** panel propio para la vista Error, conservando contenido técnico e identificador de solicitud.

Los formularios de una sola acción, por ejemplo reactivar un registro, mantienen su estructura mínima y reciben el sistema común. No se les agregan campos o pasos por motivos estéticos.

## Modales y navegación

Los 15 modales tienen superficies y zonas de decisión comunes; los formularios de Sectores y Controlados tienen composiciones específicas. Se conservaron IDs, botones, clases de visibilidad, funciones de apertura/cierre y diferencias entre Sí, No, Cancelar, Volver y Limpiar. No se cambió ningún manejador de confirmación ni se sustituyó una confirmación personalizada por alert/confirm/prompt.

El foco y Escape preexistentes se conservaron. El apoyo de foco de los dos modales de lotes introducido en la entrega anterior sigue activo y pasó su prueba aislada. **No se afirma que todos los modales tengan una nueva contención de foco ni que hayan sido probados con lector de pantalla**: revisar los recorridos existentes en las pruebas manuales, especialmente las confirmaciones superpuestas de Sectores y Controlados.

Barra superior, usuario, cierre de sesión, sidebar, submenús, tarjetas de módulos, enlaces de retorno, paginación, campana y bandeja se integran en el sistema global. Las rutas y condiciones de permisos se conservaron exactamente. No se ocultaron acciones para simplificar la vista móvil.

## Movimiento y accesibilidad

Se mantienen las animaciones aprobadas y se añaden entradas cortas de 220 ms a los nuevos paneles. Los controles tienen respuesta visual inmediata y foco visible. Las transiciones de botones respetan tanto `prefers-reduced-motion` como `sm-motion-paused`, incluso frente a reglas CSS con prioridad alta.

Las columnas se apilan a 760 px; las consolas y la mesa de permisos se simplifican a 1100 px. Se preserva el desplazamiento horizontal contenido para tablas anchas. Las nuevas agrupaciones siguen el orden del DOM y de tabulación; se añaden asociaciones de etiquetas donde se pudo resolver inequívocamente el ID existente.

## Impresión y límites técnicos

- No se modificó ningún bloque CSS local, incluidos los de impresión; la auditoría compara sus textos completos.
- Las reglas visuales nuevas están en medios de pantalla. Las nuevas cabeceras de tablas se ocultan fuera de pantalla.
- ImprimirDosificacion e InformeSalidasTurno conservan etiquetas, dimensiones, códigos, datos, formato de informe y scripts. Se normalizaron sus controles de pantalla.
- Lotes sigue sin disponer del stock mínimo del producto. No se inventó una clasificación de stock bajo ni se amplió el backend.
- No se añadieron medicamentos, programaciones ni datos de ejemplo. Las vistas estáticas contienen campos vacíos y están desconectadas de la aplicación.
- Persisten dos advertencias CS8604 de nulabilidad en HomeController.cs (142 y 143), archivo protegido y sin cambios en esta entrega.

## Verificaciones realizadas

1. `dotnet build LoginSARMedix.slnx --no-restore`: compilación correcta, 0 errores, 2 advertencias existentes.
2. `node design/global/verify.mjs`: 49 archivos Razor; atributos de controles, orden, pertenencia a formularios, rutas, condiciones, tokens, clases y anidación estática conservados. Comprueba también dependencias CSS/JS y parciales.
3. Comparación íntegra de scripts: todos los scripts funcionales se conservan. Única excepción de presentación auditada: el `alert()` del mensaje de EditarUsuario se reemplaza por texto Razor escapado con `role="alert"`; misma condición y contenido.
4. Los 220 controles de acción/navegación tienen variante; inventario individual revisado y corregido para no confundir consultas con operaciones destructivas.
5. **109 archivos existentes fuera de las vistas y de la hoja CSS consolidada permanecen idénticos por SHA-256**, incluidos controladores, modelos, repositorios, servicios, configuración y JavaScript existente.
6. `node design/refinement/check-focus.mjs`: simulación del foco de confirmaciones de lotes aprobada. No sustituye una prueba real de navegador.
7. Intento de vista estática por navegador: falló por `ERR_CONNECTION_TIMED_OUT`. Solo había navegador integrado disponible. No se ejecutó la aplicación ni se conectó a MySQL para sustituir esta prueba.

El `git diff` general incluye cambios anteriores del usuario, entre ellos HomeController y appsettings. La referencia de esta entrega es `design/global/baseline.json`; sus hashes demuestran que esos archivos no se tocaron durante esta solicitud. No se hizo commit, push, pull ni sincronización remota.

## Pruebas manuales pendientes en Visual Studio

Usar un entorno de pruebas para operaciones que escriban inventario, usuarios o auditoría.

1. **Acceso:** login correcto/incorrecto, recuperación, código y cambio de contraseña; mensajes y teclado.
2. **Permisos:** recorrer con cada rol y comprobar rutas/acciones visibles y acceso denegado. No basta revisar como administrador.
3. **Usuarios y roles:** crear/editar, AJAX de RUT/correo/usuario, guardar permisos, desactivar/reactivar/eliminar y diferencias entre los botones de confirmación.
4. **Productos:** Medicamento/Insumo, código duplicado o escaneado, unidad sugerida/personalizada, concentración, contenido, mínimo, imagen y errores de envío.
5. **Lotes:** manual/GS1, producto desconocido, vencido, próximo, stock cero, envases/total, ubicación, edición y limpieza/cancelación.
6. **Sectores:** crear/editar, tipos, menús, restricciones de cambio de tipo, inactivar/reactivar/eliminar, inventario y filtros.
7. **Movimientos:** traslado, baja y salida extraordinaria; revisión, cantidades, destinos, falta de stock y mensajes originales.
8. **Controlados:** permisos, filtros, lotes/historial expandibles, entrada/salida, motivo, validaciones y doble confirmación.
9. **Dosificación/entrega:** cargar medicamentos reales disponibles de prueba, programar, imprimir/reimprimir, límite de copias; confirmar que imprimir no descuenta y que la entrega sigue aplicando FEFO una sola vez.
10. **Historiales e informes:** búsqueda, combinación de filtros, limpieza, paginación, rangos de turno y cruce de medianoche; comparar contenido de informe/descarga.
11. **Alertas:** campana, cantidades, destinos, estados vacíos y menú en pantalla pequeña.
12. **Presentación:** 1440/1024/768/390 px, zoom 200 %, texto largo, Tab/Shift+Tab, Escape, foco inicial/retorno, lector de pantalla, pausa global y reducción de movimiento. Verificar modales superpuestos.
13. **Impresión física:** etiquetas y códigos de barras con impresora habitual; comprobar dimensiones, número de copias y PDF/informe. No se cambió su geometría, pero esta prueba aún es necesaria.

## Archivos de auditoría y reanudación

- `inventory.json`: inventario inicial con formularios, botones, modales, selectores y puntos de HTML dinámico.
- `baseline.json`: fuentes Razor anteriores y hashes de archivos protegidos.
- `transform.mjs`: transformación reproducible desde esa referencia. No ejecutarla sobre ajustes manuales posteriores sin revisar, pues vuelve a partir de la referencia inicial.
- `verify.mjs`: auditoría actual; ejecutar desde la raíz del repositorio.
- `report.mjs`: genera matrices y lista de cambios.
- `preview.mjs` y `previews/`: vistas estáticas sin datos ni scripts de aplicación. No son una ejecución Razor ni evidencia visual aprobada.

El trabajo de implementación no depende de que el servidor estático esté activo. La aplicación puede abrirse y compilarse normalmente desde Visual Studio.
