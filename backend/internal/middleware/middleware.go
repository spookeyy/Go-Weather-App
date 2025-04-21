package middleware

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

func RequestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		startTime := time.Now()

		// Process request
		c.Next()
		endTime := time.Now()
		latency := endTime.Sub(startTime)

		c.Writer.Header().Set("X-Response-Time", latency.String())
		// gin.Default().Logger().Info("Request processed",
		log.Printf("Request processed: method=%s, path=%s, status=%d, latency=%s",
			c.Request.Method,
			c.Request.URL.Path,
			c.Writer.Status(),
			latency,
		)
	}
}