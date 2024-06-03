package org.sdproject.api.json;

import java.util.ArrayList;
import java.util.Collection;

public class JSONArray extends org.json.JSONArray {
    public JSONArray() {
        super();
    }

    public JSONArray(org.json.JSONArray source) {
        super(source);
    }

    public JSONArray(String source) {
        super(source);
    }

    public JSONArray(Collection<?> collection) {
        super(collection);
    }

    public <T> ArrayList<T> toList(Class<T> of) {
        final ArrayList<T> list = new ArrayList<>();

        for (int i = 0; i < super.length(); i++) {
            final Object obj = super.get(i);

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
