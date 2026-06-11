package com.gestor.backend.Services;

import java.time.OffsetDateTime;
import java.time.ZoneId;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestor.backend.Repository.EmpleadoRepository;
import com.gestor.backend.model.Empleado;

@Service
public class EmpleadoService {

    @Autowired
    private EmpleadoRepository empleadoRepo;

    public Empleado crearNuevoEmpleado(Empleado nuevoEmpleado) {
        if (empleadoRepo.findByRutEmpleado(nuevoEmpleado.getRutEmpleado()).isPresent()) {
            throw new RuntimeException("El RUT ya está registrado");
        }
        
        if (nuevoEmpleado.getEstadoEmpleado() == null) {
            nuevoEmpleado.setEstadoEmpleado(true);
        }
        return empleadoRepo.save(nuevoEmpleado);
    }

    public Empleado modificarNuevoEmpleado(Long id, Empleado empleadoEditado){
        
        Empleado empleadoExistente = empleadoRepo.findById(id).orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + id));

        if (!empleadoExistente.getRutEmpleado().equals(empleadoEditado.getRutEmpleado())) {
            if (empleadoRepo.findByRutEmpleado(empleadoEditado.getRutEmpleado()).isPresent()) {
                throw new RuntimeException("El nuevo RUT ya pertenece a otro empleado");
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
                .forEach(a -> a.setFechaDesvinculacion(OffsetDateTime.now(ZoneId.of("America/Santiago"))));
        }
        
        // Borrado lógico: marcamos al empleado como inactivo (dado de baja)
        empleado.setEstadoEmpleado(false);
        empleadoRepo.save(empleado);
    }
}