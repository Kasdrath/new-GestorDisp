package com.gestor.backend.Services;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestor.backend.Repository.AsignacionRepository;
import com.gestor.backend.Repository.DispositivoRepository;
import com.gestor.backend.Repository.EmpleadoRepository;
import com.gestor.backend.model.Asignacion;
import com.gestor.backend.model.Dispositivo;
import com.gestor.backend.model.Empleado;

@Service
public class AsignacionService {

    @Autowired
    private AsignacionRepository asignacionRepo;

    @Autowired
    private EmpleadoRepository empleadoRepo;

    @Autowired
    private DispositivoRepository dispositivoRepo;

    public Asignacion vincularDispositivo(Long idEmpleado, Long idDispositivo) {
        Empleado empleado = empleadoRepo.findById(idEmpleado).orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + idEmpleado));

        Dispositivo dispositivo = dispositivoRepo.findById(idDispositivo).orElseThrow(() -> new RuntimeException("Dispositivo no encontrado con ID: " + idDispositivo));

        List<Asignacion> asignacionesActivas = asignacionRepo.findByDispositivoIdDispositivoAndFechaDesvinculacionIsNull(idDispositivo);
        if (!asignacionesActivas.isEmpty()) {
            throw new RuntimeException("El dispositivo ya se encuentra asignado actualmente a un empleado y no ha sido devuelto.");
        }
        Asignacion nuevaAsignacion = new Asignacion(dispositivo, empleado, OffsetDateTime.now(ZoneId.of("America/Santiago")), null);

        return asignacionRepo.save(nuevaAsignacion);
    }

    public Asignacion desvincularDispositivo(Long idAsignacion) {
        Asignacion asignacion = asignacionRepo.findById(idAsignacion).orElseThrow(() -> new RuntimeException("Asignación no encontrada con ID: " + idAsignacion));

        if (asignacion.getFechaDesvinculacion() != null) {
            throw new RuntimeException("Este dispositivo ya fue devuelto/desvinculado anteriormente.");
        }

        asignacion.setFechaDesvinculacion(OffsetDateTime.now(ZoneId.of("America/Santiago")));
        return asignacionRepo.save(asignacion);
    }

    // --- Métodos de Lectura (Consultas) ---

    public List<Asignacion> obtenerTodasLasAsignaciones() {
        return asignacionRepo.findAll();
    }

    public Asignacion obtenerAsignacionPorId(Long idAsignacion) {
        return asignacionRepo.findById(idAsignacion).orElseThrow(() -> new RuntimeException("Asignación no encontrada con ID: " + idAsignacion));
    }

    public List<Asignacion> obtenerAsignacionesPorEmpleado(Long idEmpleado) {
        return asignacionRepo.findByEmpleadoIdEmpleado(idEmpleado);
    }
}
