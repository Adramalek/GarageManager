package com.develope.blackhole.backend.model;


import com.fasterxml.jackson.annotation.*;
import lombok.Data;
import lombok.NonNull;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.springframework.hateoas.ResourceSupport;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonPropertyOrder({
        "car",
        "driver"
})
public class GarageRecord extends ResourceSupport {

    @JsonProperty("car")
    private  Car car;
    @JsonProperty("driver")
    private Driver driver;

    public GarageRecord(@NonNull Car car, @NonNull Driver driver){
        this.car = car;
        this.driver = driver;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
}
