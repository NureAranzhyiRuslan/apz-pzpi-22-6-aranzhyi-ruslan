package com.rdev.nure.apz.api

import android.util.Log
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.rdev.nure.apz.api.responses.ErrorResponse
import retrofit2.HttpException
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.jackson.JacksonConverterFactory
import java.io.IOException

private var client: Retrofit? = null
private val mapper = ObjectMapper().registerKotlinModule()

fun getApiClient(): Retrofit {
    if (client == null)
        client = Retrofit.Builder()
            .baseUrl("http://192.168.0.111:8000")
            .addConverterFactory(JacksonConverterFactory.create(mapper))
            .build()

    return client!!
}

fun <T> Response<T>.getErrorResponse(): ErrorResponse? {
    if (isSuccessful)
        return null

    val errorStr = errorBody()?.string()

    Log.e("ApiClient", "Error: "+errorStr.orEmpty())

    errorStr?.let {
        return mapper.readValue<ErrorResponse>(it)
    } ?: run {
        return ErrorResponse(listOf("Unknown error"))
    }
}

suspend fun <T> handleResponse(
    successResponse: (body: T) -> Unit,
    errorResponse: (err: ErrorResponse) -> Unit,
    onHttpError: () -> Unit,
    onNetworkError: () -> Unit,
    body: suspend () -> Response<T>,
): Boolean {
    try {
        val resp = body()
        val respBody = resp.body()
        if(respBody == null) {
            val errResp = resp.getErrorResponse()?.let {
                if(it.errors.isEmpty())
                    ErrorResponse(listOf("Unknown error"))
                else
                    it
            } ?: run {
                ErrorResponse(listOf("Unknown error"))
            }

            errorResponse(errResp)
            return false
        }

        successResponse(respBody)
        return true
    } catch (e: HttpException) {
        Log.e("ApiClient", "Http error", e)
        onHttpError()
    } catch (e: IOException) {
        Log.e("ApiClient", "Network error", e)
        onNetworkError()
    }

    return false
}
