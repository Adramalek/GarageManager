package com.develope.blackhole.backend.controller;

import com.develope.blackhole.backend.GarageRecordJsonSerializer;
import com.develope.blackhole.backend.POJOToJsonSchemaConverter;
import com.develope.blackhole.backend.model.Car;
import com.develope.blackhole.backend.model.Driver;
import com.develope.blackhole.backend.model.GarageRecord;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping(path = "/api/profile")
public class ProfilesController {

    private POJOToJsonSchemaConverter pojoToJsonSchemaConverter;
    private GarageRecordJsonSerializer garageRecordJsonSerializer;

    @Autowired
    public ProfilesController(POJOToJsonSchemaConverter pojoToJsonSchemaConverter,
                              GarageRecordJsonSerializer garageRecordJsonSerializer) {
        this.pojoToJsonSchemaConverter = pojoToJsonSchemaConverter;
        this.garageRecordJsonSerializer = garageRecordJsonSerializer;
    }

    @Autowired


    @GetMapping(path = "/garage", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> garageProfile(){
        return convert(GarageRecord.class, Optional.ofNullable(this.garageRecordJsonSerializer));
    }

    @GetMapping(path = "/cars", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> carsProfile(){
        return convert(Car.class, Optional.empty());
    }

    @GetMapping(path = "/drivers", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> driversProfile(){
        return convert(Driver.class, Optional.empty());
    }

    private <T> ResponseEntity<String> convert(Class<T> clazz, Optional<StdSerializer<T>> serializer){
        ResponseEntity<String> response;
        try {
            String result = pojoToJsonSchemaConverter.map(clazz, serializer);
            response = ResponseEntity.ok(result);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            response = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        return response;
    }
}
