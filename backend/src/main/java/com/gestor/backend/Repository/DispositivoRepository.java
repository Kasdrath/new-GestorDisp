package com.gestor.backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gestor.backend.model.Dispositivo;


public interface DispositivoRepository extends JpaRepository<Dispositivo, Long> {
    Optional<Dispositivo> findByNumeroSerie(String numeroSerie);
}

