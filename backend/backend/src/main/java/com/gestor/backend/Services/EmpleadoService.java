package com.gestor.backend.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}