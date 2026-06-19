package com.gestor.backend.Component;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.gestor.backend.Repository.TipoDispRepository;
import com.gestor.backend.model.TipoDisp;

@Component
public class DataSeeder implements CommandLineRunner {

    private final TipoDispRepository tipoDispRepo;

    public DataSeeder(TipoDispRepository tipoDispRepo) {
        this.tipoDispRepo = tipoDispRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        // Solo verificamos si existen los tipos base, ya no creamos datos falsos
        if (tipoDispRepo.count() == 0) {
            System.out.println("⏳ Inicializando tipos de dispositivos maestros...");

            TipoDisp tipoComputador = new TipoDisp();
            tipoComputador.setTipoDispositivo("Computador");
            tipoDispRepo.save(tipoComputador);

            TipoDisp tipoTelefono = new TipoDisp();
            tipoTelefono.setTipoDispositivo("Teléfono");
            tipoDispRepo.save(tipoTelefono);

            System.out.println("✅ Tipos de dispositivos creados exitosamente!");
        }
    }
}
