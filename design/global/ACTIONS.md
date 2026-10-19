# Inventario individual de acciones

Las variantes se asignan por propósito y se conservan aunque JavaScript cambie clases/texto. Las confirmaciones compartidas entre varias operaciones usan advertencia cuando no hay una semántica destructiva única.

| Vista | Variante | Control original (atributos) |
|---|---|---|
| Home/AccesoDenegado.cshtml | secondary | `<a asp-controller="Home" asp-action="Modulos" class="btn-volver">` |
| Home/BajaInventario.cshtml | secondary | `<a asp-controller="Home" asp-action="MovimientoHistorial" class="btn volver">` |
| Home/BajaInventario.cshtml | danger | `<button type="submit" id="btnBaja" class="btn confirmar" disabled>` |
| Home/Bienvenida.cshtml | secondary | `<button class="sm-motion-toggle" type="button" aria-pressed="false" aria-label="Pausar efectos ambientales">` |
| Home/Bienvenida.cshtml | navigation | `<a asp-controller="Home" asp-action="UsuariosPermisos" class="modulo habilitado sm-module-people">` |
| Home/Bienvenida.cshtml | navigation | `<a asp-controller="Home" asp-action="Productos" class="modulo habilitado sm-module-products">` |
| Home/Bienvenida.cshtml | navigation | `<a asp-controller="Home" asp-action="MovimientoHistorial" class="modulo habilitado sm-module-movements">` |
| Home/Bienvenida.cshtml | navigation | `<a asp-controller="Home" asp-action="MedicamentosControlados" class="modulo habilitado sm-module-controlled">` |
| Home/CrearLote.cshtml | secondary | `<button type="button" id="btnModoScanner" class="btn-modo activo" onclick="cambiarModo('scanner')">` |
| Home/CrearLote.cshtml | secondary | `<button type="button" id="btnModoManual" class="btn-modo" onclick="cambiarModo('manual')">` |
| Home/CrearLote.cshtml | quiet | `<button type="button" class="btn-buscar-codigo" onclick="buscarProductoEscaneado()">` |
| Home/CrearLote.cshtml | primary | `<button type="submit" id="btnRegistrarEntrada" class="btn-registrar-entrada">` |
| Home/CrearLote.cshtml | secondary | `<a asp-controller="Home" asp-action="Lotes" class="btn-volver-inventario">` |
| Home/CrearLote.cshtml | primary | `<button type="button" class="btn-modal-si" onclick="registrarLote()">` |
| Home/CrearLote.cshtml | secondary | `<button type="button" class="btn-modal-no" onclick="cerrarConfirmacion()">` |
| Home/CrearLote.cshtml | secondary | `<button type="button" class="btn-modal-cancelar" onclick="cancelarRegistro()">` |
| Home/CrearProducto.cshtml | primary | `<button type="submit" id="btnRegistrarProducto">` |
| Home/CrearProducto.cshtml | secondary | `<a asp-controller="Home" asp-action="Productos" class="btn-volver-productos">` |
| Home/CrearProducto.cshtml | primary | `<button type="button" class="btn-modal-si" onclick="registrarProducto()">` |
| Home/CrearProducto.cshtml | secondary | `<button type="button" class="btn-modal-no" onclick="cerrarConfirmacion()">` |
| Home/CrearProducto.cshtml | secondary | `<button type="button" class="btn-modal-cancelar" onclick="cancelarRegistro()">` |
| Home/CrearRol.cshtml | primary | `<button type="submit" class="btn-guardar-rol">` |
| Home/CrearRol.cshtml | secondary | `<a asp-controller="Home" asp-action="RolesPermisos" class="btn-volver-rol">` |
| Home/CrearRol.cshtml | primary | `<button type="button" class="btn-modal-si" onclick="crearRol()">` |
| Home/CrearRol.cshtml | secondary | `<button type="button" class="btn-modal-no" onclick="cerrarConfirmacionRol()">` |
| Home/CrearRol.cshtml | secondary | `<button type="button" class="btn-modal-cancelar" onclick="cancelarCreacionRol()">` |
| Home/CrearUsuario.cshtml | primary | `<button type="submit">` |
| Home/CrearUsuario.cshtml | secondary | `<a asp-controller="Home" asp-action="UsuariosPermisos" class="btn-volver-usuarios">` |
| Home/CrearUsuario.cshtml | primary | `<button type="button" class="btn-modal-si" onclick="crearUsuario()">` |
| Home/CrearUsuario.cshtml | secondary | `<button type="button" class="btn-modal-no" onclick="cerrarConfirmacion()">` |
| Home/CrearUsuario.cshtml | secondary | `<button type="button" class="btn-modal-cancelar" onclick="cancelarCreacion()">` |
| Home/Dosificaciones.cshtml | primary | `<button type="submit" class="btn-principal" id="btnCrearDosif" disabled>` |
| Home/Dosificaciones.cshtml | secondary | `<a asp-controller="Home" asp-action="EntregaDosificacion" class="btn-scan">` |
| Home/Dosificaciones.cshtml | secondary | `<button type="submit" class="btn-reimprimir">` |
| Home/EditarLote.cshtml | primary | `<button type="submit">` |
| Home/EditarLote.cshtml | secondary | `<a asp-controller="Home" asp-action="Lotes" class="btn-volver-listado">` |
| Home/EditarLote.cshtml | secondary | `<a asp-controller="Home" asp-action="Productos" class="btn-volver-productos">` |
| Home/EditarLote.cshtml | primary | `<button type="button" class="btn-modal-si" onclick="actualizarLote()">` |
| Home/EditarLote.cshtml | secondary | `<button type="button" class="btn-modal-no" onclick="cerrarConfirmacion()">` |
| Home/EditarLote.cshtml | secondary | `<button type="button" class="btn-modal-cancelar" onclick="cancelarEdicion()">` |
| Home/EditarProducto.cshtml | primary | `<button type="submit">` |
| Home/EditarProducto.cshtml | secondary | `<a asp-controller="Home" asp-action="ListadoProductos2" class="btn-volver-listado">` |
| Home/EditarProducto.cshtml | secondary | `<a asp-controller="Home" asp-action="Productos" class="btn-volver-productos">` |
| Home/EditarProducto.cshtml | primary | `<button type="button" class="btn-modal-si" onclick="actualizarProducto()">` |
| Home/EditarProducto.cshtml | secondary | `<button type="button" class="btn-modal-no" onclick="cerrarConfirmacion()">` |
| Home/EditarProducto.cshtml | secondary | `<button type="button" class="btn-modal-cancelar" onclick="cancelarEdicion()">` |
| Home/EditarRol.cshtml | primary | `<button type="submit" class="btn-guardar-rol">` |
| Home/EditarRol.cshtml | secondary | `<a asp-controller="Home" asp-action="RolesPermisos" asp-route-idRol="@Model.id_rol" class="btn-volver-rol">` |
| Home/EditarUsuario.cshtml | primary | `<button type="submit">` |
| Home/EditarUsuario.cshtml | secondary | `<a asp-controller="Home" asp-action="Usuarios" class="btn-volver">` |
| Home/EntregaDosificacion.cshtml | primary | `<button type="button" id="btnProcesarScan" class="btn-procesar-scan">` |
| Home/EntregaDosificacion.cshtml | secondary | `<a asp-controller="Home" asp-action="HistorialSalidasTurno" class="btn-historial-turno">` |
| Home/EntregaDosificacion.cshtml | secondary | `<a asp-controller="Home" asp-action="Dosificaciones" class="btn-volver">` |
| Home/Historial.cshtml | quiet | `<button type="submit" class="btn-buscar">` |
| Home/Historial.cshtml | quiet | `<button type="submit" class="btn-aplicar-filtros">` |
| Home/Historial.cshtml | quiet | `<a asp-controller="Home" asp-action="Historial" asp-route-buscar="@buscarActual" class="btn-limpiar-filtros">` |
| Home/Historial.cshtml | quiet | `<a asp-controller="Home" asp-action="Historial" asp-route-pagina="@(ViewBag.PaginaActual - 1)" asp-route-buscar="@buscarActual" asp-route-filtro="@filtroActual" asp-route-periodo="@periodoActual" class="pagina-boton">` |
| Home/Historial.cshtml | quiet | `<a asp-controller="Home" asp-action="Historial" asp-route-pagina="@i" asp-route-buscar="@buscarActual" asp-route-filtro="@filtroActual" asp-route-periodo="@periodoActual" class="pagina-boton @(i == ViewBag.PaginaActual ? "pagina-activa" : "")">` |
| Home/Historial.cshtml | quiet | `<a asp-controller="Home" asp-action="Historial" asp-route-pagina="@(ViewBag.PaginaActual + 1)" asp-route-buscar="@buscarActual" asp-route-filtro="@filtroActual" asp-route-periodo="@periodoActual" class="pagina-boton">` |
| Home/Historial.cshtml | secondary | `<a asp-controller="Home" asp-action="MovimientoHistorial" class="btn-volver">` |
| Home/HistorialProductos.cshtml | quiet | `<button type="submit" class="btn-buscar">` |
| Home/HistorialProductos.cshtml | quiet | `<button type="submit" class="btn-aplicar-filtros">` |
| Home/HistorialProductos.cshtml | quiet | `<a asp-controller="Home" asp-action="HistorialProductos" asp-route-buscar="@buscarActual" class="btn-limpiar-filtros">` |
| Home/HistorialProductos.cshtml | quiet | `<a asp-controller="Home" asp-action="HistorialProductos" asp-route-pagina="@(ViewBag.PaginaActual - 1)" asp-route-buscar="@buscarActual" asp-route-filtro="@filtroActual" asp-route-periodo="@periodoActual" class="pagina-boton">` |
| Home/HistorialProductos.cshtml | quiet | `<a asp-controller="Home" asp-action="HistorialProductos" asp-route-pagina="@i" asp-route-buscar="@buscarActual" asp-route-filtro="@filtroActual" asp-route-periodo="@periodoActual" class="pagina-boton @(i == ViewBag.PaginaActual ? "pagina-activa" : "")">` |
| Home/HistorialProductos.cshtml | quiet | `<a asp-controller="Home" asp-action="HistorialProductos" asp-route-pagina="@(ViewBag.PaginaActual + 1)" asp-route-buscar="@buscarActual" asp-route-filtro="@filtroActual" asp-route-periodo="@periodoActual" class="pagina-boton">` |
| Home/HistorialProductos.cshtml | secondary | `<a asp-controller="Home" asp-action="MovimientoHistorial" class="btn-volver">` |
| Home/HistorialSalidasTurno.cshtml | secondary | `<a asp-controller="Home" asp-action="EntregaDosificacion" class="btn-volver-scan">` |
| Home/HistorialSalidasTurno.cshtml | quiet | `<button type="submit" class="btn-aplicar">` |
| Home/HistorialSalidasTurno.cshtml | quiet | `<button type="button" class="preset" data-inicio="08:00" data-fin="00:00">` |
| Home/HistorialSalidasTurno.cshtml | quiet | `<button type="button" class="preset" data-inicio="08:00" data-fin="20:00">` |
| Home/HistorialSalidasTurno.cshtml | quiet | `<button type="button" class="preset" data-inicio="20:00" data-fin="08:00">` |
| Home/HistorialSalidasTurno.cshtml | secondary | `<a asp-controller="Home" asp-action="InformeSalidasTurno" asp-route-fecha="@Model.fecha.ToString("yyyy-MM-dd")" asp-route-horaInicio="@Model.hora_inicio" asp-route-horaFin="@Model.hora_fin" target="_blank" class="btn-informe">` |
| Home/HistorialSectores.cshtml | primary | `<button type="submit">` |
| Home/HistorialUsuarios.cshtml | quiet | `<button type="submit" class="btn-buscar">` |
| Home/HistorialUsuarios.cshtml | quiet | `<button type="submit" class="btn-aplicar-filtros">` |
| Home/HistorialUsuarios.cshtml | quiet | `<a asp-controller="Home" asp-action="HistorialUsuarios" asp-route-buscar="@buscarActual" class="btn-limpiar-filtros">` |
| Home/HistorialUsuarios.cshtml | quiet | `<a asp-controller="Home" asp-action="HistorialUsuarios" asp-route-pagina="@(ViewBag.PaginaActual - 1)" asp-route-buscar="@buscarActual" asp-route-filtro="@filtroActual" asp-route-periodo="@periodoActual" class="pagina-boton">` |
| Home/HistorialUsuarios.cshtml | quiet | `<a asp-controller="Home" asp-action="HistorialUsuarios" asp-route-pagina="@i" asp-route-buscar="@buscarActual" asp-route-filtro="@filtroActual" asp-route-periodo="@periodoActual" class="pagina-boton @(i == ViewBag.PaginaActual ? "pagina-activa" : "")">` |
| Home/HistorialUsuarios.cshtml | quiet | `<a asp-controller="Home" asp-action="HistorialUsuarios" asp-route-pagina="@(ViewBag.PaginaActual + 1)" asp-route-buscar="@buscarActual" asp-route-filtro="@filtroActual" asp-route-periodo="@periodoActual" class="pagina-boton">` |
| Home/HistorialUsuarios.cshtml | secondary | `<a asp-controller="Home" asp-action="MovimientoHistorial" class="btn-volver">` |
| Home/ImprimirDosificacion.cshtml | secondary | `<a asp-controller="Home" asp-action="Dosificaciones" class="btn-volver">` |
| Home/ImprimirDosificacion.cshtml | primary | `<button type="button" class="btn-print" onclick="window.print()">` |
| Home/Index.cshtml | primary | `<button type="submit">` |
| Home/Index.cshtml | secondary | `<a asp-controller="Home" asp-action="RecuperarContrasena">` |
| Home/InformeSalidasTurno.cshtml | secondary | `<a href="javascript:history.back();" class="btn-volver">` |
| Home/InformeSalidasTurno.cshtml | secondary | `<a asp-controller="Home" asp-action="DescargarInformeSalidasTurno" asp-route-fecha="@Model.fecha.ToString("yyyy-MM-dd")" asp-route-horaInicio="@Model.hora_inicio" asp-route-horaFin="@Model.hora_fin" class="btn-descargar">` |
| Home/InformeSalidasTurno.cshtml | primary | `<button type="button" class="btn-imprimir" onclick="window.print()">` |
| Home/InventarioUbicacion.cshtml | secondary | `<a asp-controller="Home" asp-action="Ubicaciones" class="inventario-volver">` |
| Home/ListadoEliminarUsuarios.cshtml | primary | `<button type="submit" class="btn-reactivar">` |
| Home/ListadoEliminarUsuarios.cshtml | danger | `<button type="submit" class="btn-eliminar">` |
| Home/ListadoEliminarUsuarios.cshtml | secondary | `<a asp-controller="Home" asp-action="Usuarios" class="btn-listado">` |
| Home/ListadoEliminarUsuarios.cshtml | secondary | `<a asp-controller="Home" asp-action="UsuariosPermisos" class="btn-volver-usuarios">` |
| Home/ListadoEliminarUsuarios.cshtml | warning | `<button type="button" class="btn-modal-si" onclick="realizarAccion()">` |
| Home/ListadoEliminarUsuarios.cshtml | secondary | `<button type="button" class="btn-modal-no" onclick="cerrarConfirmacion()">` |
| Home/ListadoEliminarUsuarios.cshtml | secondary | `<button type="button" class="btn-modal-cancelar" onclick="cancelarAccion()">` |
| Home/Lotes.cshtml | primary | `<a asp-controller="Home" asp-action="CrearLote" class="btn-nuevo-lote">` |
| Home/Lotes.cshtml | secondary | `<a asp-controller="Home" asp-action="ListadoProductos2" class="btn-listado-productos">` |
| Home/Lotes.cshtml | secondary | `<a asp-controller="Home" asp-action="Productos" class="btn-volver-productos">` |
| Home/Lotes.cshtml | secondary | `<a asp-controller="Home" asp-action="EditarLote" asp-route-idLote="@lote.id_lote" class="btn-editar">` |
| Home/Modulos/MedicamentosControlados.cshtml | quiet | `<button type="button" class="controlados-btn-buscar" onclick="buscarMedicamentosControlados()">` |
| Home/Modulos/MedicamentosControlados.cshtml | quiet | `<button type="button" class="controlados-btn-aplicar" onclick="aplicarFiltroControlados()">` |
| Home/Modulos/MedicamentosControlados.cshtml | quiet | `<button type="button" class="controlados-btn-limpiar" onclick="limpiarFiltroControlados()">` |
| Home/Modulos/MedicamentosControlados.cshtml | secondary | `<button type="button" class="controlados-btn-lotes" onclick="alternarLotesControlado( @medicamento.id_producto, this )" aria-expanded="false">` |
| Home/Modulos/MedicamentosControlados.cshtml | primary | `<button type="button" class="controlados-btn-movimiento controlados-btn-entrada" data-id-lote="@lote.id_lote" data-tipo="Entrada" data-medicamento="@(medicamento.nombre ?? "")" data-lote="@(lote.numero_lote ?? "")" data-stock="@lote.cantidad_actual" onclick="abrirModalMovimiento(this)">` |
| Home/Modulos/MedicamentosControlados.cshtml | warning | `<button type="button" class="controlados-btn-movimiento controlados-btn-salida" data-id-lote="@lote.id_lote" data-tipo="Salida" data-medicamento="@(medicamento.nombre ?? "")" data-lote="@(lote.numero_lote ?? "")" data-stock="@lote.cantidad_actual" onclick="abrirModalMovimiento(this)">` |
| Home/Modulos/MedicamentosControlados.cshtml | warning | `<button type="button" class="controlados-btn-movimiento controlados-btn-salida" disabled>` |
| Home/Modulos/MedicamentosControlados.cshtml | secondary | `<button type="button" class="controlados-btn-movimiento controlados-btn-historial" onclick="alternarHistorialLote( @lote.id_lote, this )" aria-expanded="false">` |
| Home/Modulos/MedicamentosControlados.cshtml | icon | `<button type="button" class="mc-cerrar" onclick="cerrarModalMovimiento()">` |
| Home/Modulos/MedicamentosControlados.cshtml | secondary | `<button type="button" class="mc-btn-cancelar" onclick="cerrarModalMovimiento()">` |
| Home/Modulos/MedicamentosControlados.cshtml | primary | `<button type="submit" id="btnConfirmarMovimiento" class="mc-btn-confirmar">` |
| Home/Modulos/MedicamentosControlados.cshtml | warning | `<button type="button" class="mcc-btn mcc-btn-si" onclick="confirmarMovimientoControlado()">` |
| Home/Modulos/MedicamentosControlados.cshtml | secondary | `<button type="button" class="mcc-btn mcc-btn-no" onclick="cerrarConfirmacionMovimiento()">` |
| Home/Modulos/MedicamentosControlados.cshtml | secondary | `<button type="button" class="mcc-btn mcc-btn-cancelar" onclick="cancelarConfirmacionMovimiento()">` |
| Home/Modulos/MovimientoHistorial.cshtml | navigation | `<a asp-controller="Home" asp-action="Historial" class="submenu-card">` |
| Home/Modulos/MovimientoHistorial.cshtml | navigation | `<a asp-controller="Home" asp-action="HistorialUsuarios" class="submenu-card">` |
| Home/Modulos/MovimientoHistorial.cshtml | navigation | `<a asp-controller="Home" asp-action="HistorialProductos" class="submenu-card">` |
| Home/Modulos/MovimientoHistorial.cshtml | secondary | `<a asp-controller="Home" asp-action="Modulos" class="btn-volver-submenu">` |
| Home/Modulos/Productos.cshtml | navigation | `<a asp-controller="Home" asp-action="CrearProducto" class="submenu-card">` |
| Home/Modulos/Productos.cshtml | navigation | `<a asp-controller="Home" asp-action="ListadoProductos2" class="submenu-card">` |
| Home/Modulos/Productos.cshtml | navigation | `<a asp-controller="Home" asp-action="Lotes" class="submenu-card">` |
| Home/Modulos/Productos.cshtml | secondary | `<a asp-controller="Home" asp-action="Modulos" class="btn-volver-submenu">` |
| Home/Modulos/UsuariosPermisos.cshtml | navigation | `<a asp-controller="Home" asp-action="CrearUsuario" class="submenu-card">` |
| Home/Modulos/UsuariosPermisos.cshtml | navigation | `<a asp-controller="Home" asp-action="Usuarios" class="submenu-card">` |
| Home/Modulos/UsuariosPermisos.cshtml | navigation | `<a asp-controller="Home" asp-action="ListadoEliminarUsuarios" class="submenu-card">` |
| Home/Modulos/UsuariosPermisos.cshtml | navigation | `<a asp-controller="Home" asp-action="RolesPermisos" class="submenu-card">` |
| Home/Modulos/UsuariosPermisos.cshtml | secondary | `<a asp-controller="Home" asp-action="Modulos" class="btn-volver-submenu">` |
| Home/NuevaContrasena.cshtml | primary | `<button type="submit">` |
| Home/NuevaContrasena.cshtml | secondary | `<a asp-controller="Home" asp-action="Index" class="volver-login">` |
| Home/Productos.cshtml | primary | `<a asp-controller="Home" asp-action="CrearProducto" class="btn-nuevo-producto">` |
| Home/Productos.cshtml | secondary | `<button type="button" id="btnMedicamentos" class="selector-btn activo" onclick="mostrarTipo('medicamentos')">` |
| Home/Productos.cshtml | secondary | `<button type="button" id="btnInsumos" class="selector-btn" onclick="mostrarTipo('insumos')">` |
| Home/Productos.cshtml | navigation | `<a asp-controller="Home" asp-action="EditarProducto" asp-route-idProducto="@producto.id_producto" class="producto-card">` |
| Home/Productos.cshtml | navigation | `<a asp-controller="Home" asp-action="EditarProducto" asp-route-idProducto="@producto.id_producto" class="producto-card">` |
| Home/Productos.cshtml | secondary | `<a asp-controller="Home" asp-action="Productos" class="btn-volver-productos">` |
| Home/RecuperarContrasena.cshtml | primary | `<button type="submit">` |
| Home/RecuperarContrasena.cshtml | secondary | `<a asp-controller="Home" asp-action="Index">` |
| Home/RolesInactivos.cshtml | primary | `<button type="submit" class="btn-reactivar">` |
| Home/RolesInactivos.cshtml | secondary | `<a asp-controller="Home" asp-action="RolesPermisos" class="btn-volver-roles">` |
| Home/RolesInactivos.cshtml | primary | `<button type="button" class="btn-modal-si" onclick="reactivarRol()">` |
| Home/RolesInactivos.cshtml | secondary | `<button type="button" class="btn-modal-no" onclick="cerrarConfirmacion()">` |
| Home/RolesInactivos.cshtml | secondary | `<button type="button" class="btn-modal-cancelar" onclick="cancelarReactivacion()">` |
| Home/RolesPermisos.cshtml | secondary | `<a asp-controller="Home" asp-action="RolesInactivos" class="btn-inactivos">` |
| Home/RolesPermisos.cshtml | primary | `<a asp-controller="Home" asp-action="CrearRol" class="btn-crear-rol">` |
| Home/RolesPermisos.cshtml | secondary | `<a asp-controller="Home" asp-action="EditarRol" asp-route-idRol="@idRol" class="btn-editar">` |
| Home/RolesPermisos.cshtml | warning | `<button type="button" class="btn-desactivar" onclick="mostrarConfirmacion()">` |
| Home/RolesPermisos.cshtml | warning | `<button type="submit" class="btn-confirmar">` |
| Home/RolesPermisos.cshtml | secondary | `<button type="button" class="btn-cancelar" onclick="ocultarConfirmacion()">` |
| Home/RolesPermisos.cshtml | primary | `<button type="submit" class="btn-guardar">` |
| Home/RolesPermisos.cshtml | secondary | `<a asp-controller="Home" asp-action="UsuariosPermisos" class="btn-volver">` |
| Home/SalidaExtraordinaria.cshtml | secondary | `<a asp-controller="Home" asp-action="MovimientoHistorial" class="btn volver">` |
| Home/SalidaExtraordinaria.cshtml | warning | `<button type="submit" id="btnExtra" class="btn confirmar" disabled>` |
| Home/TrasladarStock.cshtml | secondary | `<a asp-controller="Home" asp-action="MovimientoHistorial" class="btn-volver">` |
| Home/TrasladarStock.cshtml | warning | `<button type="submit" id="btnTrasladar" class="btn-trasladar" disabled>` |
| Home/Ubicaciones.cshtml | primary | `<button type="button" class="btn-agregar-ubicacion" onclick="abrirModalUbicacion()">` |
| Home/Ubicaciones.cshtml | icon | `<button type="button" class="ubicacion-menu" onclick="alternarMenuUbicacion(this)" title="Opciones">` |
| Home/Ubicaciones.cshtml | secondary | `<button type="button" class="ubicacion-menu-opcion" data-id="@ubicacion.id_ubicacion" data-nombre="@ubicacion.nombre_sector" data-tipo="@ubicacion.tipo_sector" onclick="abrirModalEditarUbicacion(this)">` |
| Home/Ubicaciones.cshtml | warning | `<button type="button" class="ubicacion-menu-opcion ubicacion-menu-opcion-inactivar" data-accion="inactivar" data-nombre="@ubicacion.nombre_sector" onclick="abrirModalConfirmacionUbicacion(this)">` |
| Home/Ubicaciones.cshtml | primary | `<button type="button" class="ubicacion-menu-opcion ubicacion-menu-opcion-reactivar" data-accion="reactivar" data-nombre="@ubicacion.nombre_sector" onclick="abrirModalConfirmacionUbicacion(this)">` |
| Home/Ubicaciones.cshtml | danger | `<button type="button" class="ubicacion-menu-opcion ubicacion-menu-opcion-eliminar" data-accion="eliminar" data-nombre="@ubicacion.nombre_sector" onclick="abrirModalConfirmacionUbicacion(this)">` |
| Home/Ubicaciones.cshtml | secondary | `<a asp-controller="Home" asp-action="InventarioUbicacion" asp-route-idUbicacion="@ubicacion.id_ubicacion" class="btn-ver-inventario">` |
| Home/Ubicaciones.cshtml | navigation | `<button type="button" class="ubicacion-card ubicacion-card-agregar" onclick="abrirModalUbicacion()">` |
| Home/Ubicaciones.cshtml | icon | `<button type="button" class="ubicacion-modal-cerrar" onclick="cerrarModalUbicacion()">` |
| Home/Ubicaciones.cshtml | secondary | `<button type="button" class="btn-ubicacion-cancelar" onclick="cerrarModalUbicacion()">` |
| Home/Ubicaciones.cshtml | primary | `<button type="button" class="btn-ubicacion-guardar" data-accion="crear" data-formulario="formAgregarUbicacion" onclick="abrirConfirmacionFormularioUbicacion(this)">` |
| Home/Ubicaciones.cshtml | icon | `<button type="button" class="ubicacion-modal-cerrar" onclick="cerrarModalEditarUbicacion()">` |
| Home/Ubicaciones.cshtml | secondary | `<button type="button" class="btn-ubicacion-cancelar" onclick="cerrarModalEditarUbicacion()">` |
| Home/Ubicaciones.cshtml | primary | `<button type="button" class="btn-ubicacion-guardar" data-accion="editar" data-formulario="formEditarUbicacion" onclick="abrirConfirmacionFormularioUbicacion(this)">` |
| Home/Ubicaciones.cshtml | secondary | `<button type="button" class="btn-confirmacion-cancelar" onclick="cerrarModalConfirmacionUbicacion()">` |
| Home/Ubicaciones.cshtml | warning | `<button type="button" id="btnConfirmarAccionUbicacion" class="btn-confirmacion-aceptar" onclick="confirmarAccionUbicacion()">` |
| Home/Usuarios.cshtml | secondary | `<a asp-controller="Home" asp-action="EditarUsuario" asp-route-idUsuario="@usuario.id_usuario" class="btn-editar" onclick="return confirmarEditar(this)">` |
| Home/Usuarios.cshtml | warning | `<button type="submit" class="btn-desactivar">` |
| Home/Usuarios.cshtml | quiet | `<a asp-controller="Home" asp-action="Usuarios" asp-route-pagina="@(ViewBag.PaginaActual - 1)" class="pagina-boton">` |
| Home/Usuarios.cshtml | quiet | `<a asp-controller="Home" asp-action="Usuarios" asp-route-pagina="@i" class="pagina-boton @(i == ViewBag.PaginaActual ? "pagina-activa" : "")">` |
| Home/Usuarios.cshtml | quiet | `<a asp-controller="Home" asp-action="Usuarios" asp-route-pagina="@(ViewBag.PaginaActual + 1)" class="pagina-boton">` |
| Home/Usuarios.cshtml | secondary | `<a asp-controller="Home" asp-action="ListadoEliminarUsuarios" class="btn-inactivos">` |
| Home/Usuarios.cshtml | secondary | `<a asp-controller="Home" asp-action="UsuariosPermisos" class="btn-volver-usuarios">` |
| Home/Usuarios.cshtml | warning | `<button type="button" class="btn-modal-si" onclick="realizarAccion()">` |
| Home/Usuarios.cshtml | secondary | `<button type="button" class="btn-modal-no" onclick="cerrarConfirmacion()">` |
| Home/Usuarios.cshtml | secondary | `<button type="button" class="btn-modal-cancelar" onclick="cerrarConfirmacion()">` |
| Home/VerificarCodigo.cshtml | primary | `<button type="submit">` |
| Home/VerificarCodigo.cshtml | secondary | `<a asp-controller="Home" asp-action="Index">` |
| Shared/Components/Alertas/Default.cshtml | icon | `<button type="button" class="alertas-boton" id="botonAlertasSarmedix" onclick="alternarAlertasSarmedix(event)" aria-label="Ver alertas" aria-expanded="false">` |
| Shared/Components/Alertas/Default.cshtml | navigation | `<a href="@alerta.UrlDestino" class="alertas-item alertas-item-enlace @claseTipo" title="@alerta.TextoDestino">` |
| Shared/_Layout.cshtml | navigation | `<a class="sm-skip" href="#sm-main">` |
| Shared/_Layout.cshtml | navigation | `<a asp-controller="Home" asp-action="Modulos" class="logo-layout">` |
| Shared/_Layout.cshtml | secondary | `<button class="sm-motion-control" type="button" data-sm-motion-control aria-pressed="false" aria-label="Pausar efectos visuales" hidden>` |
| Shared/_Layout.cshtml | warning | `<button type="button" class="btn-cerrar-layout" onclick="abrirConfirmacionCerrarSesion()">` |
| Shared/_Layout.cshtml | warning | `<button type="button" class="btn-sesion-si" onclick="confirmarCerrarSesion()">` |
| Shared/_Layout.cshtml | secondary | `<button type="button" class="btn-sesion-no" onclick="cerrarConfirmacionCerrarSesion()">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="UsuariosPermisos" class="sidebar-modulo-enlace" title="Ir a Usuarios y Permisos">` |
| Shared/_Sidebar.cshtml | navigation | `<button type="button" class="sidebar-toggle" onclick="alternarSubmenu(this)" aria-label="Mostrar submódulos de Usuarios y Permisos" aria-expanded="false">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="CrearUsuario" class="sidebar-subopcion @(accionActual == "CrearUsuario" ? "activo" : "")">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="Usuarios" class="sidebar-subopcion @(accionActual == "Usuarios" &#124;&#124; accionActual == "EditarUsuario" ? "activo" : "")">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="RolesPermisos" class="sidebar-subopcion @(accionActual == "RolesPermisos" &#124;&#124; accionActual == "CrearRol" &#124;&#124; accionActual == "EditarRol" &#124;&#124; accionActual == "RolesInactivos" ? "activo" : "")">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="ListadoEliminarUsuarios" class="sidebar-subopcion @(accionActual == "ListadoEliminarUsuarios" ? "activo" : "")">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="Productos" class="sidebar-modulo-enlace" title="Ir a Productos">` |
| Shared/_Sidebar.cshtml | navigation | `<button type="button" class="sidebar-toggle" onclick="alternarSubmenu(this)" aria-label="Mostrar submódulos de Productos" aria-expanded="false">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="CrearProducto" class="sidebar-subopcion @(accionActual == "CrearProducto" ? "activo" : "")">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="ListadoProductos2" class="sidebar-subopcion @(accionActual == "ListadoProductos2" &#124;&#124; accionActual == "EditarProducto" ? "activo" : "")">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="Lotes" class="sidebar-modulo-enlace" title="Ir a Inventario">` |
| Shared/_Sidebar.cshtml | navigation | `<button type="button" class="sidebar-toggle" onclick="alternarSubmenu(this)" aria-label="Mostrar submódulos de Inventario" aria-expanded="false">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="Lotes" class="sidebar-subopcion @(accionActual == "Lotes" &#124;&#124; accionActual == "EditarLote" ? "activo" : "")">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="MovimientoHistorial" class="sidebar-modulo-enlace" title="Ir a Movimientos">` |
| Shared/_Sidebar.cshtml | navigation | `<button type="button" class="sidebar-toggle" onclick="alternarSubmenu(this)" aria-label="Mostrar submódulos de Movimientos" aria-expanded="false">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="CrearLote" class="sidebar-subopcion @(accionActual == "CrearLote" ? "activo" : "")">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="TrasladarStock" class="sidebar-subopcion @(accionActual == "TrasladarStock" &#124;&#124; accionActual == "RegistrarTraslado" ? "activo" : "")">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="Dosificaciones" class="sidebar-subopcion @(accionActual == "Dosificaciones" &#124;&#124; accionActual == "GuardarDosificacionProgramada" &#124;&#124; accionActual == "ImprimirDosificacion" ? "activo" : "")">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="EntregaDosificacion" class="sidebar-subopcion @(accionActual == "EntregaDosificacion" &#124;&#124; accionActual == "ProcesarEntregaDosificacion" ? "activo" : "")">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="BajaInventario" class="sidebar-subopcion @(accionActual == "BajaInventario" &#124;&#124; accionActual == "RegistrarBajaInventario" ? "activo" : "")">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="SalidaExtraordinaria" class="sidebar-subopcion @(accionActual == "SalidaExtraordinaria" &#124;&#124; accionActual == "RegistrarSalidaExtraordinaria" ? "activo" : "")">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="HistorialSalidasTurno" class="sidebar-subopcion @(accionActual == "HistorialSalidasTurno" &#124;&#124; accionActual == "InformeSalidasTurno" ? "activo" : "")">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="Historial" class="sidebar-subopcion @(accionActual == "Historial" ? "activo" : "")">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="HistorialUsuarios" class="sidebar-subopcion @(accionActual == "HistorialUsuarios" ? "activo" : "")">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="HistorialProductos" class="sidebar-subopcion @(accionActual == "HistorialProductos" ? "activo" : "")">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="HistorialSectores" class="sidebar-subopcion @(accionActual == "HistorialSectores" ? "activo" : "")">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="MedicamentosControlados" class="sidebar-modulo-enlace" title="Ir a Medicamentos Controlados">` |
| Shared/_Sidebar.cshtml | navigation | `<button type="button" class="sidebar-toggle" onclick="alternarSubmenu(this)" aria-label="Mostrar submódulos de Medicamentos Controlados" aria-expanded="false">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="MedicamentosControlados" class="sidebar-subopcion @(accionActual == "MedicamentosControlados" ? "activo" : "")">` |
| Shared/_Sidebar.cshtml | navigation | `<a asp-controller="Home" asp-action="Ubicaciones" class="sidebar-modulo-enlace" title="Ir a Sectores">` |
