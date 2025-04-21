package com.rdev.nure.apz.components

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.window.PopupProperties
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun <T> AutoCompleteField(
    modifier: Modifier = Modifier,
    fieldLabel: String,
    defaultSuggestion: T? = null,
    getSuggestionString: (T) -> String,
    onSearch: suspend (String) -> List<T>,
    onSuggestionSelected: (T) -> Unit,
) {
    var text by remember {
        mutableStateOf(
            if (defaultSuggestion == null) ""
            else getSuggestionString(defaultSuggestion)
        )
    }
    var suggestions by remember { mutableStateOf(emptyList<T>()) }
    var isDropdownExpanded by remember { mutableStateOf(false) }
    var suggestionsJob by remember { mutableStateOf<Job?>(null) }

    LaunchedEffect(text) {
        suggestionsJob?.cancel()
        suggestionsJob = launch {
            suggestions = onSearch(text)
        }
    }

    ExposedDropdownMenuBox(
        modifier = modifier,
        expanded = isDropdownExpanded,
        onExpandedChange = { expanded ->
            isDropdownExpanded = expanded
        }
    ) {
        TextField(
            label = { Text(fieldLabel) },
            maxLines = 1,
            modifier = Modifier
                .fillMaxWidth()
                .onFocusChanged {
                    if (!it.isFocused) {
                        isDropdownExpanded = false
                    }
                }
                .menuAnchor(),
            onValueChange = {
                text = it
                isDropdownExpanded = it.isNotEmpty()
            },
            readOnly = false,
            value = text
        )

        if (suggestions.isNotEmpty()) {
            DropdownMenu(
                modifier = Modifier.exposedDropdownSize(),
                expanded = isDropdownExpanded,
                onDismissRequest = {
                    isDropdownExpanded = false
                },
                properties = PopupProperties(focusable = false)
            ) {
                suggestions.forEach { suggestion ->
                    val suggestionText = getSuggestionString(suggestion)

                    DropdownMenuItem(
                        text = {
                            Text(text = suggestionText)
                        },
                        onClick = {
                            onSuggestionSelected(suggestion)
                            text = suggestionText
                            isDropdownExpanded = false
                        },
                        contentPadding = ExposedDropdownMenuDefaults.ItemContentPadding
                    )
                }
            }
        }
    }
}