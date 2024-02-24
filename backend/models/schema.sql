CREATE TABLE roles (
    role_id SERIAL NOT NULL,
    role VARCHAR (255),
    PRIMARY KEY (role_id)
);

CREATE TABLE permissions (
    permissions_id SERIAL NOT NULL,
    permission VARCHAR (255),
    PRIMARY KEY (permissions_id)
);

CREATE TABLE role_permissions (
    role_permissions_id SERIAL NOT NULL,
    role_id INT,
    permissions_id INT,
    FOREIGN KEY (role_id) REFERENCES roles (role_id),
    FOREIGN KEY (permissions_id) REFERENCES permissions (permissions_id),
    PRIMARY KEY (role_permissions_id)
);

CREATE TABLE users (
    user_id SERIAL NOT NULL,
    userName VARCHAR (255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR (255),
    is_deleted SMALLINT DEFAULT 0,
    role INT,
    FOREIGN KEY (role) REFERENCES roles (role_id),
    PRIMARY KEY (user_id)
);

CREATE TABLE events (
    event_id SERIAL NOT NULL,
    event VARCHAR (255),
    image TEXT,
    is_deleted SMALLINT DEFAULT 0,
    PRIMARY KEY (event_id)
);

CREATE TABLE services (
    service_id SERIAL NOT NULL,
    service_name VARCHAR (255),
    details  TEXT,
    price INT,
    image TEXT,
    status VARCHAR (255) DEFAULT 'pending',
    provider INT,
    is_deleted SMALLINT DEFAULT 0,
    FOREIGN KEY (provider) REFERENCES users (user_id),
    PRIMARY KEY (service_id)
);

CREATE TABLE service_event (
    id SERIAL NOT NULL,
    service_id INT,
    event_id INT,
    FOREIGN KEY (service_id) REFERENCES services (service_id),
    FOREIGN KEY (event_id) REFERENCES events (event_id),
    is_deleted SMALLINT DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE package (
    package_id SERIAL NOT NULL,
    package_Name VARCHAR (255),
    price INT,
    Description TEXT,
    image TEXT,
    event INT,
    is_deleted SMALLINT DEFAULT 0,
    FOREIGN KEY (event) REFERENCES events (event_id),
    PRIMARY KEY (package_id)
);

CREATE TABLE service_package (
    id SERIAL NOT NULL,
    service_id INT,
    package_id INT,
    FOREIGN KEY (service_id) REFERENCES services (service_id),
    FOREIGN KEY (package_id) REFERENCES package (package_id),
    is_deleted SMALLINT DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE orders (
    order_id SERIAL NOT NULL,
    order_price INT,
    user_id INT,
    event_name VARCHAR(255),
    eventDate VARCHAR(255),
    place VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    is_deleted SMALLINT DEFAULT 0,
    status VARCHAR (255) DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    PRIMARY KEY (order_id)
);

CREATE TABLE orders_services (
    id SERIAL NOT NULL,
    order_id INT,
    service_id  INT,
    service_package_id INT,
    created_at TIMESTAMP DEFAULT NOW(),
    is_deleted SMALLINT DEFAULT 0,
    FOREIGN KEY (service_package_id) REFERENCES service_package(id),
    FOREIGN KEY (order_id) REFERENCES orders (order_id),
    FOREIGN KEY (service_id) REFERENCES services (service_id),
    PRIMARY KEY (id)
);
