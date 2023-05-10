DROP DATABASE IF EXISTS kickit;
CREATE DATABASE kickit;

\c kickit;


DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30)
);

DROP TABLE IF EXISTS users;
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    age INTEGER NOT NULL,
    username VARCHAR(30) UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    profile_img TEXT
);

DROP TABLE IF EXISTS events;
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    date_created TIMESTAMP WITH TIME ZONE DEFAULT TO_TIMESTAMP(TO_CHAR(CURRENT_TIMESTAMP, 'MM/DD/YYYY'), 'MM?DD?YYYY'),
    date_event TEXT NOT NULL,
    summary TEXT NOT NULL,
    max_people INTEGER, 
    age_restriction BOOLEAN,
    age_min INTEGER DEFAULT 18,
    age_max INTEGER,
    CHECK(age_min <= age_max),
    location TEXT NOT NULL,
    address TEXT NOT NULL,
    creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS users_categories;

CREATE TABLE users_categories (
    users_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (users_id, category_id)
);

DROP TABLE IF EXISTS events_categories;
CREATE TABLE events_categories (
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, category_id)
);


DROP TABLE IF EXISTS comments;
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    events_id INTEGER REFERENCES events(id),
    user_id INTEGER REFERENCES users(id),
    comment VARCHAR(150) NOT NULL,
    time TIMESTAMP WITH TIME ZONE DEFAULT TO_TIMESTAMP(TO_CHAR(CURRENT_TIMESTAMP, 'MM/DD/YYYY'), 'MM?DD?YYYY')
);