package com.rdev.nure.apz.api.entities

import com.fasterxml.jackson.annotation.JsonProperty

enum class UserLocale {
    EN,
    UA,
}

enum class UserTemperatureUnits {
    CELSIUS,
    FAHRENHEIT,
}

data class User(
    val id: Long,
    val email: String,
    @JsonProperty("first_name")
    val firstName: String,
    @JsonProperty("last_name")
    val lastName: String,
    val role: Int, // TODO: enum
    val locale: UserLocale,
    @JsonProperty("temperature_units")
    val temperatureUnits: UserTemperatureUnits,
)