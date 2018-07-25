package com.develope.blackhole.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NonNull;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Data
@Entity
public class Driver {

    private @Id @GeneratedValue Long id;
    private @NotBlank String firstName;
    private @NotBlank String secondName;
    private @NonNull Integer experienceInYears;
    private @JsonIgnore @Nullable @OneToOne(cascade = CascadeType.ALL) Car assignedCar;

    public Driver(@NotBlank String firstName, @NotBlank String secondName, Integer experienceInYears, @Nullable Car assignedCar) {
        this.firstName = firstName;
        this.secondName = secondName;
        this.experienceInYears = experienceInYears;
        this.assignedCar = assignedCar;
    }
}
