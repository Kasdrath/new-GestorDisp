package com.gestor.backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestor.backend.Repository.EmpleadoRepository;
import com.gestor.backend.Services.EmpleadoService;
import com.gestor.backend.model.Empleado;

@RestController
@RequestMapping("/api/empleados")
@CrossOrigin(origins = "*") 
public class EmpleadoController {

    @Autowired
    private EmpleadoService empleadoService;

    @Autowired
    private EmpleadoRepository empleadoRepo;

    @GetMapping
    public List<Empleado> obtenerTodosEmpleados() {
        return empleadoRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empleado> obtenerEmpleadoPorId(@PathVariable Long id) {
        return empleadoRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crearEmpleado(@RequestBody Empleado empleado) {
        try {
            Empleado nuevoEmpleado = empleadoService.crearNuevoEmpleado(empleado);
            return new ResponseEntity<>(nuevoEmpleado, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // Devuelve un error 400 Bad Request si el RUT ya está registrado
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> modificarEmpleado(@PathVariable Long id, @RequestBody Empleado empleadoEditado) {
        try {
            Empleado empleadoActualizado = empleadoService.modificarNuevoEmpleado(id, empleadoEditado);
            return ResponseEntity.ok(empleadoActualizado);
        } catch (RuntimeException e) {
            // Devuelve un error 400 Bad Request si el empleado no existe o el RUT ya pertenece a otro
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarEmpleado(@PathVariable Long id) {
        try {
            empleadoService.eliminarEmpleado(id);
            return ResponseEntity.noContent().build(); // Devuelve 204 No Content si se elimina con éxito
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}