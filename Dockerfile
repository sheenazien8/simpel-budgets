FROM php:8.1-fpm

WORKDIR /var/www/html
COPY . /var/www/html/

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo pdo_mysql zip

COPY --from=composer /usr/bin/composer /usr/bin/composer

EXPOSE 8000
CMD php artisan serve --host=0.0.0.0 --port=8000
