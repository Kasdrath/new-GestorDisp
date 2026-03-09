package com.gestor.backend.model;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
public class Empleado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idEmpleado;

    private String nombresEmpleado;
    private String apellidosEmpleado;

    @Column(unique = true)
    private String rutEmpleado;

    private String emailEmpleado;
    private String telefonoEmpleado;
    private String nacionalidadEmpleado;
    private String cargoEmpleado;

    @OneToMany(mappedBy="empleadoAsociado")
    @ToString.Exclude
    private List<Dispositivo> dispositivosEmpleados = new ArrayList<>();
}
