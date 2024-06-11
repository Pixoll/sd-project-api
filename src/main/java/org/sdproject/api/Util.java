package org.sdproject.api;

import com.google.common.hash.Hashing;
import org.jetbrains.annotations.Nullable;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.util.ArrayList;

public class Util {
    public static JSONObject readJSONObjectFile(File file) {
        final String content;
        try {
            content = Files.readString(Paths.get(file.toURI()));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return new JSONObject(content);
    }

    public static ArrayList<JSONObject> readJSONArrayFile(File file) {
        final String content;
        try {
            content = Files.readString(Paths.get(file.toURI()));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return jsonArrayToList(new JSONArray(content), JSONObject.class);
    }

    public static JSONObject readJSONObjectFile(String path) {
        return readJSONObjectFile(new File(path));
    }

    public static ArrayList<JSONObject> readJSONArrayFile(String path) {
        return readJSONArrayFile(new File(path));
    }

    public static String generateSalt() {
        byte[] randomBytes = new byte[16];
        new SecureRandom().nextBytes(randomBytes);
        return new BigInteger(1, randomBytes).toString(16);
    }

    public static String hashPassword(String password, String salt) {
        return Hashing.sha256()
                .hashString(password + salt, StandardCharsets.UTF_8)
                .toString();
    }

    public static <E extends Enum<E>> @Nullable E stringToEnum(@Nullable String value, Class<E> enumClass) {
        if (value == null) return null;
        for (final E e : enumClass.getEnumConstants()) {
            if (e.toString().equals(value)) {
                return e;
            }
        }
        return null;
    }

    public static <T> ArrayList<T> jsonArrayToList(JSONArray jsonArray, Class<T> of) {
        final ArrayList<T> list = new ArrayList<>();

        for (int i = 0; i < jsonArray.length(); i++) {
            final Object obj = jsonArray.get(i);

            try {
                list.add(of.cast(obj));
            } catch (ClassCastException e) {
                try {
                    list.add(of.getDeclaredConstructor(obj.getClass()).newInstance(obj));
                } catch (Exception ex) {
                    throw new RuntimeException(ex);
                }
            }
        }

        return list;
    }
}
