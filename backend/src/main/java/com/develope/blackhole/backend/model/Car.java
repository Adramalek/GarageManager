package com.develope.blackhole.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.module.jsonSchema.annotation.JsonHyperSchema;
import com.fasterxml.jackson.module.jsonSchema.annotation.Link;
import lombok.Data;
import lombok.NonNull;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.sql.Date;

@Data
@Entity
@JsonPropertyOrder({
        "color",
        "model",
        "registrationNumber",
        "builtDate"
})
public class Car {

    private @Id @GeneratedValue Long id;
    @JsonProperty("color")
    @Column
    private @NotBlank String color;
    @JsonProperty("model")
    @Column
    private @NotBlank String model;
    @JsonProperty("registrationNumber")
    @Column(unique = true)
    private @NotBlank String registrationNumber;
    @JsonProperty("builtDate")
    @Column
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
