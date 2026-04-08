package com.gestor.backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestor.backend.Services.AsignacionService;
import com.gestor.backend.model.Asignacion;

@RestController
@RequestMapping("/api/asignaciones")
@CrossOrigin(origins = "*")
public class AsignacionController {

    @Autowired
    private AsignacionService asignacionService;

    @GetMapping
    public ResponseEntity<List<Asignacion>> obtenerTodasLasAsignaciones() {
        return ResponseEntity.ok(asignacionService.obtenerTodasLasAsignaciones());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerAsignacionPorId(@PathVariable Long id) {
        try {
            Asignacion asignacion = asignacionService.obtenerAsignacionPorId(id);
            return ResponseEntity.ok(asignacion);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/empleado/{idEmpleado}")
    public ResponseEntity<List<Asignacion>> obtenerAsignacionesPorEmpleado(@PathVariable Long idEmpleado) {
        return ResponseEntity.ok(asignacionService.obtenerAsignacionesPorEmpleado(idEmpleado));
    }

    @PostMapping("/vincular")
    public ResponseEntity<?> vincularDispositivo(@RequestParam Long idEmpleado, @RequestParam Long idDispositivo) {
        try {
            Asignacion nuevaAsignacion = asignacionService.vincularDispositivo(idEmpleado, idDispositivo);
            return new ResponseEntity<>(nuevaAsignacion, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/desvincular")
    public ResponseEntity<?> desvincularDispositivo(@PathVariable Long id) {
        try {
            Asignacion asignacionActualizada = asignacionService.desvincularDispositivo(id);
            return ResponseEntity.ok(asignacionActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}