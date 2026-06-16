package com.gestor.backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gestor.backend.model.Dispositivo;
import com.gestor.backend.model.Telefono;

public interface TelefonoRepository extends JpaRepository<Telefono, Long> {
    Optional<Dispositivo> findBynumeroTelefono(String numeroTelefono);
}
