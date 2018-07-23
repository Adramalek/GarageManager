package com.develope.blackhole.backend.model;


import lombok.Getter;
import lombok.NonNull;

import java.util.List;
import java.util.stream.Collectors;

public class Garage {

    private @Getter List<Car> cars;
    private @Getter List<Driver> drives;

    public Garage(@NonNull List<Car> cars){
        this.cars = cars;
        this.drives = cars.stream().map(car -> car.getAssignedDriver()).collect(Collectors.toList());
    }


}
