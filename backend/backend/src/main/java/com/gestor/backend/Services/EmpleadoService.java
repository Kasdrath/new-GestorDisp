package com.gestor.backend.Services;

import java.time.OffsetDateTime;
import java.time.ZoneId;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}