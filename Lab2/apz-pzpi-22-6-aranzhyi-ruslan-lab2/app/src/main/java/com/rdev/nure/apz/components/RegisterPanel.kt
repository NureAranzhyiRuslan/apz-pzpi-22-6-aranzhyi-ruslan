package com.rdev.nure.apz.components

import android.widget.Toast
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.rdev.nure.apz.ui.theme.ApzTheme

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
