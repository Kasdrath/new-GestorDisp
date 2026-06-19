package com.gestor.backend.Services;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.LocalDate;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.gestor.backend.Repository.AsignacionRepository;
import com.gestor.backend.Repository.DispositivoRepository;
import com.gestor.backend.Repository.TipoDispRepository;
import com.gestor.backend.model.Computador;
import com.gestor.backend.model.Dispositivo;
import com.gestor.backend.model.Telefono;
import com.gestor.backend.model.TipoDisp;


@Service
public class DispositivoService {

    private final DispositivoRepository dispositivoRepo;
    private final AsignacionRepository asignacionRepo;
    private final TipoDispRepository tipoDispRepo;

    public DispositivoService(DispositivoRepository dispositivoRepo, AsignacionRepository asignacionRepo, TipoDispRepository tipoDispRepo) {
        this.dispositivoRepo = dispositivoRepo;
        this.asignacionRepo = asignacionRepo;
        this.tipoDispRepo = tipoDispRepo;
    }

    public Dispositivo crearNuevoDispositivo(Dispositivo nuevoDispositivo) {
        if (nuevoDispositivo.getNumeroSerie() != null && dispositivoRepo.findByNumeroSerie(nuevoDispositivo.getNumeroSerie()).isPresent()) {
            throw new RuntimeException("El número de serie ya está registrado en otro dispositivo");
        }
        return dispositivoRepo.save(nuevoDispositivo);
    }

    @Transactional
    public Dispositivo modificarDispositivo(Long id, Dispositivo dispositivoEditado) {
        Dispositivo dispositivoExistente = dispositivoRepo.findById(id).orElseThrow(() -> new RuntimeException("Dispositivo no encontrado con ID: " + id));

        // Validar que el número de serie no se repita si lo cambian
        if (dispositivoEditado.getNumeroSerie() != null && 
            !dispositivoEditado.getNumeroSerie().equals(dispositivoExistente.getNumeroSerie())) {
            if (dispositivoRepo.findByNumeroSerie(dispositivoEditado.getNumeroSerie()).isPresent()) {
                throw new RuntimeException("El nuevo número de serie ya pertenece a otro dispositivo");
            }
        }

        // Si el estado cambia de Activo (true) a Dado de baja (false), desvincular al trabajador
        if (dispositivoExistente.getEstadoDisp() != null && dispositivoExistente.getEstadoDisp() && 
            (dispositivoEditado.getEstadoDisp() == null || !dispositivoEditado.getEstadoDisp())) {
            boolean tieneAsignacionesActivas = dispositivoExistente.getAsignaciones().stream()
                .anyMatch(a -> a.getFechaDesvinculacion() == null);
            if (tieneAsignacionesActivas) {
                dispositivoExistente.getAsignaciones().stream().filter(a -> a.getFechaDesvinculacion() == null)
                    .forEach(a -> {
                        a.setFechaDesvinculacion(OffsetDateTime.now(ZoneId.of("America/Santiago")));
                        asignacionRepo.save(a);
                    });
            }
        }

        // 1. Actualizar los campos comunes (clase padre Dispositivo)
        dispositivoExistente.setNumeroSerie(dispositivoEditado.getNumeroSerie());
        dispositivoExistente.setMarcaDisp(dispositivoEditado.getMarcaDisp());
        dispositivoExistente.setModeloDisp(dispositivoEditado.getModeloDisp());
        dispositivoExistente.setTamanoPantalla(dispositivoEditado.getTamanoPantalla());
        dispositivoExistente.setFechaCompra(dispositivoEditado.getFechaCompra());
        dispositivoExistente.setTipoDispositivo(dispositivoEditado.getTipoDispositivo());
        dispositivoExistente.setEstadoDisp(dispositivoEditado.getEstadoDisp());


        // 2. Actualizar campos específicos (clases hijas)
        if (dispositivoExistente instanceof Computador compExistente && dispositivoEditado instanceof Computador compEditado) {
            compExistente.setProcesadorComp(compEditado.getProcesadorComp());
            compExistente.setMemoriaComp(compEditado.getMemoriaComp());
            compExistente.setAlmacenamientoComp(compEditado.getAlmacenamientoComp());
        } else if (dispositivoExistente instanceof Telefono telExistente && dispositivoEditado instanceof Telefono telEditado) {
            telExistente.setNumeroTelefono(telEditado.getNumeroTelefono());
            telExistente.setCompaniaTelefono(telEditado.getCompaniaTelefono());
        }

        return dispositivoRepo.save(dispositivoExistente);
    }

    @Transactional
    public void eliminarDispositivo(Long id) {
        Dispositivo dispositivo = dispositivoRepo.findById(id).orElseThrow(() -> new RuntimeException("Dispositivo no encontrado con ID: " + id));

        boolean tieneAsignacionesActivas = dispositivo.getAsignaciones().stream().anyMatch(a -> a.getFechaDesvinculacion() == null);

        if (tieneAsignacionesActivas) {
            // Desvincular automáticamente el dispositivo marcando la fecha actual
            dispositivo.getAsignaciones().stream().filter(a -> a.getFechaDesvinculacion() == null)
                .forEach(a -> {
                    a.setFechaDesvinculacion(OffsetDateTime.now(ZoneId.of("America/Santiago")));
                    asignacionRepo.save(a);
                });
        }
        
        // Borrado lógico: marcamos el dispositivo como inactivo o dado de baja para conservar el historial
        dispositivo.setEstadoDisp(false);
        dispositivoRepo.save(dispositivo);
    }

    @Transactional
    public List<Dispositivo> importarDesdeExcel(MultipartFile file) {
        List<Dispositivo> dispositivosGuardados = new ArrayList<>();
        DataFormatter formatter = new DataFormatter();
        
        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            
            TipoDisp tipoComputador = tipoDispRepo.findByTipoDispositivoIgnoreCase("Computador")
                    .orElseThrow(() -> new RuntimeException("Tipo de dispositivo 'Computador' no encontrado en la base de datos"));
            TipoDisp tipoTelefono = tipoDispRepo.findByTipoDispositivoIgnoreCase("Teléfono")
                    .orElseThrow(() -> new RuntimeException("Tipo de dispositivo 'Teléfono' no encontrado en la base de datos"));

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Saltar la fila 0 (Cabeceras)
                
                String numSerie = formatter.formatCellValue(row.getCell(0)).trim();
                if (numSerie.isEmpty()) continue; // Saltar filas vacías

                // Evitar insertar dispositivos duplicados por Número de Serie
                if (dispositivoRepo.findByNumeroSerie(numSerie).isPresent()) continue;

                String tipoStr = formatter.formatCellValue(row.getCell(3)).trim().toLowerCase();
                Dispositivo disp;
                
                if (tipoStr.contains("computador") || tipoStr.contains("desktop") || tipoStr.contains("pc")) {
                    Computador comp = new Computador();
                    comp.setProcesadorComp(formatter.formatCellValue(row.getCell(5)));
                    comp.setMemoriaComp(formatter.formatCellValue(row.getCell(6)));
                    comp.setAlmacenamientoComp(formatter.formatCellValue(row.getCell(7)));
                    comp.setTipoDispositivo(tipoComputador);
                    disp = comp;
                } else if (tipoStr.contains("telefono") || tipoStr.contains("teléfono") || tipoStr.contains("phone")) {
                    Telefono tel = new Telefono();
                    tel.setNumeroTelefono(formatter.formatCellValue(row.getCell(8)));
                    tel.setCompaniaTelefono(formatter.formatCellValue(row.getCell(9)));
                    tel.setTipoDispositivo(tipoTelefono);
                    disp = tel;
                } else {
                    continue; // Si no es ni Computador ni Teléfono, ignoramos la fila
                }

                // Setear las propiedades comunes de la clase padre (Dispositivo)
                disp.setNumeroSerie(numSerie);
                disp.setMarcaDisp(formatter.formatCellValue(row.getCell(1)));
                disp.setModeloDisp(formatter.formatCellValue(row.getCell(2)));
                disp.setTamanoPantalla(formatter.formatCellValue(row.getCell(4)));
                disp.setEstadoDisp(true);
                // Definimos la fecha de importación como la fecha de compra por defecto
                disp.setFechaCompra(LocalDate.now(ZoneId.of("America/Santiago")));

                dispositivosGuardados.add(dispositivoRepo.save(disp));
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al procesar el archivo Excel: " + e.getMessage());
        }
        return dispositivosGuardados;
    }
}
