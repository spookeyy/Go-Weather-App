package models

import (
	"time"
)

// final response sent to frontend
type WeatherResponse struct {
	Current CurrentWeather `json:"current"`
	Forecast []Forecast    `json:"forecast"`
	Location Location      `json:"location"`
}

// current weather data
type CurrentWeather struct {
	Temperature       float64 `json:"temperature"`
	FeelsLike         float64 `json:"feelsLike"`
	TempMin           float64 `json:"tempMin"`
	TempMax           float64 `json:"tempMax"`
	Humidity          int     `json:"humidity"`
	WindSpeed         float64 `json:"windSpeed"`
	WindDeg            int	 `json:"windDeg"` // wind degree
	Description       string `json:"description"`
	Icon              string `json:"icon"`
	Pressure          int `json:"pressure"`
	Visibility        int `json:"visibility"`
	Sunrise           int64 `json:"sunrise"`
	Sunset            int64 `json:"sunset"`
	TimestampUTC      int64 `json:"timestampUTC"`
	FormattedDate     string `json:"formattedDate"`
	FormattedSunrise  string `json:"formattedSunrise"`
	FormattedSunset   string `json:"formattedSunset"`
}

// forecast weather data
type Forecast struct {
	Date              time.Time `json:"date"`
	FormattedDate 	  string  `json:"formattedDate"`
	DayOfWeek		  string  `json:"dayOfWeek"`
	Temperature 	  float64 `json:"temperature"`
	TempMin           float64 `json:"tempMin"`
	TempMax           float64 `json:"tempMax"`
	Humidity          int     `json:"humidity"`
	WindSpeed         float64 `json:"windSpeed"`
	Description       string  `json:"description"`
	Icon              string  `json:"icon"`
	PrecipProbability float64 `json:"precipProbability,omitempty"`
}

// location data
type Location struct {
	City string `json:"city"`
	Country string `json:"country"`
	Lat float64 `json:"lat"` // latitude
	Lon float64 `json:"lon"` // longitude
}

type GeocodingResponse struct {
	Results []Location `json:"results"`
}

//Errorresponse
type ErrorResponse struct {
	Error string `json:"error"`
}