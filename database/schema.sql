CREATE DATABASE IF NOT EXISTS shopspher;

USE shopspher;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    collection VARCHAR(100),
    badge VARCHAR(100),

    price DECIMAL(10,2) NOT NULL,
    old_price DECIMAL(10,2),

    rating DECIMAL(2,1),
    reviews INT DEFAULT 0,

    stock INT DEFAULT 0,
    in_stock BOOLEAN DEFAULT TRUE,

    description TEXT,

    image TEXT,
    images JSON,

    colors JSON,
    sizes JSON,
    features JSON,
    specifications JSON,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);