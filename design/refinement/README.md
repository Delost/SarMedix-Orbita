# Órbita 2.0 · Refinamiento de la primera iteración

## Entrega y alcance

Se conservó el trabajo previo sin commit, push ni pull. No se ejecutó la aplicación ni se conectó con MySQL: incluso abrir Lotes registra una acción histórica desde su controlador. No se modificaron controladores, modelos, repositorios, servicios, configuración, datos, vistas de entrega ni impresión.

### Cambios de composición

- **Lotes:** fichas compactas, producto como título, cantidad destacada y datos secundarios alineados. Vencimiento con texto y color: vencido antes de hoy, próximo hasta hoy + 30 días, vigente después; fecha ausente se identifica como «Sin fecha». Stock cero se identifica independientemente del vencimiento. Se mantienen panel orbital, permisos y enlaces originales.
- **Registrar entrada:** composición de dos zonas: identificación por escáner/manual en una superficie azul y detalle de recepción a la derecha. Lote y recepción se organizan en paralelo, con revisión debajo. `datosEntrada` conserva la propiedad de ocultar todos los datos dependientes del producto. En ancho reducido, las zonas se apilan en orden de lectura.
- **Editar lote:** ficha con dos grupos semánticos: identidad/vigencia y existencias/destino; pie con la acción de actualizar y explicación de la confirmación. Se añaden asociaciones explícitas de etiquetas a los controles.
- **Confirmaciones de entrada y edición:** cabecera con icono, cuerpo y zona independiente de decisiones. Se conserva el resumen de entrada y cada botón original. Se añade nombre accesible, foco inicial en Volver/No, contención de Tab y retorno de foco; Escape ejecuta el botón original de regreso. Los manejadores existentes siguen controlando envío, cancelación y limpieza.
- **Dosificaciones:** cabecera y mesa más compactas, grupos numerados, resumen con apariencia de etiqueta y anuncio accesible, biblioteca de tarjetas más densas, contador real de programaciones y etiqueta visible para copias de reimpresión. Guardar e imprimir continúa siendo una sola acción. El aviso de que imprimir no descuenta stock sigue visible.
- **Historial:** búsqueda con etiqueta exterior y ancho flexible para evitar recortes, filtros más próximos, bitácora compacta, fechas con cifras alineadas y acentos según las categorías existentes. No se cambió la clasificación ni el análisis de descripciones.

### Limitación: stock bajo

La regla existente en Ubicaciones suma el stock del producto por ubicación y compara `0 < stock <= producto.stock_minimo`. La acción Lotes solamente entrega `List<Lote>`; este modelo no incluye el mínimo y no recibe la colección de productos. Por ello **no se añadió una clasificación inventada de stock bajo**. Mostrarla correctamente requiere un futuro cambio autorizado del contrato de datos. El listado actual tampoco tenía búsqueda ni filtros propios: se conservaron todas sus acciones existentes sin agregar solicitudes al backend.

## Archivos de esta entrega

Vistas modificadas, dentro de `LoginSARMedix/Views/Home/`:

- `Lotes.cshtml`
- `CrearLote.cshtml`
- `EditarLote.cshtml`
- `Dosificaciones.cshtml`
- `Historial.cshtml`

Archivos nuevos:

- `LoginSARMedix/wwwroot/css/sarmedix-refinement.css`: estilos de pantalla, cargados exclusivamente en estas cinco vistas.
- `LoginSARMedix/wwwroot/js/sarmedix-form-focus.js`: apoyo de foco en los dos modales de lotes.
- `design/refinement/baseline.json`: estado inicial de las cinco vistas y hashes de los demás archivos existentes.
- `design/refinement/refine.mjs`: migración inicial; rechaza una segunda ejecución para preservar la referencia.
- `design/refinement/verify.mjs`: auditoría reproducible de contratos y alcance.
- `design/refinement/check-focus.mjs`: prueba aislada del apoyo de foco.
- Este documento.

## Verificación realizada

- `dotnet build LoginSARMedix.slnx --no-restore`: correcto, cero errores. Dos advertencias CS8604 en HomeController.cs, líneas 142 y 143, archivo sin modificaciones en esta entrega.
- `node design/refinement/verify.mjs`: scripts inline originales idénticos normalizando saltos de línea; contratos de controles, nombres, IDs, rutas, valores, condiciones, tokens antifalsificación y anidación estática comprobados. 154 archivos existentes fuera de alcance permanecen idénticos por SHA-256.
- Dependencias revisadas antes del cambio: las cinco vistas usan IDs y funciones inline; no se encontraron dependencias funcionales con `parent`, `closest`, `children` o selectores de estructura. Los nuevos contenedores no reemplazan los nodos usados por escáner, AJAX, cálculos o resúmenes.
- `node design/refinement/check-focus.mjs`: apertura, Tab, Shift+Tab, Escape, retorno al control anterior y preservación del foco asignado por limpieza/escáner, mediante DOM simulado.
- Los estilos nuevos están contenidos en `@media screen`. No se incorporaron nuevas animaciones; se conservan las existentes y sus controles de pausa/reducción. No se alteró el CSS de impresión.

Estas comprobaciones son de compilación, código y simulación aislada. **No equivalen a una validación visual en navegador ni a pruebas integradas de AJAX, escáner o impresión**, que quedan pendientes en un entorno de prueba. No se generaron medicamentos ni programaciones de demostración.

## Pruebas pendientes en Visual Studio

Usar una base de prueba, no datos reales, para las acciones que guardan o registran auditoría.

1. **Lotes:** comparar roles con/sin Registrar productos; comprobar edición y navegación. Revisar fechas ayer, hoy, hoy + 30, hoy + 31, fecha ausente y stock cero. Confirmar que cantidades y orden no cambian.
2. **Entrada:** alternar Escáner/Manual; leer un código normal y GS1; comprobar producto, lote y fecha detectados, corrección manual, código inexistente, errores AJAX y foco del escáner. Comprobar envases, contenido y total calculado, ubicación y resumen, sin cambiar reglas.
3. **Confirmación de entrada:** validar obligatorios y vencidos; comprobar Volver, Limpiar y Sí registrar en base de prueba. Verificar teclado, Escape, desplazamiento de modal, retorno de foco y ausencia de doble envío.
4. **Edición:** revisar valores iniciales, obligatorios, cantidad cero y rechazo de negativos. Probar Sí, No y Cancelar con sus diferencias originales (Cancelar restablece el formulario). Confirmar resultado de ActualizarLote.
5. **Dosificaciones:** cargar clínicas, medicamentos disponibles, ausencia de stock útil y error de carga. Revisar resumen y habilitación del botón; cantidades/copias y límites existentes, guardar e imprimir, reimpresión y acceso al escáner. Verificar que imprimir no descuenta stock y que el descuento continúa exclusivamente en entrega.
6. **Historial:** buscar descripciones/responsables largos, combinar categoría/período y búsqueda, limpiar filtros conservando búsqueda, paginar y revisar estados vacíos. Comparar responsables, fechas, descripciones y movimientos con registros originales.
7. **Presentación:** anchos 1440, 1024, 768 y 390 px, zoom 200 %, teclado completo, foco visible, lector de pantalla para resúmenes, contenido largo, pausa global y `prefers-reduced-motion`. Verificar vista previa de impresión de etiquetas y página de impresión original.

## Inventario para siguientes etapas — sin modificar

- Usuarios y Permisos: CrearUsuario, EditarUsuario, CrearRol, EditarRol, RolesPermisos, Usuarios, RolesInactivos y confirmaciones asociadas.
- Productos: CrearProducto, EditarProducto, listado y confirmaciones de gestión.
- Sectores: formularios y modales de Ubicaciones.
- Medicamentos Controlados: formularios de Modulos/MedicamentosControlados y sus confirmaciones.
- Inventario y Movimientos: TrasladarStock, BajaInventario, SalidaExtraordinaria, InventarioUbicacion y formularios asociados a movimientos.
- Flujo de entrega: EntregaDosificacion y revisión específica de impresión, manteniendo la separación entre preparar, imprimir y entregar.
- Acceso: recuperación/verificación de contraseña y NuevaContrasena, si se incluyen en la siguiente autorización.

La iteración termina aquí. La extensión a otras pantallas requiere revisión y aprobación del usuario.
