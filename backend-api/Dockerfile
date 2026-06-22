FROM php:8.2-apache

RUN apt-get update && apt-get install -y libicu-dev libzip-dev zip unzip \
    && docker-php-ext-install intl pdo pdo_mysql zip

RUN a2enmod rewrite

COPY . /var/www/html/

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

RUN chown -R www-data:www-data /var/www/html/writable

RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf
RUN sed -i 's/80/8080/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

EXPOSE 8080

# Jalankan entrypoint saat container mulai
CMD ["/entrypoint.sh"]