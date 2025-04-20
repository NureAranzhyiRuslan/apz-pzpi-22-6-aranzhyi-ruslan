package com.rdev.nure.apz

import android.content.Context
import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.ui.Modifier
import androidx.core.content.edit
import com.rdev.nure.apz.ui.theme.ApzTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val prefs = getSharedPreferences("apz", Context.MODE_PRIVATE)
        val token = prefs.getString("authToken", null)
        val expiresAt = prefs.getLong("expiresAt", 0)

        if(token == null || expiresAt < System.currentTimeMillis() / 1000) {
            prefs.edit { remove("authToken").remove("expiresAt") }
            startActivity(Intent(this, AuthActivity::class.java))
            finish()
        }

        setContent {
            ApzTheme {
                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                ) { innerPadding ->
                    Column(
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        Text(
                            text = "Token: $token"
                        )
                        Text(
                            text = "Expires at: $expiresAt"
                        )
                    }
                }
            }
        }
    }
}
