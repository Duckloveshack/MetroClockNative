package com.metromodules

import android.content.ContentResolver
import android.os.Bundle
import android.provider.CallLog.Calls
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.ReactApplicationContext

class NativeCallContactModule(reactContext: ReactApplicationContext) : NativeCallContactSpec(reactContext) {
    override fun getTypedExportedConstants(): MutableMap<String, Any> {
        return mutableMapOf(
            "CALL_TYPE_INCOMING" to Calls.INCOMING_TYPE,
            "CALL_TYPE_OUTGOING" to Calls.OUTGOING_TYPE,
            "CALL_TYPE_MISSED" to Calls.MISSED_TYPE,
            "CALL_TYPE_VOICEMAIL" to Calls.VOICEMAIL_TYPE,
            "CALL_TYPE_REJECTED" to Calls.REJECTED_TYPE,
            "CALL_TYPE_BLOCKED" to Calls.BLOCKED_TYPE,
            "CALL_TYPE_ANSWERED_EXTERNALLY" to Calls.ANSWERED_EXTERNALLY_TYPE
        )
    }

    override fun getName() = NAME

    private fun getCallsLocal(count: Int): WritableArray {
        var bundle = Bundle();
        bundle.putInt(
            ContentResolver.QUERY_ARG_LIMIT,
            count
        )

        val cursor = reactApplicationContext.contentResolver.query(
            Calls.CONTENT_URI.buildUpon().appendQueryParameter(Calls.LIMIT_PARAM_KEY, "$count").build(),
            null,
            null,
            null,
            null
        )

        val callsNative = Arguments.createArray();

        cursor?.use {
            val indexCachedName = it.getColumnIndex(Calls.CACHED_NAME)
            val indexCountryISO = it.getColumnIndex(Calls.COUNTRY_ISO)
            val indexDate = it.getColumnIndex(Calls.DATE);
            val indexDuration = it.getColumnIndex(Calls.DURATION);
            val indexNumber = it.getColumnIndex(Calls.NUMBER);
            val indexType = it.getColumnIndex(Calls.TYPE);

            while (it.moveToNext()) {
                val callMap = Arguments.createMap();

                callMap.putString("cached_name", cursor.getString(indexCachedName))
                callMap.putString("country_iso", cursor.getString(indexCountryISO));
                callMap.putDouble("date", cursor.getLong(indexDate).toDouble());
                callMap.putDouble("duration", cursor.getLong(indexDuration).toDouble());
                callMap.putString("number", cursor.getString(indexNumber));
                callMap.putDouble("type", cursor.getInt(indexType).toDouble());

                callsNative.pushMap(callMap);
            }
        }

        return callsNative;
    }

    override fun fetchCallLogs(count: Double, promise: Promise) {
        try {
            val result = getCallsLocal(count.toInt());
            promise.resolve(result)
        } catch (err: Exception) {
            promise.reject("CALL_LOG_ERROR", "Failed to fetch call logs", err);
        }
    }

    companion object {
        const val NAME = "NativeCallContact"
    }
}