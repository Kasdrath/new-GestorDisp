package com.gestor.backend.Repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestor.backend.model.TipoDisp;

@Repository
public interface TipoDispRepository extends JpaRepository<TipoDisp, Long> {
    Optional<TipoDisp> findByTipoDispositivoIgnoreCase(String tipoDispositivo);
}