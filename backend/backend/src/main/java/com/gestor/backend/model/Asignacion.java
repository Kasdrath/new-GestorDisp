package com.gestor.backend.model;
import java.time.OffsetDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor


@Entity
public class Asignacion {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long idAsignacion;
    
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss", timezone = "America/Santiago")
    private OffsetDateTime fechaAsignacion;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss", timezone = "America/Santiago")
    private OffsetDateTime fechaDesvinculacion;

    @ManyToOne
    @JoinColumn(name = "idEmpleado") // Nombre de la columna en la BD
    @JsonIgnoreProperties("asignaciones")
    private Empleado empleado;

    @ManyToOne
    @JoinColumn(name="idDispositivo")
    @JsonIgnoreProperties("asignaciones")
    private Dispositivo dispositivo;



    public Asignacion (Dispositivo dispositivo, Empleado empleado, OffsetDateTime fechaAsignacion, OffsetDateTime fechaDesvinculacion){
        this.dispositivo = dispositivo;
        this.empleado = empleado;
        this.fechaAsignacion = fechaAsignacion;
        this.fechaDesvinculacion = fechaDesvinculacion;
    }



}
