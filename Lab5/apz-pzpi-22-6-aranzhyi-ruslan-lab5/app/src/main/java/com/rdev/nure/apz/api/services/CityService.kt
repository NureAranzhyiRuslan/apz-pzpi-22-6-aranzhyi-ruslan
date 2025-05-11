package com.rdev.nure.apz.api.services

import com.rdev.nure.apz.api.entities.City
import com.rdev.nure.apz.api.requests.CitySearchRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.GET
import retrofit2.http.Path

interface CityService {
    @POST("/cities/search")
    suspend fun searchCity(
        @Body body: CitySearchRequest,
    ): Response<List<City>>

    @GET("/cities/{cityId}")
    suspend fun getCity(
        @Path("cityId") cityId: Long,
    ): Response<City>
}