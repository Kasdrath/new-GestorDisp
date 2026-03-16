package com.gestor.backend.model;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
@Data
@EqualsAndHashCode(callSuper=true)
@AllArgsConstructor
@NoArgsConstructor

@Entity
public class Telefono extends Dispositivo{
    private String numeroTelefono;
    private String companiaTelefono;
    
    @ManyToOne
    @JoinColumn(name = "idTipoDisp") // Nombre de la columna en la BD
    private TipoDisp tipoDispositivo;
    

}
