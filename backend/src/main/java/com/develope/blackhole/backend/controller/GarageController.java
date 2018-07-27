package com.develope.blackhole.backend.controller;

import com.develope.blackhole.backend.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.PagedResources;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;


@RestController
@RequestMapping(path = "/api/garage")
public class GarageController {

    private final CarRepository carRepository;
    private final DriverRepository driverRepository;

    @Autowired
    public GarageController(CarRepository carRepository, DriverRepository driverRepository) {
        this.carRepository = carRepository;
        this.driverRepository = driverRepository;
    }

    @GetMapping
    public PagedResources<Resource<GarageRecord>> getPage(
            @RequestParam Optional<Long> page,
            @RequestParam Optional<Long> size
    )
    {
        long _page = page.orElse(0L);
        long _size = size.orElse(20L);

        long lastPage = carRepository.countByAssignedDriverNotNull()/_size-1;
        List<Resource<GarageRecord>> garageRecordResources = StreamSupport
                .stream(carRepository.findCarsByAssignedDriverNotNull()
                                .spliterator(),
                        false)
                .skip(_page*_size)
                .limit(_size)
                .map(car -> new GarageRecord(car, car.getAssignedDriver()))
                .map(record -> {
                    String id = record.getCar().getId().toString();
                    Link selfLink = linkTo(GarageController.class)
                            .slash(id)
                            .withSelfRel();
                    Link carLink = linkTo(GarageController.class)
                            .slash(id)
                            .slash("car")
                            .withRel("car");
                    Link driverLink = linkTo(GarageController.class)
                            .slash(id)
                            .slash("driver")
                            .withRel("driver");
                    return new Resource<>(record, selfLink, carLink, driverLink);
                })
                .collect(Collectors.toList());
        List<Link> links = new ArrayList<>();
        Link selfRel = linkTo(GarageController.class).withSelfRel();
        if (page.isPresent()){
            Link first = linkTo(methodOn(GarageController.class)
                    .getPage(Optional.of(0L), size))
                    .withRel("first");
            links.add(first);
        }
        Link last = linkTo(methodOn(GarageController.class)
                .getPage(Optional.of(lastPage), size))
                .withRel("last");
        if (_page > 0) {
            Link prev = linkTo(methodOn(GarageController.class)
                    .getPage( Optional.of(_page-1), size))
                    .withRel("prev");
            links.add(prev);
        }
        links.add(selfRel);
        if (_page < lastPage){
            Link next = linkTo(methodOn(GarageController.class)
                    .getPage(Optional.of(_page+1), size))
                    .withRel("next");
            links.add(next);
        }
        if (page.isPresent()){
            links.add(last);
        }
        Link profile = linkTo(ProfilesController.class).slash("garage").withRel("profile");
        links.add(profile);
        return new PagedResources<>(
                garageRecordResources,
                new PagedResources.PageMetadata(
                        _size, _page,
                        garageRecordResources.size()),
                links);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource<GarageRecord>> get(@PathVariable final Long id){
        GarageRecord record;
        Optional<Car> optionalCar = carRepository.findById(id);
        if (optionalCar.isPresent()){
            Car car = optionalCar.get();
            if (car.getAssignedDriver() == null)
                return ResponseEntity.notFound().build();
            List<Link> links = new ArrayList<>();
            Link selfLink = linkTo(GarageController.class).withSelfRel();
            Link recordLink = linkTo(GarageController.class).withRel("record");
            Link carLink = new Link(
                    linkTo(GarageController.class)
                            .slash(car.getId())
                            .toString()
                            .replace("garage", "cars"))
                    .withRel("car");
            Link driverLink = new Link(
                    linkTo(GarageController.class)
                            .slash(car.getAssignedDriver().getId())
                            .toString()
                            .replace("garage", "drivers"))
                    .withRel("driver");
            links.add(selfLink);
            links.add(recordLink);
            links.add(carLink);
            links.add(driverLink);
            record = new GarageRecord(car, car.getAssignedDriver());
            return ResponseEntity.ok(new Resource<>(record, links));
        }
        else return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable final long id){
        Optional<Car> optionalCar = carRepository.findById(id);
        if (optionalCar.isPresent()){
            Car car = optionalCar.get();
            Driver driver = car.getAssignedDriver();
            if (driver == null)
                return ResponseEntity.notFound().build();
            car.setAssignedDriver(null);
            driver.setAssignedCar(null);
            carRepository.save(car);
            driverRepository.save(driver);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@RequestBody Driver newDriver,
                                       @PathVariable final long id)
    {
        if (newDriver.getAssignedCar() != null){
            return ResponseEntity.badRequest().build();
        }
        Optional<Car> optionalCar = carRepository.findById(id);
        if (optionalCar.isPresent()){
            Car car = optionalCar.get();
            Driver oldDriver = car.getAssignedDriver();
            if (oldDriver == null)
                return ResponseEntity.notFound().build();
            car.setAssignedDriver(newDriver);
            newDriver.setAssignedCar(car);
            oldDriver.setAssignedCar(null);
            carRepository.save(car);
            driverRepository.save(newDriver);
            driverRepository.save(oldDriver);
            return ResponseEntity.ok().build();
        } else
            return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody final long carId,
                                       @RequestBody final long driverId)
    {
        Optional<Car> optionalCar = carRepository.findById(carId);
        Optional<Driver> optionalDriver = driverRepository.findById(driverId);
        if (optionalCar.isPresent() && optionalDriver.isPresent()){
            Car car = optionalCar.get();
            Driver driver = optionalDriver.get();
            if (car.getAssignedDriver() != null || driver.getAssignedCar() != null)
                return ResponseEntity.badRequest().build();
            car.setAssignedDriver(driver);
            driver.setAssignedCar(car);
            carRepository.save(car);
            driverRepository.save(driver);
            return ResponseEntity.ok().build();
        } else
            return ResponseEntity.badRequest().build();
    }
}
