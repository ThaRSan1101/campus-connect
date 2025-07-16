-- Create the database
CREATE DATABASE IF NOT EXISTS campus_connect;
USE campus_connect;

-- USERS TABLE
CREATE TABLE users (
    User_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    role ENUM('Student', 'Admin') NOT NULL DEFAULT 'Student',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    register_date DATE NOT NULL
);

-- EVENTS TABLE
CREATE TABLE events (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(200) NOT NULL,
    Status ENUM('Active', 'Upcoming') NOT NULL
);

-- REPORTS TABLE
CREATE TABLE reports (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Location VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    image VARCHAR(255),
    issue_address_date DATE,
    submitted_date DATE NOT NULL,
    phone VARCHAR(20),
    Status ENUM('Pending', 'Resolved') NOT NULL DEFAULT 'Pending',
    FOREIGN KEY (User_ID) REFERENCES users(User_ID)
);

-- ACTIVITIES TABLE
CREATE TABLE activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 