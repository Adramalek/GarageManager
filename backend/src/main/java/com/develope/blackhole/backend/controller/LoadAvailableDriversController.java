package com.develope.blackhole.backend.controller;

import com.develope.blackhole.backend.model.Driver;
import com.develope.blackhole.backend.model.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping(path = "/api/drivers")
public class LoadAvailableDriversController {

    private final DriverRepository driverRepository;

    @Autowired
    public LoadAvailableDriversController(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    @GetMapping(path = "/available")
    public Resources<Resource<Driver>> getAll(){
        return new Resources<Resource<Driver>>(StreamSupport
                .stream(driverRepository.findDriversByAssignedCarIsNull()
                                .spliterator(),
                        false)
                .map(Resource::new)
                .collect(Collectors.toList())
        );
    }
}
