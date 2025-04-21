package com.rdev.nure.apz.util

import android.content.Context
import android.widget.Toast
import com.rdev.nure.apz.api.entities.City
import com.rdev.nure.apz.api.getApiClient
import com.rdev.nure.apz.api.handleResponse
import com.rdev.nure.apz.api.requests.CitySearchRequest
import com.rdev.nure.apz.api.services.CityService

private val citiesApi: CityService = getApiClient().create(CityService::class.java)

suspend fun searchCity(name: String, context: Context): List<City> {
    return handleResponse(
        successResponse = {
            return@handleResponse it
        },
        errorResponse = {
            Toast.makeText(context, it.errors[0], Toast.LENGTH_SHORT).show()
        },
        onHttpError = {
            Toast.makeText(context, "Failed to search for a city!", Toast.LENGTH_SHORT).show()
        },
        onNetworkError = {
            Toast.makeText(context, "No internet connection!", Toast.LENGTH_SHORT).show()
        },
        errorRet = { emptyList() },
    ) {
        citiesApi.searchCity(CitySearchRequest(name = name))
    }
}