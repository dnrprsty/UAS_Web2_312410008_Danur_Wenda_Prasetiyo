# CodeIgniter 4 API on PHP 8.3 + Apache, ready for Render (or any Docker host).
FROM php:8.3-apache

# --- System libs + PHP extensions CodeIgniter 4 needs ---
RUN apt-get update && apt-get install -y --no-install-recommends \
        libicu-dev libonig-dev unzip git \
    && docker-php-ext-install mysqli intl mbstring \
    && a2enmod rewrite headers \
    && rm -rf /var/lib/apt/lists/*

# --- Composer ---
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy source then install PHP dependencies (vendor/ is not in git).
COPY . .
RUN composer install --no-dev --optimize-autoloader --no-interaction \
    && chown -R www-data:www-data writable

# --- Apache: serve CodeIgniter's public/ folder, honour its .htaccess, and
#     listen on the $PORT that the host injects (Render uses 10000 by default). ---
RUN sed -ri 's!DocumentRoot /var/www/html!DocumentRoot /var/www/html/public!' /etc/apache2/sites-available/000-default.conf \
 && printf '<Directory /var/www/html/public/>\n    AllowOverride All\n    Require all granted\n</Directory>\n' > /etc/apache2/conf-available/ci4.conf \
 && a2enconf ci4 \
 && sed -ri 's!Listen 80!Listen ${PORT}!' /etc/apache2/ports.conf \
 && sed -ri 's!:80>!:${PORT}>!' /etc/apache2/sites-available/000-default.conf

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 10000
ENTRYPOINT ["docker-entrypoint.sh"]
