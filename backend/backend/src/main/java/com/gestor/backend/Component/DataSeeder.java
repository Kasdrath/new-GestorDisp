package com.gestor.backend.Component;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.gestor.backend.Repository.AsignacionRepository;
import com.gestor.backend.Repository.DispositivoRepository;
import com.gestor.backend.Repository.EmpleadoRepository;
import com.gestor.backend.Repository.TipoDispRepository;
import com.gestor.backend.model.Asignacion;
import com.gestor.backend.model.Computador;
import com.gestor.backend.model.Empleado;
import com.gestor.backend.model.Telefono;
import com.gestor.backend.model.TipoDisp;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private EmpleadoRepository empleadoRepo;

    @Autowired
    private DispositivoRepository dispositivoRepo;

    @Autowired
    private AsignacionRepository asignacionRepo;

    @Autowired
    private TipoDispRepository tipoDispRepo;

    @Override
    public void run(String... args) throws Exception {
        // Verificamos si la base de datos ya tiene datos para no duplicarlos al reiniciar
        if (empleadoRepo.count() == 0) {
            System.out.println("⏳ Poblando la base de datos de PostgreSQL con datos iniciales...");

            // 1. Crear Empleados
            Empleado emp1 = new Empleado();
            emp1.setRutEmpleado("11111111-1");
            emp1.setNombresEmpleado("Juan");
            emp1.setApellidosEmpleado("Pérez");
            emp1.setEmailEmpleado("juan.perez@empresa.cl");
            emp1.setTelefonoEmpleado("+56912345678");
            emp1.setCargoEmpleado("Desarrollador");
            empleadoRepo.save(emp1);

            Empleado emp2 = new Empleado();
            emp2.setRutEmpleado("22222222-2");
            emp2.setNombresEmpleado("Ana");
            emp2.setApellidosEmpleado("Gómez");
            emp2.setEmailEmpleado("ana.gomez@empresa.cl");
            emp2.setTelefonoEmpleado("+56987654321");
            emp2.setCargoEmpleado("Diseñadora UI/UX");
            empleadoRepo.save(emp2);

            // 2. Crear Tipos de Dispositivos
            TipoDisp tipoComputador = new TipoDisp();
            tipoComputador.setTipoDispositivo("Computador");
            tipoComputador = tipoDispRepo.save(tipoComputador);

            TipoDisp tipoTelefono = new TipoDisp();
            tipoTelefono.setTipoDispositivo("Teléfono");
            tipoTelefono = tipoDispRepo.save(tipoTelefono);

            // 3. Crear un Computador
            Computador pc1 = new Computador();
            pc1.setNumeroSerie("PC-XYZ-001");
            pc1.setMarcaDisp("Dell");
            pc1.setModeloDisp("XPS 15");
            pc1.setTamanoPantalla("15.6");
            pc1.setFechaCompra(LocalDate.now().minusMonths(6));
            pc1.setProcesadorComp("Intel Core i7");
            pc1.setMemoriaComp("16GB RAM");
            pc1.setAlmacenamientoComp("512GB SSD");
            pc1.setTipoDispositivo(tipoComputador);
            dispositivoRepo.save(pc1);

            // 4. Crear un Teléfono
            Telefono tel1 = new Telefono();
            tel1.setNumeroSerie("TEL-ABC-002");
            tel1.setMarcaDisp("Samsung");
            tel1.setModeloDisp("Galaxy S22");
            tel1.setTamanoPantalla("6.1");
            tel1.setFechaCompra(LocalDate.now().minusMonths(2));
            tel1.setNumeroTelefono("+56955555555");
            tel1.setCompaniaTelefono("Entel");
            tel1.setTipoDispositivo(tipoTelefono);
            dispositivoRepo.save(tel1);

            // 5. Crear una Asignación Inicial (Préstamo del PC a Juan Pérez)
            Asignacion asignacion1 = new Asignacion(
                pc1, 
                emp1, 
                OffsetDateTime.now(ZoneId.of("America/Santiago")), 
                null
            );
            asignacionRepo.save(asignacion1);

            System.out.println("✅ Base de datos poblada exitosamente!");
        }
    }
}
