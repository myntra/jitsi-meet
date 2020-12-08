/*
 * Copyright @ 2017-present 8x8, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.jitsi.meet.sdk;

import android.app.Activity;
import android.app.ActivityManager;
import android.os.Build;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.rnimmersive.RNImmersiveModule;

import java.util.HashMap;
import java.util.Map;

import static android.content.Context.ACTIVITY_SERVICE;

@ReactModule(name = ConferenceActionModule.NAME)
class ConferenceActionModule extends ReactContextBaseJavaModule {

    public static final String NAME = "ConferenceAction";
    private static final String TAG = NAME;
    private static ConferenceActionModule SINGLETON = null;
    private ReactContext _reactContext = null;

    public static ConferenceActionModule getInstance () {
        return SINGLETON;
    }

    public ConferenceActionModule(ReactApplicationContext reactContext) {
        super(reactContext);
        _reactContext = reactContext;
        SINGLETON = this;
    }

    public void muteAudioVideo(boolean isMute) {
        _reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("handleVideoMute", null);
        _reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("handleAudioMute", null);
    }

    @Override
    public String getName() {
        return NAME;
    }

    public String getNameWithDate(String date) {
        return date;
    }
}
