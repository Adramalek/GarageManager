package com.develope.blackhole.backend.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private static final List<Car> DEFAULT_CARS;
    private static final List<Driver> DEFAULT_DRIVERS;

    private final CarRepository carRepository;
    private final DriverRepository driverRepository;

    @Autowired
    public DatabaseLoader(CarRepository carRepository, DriverRepository driverRepository) {
        this.carRepository = carRepository;
        this.driverRepository = driverRepository;
    }

    static {
        DEFAULT_CARS = List.of(
                new Car("black",
                        "mazda",
                        "A102BE 116",
                        "2015-12-02",
                        null),
                new Car("white",
                        "toyota",
                        "B021HP 114",
                        "2016-04-25",
                        null)
        );
        DEFAULT_DRIVERS = List.of(
                new Driver("Ivan",
                        "Ivanov",
                        6),
                new Driver("Oleg",
                        "Olegov",
                        4)
        );
        DEFAULT_CARS.get(0).setAssignedDriver(DEFAULT_DRIVERS.get(1));

    }

    @Override
    public void run(String... args) throws Exception {
        DEFAULT_CARS.forEach(carRepository::save);
        DEFAULT_DRIVERS.forEach(driverRepository::save);
    }
}
