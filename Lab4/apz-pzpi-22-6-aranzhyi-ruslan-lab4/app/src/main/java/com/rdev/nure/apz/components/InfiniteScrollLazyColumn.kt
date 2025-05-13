package com.rdev.nure.apz.components

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.rdev.nure.apz.api.entities.Sensor
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.filter

@Composable
fun <T> InfiniteScrollLazyColumn(
    items: List<T>,
    loadMoreItems: () -> Unit,
    listState: LazyListState,
    modifier: Modifier = Modifier,
    buffer: Int = 2,
    isLoading: Boolean,
) {
    val shouldLoadMore = remember {
        derivedStateOf {
            val totalItemsCount = listState.layoutInfo.totalItemsCount
            val lastVisibleItemIndex = listState.layoutInfo.visibleItemsInfo.lastOrNull()?.index ?: 0
            lastVisibleItemIndex >= (totalItemsCount - buffer) && !isLoading
        }
    }

    LaunchedEffect(items) {
        snapshotFlow { shouldLoadMore.value }
            .distinctUntilChanged()
            .filter { it }
            .collect {
                loadMoreItems()
            }
    }
    LazyColumn(
        modifier = modifier.fillMaxSize(),
        state = listState
    ) {
        itemsIndexed(
            items,
            contentType = { _, obj ->
                when (obj) {
                    is Sensor -> Sensor::class.java
                    else -> Unit::class.java
                }
            },
            key = { _, obj -> obj.hashCode() },
        ) { _, obj ->
            when (obj) {
                is Sensor -> SensorItem(sensor = (obj as Sensor))
                else -> null
            }

            HorizontalDivider(modifier = Modifier.padding(8.dp))
        }

        if (isLoading) {
            item {
                Box(
                    modifier = Modifier.fillMaxWidth(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }
        }
    }
}