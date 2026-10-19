# SARMedix · Órbita 2.0 — integración de vistas reales

Estado al 15 de octubre de 2026: capa visual integrada en 38 vistas de Home y la vista compartida Error. No se inició la aplicación ni se accedió a MySQL. La revisión visual en navegador y las pruebas operativas siguen pendientes; la compilación y los controles estáticos no las sustituyen.

## Continuidad del trabajo

Al retomar estaban integrados Acceso, Usuarios/Permisos, Productos/Inventario y Sectores (23 vistas). Se continuó con Movimientos, Dosificaciones, Controlados, Historiales e informes. Bienvenida conserva el piloto aprobado y se registra como familia `home`; Error también se integra. No se recapturó la línea base ni se reescribieron los bloques originales de las vistas.

## Archivos de presentación

- `LoginSARMedix/Views/Shared/_Layout.cshtml`: carga de la hoja compartida, atributos de identificación visual y parcial de identidad en sus dos ramas de sesión.
- `LoginSARMedix/Views/Shared/_ScreenIdentity.cshtml` (nuevo): nombre de familia y símbolo SVG ya existente, sin consultas ni decisiones de permisos.
- `LoginSARMedix/wwwroot/css/sarmedix-system.css` (nuevo): superficies, títulos, formularios, tablas, filtros, tarjetas, resúmenes, modales y adaptaciones por familia. Reglas visuales limitadas a pantalla; movimiento reducido y pausa compatibles con Órbita 2.
- Las 39 vistas enumeradas abajo: metadatos visuales; los tres submenús generales reciben símbolos SVG decorativos. Las dos páginas independientes cargan la hoja visual directamente.
- `design/integral/migrate.mjs`, `baseline.json`, `audit.mjs` y este documento: aplicación idempotente, huellas de integridad, auditoría y registro. La línea base contiene hashes, no valores de configuración.

No se alteraron el sidebar aprobado, los símbolos compartidos, los scripts de Órbita ni las hojas anteriores durante esta integración. Sus estilos activos, iluminación, animaciones y controles de pausa se conservan.

## Pantallas integradas y archivos Razor

Rutas relativas a `LoginSARMedix/Views/Home/`, salvo Error. Cada nombre corresponde a su archivo `.cshtml`.

| Familia | Archivos |
| --- | --- |
| Acceso (5) | Index, RecuperarContrasena, VerificarCodigo, NuevaContrasena, AccesoDenegado |
| Usuarios y permisos (9) | Modulos/UsuariosPermisos, Usuarios, CrearUsuario, EditarUsuario, ListadoEliminarUsuarios, RolesPermisos, CrearRol, EditarRol, RolesInactivos |
| Productos e inventario (7) | Modulos/Productos, Productos, CrearProducto, EditarProducto, Lotes, CrearLote, EditarLote |
| Sectores (2) | Ubicaciones, InventarioUbicacion |
| Movimientos (4) | Modulos/MovimientoHistorial, TrasladarStock, BajaInventario, SalidaExtraordinaria |
| Dosificaciones (3) | Dosificaciones, EntregaDosificacion, ImprimirDosificacion |
| Controlados (1) | Modulos/MedicamentosControlados |
| Historiales e informes (6) | Historial, HistorialUsuarios, HistorialProductos, HistorialSectores, HistorialSalidasTurno, InformeSalidasTurno |
| Bienvenida (1) | Bienvenida |
| Error (1) | ../Shared/Error |

## Tratamiento visual

Se extiende el lenguaje azul profundo, iluminación suave, bordes precisos y superficies claras de Órbita 2. Los encabezados identifican cada área y los controles ofrecen mayor legibilidad, foco visible, contraste y espacio. Las tarjetas de módulos tienen elevación breve al pasar el puntero; las superficies de modal incorporan una entrada corta de opacidad. Los controles cambian borde y sombra sin desplazar los formularios.

Los resúmenes de movimientos separan lectura y captura. Dosificaciones utiliza tarjetas de programación y un campo de escaneo amplio y estable. Controlados conserva la jerarquía producto → lote → historial, reforzada con superficies anidadas. Historiales mejora filtros, lectura de eventos y métricas de turno. Las tablas mantienen todas sus columnas, con desplazamiento horizontal en sus contenedores.

No se añade movimiento continuo al escáner ni a resultados clínicos. Se respeta `prefers-reduced-motion` y la pausa global existente. No se introducen librerías, fuentes remotas, nuevas llamadas de red ni paquetes.

## Preservación funcional y límites

La verificación de integridad compara el contenido original completo de las 39 vistas, normalizando únicamente los metadatos añadidos, las referencias de estilo de páginas independientes y los iconos decorativos de submenú. Compara además todos los scripts originales de esas vistas. Las condiciones Razor, campos, IDs, nombres, rutas, métodos, tokens, eventos y relaciones DOM originales permanecen intactos.

Se comprueban 44 archivos protegidos de backend, configuración y recursos originales. El layout y la navegación se contrastan adicionalmente con sus contratos originales del piloto: scripts, atributos funcionales, condiciones y bloque inicial Razor. Esto verifica preservación del código; no prueba por sí solo el comportamiento en ejecución ni descarta problemas visuales.

Se conserva el formato físico de etiquetas y códigos de barras. En la pantalla de impresión se rediseña la barra de herramientas; las dimensiones de las etiquetas no cambian. El informe independiente recibe estilos solo para pantalla y conserva sus reglas de impresión. El HTML descargable generado dentro de HomeController permanece sin rediseñar: cambiarlo exigiría modificar un controlador, fuera del alcance autorizado.

## Comprobaciones realizadas

```powershell
node design/integral/migrate.mjs verify
node design/integral/audit.mjs
node design/phase-two/check-motion.mjs
dotnet build LoginSARMedix/LoginSARMedix.csproj --no-restore -p:NuGetAudit=false -v:minimal
```

- Integridad: 39 contratos de vistas y sus scripts preservados; 44 archivos protegidos sin cambios.
- Cobertura: 39/39 pantallas integradas una sola vez; dependencias locales referenciadas por el layout y seis símbolos SVG presentes.
- Movimiento: prueba aislada existente aprobada para inclinación máxima de 1,5°, pausa sincronizada, movimiento reducido, exclusión táctil y cancelación.
- Compilación realizada tras cada grupo: correcta. Las compilaciones que recompilaron Razor mostraron únicamente las dos advertencias CS8604 preexistentes de HomeController, líneas 142 y 143, relativas a argumentos posiblemente nulos. No se modificó ese código.
- No se ejecutaron migraciones, consultas, operaciones de Git ni la aplicación web.

## Validación manual pendiente

1. Revisar las pantallas reales en navegador, a 360/768/1440 px y con zoom al 200 %: solapamientos, columnas, mensajes largos, scroll, textos y contrastes.
2. Recorrer con teclado menús, formularios, filtros y modales; comprobar foco, cierre, confirmaciones y todos los estados de error/éxito. Verificar pausa de movimiento y preferencia del sistema.
3. En un entorno de pruebas autorizado, recorrer perfiles y permisos, recuperación de acceso, altas/ediciones/bajas, filtros y paginación. No usar operaciones reales para una revisión visual.
4. Probar traslado, baja y salida extraordinaria, dosificación, reimpresión y escáner con datos de prueba; confirmar validaciones, stock, notificaciones y prevención de duplicados.
5. Probar despliegue de lotes e historiales de controlados, ambas confirmaciones y cancelaciones.
6. Comprobar vista previa de impresión, tamaño físico y lectura de códigos de barras; imprimir informe y contrastar el archivo descargado con los datos mostrados.

Las demostraciones de `design/phase-one` y `design/phase-two` documentan el piloto anterior; no representan la cobertura integral actual. Para esta fase, usar los verificadores de `design/integral`; el verificador antiguo considera otras vistas inmutables y no corresponde a la autorización integral.
