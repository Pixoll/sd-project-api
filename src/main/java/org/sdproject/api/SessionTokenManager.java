package org.sdproject.api;

import org.json.JSONObject;

import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.security.SecureRandom;
import java.util.Base64;

public class SessionTokenManager {
    private static final File TOKENS_FILE = new File("data/tokens.json");
    private static final JSONObject TOKENS = new JSONObject()
            .put(TokenType.USER.toString(), new JSONObject())
            .put(TokenType.ADMIN.toString(), new JSONObject());

    public enum TokenType {
        ADMIN("admin"),
        USER("user");

        private final String type;

        TokenType(final String type) {
            this.type = type;
        }

        @Override
        public String toString() {
            return this.type;
        }
    }

    public static void loadSessionTokens() {
        if (!TOKENS_FILE.exists()) {
            //noinspection ResultOfMethodCallIgnored
            TOKENS_FILE.getParentFile().mkdirs();
            try {
                //noinspection ResultOfMethodCallIgnored
                TOKENS_FILE.createNewFile();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            saveSessionTokens();
            return;
        }

        final JSONObject json = Util.readJSONObjectFile(TOKENS_FILE);

        TOKENS.put(TokenType.USER.toString(), json.getJSONObject(TokenType.USER.toString()));
        TOKENS.put(TokenType.ADMIN.toString(), json.getJSONObject(TokenType.ADMIN.toString()));
    }

    public static @Nonnull String generateSessionToken(@Nonnull TokenType type, @Nonnull String rut) {
        final JSONObject destination = TOKENS.getJSONObject(type.toString());
        if (destination.has(rut)) {
            revokeToken(type, rut);
        }

        String token;
        do {
            byte[] randomBytes = new byte[64];
            new SecureRandom().nextBytes(randomBytes);
            token = Base64.getEncoder().encodeToString(randomBytes);
        } while (destination.has(token));

        destination.put(rut, token);
        destination.put(token, rut);
        saveSessionTokens();

        return token;
    }

    public static @Nullable String getRutFromToken(@Nonnull TokenType type, @Nonnull String token) {
        return TOKENS.getJSONObject(type.toString()).optString(token, null);
    }

    public static void revokeToken(@Nonnull TokenType type, @Nonnull String rut) {
        final JSONObject source = TOKENS.getJSONObject(type.toString());
        if (!source.has(rut)) return;

        final String token = source.getString(rut);

        source.remove(rut);
        source.remove(token);
        saveSessionTokens();
    }

    private static void saveSessionTokens() {
        try (FileWriter fileWriter = new FileWriter(TOKENS_FILE)) {
            fileWriter.write(TOKENS.toString());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
