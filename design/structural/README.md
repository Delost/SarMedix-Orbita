# Órbita 2.0 — tres composiciones reconstruidas

Entrega del 15 de octubre de 2026. Se reconstruyen únicamente Lotes, Dosificaciones e Historial del sistema. Se conserva Bienvenida como referencia y no se extiende esta iteración al resto de las pantallas.

## Cambios estructurales

### Inventario / Lotes

La cabecera horizontal y la tabla se sustituyen por una composición asimétrica. Un panel lateral reúne contexto, conteo de lotes de la vista, registro de entrada y navegación. El área principal presenta una lista semántica de existencias: identidad del producto y lote, un bloque de vencimiento/stock/ubicación y su acción de edición.

El instrumento orbital es decorativo: el número central procede de `Model.Count`, identifica los lotes de esta vista y no simula un indicador clínico ni suma unidades de medicamentos diferentes. Todos los campos originales de cada lote continúan presentes. Las acciones de registrar y editar siguen bajo `puedeRegistrar`.

### Dosificaciones

Los dos paneles paralelos anteriores se convierten en una mesa de preparación horizontal y una biblioteca inferior. El formulario sigue siendo único: dos grupos visibles (destino/medicamento y contenido/copias) junto a un panel de resumen e impresión. No hay pasos nuevos, asistentes, formularios anidados ni envíos adicionales.

Las programaciones guardadas son tarjetas distribuidas en una cuadrícula, cada una con medicamento, cantidad, clínica, código y el formulario original de reimpresión. Se conserva el acceso al escáner y la advertencia de que imprimir no descuenta stock. Se asocian las cuatro etiquetas del formulario a sus controles existentes mediante `for`.

### Historial del sistema

La barra de herramientas pasa a ser una consola lateral de consulta. Conserva los dos formularios GET originales, filtros ocultos y enlaces. La tabla se transforma en una bitácora de artículos: número de registro, responsable, fecha/hora y descripción estructurada. Se mantienen el orden recibido, todas las expresiones, el análisis original de descripciones y la paginación del servidor.

El panel de resultados utiliza el total y los filtros reales existentes. No se agrupan ni se eliminan eventos, no se altera el orden por fecha y no se inventan estadísticas.

## Archivos de aplicación

Modificados:

- `LoginSARMedix/Views/Home/Lotes.cshtml`
- `LoginSARMedix/Views/Home/Dosificaciones.cshtml`
- `LoginSARMedix/Views/Home/Historial.cshtml`

Nuevos:

- `LoginSARMedix/Views/Shared/_OrbitInstrument.cshtml`: instrumento decorativo reutilizable.
- `LoginSARMedix/wwwroot/css/sarmedix-structural.css`: composiciones, estados de foco, responsive y movimiento. Solo se carga desde las tres vistas.

Documentación y comprobaciones: `design/structural/baseline.json`, `rebuild.mjs`, `verify.mjs` y este documento. La línea base conserva las tres vistas previas y hashes de los archivos protegidos; no incluye valores de configuración. `rebuild.mjs` registra la transformación inicial y se niega a repetirla si existe la línea base. No debe volverse a ejecutar sobre las vistas ya reconstruidas.

## Funcionalidad y dependencias

Antes de editar se inspeccionaron scripts de las tres vistas y el validador global. Lotes depende del ID `mensajeListado` para retirar su notificación; Dosificaciones utiliza IDs de campos y resumen, eventos, opciones generadas y su endpoint de medicamentos; Historial utiliza Razor para interpretar y presentar registros, y rutas GET para buscar, filtrar y paginar.

Los scripts originales permanecen idénticos byte por byte. Los controles mantienen nombres, IDs, rutas, métodos, valores, límites, estados iniciales y antifalsificación. Se mantienen los contenedores `.campo` del formulario de dosificación y cada control dentro de su formulario original. No se modifican JavaScript, backend, paquetes ni configuración. Las otras vistas, el layout, el sidebar, el escáner y las ventanas de impresión quedan intactos.

## Movimiento y accesibilidad

- Giro lento de un anillo decorativo; números y textos se mantienen estables.
- Entrada breve de los grandes paneles (420 ms); los controles están disponibles desde el inicio, sin temporizadores ni bloqueos.
- Respuesta de borde/sombra al pasar sobre existencias, programaciones y eventos.
- Respeto de la preferencia de movimiento reducido y de la pausa global existente.
- Grupos de campos con `fieldset`/`legend`, etiquetas asociadas y foco visible.
- Composiciones adaptadas a pantalla estrecha, con todos los controles y datos disponibles.

## Verificaciones

```powershell
node design/structural/verify.mjs
node design/phase-two/check-motion.mjs
dotnet build LoginSARMedix/LoginSARMedix.csproj --no-restore -p:NuGetAudit=false -v:minimal
```

La auditoría estructural comprueba scripts exactos, controles completos, rutas, condiciones, bucles, antifalsificación, referencias de datos, código de interpretación del historial y anidamiento estático HTML. Comprueba además 83 archivos protegidos sin modificaciones. La prueba aislada de movimiento del piloto también pasa; no sustituye la revisión de estas nuevas animaciones en navegador.

Compilación correcta, sin errores; persisten las dos advertencias CS8604 preexistentes en HomeController (142 y 143). No se ejecutó la aplicación, MySQL ni operaciones de Git.

El verificador `design/integral/migrate.mjs verify` corresponde a la fase anterior y exige conservar todo el HTML. Ahora señalará estas tres vistas como diferentes por la reconstrucción autorizada. No se cambió su línea base para ocultar esa diferencia; el verificador vigente para esta entrega es `design/structural/verify.mjs`.

## Revisión manual pendiente

No se realizó validación visual en navegador en esta entrega. Comprobar las tres pantallas reales con datos representativos, nombres extensos, listas vacías y listas numerosas; anchos de 360, 768 y 1440 px y zoom al 200 %. Revisar lectura, foco de teclado, pausa y movimiento reducido.

En un entorno de pruebas autorizado: comprobar roles con/sin registro, notificaciones de Lotes, carga de medicamentos por clínica, errores de validación y envío de dosificación, reimpresión, filtros combinados y paginación del historial. Contrastar etiquetas y códigos impresos. No se ejecutaron operaciones que alteren inventario para esta revisión.

La entrega se detiene en estas tres pantallas a la espera de revisión visual.
