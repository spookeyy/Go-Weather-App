package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"weather-app/internal/api"
	"weather-app/internal/config"
	"weather-app/internal/middleware"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}
	// DEBUG: Print config values
	// log.Printf("Loaded config - PORT: %s, API_KEY: %s", cfg.ServerPort, cfg.OpenWeatherAPIKey)

	router := gin.Default()

	// CORS config
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "https://pawa-weather-app.netlify.app"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	}))

	router.Use(middleware.RequestLogger())

	apiRoutes := router.Group("/api")
	{
		apiRoutes.GET("/weather", api.GetWeatherHandler)
		apiRoutes.GET("/geocode", api.GeocodeCityHandler)
	}
	 
	log.Printf("Starting server on port %s...", cfg.ServerPort)
	if err := router.Run(":" + cfg.ServerPort); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}