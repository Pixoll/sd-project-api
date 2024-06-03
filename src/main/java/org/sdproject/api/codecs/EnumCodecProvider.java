package org.sdproject.api.codecs;

import org.bson.codecs.Codec;
import org.bson.codecs.configuration.CodecProvider;
import org.bson.codecs.configuration.CodecRegistry;

public class EnumCodecProvider implements CodecProvider {
    public EnumCodecProvider() {
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    public <T> Codec<T> get(Class<T> clazz, CodecRegistry registry) {
        return Enum.class.isAssignableFrom(clazz) ? new EnumCodec(clazz) : null;
    }

    public String toString() {
        return "EnumCodecProvider{}";
    }
}
