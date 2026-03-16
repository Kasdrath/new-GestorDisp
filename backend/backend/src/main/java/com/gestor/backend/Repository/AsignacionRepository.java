package com.gestor.backend.Repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gestor.backend.model.Asignacion;
import com.gestor.backend.model.TipoDisp;

public interface AsignacionRepository extends JpaRepository<TipoDisp, Long> {
// Busca el historial de asignaciones de un empleado
    List<Asignacion> findByEmpleadoIdEmpleado(Long idEmpleado);
    
    // Busca si un dispositivo esta actualmente asignado
    List<Asignacion> findByDispositivoIdDispositivoAndFechaDesvinculacionIsNull(Long idDispositivo);
}
