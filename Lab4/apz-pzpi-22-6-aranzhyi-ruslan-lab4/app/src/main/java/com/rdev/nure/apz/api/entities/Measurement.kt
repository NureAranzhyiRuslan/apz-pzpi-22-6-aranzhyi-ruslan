package com.rdev.nure.apz.api.entities

data class Measurement(
    val timestamp: Long,
    val temperature: Double,
    val pressure: Double,
)