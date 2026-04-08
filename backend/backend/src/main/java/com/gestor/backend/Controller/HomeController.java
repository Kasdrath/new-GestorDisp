package com.gestor.backend.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String inicio() {
        return "¡La API del Gestor de Dispositivos está funcionando correctamente! Prueba visitando /api/empleados o /api/dispositivos.";
    }
}