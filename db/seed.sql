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

INSERT INTO users (first_name, last_name, age, username, email, profile_img, interest)
VALUES ('John', 'Doe', 25, 'johndoe', 'johndoe@example.com', 'https://example.com/profile1.jpg', 1);


INSERT INTO users (first_name, last_name, age, username, email, profile_img, interest)
VALUES ('Jane', 'Smith', 30, 'janesmith', 'janesmith@example.com', 'https://example.com/profile2.jpg', 3);

INSERT INTO users_categories (users_id, category_id)
VALUES (1, 1); 

INSERT INTO users_categories (users_id, category_id)
VALUES (1, 5); 


INSERT INTO users_categories (users_id, category_id)
VALUES (2, 3); 

INSERT INTO users_categories (users_id, category_id)
VALUES (2, 7); 

INSERT INTO users_categories (users_id, category_id)
VALUES (2, 9); 