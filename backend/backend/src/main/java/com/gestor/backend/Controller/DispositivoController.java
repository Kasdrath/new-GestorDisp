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

import com.gestor.backend.Repository.DispositivoRepository;
import com.gestor.backend.Services.DispositivoService;
import com.gestor.backend.model.Dispositivo;

@RestController
@RequestMapping("/api/dispositivos")
@CrossOrigin(origins = "http://localhost:4200")
public class DispositivoController {

    @Autowired
    private DispositivoService dispositivoService;

    @Autowired
    private DispositivoRepository dispositivoRepo;

    @GetMapping
    public List<Dispositivo> obtenerTodosDispositivos() {
        return dispositivoRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dispositivo> obtenerDispositivoPorId(@PathVariable Long id) {
        return dispositivoRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crearDispositivo(@RequestBody Dispositivo dispositivo) {
        try {
            Dispositivo nuevoDispositivo = dispositivoService.crearNuevoDispositivo(dispositivo);
            return new ResponseEntity<>(nuevoDispositivo, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // Captura el error si el número de serie ya existe
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> modificarDispositivo(@PathVariable Long id, @RequestBody Dispositivo dispositivoEditado) {
        try {
            Dispositivo dispositivoActualizado = dispositivoService.modificarDispositivo(id, dispositivoEditado);
            return ResponseEntity.ok(dispositivoActualizado);
        } catch (RuntimeException e) {
            // Captura el error si no existe o si el número de serie choca con otro
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarDispositivo(@PathVariable Long id) {
        try {
            dispositivoService.eliminarDispositivo(id);
            return ResponseEntity.noContent().build(); // HTTP 204
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}