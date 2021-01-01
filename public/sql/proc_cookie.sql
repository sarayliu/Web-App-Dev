DROP PROCEDURE IF EXISTS new_user;

DELIMITER $$

CREATE PROCEDURE new_user(IN name VARCHAR(100))

BEGIN
    IF NOT EXISTS (SELECT 1 FROM students WHERE s_name = name) THEN
        INSERT INTO students(s_name, score, booster) VALUES (name, 0, 0);
    END IF;
END$$

DELIMITER ;