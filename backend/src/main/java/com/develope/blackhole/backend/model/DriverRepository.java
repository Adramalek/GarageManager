package com.develope.blackhole.backend.model;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface DriverRepository extends PagingAndSortingRepository<Driver, Long> {
    Iterable<Driver> findDriversByAssignedCarIsNull();
}
