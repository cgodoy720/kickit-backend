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
    age DATE NOT NULL,
    pronouns TEXT,
    bio VARCHAR(200),
    username VARCHAR(30) UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    profile_img TEXT,
    firebase_id TEXT
);

DROP TABLE IF EXISTS events;
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    date_created DATE DEFAULT CURRENT_DATE,
    date_event DATE NOT NULL,
    CONSTRAINT check_event_after_created CHECK (date_event > date_created),
    summary TEXT NOT NULL,
    max_people INTEGER CHECK (max_people > 0), 
    age_restriction BOOLEAN,
    age_min INTEGER DEFAULT 18,
    age_max INTEGER,
    CHECK(age_min <= age_max),
    location TEXT NOT NULL,
    address TEXT NOT NULL,
    start_time time,
    end_time time,
    CONSTRAINT check_end_after_start CHECK (end_time > start_time),
    location_image TEXT NOT NULL,
    creator INTEGER REFERENCES users(id) ON DELETE CASCADE
);



DROP TABLE IF EXISTS users_categories;

CREATE TABLE users_categories (
    users_id INTEGER,
    category_id INTEGER
);

DROP TABLE IF EXISTS events_categories;
CREATE TABLE events_categories (
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, category_id)
);


DROP TABLE IF EXISTS users_events;
CREATE TABLE users_events(
    users_id INTEGER,
    event_id INTEGER,
    selected BOOLEAN DEFAULT FALSE
);



CREATE OR REPLACE FUNCTION update_user_events()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        UPDATE users_events
        SET event_id = NEW.id,
            title = NEW.title,
            date_event = NEW.date_event,
            summary = NEW.summary,
            max_people = NEW.max_people,
            age_restriction = NEW.age_restriction,
            age_min = NEW.age_min,
            age_max = NEW.age_max,
            location = NEW.location,
            address = NEW.address,
            start_time = NEW.start_time,
            end_time = NEW.end_time,
            location_image = NEW.location_image
        WHERE event_id = OLD.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_events_trigger
AFTER UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_user_events();

DROP TABLE IF EXISTS users_friends;
CREATE TABLE users_friends(
    users_id INTEGER, 
    senders_id INTEGER,
    message TEXT,
    PRIMARY KEY(users_id , senders_id)
);


CREATE OR REPLACE FUNCTION update_users_friends()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        UPDATE users_friends
        SET
            first_name = NEW.first_name,
            last_name = NEW.last_name,
            pronouns = NEW.pronouns,
            profile_img = NEW.profile_img
        WHERE users_id = OLD.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_friends_trigger
AFTER UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_friends();



DROP TABLE IF EXISTS comments;
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    events_id INTEGER REFERENCES events(id),
    user_id INTEGER REFERENCES users(id),
    comment VARCHAR(150) NOT NULL,
    time DATE DEFAULT CURRENT_DATE
);