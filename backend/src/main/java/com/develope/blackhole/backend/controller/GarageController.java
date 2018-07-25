package com.develope.blackhole.backend.controller;

import com.develope.blackhole.backend.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.PagedResources;
import org.springframework.hateoas.Resource;
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

    @GetMapping(value = {"", "?page={page}&size={size}"})
    public PagedResources<Resource<GarageRecord>> all(
//            @RequestParam(name = "page", required = false, defaultValue = "0") int page,
//            @RequestParam(name = "size", required = false, defaultValue = "5") int size
            @PathVariable(name = "page",required = false) Integer page,
            @PathVariable(name = "size", required = false) Integer size
    )
    {
        Optional<Integer> optionalPage = Optional.ofNullable(page);
        Optional<Integer> optionalSize = Optional.ofNullable(size);
        int _page = optionalPage.orElse(0);
        int _size = optionalSize.orElse(5);
        List<Car> cars = StreamSupport
                .stream(carRepository.findCarsByAssignedDriverNotNull().spliterator(),false)
                .collect(Collectors.toList());

        List<Resource<GarageRecord>> garageRecordResources = cars.stream()
                .skip(_page*_size)
                .limit(_size)
                .map(car -> new GarageRecord(car, car.getAssignedDriver(), car.getId()))
                .map(record -> {
                    String id = record.getRecordId().toString();
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
        int lastPage = cars.size()/_size-1;
        if (optionalPage.isPresent()){
            Link first = linkTo(methodOn(GarageController.class)
                    .all(0, _size))
                    .withRel("first");
            links.add(first);
        }
        Link last = linkTo(methodOn(GarageController.class)
                .all(lastPage, _size))
                .withRel("last");
        if (_page > 0) {
            Link prev = linkTo(methodOn(GarageController.class)
                    .all(_page-1, _size))
                    .withRel("prev");
            links.add(prev);
        }
        links.add(selfRel);
        if (_page < lastPage){
            Link next = linkTo(methodOn(GarageController.class)
                    .all(_page+1, _size))
                    .withRel("next");
            links.add(next);
        }
        if (optionalPage.isPresent()){
            links.add(last);
        }
        return new PagedResources<>(
                garageRecordResources,
                new PagedResources.PageMetadata(
                        _size, _page,
                        garageRecordResources.size()),
                links);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GarageRecord> get(@PathVariable final Long id){
        GarageRecord record;
        Optional<Car> optionalCar = carRepository.findById(id);
        if (optionalCar.isPresent()){
            Car car = optionalCar.get();
            if (car.getAssignedDriver() == null)
                return ResponseEntity.notFound().build();
            record = new GarageRecord(car, car.getAssignedDriver(), car.getId());
            return ResponseEntity.ok(record);
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
