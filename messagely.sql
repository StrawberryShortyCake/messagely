CREATE TABLE users (
  username VARCHAR(50) PRIMARY KEY,
  password VARCHAR(100) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  join_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP WITH TIME ZONE);

CREATE TABLE messages (
  id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  from_username VARCHAR(50) NOT NULL REFERENCES users,
  to_username VARCHAR(50) NOT NULL REFERENCES users,
  body TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP WITH TIME ZONE);


INSERT INTO users(
  username,
  password,
  first_name,
  last_name,
  phone,
  last_login_at
  )
VALUES
    ('user_1','password1','John','Smith','5554446666','2018-06-22 07:10:25-07'),
    ('user_2','password2','Jane','Green','5558887777','2022-05-13 08:10:25-07'),
    ('user_3','password3','David','Young','5550001111','2023-01-04 13:10:25-07')

INSERT INTO messages(
  id,
  from_username,
  to_username,
  body,
  read_at
  )
VALUES
  ('1','user_1','user_2','Hey','2016-06-22 19:10:25-07'),
  ('2','user_1','user_3','Whatsup','2017-08-12 08:10:25-07'),
  ('3','user_2','user_1','Monday','2018-09-03 11:10:25-07')

INSERT INTO messages(
  id,
  from_username,
  to_username,
  body,
  read_at
  )
VALUES('4', 'user_1', 'user_2', 'Good morning!', CURRENT_TIMESTAMP);