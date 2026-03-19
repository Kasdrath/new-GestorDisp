package com.gestor.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gestor.backend.model.Computador;

public interface ComputadorRepository extends JpaRepository<Computador, Long> {
}
