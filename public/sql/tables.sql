DROP TABLE IF EXISTS students;

CREATE TABLE students(s_name VARCHAR(100), score INT(100), booster INT(100), PRIMARY KEY(s_name));
INSERT INTO students(s_name, score, booster) VALUE ('George', 0, 0);