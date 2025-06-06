package com.rdev.nure.apz.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.rdev.nure.apz.ui.theme.ApzTheme

@Composable
fun LoginPanel(
    email: String? = null,
    onLogin: (String, String) -> Unit,
    disabled: Boolean = false,
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
            disabled = disabled,
        )
        CustomPasswordField(
            value = passwordText,
            onValueChange = { passwordText = it },
            disabled = disabled,
        )

        Button(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(25),
            enabled = !disabled,
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
