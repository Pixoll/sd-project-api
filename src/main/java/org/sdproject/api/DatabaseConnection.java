package org.sdproject.api;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.ServerApi;
import com.mongodb.ServerApiVersion;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import org.sdproject.api.codecs.EnumCodecProvider;
import org.sdproject.api.structures.Admin;
import org.sdproject.api.structures.Shipment;
import org.sdproject.api.structures.User;

public class DatabaseConnection {
    private static final PojoCodecProvider POJO_CODEC_PROVIDER = PojoCodecProvider.builder().automatic(true).build();
    private static final CodecRegistry POJO_CODEC_REGISTRY = CodecRegistries.fromRegistries(
            CodecRegistries.fromProviders(new EnumCodecProvider()),
            MongoClientSettings.getDefaultCodecRegistry(),
            CodecRegistries.fromProviders(POJO_CODEC_PROVIDER)
    );
    private static DatabaseConnection INSTANCE;
    private final MongoClient client;
    private final MongoDatabase database;

    private DatabaseConnection() {
        this.client = MongoClients.create(MongoClientSettings.builder()
                .applyConnectionString(new ConnectionString(Api.DOTENV.get("MONGO_URI")))
                .serverApi(ServerApi.builder()
                        .strict(true)
                        .version(ServerApiVersion.V1)
                        .deprecationErrors(true)
                        .build()
                )
                .build()
        );

        this.database = this.client.getDatabase(Api.DOTENV.get("MONGO_DB_NAME")).withCodecRegistry(POJO_CODEC_REGISTRY);
    }

    public static void connect() {
        if (INSTANCE == null)
            INSTANCE = new DatabaseConnection();
    }

    public static MongoCollection<Admin> getAdminsCollection() {
        return INSTANCE.database.getCollection("admins", Admin.class);
    }

    public static MongoCollection<Shipment> getShipmentsCollection() {
        return INSTANCE.database.getCollection("shipments", Shipment.class);
    }

    public static MongoCollection<User> getUsersCollection() {
        return INSTANCE.database.getCollection("users", User.class);
    }

    public static void close() {
        INSTANCE.client.close();
    }
}
