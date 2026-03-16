package com.gestor.backend.model;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
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
public class TipoDisp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTipoDisp;

    private String tipoDispositivo;
    
    @OneToMany(mappedBy = "tipoDispositivo", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Dispositivo> dispositivos = new ArrayList<>();


}
