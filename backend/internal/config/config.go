package config

import (
	"errors"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerPort        string
	OpenWeatherAPIKey string
}


func Load() (*Config, error) {
	_ = godotenv.Load()

	serverPort := os.Getenv("SERVER_PORT")
	if serverPort == "" {
		serverPort = "8080"
	}

	apiKey := os.Getenv("OPENWEATHER_API_KEY")
	if apiKey == "" {
		return nil, errors.New("OPENWEATHER_API_KEY environment variable is required")
	}

	return &Config{
		ServerPort:        serverPort,
		OpenWeatherAPIKey: apiKey,
	}, nil
}