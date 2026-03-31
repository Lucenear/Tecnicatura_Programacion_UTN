package main;

import java.time.LocalDate;
import java.util.Scanner;
import entities.Legajo;
import config.DatabaseConnection;
import service.LegajoService;
import service.EmpleadoService;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.util.ArrayList; 
import java.util.List;

import entities.Empleado;

// Clase principal del menu
public class AppMenu {

    // Servicios y lector de entrada
    private final LegajoService legajoService;
    private final EmpleadoService empleadoService;
    private final Scanner scanner;

    // Inicializo los servicios y el scanner
    public AppMenu(DatabaseConnection dbConnection) {
        dao.EmpleadoDao empleadoDao = new dao.EmpleadoDao();
        dao.LegajoDao legajoDao = new dao.LegajoDao();
        
        this.legajoService = new service.LegajoService(legajoDao, dbConnection);
        this.empleadoService = new service.EmpleadoService(empleadoDao, legajoService, dbConnection);
        this.scanner = new Scanner(System.in);  
    }
       
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Usuario de MySQL: ");
        String user = input.nextLine().trim();

        System.out.print("Contraseña: ");
        String pass = input.nextLine().trim();
        
        
        // Solicita el puerto
        System.out.print("Puerto de MySQL (por defecto 3306): ");
        String portStr = input.nextLine().trim();
        int port = portStr.isEmpty() ? 3306 : Integer.parseInt(portStr); // Valor por defecto si no se ingresa nada

        try {
            // Conexion inicial sin base de datos usando el puerto proporcionado
            String initialUrl = "jdbc:mysql://localhost:" + port + "?useSSL=false&serverTimezone=UTC";
            Connection conn = DriverManager.getConnection(initialUrl, user, pass);

            // Listar bases de datos disponibles
            DatabaseMetaData meta = conn.getMetaData();
            ResultSet rs = meta.getCatalogs();

            List<String> bases = new ArrayList<>();
            System.out.println("\nBases de datos disponibles (seleccionar TPFI_DDBB):");
            int idx = 1;
            while (rs.next()) {
                String db = rs.getString("TABLE_CAT");
                bases.add(db);
                System.out.println(idx + ". " + db);
                idx++;
            }
            conn.close();

            if (bases.isEmpty()) {
                System.err.println("No se encontraron bases de datos.");
                return;
            }

            // Seleccionar base
            System.out.print("\nSeleccione el numero de la base de datos: ");
            int opcion = Integer.parseInt(input.nextLine().trim());
            if (opcion < 1 || opcion > bases.size()) {
                System.err.println("Opcion invalida.");
                return;
            }
            String dbName = bases.get(opcion - 1);
            
            // Conexion a la DB
            DatabaseConnection dbConn = new DatabaseConnection(dbName, user, pass, port);

            dbConn.getConnection().close();

            new AppMenu(dbConn).mostrarMenu();
            
            // Captura del error
        } catch (Exception e) {
            System.err.println("Error al conectar por seleccion incorrecta de puerto: " + e.getMessage());
        } finally {
            input.close();
        }
    }
    
    // Menu principal
    public void mostrarMenu() {
        int opcion;
        do {
            System.out.println("\nMENU PRINCIPAL");
            System.out.println("1. Gestionar Legajo");
            System.out.println("2. Gestionar Empleado");
            System.out.println("0. Salir");
            System.out.print("Elija una opcion: ");
            opcion = leerEntero();
            switch (opcion) {
                case 1 -> menuLegajo();
                case 2 -> menuEmpleado();
                case 0 -> System.out.println("Chau, portate bien, y aplica WHERE en un DELETE!");
                default -> System.out.println("Opcion no valida");
            }
        } while (opcion != 0);
    }

    // Opciones con Legajo --Revisar dependencias
    private void menuLegajo() {
        int opcion;
        do {
            System.out.println("\nOPCIONES DISPONIBLES CON LEGAJO");
            System.out.println("1. Crear Legajo");
            System.out.println("2. Mostrar todos los legajos");
            System.out.println("3. Buscar por ID");
            System.out.println("4. Actualizar Legajo");
            System.out.println("5. Eliminar Legajo (marca logica)"); // No marca BOOL
            System.out.println("0. Volver");
            System.out.print("Opcion: ");
            opcion = leerEntero();
            switch (opcion) {
                case 1 -> crearLegajo();
                case 2 -> mostrarLegajos();
                case 3 -> leerLegajoPorId();
                case 4 -> actualizarLegajo();
                case 5 -> eliminarLegajo();
                case 0 -> {}
                default -> System.out.println("Opcion no valida");
            }
        } while (opcion != 0);
    }
    
    // Opciones para gestionar Empleado -- Revisar dependencias
    private void menuEmpleado() {
        int opcion;
        do {
            System.out.println("\nOPCIONES DISPONIBLES CON EMPLEADO");
            System.out.println("1. Crear Empleado");
            System.out.println("2. Mostrar todos los empleados activos");
            System.out.println("3. Buscar por ID");
            System.out.println("4. Buscar por DNI");
            System.out.println("5. Actualizar Empleado");
            System.out.println("6. Eliminar Empleado (marca logica)");
            System.out.println("0. Volver");
            System.out.print("Opcion: ");
            opcion = leerEntero();
            switch (opcion) {
                case 1 -> crearEmpleado();
                case 2 -> listarEmpleados();
                case 3 -> leerEmpleadoPorId();
                case 4 -> buscarPorDni();
                case 5 -> actualizarEmpleado();
                case 6 -> eliminarEmpleado();
                case 0 -> {}
                default -> System.out.println("Opcion no valida");
            }
        } while (opcion != 0);
    }
    
    // Lectura de numero entero y manejo de errores con el formato
    private int leerEntero() {
        try {
            return Integer.parseInt(scanner.nextLine().trim());
        } catch (NumberFormatException e) {
            System.out.println("Entrada no valida. Uso 0");
            return 0;
        }
    }
    
    // Lectura de ID largo (Long) y manejo de errores de formato
    private Long leerEnteroLargo() {
        try {
            return Long.parseLong(scanner.nextLine().trim());
        } catch (NumberFormatException e) {
            System.out.println("ID no valido. Use solo numeros");
            throw new RuntimeException("ID invalido");
        }
    }
    
// LEGAJO//
    
    // Crear nuevo legajo
    private void crearLegajo() {
        try {
            System.out.print("Nro Legajo: ");
            String nroLegajo = scanner.nextLine().trim();
            System.out.print("Categoria (A-F): ");
            String categoria = scanner.nextLine().trim().toUpperCase();
            System.out.print("Estado (ACTIVO/INACTIVO): ");
            String estadoStr = scanner.nextLine().trim().toUpperCase();
            Legajo.Estado estado = Legajo.Estado.valueOf(estadoStr);
            System.out.print("Observaciones (max 255 caracteres): ");
            String observaciones = scanner.nextLine().trim();

            Legajo legajo = new Legajo();
            legajo.setNroLegajo(nroLegajo);
            legajo.setCategoria(categoria);
            legajo.setEstado(estado);
            legajo.setFechaAlta(LocalDate.now());
            legajo.setObservaciones(observaciones);
            legajo.setEliminado(false);

            legajoService.insert(legajo);
            System.out.println("Legajo creado! ID: " + legajo.getId());

        } catch (IllegalArgumentException e) {
            System.out.println("Error: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Error al crear legajo: " + e.getMessage());
        }
    }
    
    // Muestra todos los legajos activos
    private void mostrarLegajos() {
        try {
            List<Legajo> legajos = legajoService.mostrarActivos();
            if (legajos.isEmpty()) {
                System.out.println("No hay legajos activos");
            } else {
                legajos.forEach(l -> 
                    System.out.println("ID: " + l.getId() + " | " + l.getNroLegajo() + " | " + l.getCategoria()));
            }
        } catch (Exception e) {
            System.out.println("Error al listar: " + e.getMessage());
        }
    }
    
//    // Busco un legajo por su ID y muestro sus datos
//    private void leerLegajoPorId() {
//        try {
//            System.out.print("ID del legajo: ");
//            Long id = leerEnteroLargo();
//            Legajo legajo = legajoService.obtenerPorId(id);
//            if (legajo != null && !legajo.getEliminado()) {
//                System.out.println("Legajo: " + legajo.getNroLegajo() +
//                        " | Categoria: " + legajo.getCategoria() +
//                        " | Estado: " + legajo.getEstado());
//            } else {
//                System.out.println("Legajo no encontrado o eliminado");
//            }
//        } catch (Exception e) {
//            System.out.println("Error: " + e.getMessage());
//        }
//    }
    
    private void leerLegajoPorId() {
        try {
            System.out.print("ID del legajo: ");
            Long id = leerEnteroLargo();
            Legajo legajo = legajoService.obtenerPorId(id);

            if (legajo == null || legajo.getEliminado()) {
                System.out.println("Legajo no encontrado o eliminado");
                return;
            }

            System.out.println("\n-> Datos del legajo:");
            System.out.println("ID: " + legajo.getId());
            System.out.println("Numero de Legajo: " + legajo.getNroLegajo());
            System.out.println("Categoria: " + legajo.getCategoria());
            System.out.println("Estado: " + legajo.getEstado());

            String fechaFormateada = (legajo.getFechaAlta() != null)
                    ? legajo.getFechaAlta().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                    : "N/A";
            System.out.println("Fecha de Alta: " + fechaFormateada);

            System.out.println("Observaciones: " +
                    (legajo.getObservaciones() != null && !legajo.getObservaciones().isBlank()
                            ? legajo.getObservaciones()
                            : "Ninguna"));

            // Busco el empleado asociado al legajo
            Empleado empleadoAsociado = empleadoService.obtenerPorLegajo(legajo);
            if (empleadoAsociado != null && !empleadoAsociado.getEliminado()) {
                System.out.println("\n-> Datos del empleado:");
                System.out.println("ID: " + empleadoAsociado.getId());
                System.out.println("Nombre completo: " + empleadoAsociado.getNombre() + " " + empleadoAsociado.getApellido());
                System.out.println("DNI: " + empleadoAsociado.getDni());
                System.out.println("Area: " + empleadoAsociado.getArea());
                System.out.println("Email: " + empleadoAsociado.getEmail());
                System.out.println("Fecha de ingreso: " + empleadoAsociado.getFechaIngreso());
            } else {
                System.out.println("No hay un empleado asociado a este legajo");
            }

        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    // Actualizo datos de un legajo existente
    private void actualizarLegajo() {
        try {
            System.out.print("ID del legajo a actualizar: ");
            Long id = leerEnteroLargo();
            Legajo legajo = legajoService.obtenerPorId(id);
            if (legajo == null || legajo.getEliminado()) {
                System.out.println("Legajo no encontrado");
                return;
            }

            System.out.print("Nuevo nro legajo (actual: " + legajo.getNroLegajo() + "): ");
            String nroLegajo = scanner.nextLine().trim();
            if (!nroLegajo.isEmpty()) legajo.setNroLegajo(nroLegajo);

            System.out.print("Nueva categoria (actual: " + legajo.getCategoria() + "): ");
            String categoria = scanner.nextLine().trim();
            if (!categoria.isEmpty()) legajo.setCategoria(categoria.toUpperCase());

            System.out.print("Nuevo estado (actual: " + legajo.getEstado() + "): ");
            String estadoStr = scanner.nextLine().trim();
            if (!estadoStr.isEmpty()) {
                try {
                    legajo.setEstado(Legajo.Estado.valueOf(estadoStr.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    System.out.println("Estado invalido. Se mantiene el actual");
                }
            }

            legajoService.update(legajo);
            System.out.println("Legajo actualizado");

        } catch (Exception e) {
            System.out.println("Error al actualizar: " + e.getMessage());
        }
    }
    
    // Elimino logicamente un legajo (marca como eliminado)
    private void eliminarLegajo() {
        try {
            System.out.print("ID del legajo a eliminar: ");
            Long id = leerEnteroLargo();
            legajoService.eliminarLogico(id);
            System.out.println("Legajo marcado como eliminado");
        } catch (Exception e) {
            System.out.println("Error al eliminar: " + e.getMessage());
        }
    }
    
// Metodos Empleado//
    
    // Creo un nuevo empleado con datos ingresados por el usuario
    private void crearEmpleado() {
        try {
            System.out.print("Nombre: ");
            String nombre = scanner.nextLine().trim().toUpperCase();
            System.out.print("Apellido: ");
            String apellido = scanner.nextLine().trim().toUpperCase();
            System.out.print("DNI (8-15 digitos): ");
            String dni = scanner.nextLine().trim();
            System.out.print("Email: ");
            String email = scanner.nextLine().trim();
            System.out.print("Area: ");
            String area = scanner.nextLine().trim().toUpperCase();
            System.out.print("ID del Legajo (debe existir): ");
            Long legajoId = leerEnteroLargo();

            // Verifico que el legajo exista en la base
            Legajo legajo = legajoService.obtenerPorId(legajoId);
            if (legajo == null) {
                System.out.println("Error: El legajo con ID " + legajoId + " no existe");
                return;
            }

            // Armo el objeto Empleado y lo guardo
            Empleado emp = new Empleado();
            emp.setNombre(nombre);
            emp.setApellido(apellido);
            emp.setDni(dni);
            emp.setEmail(email);
            emp.setArea(area);
            emp.setLegajo(legajo);
            emp.setFechaIngreso(LocalDate.now());
            emp.setEliminado(false);

            empleadoService.insert(emp);
            System.out.println("Empleado creado! ID: " + emp.getId());

        } catch (Exception e) {
            System.out.println("Error al crear empleado: " + e.getMessage());
        }
    }

    // Busco un empleado por su ID y muestra sus datos
//    private void leerEmpleadoPorId() {
//        try {
//            System.out.print("ID del empleado: ");
//            Long id = leerEnteroLargo();
//            Empleado emp = empleadoService.obtenerPorId(id);
//            if (emp != null && !emp.getEliminado()) {
//                //System.out.println("Empleado: " + emp.getNombre() + " " + emp.getApellido() +
//                //        " | DNI: " + emp.getDni() + " | Area: " + emp.getArea());
//                
//                 System.out.println(emp);
//                
//            } else {
//                System.out.println("Empleado no encontrado o eliminado");
//            }
//        } catch (Exception e) {
//            System.out.println("Error: " + e.getMessage());
//        }
//    }
    
    // Busco un empleado por su ID y muestra sus datos
    private void leerEmpleadoPorId() {
        try {
            System.out.print("ID del empleado: ");
            Long id = leerEnteroLargo();
            Empleado emp = empleadoService.obtenerPorId(id);

            if (emp != null && !emp.getEliminado()) {

                System.out.println("\n-> Datos del empleado:");
                System.out.println("Nombre completo: " + emp.getNombre() + " " + emp.getApellido());
                System.out.println("DNI: " + emp.getDni());
                System.out.println("Área: " + emp.getArea());
                System.out.println("Email: " + emp.getEmail());
                System.out.println("Fecha de ingreso: " + emp.getFechaIngreso());

                Legajo leg = emp.getLegajo();
                System.out.println("\n-> Datos del Legajo:");
                if (leg == null) {
                    System.out.println("Legajo no asignado");
                } else {
                    System.out.println("N° de Legajo: " + leg.getNroLegajo());
                    System.out.println("Estado: " + leg.getEstado());
                    System.out.println("Categoría: " + leg.getCategoria());
                    System.out.println("Fecha de alta: " + leg.getFechaAlta());
                    System.out.println("Observaciones: " +
                        (leg.getObservaciones() != null && !leg.getObservaciones().isBlank()
                            ? leg.getObservaciones() : "Ninguna"));
                }

            } else {
                System.out.println("Empleado no encontrado o eliminado");
            }

        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    // Muestro todos los empleados activos
    private void listarEmpleados() {
        try {
            List<Empleado> empleados = empleadoService.mostrarActivos();
            if (empleados.isEmpty()) {
                System.out.println("No hay empleados activos.");
            } else {
                empleados.forEach(e -> 
                    System.out.println("ID: " + e.getId() + " | " + e.getNombre() + " " + e.getApellido()));
            }
        } catch (Exception e) {
            System.out.println("Error al listar: " + e.getMessage());
        }
    }

    // Busco un empleado por DNI
    private void buscarPorDni() {
        try {
            System.out.print("Ingrese DNI: ");
            String dni = scanner.nextLine().trim();
            Empleado emp = empleadoService.buscarPorDni(dni);
            if (emp != null && !emp.getEliminado()) {
                System.out.println("Encontrado: " + emp.getNombre() + " " + emp.getApellido() + " " + emp.getLegajo());
            } else {
                System.out.println("No se encontro empleado con ese DNI");
            }
        } catch (Exception e) {
            System.out.println("Error en busqueda: " + e.getMessage());
        }
    }

    // Actualizo datos de un empleado existente
    private void actualizarEmpleado() {
        try {
            System.out.print("ID del empleado a actualizar: ");
            Long id = leerEnteroLargo();
            Empleado emp = empleadoService.obtenerPorId(id);
            if (emp == null || emp.getEliminado()) {
                System.out.println("Empleado no encontrado");
                return;
            }

            System.out.print("Nuevo nombre (actual: " + emp.getNombre() + "): ");
            String nombre = scanner.nextLine().trim();
            if (!nombre.isEmpty()) emp.setNombre(nombre.toUpperCase());

            System.out.print("Nueva area (actual: " + emp.getArea() + "): ");
            String area = scanner.nextLine().trim();
            if (!area.isEmpty()) emp.setArea(area.toUpperCase());

            empleadoService.update(emp);
            System.out.println("Empleado actualizado");

        } catch (Exception e) {
            System.out.println("Error al actualizar: " + e.getMessage());
        }
    }

    // Elimino logicamente un empleado (marca como eliminado)
    private void eliminarEmpleado() {
        try {
            System.out.print("ID del empleado a eliminar: ");
            Long id = leerEnteroLargo();
            empleadoService.eliminarLogico(id);
            System.out.println("Empleado marcado como eliminado");
        } catch (Exception e) {
            System.out.println("Error al eliminar: " + e.getMessage());
        }
    }
}