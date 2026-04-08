package com.gestor.backend.Repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gestor.backend.model.Asignacion;

public interface AsignacionRepository extends JpaRepository<Asignacion, Long> {
    List<Asignacion> findByEmpleadoIdEmpleado(Long idEmpleado);
    
    List<Asignacion> findByEmpleadoIdEmpleadoAndFechaDesvinculacionIsNull(Long idEmpleado);

    List<Asignacion> findByDispositivoIdDispositivoAndFechaDesvinculacionIsNull(Long idDispositivo);

    List<Asignacion> findByDispositivoIdDispositivo(Long idDispositivo);
}
