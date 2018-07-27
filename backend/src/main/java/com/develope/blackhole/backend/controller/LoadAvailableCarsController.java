package com.develope.blackhole.backend.controller;

import com.develope.blackhole.backend.model.Car;
import com.develope.blackhole.backend.model.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping(path = "/api/cars")
public class LoadAvailableCarsController {

    private final CarRepository carRepository;

    @Autowired
    public LoadAvailableCarsController(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    @GetMapping(path = "/available")
    public Resources<Resource<Car>> getAll(){
        return new Resources<Resource<Car>>(StreamSupport
                .stream(carRepository.findCarsByAssignedDriverIsNull()
                                .spliterator(),
                        false)
                .map(Resource::new)
                .collect(Collectors.toList())
        );
    }
}
