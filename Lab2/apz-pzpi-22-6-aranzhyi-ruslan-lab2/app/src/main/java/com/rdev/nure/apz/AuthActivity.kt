package com.rdev.nure.apz

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.core.content.ContextCompat.startActivity
import com.rdev.nure.apz.api.getApiClient
import com.rdev.nure.apz.api.handleResponse
import com.rdev.nure.apz.api.requests.LoginRequest
import com.rdev.nure.apz.api.responses.AuthResponse
import com.rdev.nure.apz.api.services.AuthService
import com.rdev.nure.apz.components.AuthPanel
import com.rdev.nure.apz.ui.theme.ApzTheme
import kotlinx.coroutines.launch
import androidx.core.content.edit
import com.rdev.nure.apz.api.requests.RegisterRequest
import com.rdev.nure.apz.util.getActivity

private val authApi: AuthService = getApiClient().create(AuthService::class.java)

class AuthActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            AuthActivityComponent()
        }
    }
}

@Composable
fun AuthActivityComponent() {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    var loading by remember { mutableStateOf(false) }

    fun handleSuccessAuth(resp: AuthResponse) {
        val prefs = context.getSharedPreferences("apz", Context.MODE_PRIVATE)
        prefs.edit { putString("authToken", resp.token).putLong("expiresAt", resp.expiresAt) }
        context.startActivity(Intent(context, MainActivity::class.java))
        context.getActivity()!!.finish()
    }

    fun handleError(text: String) {
        Toast.makeText(context, text, Toast.LENGTH_SHORT).show()
        loading = false
    }

    fun login(email: String, password: String) {
        loading = true

        coroutineScope.launch {
            handleResponse(
                successResponse = ::handleSuccessAuth,
                errorResponse = { handleError(it.errors[0]) },
                onHttpError = { handleError("Unknown error!") },
                onNetworkError = { handleError("Network error!\nCheck your connection!") },
            ) {
                authApi.login(LoginRequest(email = email, password = password))
            }
        }
    }

    fun register(email: String, password: String, firstName: String, lastName: String) {
        loading = true

        coroutineScope.launch {
            handleResponse(
                successResponse = ::handleSuccessAuth,
                errorResponse = { handleError(it.errors[0]) },
                onHttpError = { handleError("Unknown error!") },
                onNetworkError = { handleError("Network error!\nCheck your connection!") },
            ) {
                authApi.register(
                    RegisterRequest(
                        email = email,
                        password = password,
                        firstName = firstName,
                        lastName = lastName,
                    )
                )
            }
        }
    }

    ApzTheme {
        Scaffold(
            modifier = Modifier.fillMaxSize(),
        ) { innerPadding ->
            AuthPanel(
                modifier = Modifier.padding(innerPadding),
                disabled = loading,
                onLogin = ::login,
                onRegister = ::register,
            )
        }
    }
}
