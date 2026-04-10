package com.gestor.backend.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestor.backend.Repository.DispositivoRepository;
import com.gestor.backend.model.Computador;
import com.gestor.backend.model.Dispositivo;
import com.gestor.backend.model.Telefono;


@Service
public class DispositivoService {

    @Autowired
    private DispositivoRepository dispositivoRepo;

    public Dispositivo crearNuevoDispositivo(Dispositivo nuevoDispositivo) {
        if (nuevoDispositivo.getNumeroSerie() != null && dispositivoRepo.findByNumeroSerie(nuevoDispositivo.getNumeroSerie()).isPresent()) {
            throw new RuntimeException("El número de serie ya está registrado en otro dispositivo");
        }
        return dispositivoRepo.save(nuevoDispositivo);
    }

    public Dispositivo modificarDispositivo(Long id, Dispositivo dispositivoEditado) {
        Dispositivo dispositivoExistente = dispositivoRepo.findById(id).orElseThrow(() -> new RuntimeException("Dispositivo no encontrado con ID: " + id));

        // Validar que el número de serie no se repita si lo cambian
        if (dispositivoEditado.getNumeroSerie() != null && 
            !dispositivoEditado.getNumeroSerie().equals(dispositivoExistente.getNumeroSerie())) {
            if (dispositivoRepo.findByNumeroSerie(dispositivoEditado.getNumeroSerie()).isPresent()) {
                throw new RuntimeException("El nuevo número de serie ya pertenece a otro dispositivo");
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
            throw new RuntimeException("No se puede eliminar el dispositivo porque está asignado actualmente. Debe ser devuelto primero.");
        }
        dispositivoRepo.delete(dispositivo);
    }
}
