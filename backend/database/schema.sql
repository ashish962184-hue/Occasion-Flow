CREATE DATABASE IF NOT EXISTS giftingcrm;
USE giftingcrm;

-- Migration Tracking Table
CREATE TABLE IF NOT EXISTS migration_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    migration_name VARCHAR(255) NOT NULL,
    schema_version VARCHAR(50) NOT NULL,
    checksum VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Core Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_external_id VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NULL,
    phone VARCHAR(50),
    customerType VARCHAR(50) DEFAULT 'Standard',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    UNIQUE KEY idx_unique_name_phone (name, phone)
);

-- Occasions Table
CREATE TABLE IF NOT EXISTS occasions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NULL,
    occasion_name VARCHAR(255) NOT NULL,
    occasion_date DATE NOT NULL,
    reminder_days_before INT DEFAULT 7,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- Orders (Purchase History) Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NULL,
    gift_name VARCHAR(255),
    amount DECIMAL(10, 2),
    order_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- Reminders Table
CREATE TABLE IF NOT EXISTS reminders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NULL,
    occasion_id INT NULL,
    scheduled_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (occasion_id) REFERENCES occasions(id) ON DELETE SET NULL
);

-- Workflow History Table
CREATE TABLE IF NOT EXISTS workflow_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- Performance Indexes
CREATE INDEX idx_customer_id_occasions ON occasions(customer_id);
CREATE INDEX idx_customer_id_orders ON orders(customer_id);
CREATE INDEX idx_customer_id_reminders ON reminders(customer_id);
CREATE INDEX idx_customer_id_workflow ON workflow_history(customer_id);

CREATE INDEX idx_occasion_date ON occasions(occasion_date);
CREATE INDEX idx_order_date ON orders(order_date);
CREATE INDEX idx_reminder_status ON reminders(status);
CREATE INDEX idx_workflow_created_at ON workflow_history(created_at);
