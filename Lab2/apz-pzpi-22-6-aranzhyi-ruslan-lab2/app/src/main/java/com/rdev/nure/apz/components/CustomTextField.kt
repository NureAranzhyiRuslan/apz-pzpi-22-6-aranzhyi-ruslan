package com.rdev.nure.apz.components

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

@Composable
fun CustomTextField(
    value: String,
    onValueChange: (String) -> Unit,
    labelText: String,
    disabled: Boolean = false,
    outlined: Boolean = false,
) {
    if (outlined)
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            label = {
                Text(text = labelText)
            },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
            enabled = !disabled,
        )
    else
        TextField(
            value = value,
            onValueChange = onValueChange,
            label = {
                Text(text = labelText)
            },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
            enabled = !disabled,
        )
}