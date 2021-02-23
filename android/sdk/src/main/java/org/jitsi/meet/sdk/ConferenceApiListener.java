package org.jitsi.meet.sdk;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;

public interface ConferenceApiListener {
    void onPing(String method, String url, String requestBody, ReadableMap requestHeaders, Promise promise);
}
