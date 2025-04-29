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
private const val TAG = "ApiClient"
private val voidInstance = Void::class.java.getDeclaredConstructor().apply { isAccessible = true }.newInstance()

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

    Log.e(TAG, "Error: "+errorStr.orEmpty())

    errorStr?.let {
        return mapper.readValue<ErrorResponse>(it)
    } ?: run {
        return ErrorResponse(listOf("Unknown error"))
    }
}

suspend fun <T, R> handleResponse(
    successResponse: (body: T) -> R,
    errorResponse: (err: ErrorResponse) -> Unit,
    errorRet: () -> R,
    onHttpError: () -> Unit,
    onNetworkError: () -> Unit,
    on401Error: (() -> Unit)? = null,
    body: suspend () -> Response<T>,
): R {
    try {
        val resp = body()
        val respBody = resp.body()

        if(respBody == null && resp.code() == 204)
            return successResponse(voidInstance as T)

        if(respBody == null) {
            Log.e(TAG, "Error: code is ${resp.code()}")

            if(resp.code() == 401 && on401Error != null) {
                on401Error()
                return errorRet()
            }

            val errResp = resp.getErrorResponse()?.let {
                if(it.errors.isEmpty())
                    ErrorResponse(listOf("Unknown error"))
                else
                    it
            } ?: run {
                ErrorResponse(listOf("Unknown error"))
            }

            errorResponse(errResp)
            return errorRet()
        }

        Log.d(TAG, "Response: $respBody")

        return successResponse(respBody)
    } catch (e: HttpException) {
        Log.e(TAG, "Http error", e)
        onHttpError()
    } catch (e: IOException) {
        Log.e("ApiClient", "Network error", e)
        onNetworkError()
    }

    return errorRet()
}
