package com.gestor.backend.Services;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.gestor.backend.Repository.AsignacionRepository;
import com.gestor.backend.Repository.EmpleadoRepository;
import com.gestor.backend.model.Empleado;

@Service
public class EmpleadoService {

    @Autowired
    private EmpleadoRepository empleadoRepo;

    @Autowired
    private AsignacionRepository asignacionRepo;

    public Empleado crearNuevoEmpleado(Empleado nuevoEmpleado) {
        if (empleadoRepo.findByRutEmpleado(nuevoEmpleado.getRutEmpleado()).isPresent()) {
            throw new RuntimeException("El RUT ya está registrado");
        }
        
        if (nuevoEmpleado.getEstadoEmpleado() == null) {
            nuevoEmpleado.setEstadoEmpleado(true);
        }
        return empleadoRepo.save(nuevoEmpleado);
    }

    @Transactional
    public Empleado modificarNuevoEmpleado(Long id, Empleado empleadoEditado){
        
        Empleado empleadoExistente = empleadoRepo.findById(id).orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + id));

        if (!empleadoExistente.getRutEmpleado().equals(empleadoEditado.getRutEmpleado())) {
            if (empleadoRepo.findByRutEmpleado(empleadoEditado.getRutEmpleado()).isPresent()) {
                throw new RuntimeException("El nuevo RUT ya pertenece a otro empleado");
            }
        }

        // Si el estado cambia de Activo (true) a Dado de baja (false), desvincular los equipos que tenga
        if (empleadoExistente.getEstadoEmpleado() != null && empleadoExistente.getEstadoEmpleado() && 
            (empleadoEditado.getEstadoEmpleado() == null || !empleadoEditado.getEstadoEmpleado())) {
            boolean tieneEquiposActivos = empleadoExistente.getAsignaciones().stream()
                .anyMatch(a -> a.getFechaDesvinculacion() == null);
            if (tieneEquiposActivos) {
                empleadoExistente.getAsignaciones().stream().filter(a -> a.getFechaDesvinculacion() == null)
                    .forEach(a -> {
                        a.setFechaDesvinculacion(OffsetDateTime.now(ZoneId.of("America/Santiago")));
                        asignacionRepo.save(a);
                    });
            }
        }

        empleadoExistente.setNombresEmpleado(empleadoEditado.getNombresEmpleado());
        empleadoExistente.setApellidosEmpleado(empleadoEditado.getApellidosEmpleado());
        empleadoExistente.setRutEmpleado(empleadoEditado.getRutEmpleado());
        empleadoExistente.setEmailEmpleado(empleadoEditado.getEmailEmpleado());
        empleadoExistente.setTelefonoEmpleado(empleadoEditado.getTelefonoEmpleado());
        empleadoExistente.setNacionalidadEmpleado(empleadoEditado.getNacionalidadEmpleado());
        empleadoExistente.setCargoEmpleado(empleadoEditado.getCargoEmpleado());
        
        if (empleadoEditado.getEstadoEmpleado() != null) {
            empleadoExistente.setEstadoEmpleado(empleadoEditado.getEstadoEmpleado());
        }

        return empleadoRepo.save(empleadoExistente);
    }

    @Transactional
    public void eliminarEmpleado(Long id) {
        Empleado empleado = empleadoRepo.findById(id).orElseThrow(() -> new RuntimeException("No se puede eliminar: Empleado no encontrado con ID: " + id));
        boolean tieneEquiposActivos = empleado.getAsignaciones().stream().anyMatch(a -> a.getFechaDesvinculacion() == null);
        
        if (tieneEquiposActivos) {
            // Desvincular automáticamente los dispositivos marcando la fecha actual
            empleado.getAsignaciones().stream().filter(a -> a.getFechaDesvinculacion() == null)
                .forEach(a -> {
                    a.setFechaDesvinculacion(OffsetDateTime.now(ZoneId.of("America/Santiago")));
                    asignacionRepo.save(a);
                });
        }
        
        // Borrado lógico: marcamos al empleado como inactivo (dado de baja)
        empleado.setEstadoEmpleado(false);
        empleadoRepo.save(empleado);
    }

    @Transactional
    public List<Empleado> importarDesdeExcel(MultipartFile file) {
        List<Empleado> empleadosGuardados = new ArrayList<>();
        DataFormatter formatter = new DataFormatter(); // Convierte cualquier celda a String de forma segura
        
        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0); // Leer la primera hoja del Excel
            
            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Saltar la fila 0 (Cabeceras)
                
                // Se asume el orden: 0=RUT, 1=Nombres, 2=Apellidos, 3=Email, 4=Tel, 5=Nacionalidad, 6=Cargo
                String rut = formatter.formatCellValue(row.getCell(0)).trim();
                if (rut.isEmpty()) continue; // Saltar filas vacías

                // Evitar insertar empleados duplicados en base al RUT
                if (empleadoRepo.findByRutEmpleado(rut).isPresent()) continue; 

                Empleado emp = new Empleado();
                emp.setRutEmpleado(rut);
                emp.setNombresEmpleado(formatter.formatCellValue(row.getCell(1)));
                emp.setApellidosEmpleado(formatter.formatCellValue(row.getCell(2)));
                emp.setEmailEmpleado(formatter.formatCellValue(row.getCell(3)));
                emp.setTelefonoEmpleado(formatter.formatCellValue(row.getCell(4)));
                emp.setNacionalidadEmpleado(formatter.formatCellValue(row.getCell(5)));
                emp.setCargoEmpleado(formatter.formatCellValue(row.getCell(6)));
                emp.setEstadoEmpleado(true);

                empleadosGuardados.add(empleadoRepo.save(emp));
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al procesar el archivo Excel: " + e.getMessage());
        }
        return empleadosGuardados;
    }
}