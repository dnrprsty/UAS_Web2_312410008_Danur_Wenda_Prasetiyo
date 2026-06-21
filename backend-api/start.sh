#!/bin/bash
# Railway start script
cd backend-api
php spark serve --host=0.0.0.0 --port=${PORT:-8080}