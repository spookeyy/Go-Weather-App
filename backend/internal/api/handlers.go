package api

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"

	"weather-app/internal/models"
	"weather-app/pkg/openweather"
)

// handling requests for weather data
func GetWeatherHandler(c *gin.Context) {
	city := c.Query("city")
	if city == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "City parameter is required",
		})
		return
	}

	// get units
	units := c.DefaultQuery("units", "metric")
	if units != "metric" && units != "imperial" {
		units = "metric" // default to metric if invalid
	}

	// creating openweather client
	apiKey := os.Getenv("OPENWEATHER_API_KEY")
	client := openweather.NewClient(apiKey)
	if client == nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error: "Failed to create OpenWeather client",
		})
		return
	}
	
	// get weather data
	weatherResponse, err := client.GetWeatherByCity(city, units)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error: "Failed to get weather data: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, weatherResponse)

}

// handling requests for geocoding city names
func GeocodeCityHandler(c *gin.Context) {
	city := c.Query("city")

	if city == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "City parameter is required",
		})
		return
	}

	// creating openweathermap client
	apiKey := os.Getenv("OPENWEATHER_API_KEY")
	client := openweather.NewClient(apiKey)
	if client == nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error: "Failed to create OpenWeather client",
		})
		return
	}

	locations, err := client.GeocodeCityName(city)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error: "Failed to get geocode data: " + err.Error(),
		})
		return
	}

	if len(locations) == 0 {
		c.JSON(http.StatusNotFound, models.ErrorResponse{
			Error: "No locations found",
		})
		return
	}

	// return the first location
	c.JSON(http.StatusOK, gin.H{
		"results": locations,
	})
}