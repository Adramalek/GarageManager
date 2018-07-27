package com.develope.blackhole.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.module.jsonSchema.annotation.JsonHyperSchema;
import com.fasterxml.jackson.module.jsonSchema.annotation.Link;
import lombok.Data;
import lombok.NonNull;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.PositiveOrZero;

@Data
@Entity
@JsonPropertyOrder({
        "firstName",
        "secondName",
        "experienceInYears",
        "phoneNumber"
})
public class Driver {

    private @Id @GeneratedValue Long id;
    @JsonProperty("firstName")
    @Pattern(regexp = "^[A-ZА-Я][a-zа-я]*$")
    @Column
    private @NotBlank String firstName;
    @JsonProperty("secondName")
    @Pattern(regexp = "^[A-ZА-Я][a-zа-я]*$")
    @Column
    private @NotBlank String secondName;
    @JsonProperty("experienceInYears")
    @NonNull
    @PositiveOrZero
    @Column
    private Integer experienceInYears;
    @Pattern(regexp="^(8|\\+7)[0-9]{10}$")
    @JsonProperty("phoneNumber")
    @Column(unique = true)
    private @NonNull String phoneNumber;
    private @JsonIgnore @Nullable @OneToOne(cascade = CascadeType.ALL) Car assignedCar;

    public Driver(@Pattern(regexp = "^[A-ZА-Я][a-zа-я]*$") @NotBlank String firstName,
                  @Pattern(regexp = "^[A-ZА-Я][a-zа-я]*$") @NotBlank String secondName,
                  @PositiveOrZero Integer experienceInYears,
                  @Pattern(regexp = "^[0-9]{10}$") String phoneNumber,
                  @Nullable Car assignedCar) {
        this.firstName = firstName;
        this.secondName = secondName;
        this.experienceInYears = experienceInYears;
        this.phoneNumber = phoneNumber;
        this.assignedCar = assignedCar;
    }
}
