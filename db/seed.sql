\c kickit;

INSERT INTO categories(name) VALUES
('Music'),
('Art'),
('Sport'),
('Going Out'),
('Gaming'),
('Tech'),
('Food & Drinks'),
('Educational'),
('Outdoors & Adventures'),
('Community'),
('Other');

-- INSERT INTO users (first_name, last_name, age, username, email, profile_img, firebase_id)VALUES 
-- ('John', 'Doe', '09/10/1998', 'johndoe', 'johndoe@example.com', 'https://example.com/profile1.jpg', '100')


-- For testing
-- Insert the first room
INSERT INTO rooms (user1_id, user2_id, added) VALUES (1, 2, true),(3, 4, true);

-- Insert the second room
-- INSERT INTO rooms (user1_id, user2_id, added)
-- VALUES ;

