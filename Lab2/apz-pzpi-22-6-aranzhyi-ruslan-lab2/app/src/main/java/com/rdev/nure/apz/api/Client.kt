package com.rdev.nure.apz.api

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import com.fasterxml.jackson.module.kotlin.readValue
import com.rdev.nure.apz.api.responses.ErrorResponse
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.jackson.JacksonConverterFactory

private var client: Retrofit? = null
private val mapper = ObjectMapper().registerModules(KotlinModule.Builder().build())

fun getApiClient(): Retrofit {
    if (client == null)
        client = Retrofit.Builder()
            .baseUrl("http://192.168.0.111:3000")
            .addConverterFactory(JacksonConverterFactory.create())
            .build()

    return client!!
}

fun <T> Response<T>.getErrorResponse(): ErrorResponse? {
    if (isSuccessful)
        return null

    errorBody()?.string()?.let {
        return mapper.readValue<ErrorResponse>(it)
    } ?: run {
        return ErrorResponse(listOf("Unknown error"))
    }
}
