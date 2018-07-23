package com.develope.blackhole.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NonNull;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.sql.Date;

@Data
@Entity
public class Car {

    private @Id @GeneratedValue Long id;
    private @NotBlank String color;
    private @NotBlank String model;
    private @NotBlank String registrationNumber;
    private @NonNull @DateTimeFormat(pattern = "yyyy-mm-dd") Date builtDate;
    private @JsonIgnore @Nullable @OneToOne(cascade = CascadeType.ALL) Driver assignedDriver;

    public Car(@NotBlank String color,
               @NotBlank String model,
               @NotBlank String registrationNumber,
               @DateTimeFormat(pattern = "yyyy-mm-dd") String builtDate,
               @Nullable Driver assignedDriver) {
        this.color = color;
        this.model = model;
        this.registrationNumber = registrationNumber;
        this.builtDate = Date.valueOf(builtDate);
        this.assignedDriver = assignedDriver;
    }

    public void setBuiltDate(@NotBlank String builtDate){
        this.builtDate = Date.valueOf(builtDate);
    }
}
