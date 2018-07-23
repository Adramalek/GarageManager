package com.develope.blackhole.backend.controller;

import com.develope.blackhole.backend.model.Car;
import com.develope.blackhole.backend.model.CarRepository;
import com.develope.blackhole.backend.model.Garage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Deprecated
@Controller
@RequestMapping(path = "/api")
public class GarageController {

    private final CarRepository carRepository;

    @Autowired
    public GarageController(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    @GetMapping(path = "/garage", params = { "page", "size" })
    @CrossOrigin(origins = "http://localhost:3000")
    @ResponseBody
    public Garage getGarage(@RequestParam( "page" ) int page, @RequestParam( "size" ) int size,
                            UriComponentsBuilder uriBuilder, HttpServletResponse response){
        List<Car> cars = StreamSupport
                .stream(carRepository.findAll().spliterator(), false)
                .filter(car -> car.getAssignedDriver() != null)
                .collect(Collectors.toList());

        return new Garage(cars);
    }


}
