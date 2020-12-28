package org.jitsi.meet.sdk;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;

import java.util.ArrayList;

@ReactModule(name="APIRequest")
public class APIRequest extends ReactContextBaseJavaModule {
    public static final String NAME = "APIRequest";

    public APIRequest(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void request(String method, String url, final String requestBody, final ReadableMap requestHeaders, final Promise promise) {
        // Delegate to MLive
        ArrayList<BaseReactView> views = BaseReactView.getViews();
        for (BaseReactView view : views) {
            view.onJitsiAPIRequest(method, url, requestBody, requestHeaders, promise);
        }
    }
}
