package com.rdev.nure.apz.api.requests

import com.fasterxml.jackson.annotation.JsonProperty

data class RegisterRequest(
    val email: String,
    val password: String,
    @JsonProperty("first_name")
    val firstName: Long,
    @JsonProperty("last_name")
    val lastName: Long,
)