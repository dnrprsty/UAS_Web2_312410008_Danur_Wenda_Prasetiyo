# UBAH DARI 8.1 JADI 8.2
FROM php:8.2-apache

# Install dependencies
RUN apt-get update && apt-get install -y libicu-dev libzip-dev zip unzip \
    && docker-php-ext-install intl pdo pdo_mysql zip

# Aktifkan mod_rewrite
RUN a2enmod rewrite

# COPY source code
COPY . /var/www/html/

# SET PERMISSION
RUN chown -R www-data:www-data /var/www/html/writable

# Setting biar Apache ngarah ke folder public
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Pindah port ke 8080 (Render wajib ini)
RUN sed -i 's/80/8080/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

EXPOSE 8080