package com.gestor.backend.model;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "tipo")
@JsonSubTypes({
    @JsonSubTypes.Type(value = Computador.class, name = "computador"),
    @JsonSubTypes.Type(value = Telefono.class, name = "telefono")
})
public class Dispositivo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDispositivo;

    @Column(unique = true)
    private String numeroSerie;
    private String marcaDisp;
    private String modeloDisp;
    private String tamanoPantalla;
    private LocalDate fechaCompra;
    private Boolean estadoDisp;


    @OneToMany(mappedBy="dispositivo", cascade=CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnoreProperties("dispositivo")
    private List<Asignacion> asignaciones = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "idTipoDisp")
    @JsonIgnoreProperties("dispositivos")
    private TipoDisp tipoDispositivo;
}
