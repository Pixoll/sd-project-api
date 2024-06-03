package org.sdproject.api.codecs;

import org.bson.BsonReader;
import org.bson.BsonWriter;
import org.bson.codecs.Codec;
import org.bson.codecs.DecoderContext;
import org.bson.codecs.EncoderContext;

public class EnumCodec<T extends Enum<T>> implements Codec<T> {
    private final Class<T> clazz;

    public EnumCodec(Class<T> clazz) {
        this.clazz = clazz;
    }

    public T decode(BsonReader reader, DecoderContext decoderContext) {
        final String value = reader.readString();
        for (T e : this.clazz.getEnumConstants()) {
            if (e.toString().equals(value)) {
                return e;
            }
        }
        return Enum.valueOf(this.clazz, value);
    }

    public void encode(BsonWriter writer, T value, EncoderContext encoderContext) {
        writer.writeString(value.toString());
    }

    public Class<T> getEncoderClass() {
        return this.clazz;
    }
}
