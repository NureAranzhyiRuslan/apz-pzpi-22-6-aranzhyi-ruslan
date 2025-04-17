package com.rdev.nure.apz.api.responses

data class PaginatedResponse<T>(
    val count: Long,
    val result: List<T>,
)