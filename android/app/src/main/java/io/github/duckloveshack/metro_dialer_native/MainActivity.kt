package io.github.duckloveshack.metro_dialer_native

import android.os.Bundle;
import android.content.Intent
import com.zoontek.rnbootsplash.RNBootSplash;

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.result.ActivityResult
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.bridge.Promise
import com.metromodules.NativeMiscModule

class MainActivity : ReactActivity() {
  private lateinit var activityLauncher: ActivityResultLauncher<Intent>;

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "launcher"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    activityLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result: ActivityResult ->
      val dialerPromise = NativeMiscModule.dialerRolePromise;
      
      if (dialerPromise != null) {
        dialerPromise.resolve(result.resultCode);
        //dialerPromise.resolve(2.00);
      }
    };

    RNBootSplash.init(this, R.style.BootTheme);
    super.onCreate(null);
  }

  fun getActivityLauncher(): ActivityResultLauncher<Intent>? {
    return activityLauncher;
  }

  companion object {
    
  }
}
