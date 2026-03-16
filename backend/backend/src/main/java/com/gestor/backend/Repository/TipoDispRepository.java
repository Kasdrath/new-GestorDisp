package com.gestor.backend.Repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gestor.backend.model.TipoDisp;

public interface TipoDispRepository extends JpaRepository<TipoDisp, Long> {
    Optional<TipoDisp> findByTipoDispositivo(String tipoDispositivo);
}

