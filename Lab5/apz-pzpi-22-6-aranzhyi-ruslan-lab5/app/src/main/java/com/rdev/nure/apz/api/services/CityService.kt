package com.rdev.nure.apz.api.services

import com.rdev.nure.apz.api.entities.City
import com.rdev.nure.apz.api.requests.CitySearchRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface CityService {
    @POST("/cities/search")
    suspend fun searchCity(
        @Body body: CitySearchRequest,
    ): Response<List<City>>
}