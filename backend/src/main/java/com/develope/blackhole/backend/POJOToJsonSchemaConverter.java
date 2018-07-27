package com.develope.blackhole.backend;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.fasterxml.jackson.module.jsonSchema.JsonSchemaGenerator;
import com.fasterxml.jackson.module.jsonSchema.customProperties.HyperSchemaFactoryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class POJOToJsonSchemaConverter {

    public POJOToJsonSchemaConverter(){}

    public <T> String map(Class<T> clazz, Optional<StdSerializer<T>> serializer) throws JsonProcessingException {
        JsonSchemaGenerator schemaGenerator;
        HyperSchemaFactoryWrapper hyperSchemaFactoryWrapper = new HyperSchemaFactoryWrapper();
        ObjectMapper mapper = new ObjectMapper();
        mapper.acceptJsonFormatVisitor(clazz, hyperSchemaFactoryWrapper);
        if (serializer.isPresent()){
            SimpleModule module = new SimpleModule("Custom serializer");
            module.addSerializer(clazz, serializer.get());
            mapper.registerModule(module);
        }
        schemaGenerator = new JsonSchemaGenerator(mapper);
        return mapper.writerWithDefaultPrettyPrinter()
                .writeValueAsString(schemaGenerator.generateSchema(clazz));
    }
}
