<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');

$routes->group('api', function($routes) {
    // 1. Auth Endpoint
    $routes->post('auth/login', 'Auth::login');

    // 2. RESTful Resource Endpoints
    $routes->resource('books', ['controller' => 'Books']);
    $routes->resource('categories', ['controller' => 'Categories']);
    $routes->resource('authors', ['controller' => 'Authors']);
    $routes->resource('members', ['controller' => 'Members']);

    // 3. Loans sirkulasi endpoints
    $routes->get('loans', 'Loans::index');
    $routes->post('loans', 'Loans::create');
    $routes->post('loans/(:segment)/return', 'Loans::returnBook/$1');
    $routes->delete('loans/(:segment)', 'Loans::delete/$1');

    // 4. Auxiliary admin endpoints
    $routes->get('dashboard/stats', 'Dashboard::stats');
    $routes->post('admin/reset-db', 'Admin::resetDb');
});
