package com.develope.blackhole.backend;

import com.develope.blackhole.backend.model.GarageRecord;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class GarageRecordJsonSerializer extends StdSerializer<GarageRecord> {

    public GarageRecordJsonSerializer() {
        super(GarageRecord.class);
    }

    @Override
    public void serialize(GarageRecord record,
                          JsonGenerator jsonGenerator,
                          SerializerProvider serializerProvider) throws IOException
    {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeObjectFieldStart("car");
        jsonGenerator.writeStringField("model", record.getCar().getModel());
        jsonGenerator.writeStringField("registrationNumber", record.getCar().getRegistrationNumber());
        jsonGenerator.writeEndObject();
        System.out.println("serializing");
        jsonGenerator.writeObjectFieldStart("driver");
        jsonGenerator.writeStringField("firstName", record.getDriver().getFirstName());
        jsonGenerator.writeStringField("secondName", record.getDriver().getSecondName());
        jsonGenerator.writeStringField("phoneNumber", record.getDriver().getPhoneNumber());
        jsonGenerator.writeEndObject();
        jsonGenerator.writeEndObject();
    }
}
