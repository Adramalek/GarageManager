package com.develope.blackhole.backend.model;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface CarRepository extends PagingAndSortingRepository<Car, Long> {
    Iterable<Car> findCarsByAssignedDriverNotNull();
    long countByAssignedDriverNotNull();
    Iterable<Car> findCarsByAssignedDriverIsNull();
}
