package com.develope.blackhole.backend.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final CarRepository carRepository;
    private final DriverRepository driverRepository;

    @Autowired
    public DatabaseLoader(CarRepository carRepository, DriverRepository driverRepository) {
        this.carRepository = carRepository;
        this.driverRepository = driverRepository;
    }

    private List<Car> defaultCars() {
        List<Car> cars = new ArrayList<>();
        cars.add(
                new Car("black",
                        "mazda",
                        "A102BE 116",
                        "2015-12-02",
                        null));
        cars.add(
                new Car("white",
                        "toyota",
                        "B021HP 114",
                        "2016-04-25",
                        null));
        cars.add(
                new Car("red",
                        "lada",
                        "B212HE 112",
                        "2016-04-25",
                        null));
        return cars;
    }

    private List<Driver> defaultDrivers(){
        List<Driver> drivers = new ArrayList<>();
        drivers.add(
                new Driver("Ivan",
                        "Ivanov",
                        6,
                        "89997770303",
                        null));
        drivers.add(
                new Driver("Oleg",
                        "Olegov",
                        4,
                        "89346740304",
                        null));
        drivers.add(
                new Driver("Ahmed",
                        "Ahmedov",
                        15,
                        "89376541304",
                        null));
        return drivers;
    }

    private void bind(Car car, Driver driver){
        car.setAssignedDriver(driver);
        driver.setAssignedCar(car);
    }

    @Override
    public void run(String... args) throws Exception {
        List<Car> cars = defaultCars();
        List<Driver> drivers = defaultDrivers();
        bind(cars.get(0), drivers.get(1));
        bind(cars.get(1), drivers.get(0));
        cars.forEach(carRepository::save);
        drivers.forEach(driverRepository::save);
    }
}
