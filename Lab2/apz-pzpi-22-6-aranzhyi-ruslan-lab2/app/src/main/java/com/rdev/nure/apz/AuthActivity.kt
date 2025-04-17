package com.rdev.nure.apz

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.rdev.nure.apz.ui.theme.ApzTheme

class AuthActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            ApzTheme {
                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                ) { innerPadding ->
                    Greeting(
                        name = "Android", modifier = Modifier.padding(innerPadding)
                    )
                }
            }
        }
    }
}

@Composable
fun CustomEmailField(
    value: String,
    onValueChange: (String) -> Unit,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = {
            Text(text = "Email")
        },
        singleLine = true,
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
        modifier = Modifier.fillMaxWidth(),
    )
}

@Composable
fun CustomPasswordField(
    value: String,
    onValueChange: (String) -> Unit,
    labelText: String = "Password",
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = {
            Text(text = labelText)
        },
        singleLine = true,
        visualTransformation = PasswordVisualTransformation(),
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
        modifier = Modifier.fillMaxWidth(),
    )
}

@Composable
fun LoginPanel(
    email: String? = null,
    onLogin: (String, String) -> Unit,
) {
    var emailText by remember { mutableStateOf(email ?: "") }
    var passwordText by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .padding(8.dp)
            .fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        CustomEmailField(
            value = emailText,
            onValueChange = { emailText = it },
        )
        CustomPasswordField(
            value = passwordText,
            onValueChange = { passwordText = it },
        )

        Button(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(25),
            onClick = {
                onLogin(emailText, passwordText)
            },
        ) {
            Text(
                text = "Login",
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun LoginPanelPreview() {
    ApzTheme {
        LoginPanel(onLogin = { _, _ -> run {} })
    }
}

@Composable
fun RegisterPanel(
    onRegister: (String, String) -> Unit,
) {
    val context = LocalContext.current

    var emailText by remember { mutableStateOf("") }
    var passwordText by remember { mutableStateOf("") }
    var passwordRepeatText by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .padding(8.dp)
            .fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        CustomEmailField(
            value = emailText,
            onValueChange = { emailText = it },
        )
        CustomPasswordField(
            value = passwordText,
            onValueChange = { passwordText = it },
        )
        CustomPasswordField(
            value = passwordRepeatText,
            onValueChange = { passwordRepeatText = it },
            labelText = "Repeat password",
        )

        Button(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(25),
            onClick = {
                if(passwordText != passwordRepeatText) {
                    Toast.makeText(context, "Passwords do not match!", Toast.LENGTH_SHORT).show()
                    return@Button
                }
                onRegister(emailText, passwordText)
            },
        ) {
            Text(
                text = "Register",
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun RegisterPanelPreview() {
    ApzTheme {
        RegisterPanel(onRegister = { _, _ -> run {} })
    }
}

enum class AuthPanelState {
    LOGIN,
    REGISTER
}

@Composable
fun AuthPanel(
    onLogin: (String, String) -> Unit,
    onRegister: (String, String) -> Unit,
    initialState: AuthPanelState = AuthPanelState.LOGIN,
) {
    var panel by remember { mutableStateOf(initialState) }

    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        if(panel == AuthPanelState.LOGIN) {
            LoginPanel(
                onLogin = onLogin,
            )
            Text(
                text = "Register instead",
                modifier = Modifier.fillMaxWidth().padding(8.dp, 0.dp).clickable { panel = AuthPanelState.REGISTER },
                textAlign = TextAlign.Left,
            )
        } else {
            RegisterPanel(
                onRegister = onRegister,
            )
            Text(
                text = "Login instead",
                modifier = Modifier.fillMaxWidth().padding(8.dp, 0.dp).clickable { panel = AuthPanelState.LOGIN },
                textAlign = TextAlign.Left,
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun AuthPanelPreview() {
    ApzTheme {
        AuthPanel(
            onLogin = { _, _ -> run {} },
            onRegister = { _, _ -> run {} },
            initialState = AuthPanelState.REGISTER,
        )
    }
}