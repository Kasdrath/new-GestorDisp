package com.gestor.backend.model;
import java.time.OffsetDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Asignacion {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int idAsignacion;
    
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss", timezone = "America/Santiago")
    private OffsetDateTime fechaAsignacion;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss", timezone = "America/Santiago")
    private OffsetDateTime fechaDesvinculacion;

    private int idDispositivo;
    private int idEmpleado;
    private String nombresEmpleado;


    public Asignacion (int idDispositivo, int idEmpleado, String nombresEmpleado, OffsetDateTime fechaAsignacion, OffsetDateTime fechaDesvinculacion){
        this.idDispositivo = idDispositivo;
        this.idEmpleado = idEmpleado;
        this.nombresEmpleado = nombresEmpleado;
        this.fechaAsignacion = fechaAsignacion;
        this.fechaDesvinculacion = fechaDesvinculacion;
    }
    



}
