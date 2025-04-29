package com.rdev.nure.apz.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.rdev.nure.apz.ui.theme.ApzTheme

enum class AuthPanelState {
    LOGIN,
    REGISTER
}

@Composable
fun AuthPanel(
    onLogin: (String, String) -> Unit,
    onRegister: (String, String, String, String) -> Unit,
    modifier: Modifier = Modifier,
    initialState: AuthPanelState = AuthPanelState.LOGIN,
    disabled: Boolean = false,
) {
    var panel by remember { mutableStateOf(initialState) }

    Column(
        modifier = modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        if(panel == AuthPanelState.LOGIN) {
            LoginPanel(
                onLogin = onLogin,
                disabled = disabled,
            )
            Text(
                text = "Register instead",
                modifier = Modifier.fillMaxWidth().padding(8.dp, 0.dp).clickable { panel = AuthPanelState.REGISTER },
                textAlign = TextAlign.Left,
            )
        } else {
            RegisterPanel(
                onRegister = onRegister,
                disabled = disabled,
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
            onRegister = { _, _, _, _ -> run {} },
            initialState = AuthPanelState.REGISTER,
        )
    }
}
