package com.gestor.backend.model;
import jakarta.persistence.Entity;
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

}
