package io.github.duckloveshack.metro_dialer_native

import android.os.Bundle
import android.content.Intent
import android.net.Uri
import android.util.Log
import com.zoontek.rnbootsplash.RNBootSplash

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.result.ActivityResult
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.metromodules.NativeMiscModule

class CallActivity : ReactActivity() {
    private lateinit var activityLauncher: ActivityResultLauncher<Intent>

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "call"

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return object : ReactActivityDelegate(this, mainComponentName) {
            override fun getLaunchOptions(): Bundle {
                return Bundle().apply { putString("number", intent.data?.schemeSpecificPart) }
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        activityLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result: ActivityResult ->
            NativeMiscModule.dialerRolePromise?.resolve(result.resultCode)
        }
        super.onCreate(null)
    }

    fun getActivityLauncher(): ActivityResultLauncher<Intent> {
        return activityLauncher
    }
}
