package services

import (
	"os"
	"weather-app/internal/models"
	"weather-app/pkg/openweather"
)

type WeatherService struct {
	client *openweather.Client
}

func NewWeatherService(apiKey string) *WeatherService {
	client := openweather.NewClient(apiKey)
	return &WeatherService{client: client}
}

func (s *WeatherService) GetWeatherByCity(city string, units string) (*models.WeatherResponse, error) {
	return s.client.GetWeatherByCity(city, units)
}

func (s *WeatherService) GeocodeCityName(cityName string) ([]*models.Location, error) {
	return s.client.GeocodeCityName(cityName)
}

func GetWeatherData(city string, units string) (*models.WeatherResponse, error) {
	apiKey := os.Getenv("OPENWEATHER_API_KEY")
	service := NewWeatherService(apiKey)
	return service.GetWeatherByCity(city, units)
}

func GetGeocodeData(cityName string) ([]*models.Location, error) {
	apiKey := os.Getenv("OPENWEATHER_API_KEY")
	service := NewWeatherService(apiKey)
	return service.GeocodeCityName(cityName)
}

func GetWeatherDataByCoordinates(lat, lon float64, units string) (*models.WeatherResponse, error) {
	apiKey := os.Getenv("OPENWEATHER_API_KEY")
	service := NewWeatherService(apiKey)
	return service.client.GetWeatherByCoordinates(lat, lon, units)
}

func GetForecastDataByCoordinates(lat, lon float64, units string) ([]*models.Forecast, error) {
	apiKey := os.Getenv("OPENWEATHER_API_KEY")
	service := NewWeatherService(apiKey)
	return service.client.GetForecastByCoordinates(lat, lon, units)
}

func GetWeatherDataByCityName(cityName string, units string) (*models.WeatherResponse, error) {
	apiKey := os.Getenv("OPENWEATHER_API_KEY")
	service := NewWeatherService(apiKey)
	return service.GetWeatherByCity(cityName, units)
}

func GetGeocodeDataByCityName(cityName string) ([]*models.Location, error) {
	apiKey := os.Getenv("OPENWEATHER_API_KEY")
	service := NewWeatherService(apiKey)
	return service.GeocodeCityName(cityName)
}

func GetWeatherDataByCityNameAndUnits(cityName string, units string) (*models.WeatherResponse, error) {
	apiKey := os.Getenv("OPENWEATHER_API_KEY")
	service := NewWeatherService(apiKey)
	return service.GetWeatherByCity(cityName, units)
}
