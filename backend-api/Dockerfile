FROM php:8.2-apache

# Install intl extension
RUN apt-get update && apt-get install -y \
    libicu-dev \
    && docker-php-ext-install intl

# 1. Hapus SEMUA symlink mpm dari folder mods-enabled
RUN rm -f /etc/apache2/mods-enabled/mpm_*.load /etc/apache2/mods-enabled/mpm_*.conf

# 2. Paksa aktifkan mpm_prefork saja
RUN a2enmod mpm_prefork

# 3. Sesuaikan DocumentRoot ke folder public (CI4 standard)
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# 4. Pastikan mod_rewrite aktif (biar URL CI4/routing jalan)
RUN a2enmod rewrite

# 5. Salin kode aplikasi
COPY . /var/www/html/