package com.gestor.backend.Services;

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
        empleadoExistente.setCargoEmpleado(empleadoEditado.getCargoEmpleado());

        return empleadoRepo.save(empleadoExistente);
    }

    @Transactional
    public void eliminarEmpleado(Long id) {
        Empleado empleado = empleadoRepo.findById(id).orElseThrow(() -> new RuntimeException("No se puede eliminar: Empleado no encontrado con ID: " + id));
        boolean tieneEquiposActivos = empleado.getAsignaciones().stream().anyMatch(a -> a.getFechaDesvinculacion() == null);
        if (tieneEquiposActivos) {
            throw new RuntimeException("No se puede eliminar al empleado porque tiene dispositivos asignados actualmente. Debe desvincularlos primero.");
        }
        empleadoRepo.delete(empleado);
    }
}