package com.rdev.nure.apz.api.requests

import com.fasterxml.jackson.annotation.JsonProperty

data class RegisterRequest(
    val email: String,
    val password: String,
    @JsonProperty("first_name")
    val firstName: String,
    @JsonProperty("last_name")
    val lastName: String,
)