-- --------------------------------------------------------------------------------
-- Routine DDL
-- Note: comments before and after the routine body will not be stored by the server
-- --------------------------------------------------------------------------------
DELIMITER $$

CREATE PROCEDURE `createAdmin`(OUT newAdminId INT, IN pPassword VARCHAR(100), IN pFirstname VARCHAR(50), IN pLastname VARCHAR(50), IN pBirthdate DATE, IN pEmail VARCHAR(100), IN pGender ENUM('male','female'))
mainJob:BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SET newAdminId = NULL;
		ROLLBACK;
	END;

	DECLARE EXIT HANDLER FOR SQLWARNING
	BEGIN
		SET newAdminId = NULL;
		ROLLBACK;
	END;

	START TRANSACTION;
		SELECT id INTO newAdminId FROM user ORDER BY id DESC LIMIT 1;
		
		IF newAdminId IS NULL THEN
			SET newAdminId = 1;
		ELSE
			SET newAdminId = newAdminId + 1;
		END IF;

		INSERT INTO `user` (`id`, `password`, `firstname`, `lastname`, `birthdate`, `email`, `gender`, `active`)
			VALUES (newAdminId, pPassword, pFirstname, pLastname, pBirthdate, pEmail, pGender, 1);

		INSERT INTO `admin` (`idUser`) VALUES (newAdminId);
	COMMIT;
END