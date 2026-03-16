package com.gestor.backend.model;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
public class Dispositivo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDispositivo;

    @Column(unique = true)
    private String numeroSerie;

    private String marcaDisp;
    private String modeloDisp;
    private String memoriaDisp;
    private String procesadorDisp;
    private String tamanoPantalla;
    private int numeroTel;
    private LocalDate fechaCompra;

    @OneToMany(mappedBy="dispositivo", cascade=CascadeType.ALL)
    @ToString.Exclude
    private List<Asignacion> asignaciones = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "idTipoDisp") // Nombre de la columna en la BD
    private TipoDisp tipoDispositivo;



    

}
