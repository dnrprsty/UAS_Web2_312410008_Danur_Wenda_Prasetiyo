#!/bin/bash
# Jalankan migrasi
php /var/www/html/spark migrate --force

# Jalankan Apache
apache2-foreground