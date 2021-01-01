DROP PROCEDURE IF EXISTS new_grandma;

DELIMITER $$

CREATE PROCEDURE new_grandma(IN name VARCHAR(100))

BEGIN
    DECLARE queried_value INT;
    SELECT score INTO queried_value
        FROM students
        WHERE s_name = name;
    IF queried_value >= 25 THEN
        UPDATE students
        SET score = score - 25, booster = booster + 1
        WHERE s_name = name;
    END IF;
END$$

DELIMITER ;