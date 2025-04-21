package openweather

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"

	"weather-app/internal/models"
	// "google.golang.org/protobuf/types/descriptorpb"
)

const (
	baseURL       = "https://api.openweathermap.org"
	currentPath   = "/data/2.5/weather"
	forecastPath  = "/data/2.5/forecast"
	geocodingPath = "/geo/1.0/direct"
	// geocodingLimit = 5
	// geocodingLimitParam = "limit"
)

// This is a Client struct to hold the API key and HTTP client
type Client struct {
	apiKey     string
	httpClient *http.Client
}

func (c *Client) GetForecastByCoordinates(lat float64, lon float64, units string) ([]*models.Forecast, error) {
	panic("unimplemented")
}

func (c *Client) GetWeatherByCoordinates(lat float64, lon float64, units string) (*models.WeatherResponse, error) {
	panic("unimplemented")
}

// NewClient creates a new OpenWeather client with the given API key
func NewClient(apiKey string) *Client {
	return &Client{
		apiKey: apiKey,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

// GetWeatherByCity fetches the current weather and forecast for a given city
func (c *Client) GetWeatherByCity(city string, units string) (*models.WeatherResponse, error) {
	locations, err := c.GeocodeCityName(city) // c is the client
	if err != nil {
		return nil, err
	}
	if len(locations) == 0 {
		return nil, fmt.Errorf("no locations found for city: %s", city)
	}

	location := locations[0]

	current, err := c.getCurrentWeather(location.Lat, location.Lon, units)
	if err != nil {
		return nil, err
	}

	// get forecast data
	forecast, err := c.getForecast(location.Lat, location.Lon, units)
	if err != nil {
		return nil, err
	}

	return &models.WeatherResponse{
		Current:  *current,
		Forecast: forecast,
		Location: *location,
	}, nil

}

func (c *Client) GeocodeCityName(cityName string) ([]*models.Location, error) {
	params := url.Values{}
	params.Add("q", cityName)
	params.Add("limit", "5")
	params.Add("appid", c.apiKey)

	requestURL := fmt.Sprintf("%s%s?%s", baseURL, geocodingPath, params.Encode())

	resp, err := c.httpClient.Get(requestURL)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch geocode data: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("geocoding API error (status %d): %s", resp.StatusCode, string(body))
	}

	var geoResults []struct {
		Name       string            `json:"name"`
		Lat        float64           `json:"lat"`
		Lon        float64           `json:"lon"`
		Country    string            `json:"country"`
		State      string            `json:"state,omitempty"`
		LocalNames map[string]string `json:"local_names,omitempty"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&geoResults); err != nil {
		return nil, fmt.Errorf("failed to decode geocode response: %w", err)
	}

	var locations []*models.Location
	for _, result := range geoResults {
		locations = append(locations, &models.Location{
			City:    result.Name,
			Country: result.Country,
			Lat:     result.Lat,
			Lon:     result.Lon,
		})
	}

	return locations, nil
}

func (c *Client) getCurrentWeather(lat, lon float64, units string) (*models.CurrentWeather, error) {
	params := url.Values{}
	params.Add("lat", fmt.Sprintf("%f", lat))
	params.Add("lon", fmt.Sprintf("%f", lon))
	params.Add("units", units)
	params.Add("appid", c.apiKey)

	requestURL := fmt.Sprintf("%s%s?%s", baseURL, currentPath, params.Encode())

	resp, err := c.httpClient.Get(requestURL)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch current weather data: %w", err)
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("current weather API error (status %d): %s", resp.StatusCode, string(body))
	}

	var result struct {
		Weather []struct {
			Description string `json:"description"`
			Icon        string `json:"icon"`
		} `json:"weather"`
		Main struct {
			Temp      float64 `json:"temp"`
			FeelsLike float64 `json:"feels_like"`
			TempMin   float64 `json:"temp_min"`
			TempMax   float64 `json:"temp_max"`
			Pressure  int     `json:"pressure"`
			Humidity  int     `json:"humidity"`
		} `json:"main"`
		Wind struct {
			Speed float64 `json:"speed"`
			Deg   int     `json:"deg"`
		} `json:"wind"`

		Visibility int   `json:"visibility"`
		Dt         int64 `json:"dt"`
		Sys        struct {
			Sunrise int64 `json:"sunrise"`
			Sunset  int64 `json:"sunset"`
		} `json:"sys"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("failed to decode current weather response: %w", err)
	}

	description := ""
	icon := ""
	if len(result.Weather) > 0 {
		description = result.Weather[0].Description
		icon = result.Weather[0].Icon
	}

	//dates
	date := time.Unix(result.Dt, 0)
	sunrise := time.Unix(result.Sys.Sunrise, 0)
	sunset := time.Unix(result.Sys.Sunset, 0)

	return &models.CurrentWeather{
		Temperature:      result.Main.Temp,
		FeelsLike:        result.Main.FeelsLike,
		TempMin:          result.Main.TempMin,
		TempMax:          result.Main.TempMax,
		Humidity:         result.Main.Humidity,
		WindSpeed:        result.Wind.Speed,
		WindDeg:          result.Wind.Deg,
		Description:      description,
		Icon:             icon,
		Pressure:         result.Main.Pressure,
		Visibility:       result.Visibility,
		Sunrise:          result.Sys.Sunrise,
		Sunset:           result.Sys.Sunset,
		TimestampUTC:     result.Dt,
		FormattedDate:    date.Format("Mon, 02 Jan 2025"),
		FormattedSunrise: sunrise.Format("15:04"),
		FormattedSunset:  sunset.Format("15:04"),
	}, nil

}

// getting forecast for coordinates
func (c *Client) getForecast(lat, lon float64, units string) ([]models.Forecast, error) {
	params := url.Values{}
	params.Add("lat", fmt.Sprintf("%f", lat))
	params.Add("lon", fmt.Sprintf("%f", lon))
	params.Add("units", units)
	params.Add("appid", c.apiKey)

	requestURL := fmt.Sprintf("%s%s?%s", baseURL, forecastPath, params.Encode())

	resp, err := c.httpClient.Get(requestURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("forecast API error (status %d): %s", resp.StatusCode, body)
	}

	var result struct {
		List []struct {
			Dt   int64 `json:"dt"`
			Main struct {
				Temp      float64 `json:"temp"`
				FeelsLike float64 `json:"feels_like"`
				TempMin   float64 `json:"temp_min"`
				TempMax   float64 `json:"temp_max"`
				Pressure  int     `json:"pressure"`
				Humidity  int     `json:"humidity"`
			} `json:"main"`
			Weather []struct {
				Description string `json:"description"`
				Icon        string `json:"icon"`
			} `json:"weather"`
			Clouds struct {
				All int `json:"all"`
			} `json:"clouds"`
			Wind struct {
				Speed float64 `json:"speed"`
				Deg   int     `json:"deg"`
			} `json:"wind"`
			Pop float64 `json:"pop"` // Probability of precipitation
		} `json:"list"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	// Process forecast
	forecastMap := make(map[string]models.Forecast)

	// Get current date at midnight
	now := time.Now()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)

	// Process next 3 days (excluding today)
	for i := 1; i <= 3; i++ {
		dayDate := today.AddDate(0, 0, i)
		dayKey := dayDate.Format("2006-01-02")

		// Initialize using empty forecast
		forecastMap[dayKey] = models.Forecast{
			Date:          dayDate,
			FormattedDate: dayDate.Format("Mon, 02 Jan"),
			DayOfWeek:     dayDate.Format("Mon"),
		}
	}

	for _, item := range result.List {
		forecastTime := time.Unix(item.Dt, 0)
		dayKey := forecastTime.Format("2006-01-02")

		if forecast, exists := forecastMap[dayKey]; exists {
			if forecastTime.Hour() == 12 ||
				(forecast.Description == "" && forecastTime.Hour() >= 9) {

				description := ""
				icon := ""
				if len(item.Weather) > 0 {
					description = item.Weather[0].Description
					icon = item.Weather[0].Icon
				}

				forecast.Temperature = item.Main.Temp
				forecast.TempMin = item.Main.TempMin
				forecast.TempMax = item.Main.TempMax
				forecast.Humidity = item.Main.Humidity
				forecast.WindSpeed = item.Wind.Speed
				forecast.Description = description
				forecast.Icon = icon
				forecast.PrecipProbability = item.Pop

				// Update the map
				forecastMap[dayKey] = forecast
			}
		}
	}

	// Convert map to sorted slice
	var forecasts []models.Forecast
	for i := 1; i <= 3; i++ {
		dayDate := today.AddDate(0, 0, i)
		dayKey := dayDate.Format("2006-01-02")

		if forecast, exists := forecastMap[dayKey]; exists {
			forecasts = append(forecasts, forecast)
		}
	}

	return forecasts, nil
}
