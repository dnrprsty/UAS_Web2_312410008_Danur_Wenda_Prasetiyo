FROM php:8.1-apache

# Install ekstensi yang dibutuhin CI4
RUN apt-get update && apt-get install -y libicu-dev libzip-dev zip unzip \
    && docker-php-ext-install intl pdo pdo_mysql zip

# Aktifkan mod_rewrite (PENTING buat routing CI4)
RUN a2enmod rewrite

# Copy kode lu ke container
COPY . /var/www/html/

# Set permission biar CI4 bisa nulis log
RUN chown -R www-data:www-data /var/www/html/writable

# Setting biar Apache ngarah ke folder public
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Pindah port ke 8080 (Render wajib ini)
RUN sed -i 's/80/8080/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

EXPOSE 8080