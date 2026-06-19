package com.gestor.backend.Controller;

import java.util.List;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.gestor.backend.Repository.DispositivoRepository;
import com.gestor.backend.Services.DispositivoService;
import com.gestor.backend.model.Dispositivo;

@RestController
@RequestMapping("/api/dispositivos")
@CrossOrigin(origins = "http://localhost:4200")
public class DispositivoController {

    private final DispositivoService dispositivoService;
    private final DispositivoRepository dispositivoRepo;

    public DispositivoController(DispositivoService dispositivoService, DispositivoRepository dispositivoRepo) {
        this.dispositivoService = dispositivoService;
        this.dispositivoRepo = dispositivoRepo;
    }

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
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> importarDispositivosExcel(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("El archivo Excel está vacío.");
        }
        try {
            List<Dispositivo> guardados = dispositivoService.importarDesdeExcel(file);
            return ResponseEntity.ok("Se han importado " + guardados.size() + " dispositivos exitosamente.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> modificarDispositivo(@PathVariable Long id, @RequestBody Dispositivo dispositivoEditado) {
        try {
            Dispositivo dispositivoActualizado = dispositivoService.modificarDispositivo(id, dispositivoEditado);
            return ResponseEntity.ok(dispositivoActualizado);
        } catch (RuntimeException e) {
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