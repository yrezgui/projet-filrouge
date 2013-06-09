-- --------------------------------------------------------------------------------
-- Routine DDL
-- Note: comments before and after the routine body will not be stored by the server
-- --------------------------------------------------------------------------------
DELIMITER $$

CREATE PROCEDURE `createSecretary`(OUT newSecretaryId INT, IN pPassword VARCHAR(100), IN pFirstname VARCHAR(50), IN pLastname VARCHAR(50), IN pBirthdate DATE, IN pEmail VARCHAR(100), IN pGender ENUM('male','female'))
mainJob:BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SET newSecretaryId = NULL;
		ROLLBACK;
	END;

	DECLARE EXIT HANDLER FOR SQLWARNING
	BEGIN
		SET newSecretaryId = NULL;
		ROLLBACK;
	END;

	START TRANSACTION;
		SELECT id INTO newSecretaryId FROM user ORDER BY id DESC LIMIT 1;
		
		IF newSecretaryId IS NULL THEN
			SET newSecretaryId = 1;
		ELSE
			SET newSecretaryId = newSecretaryId + 1;
		END IF;

		INSERT INTO `user` (`id`, `password`, `firstname`, `lastname`, `birthdate`, `email`, `gender`, `active`)
			VALUES (newSecretaryId, pPassword, pFirstname, pLastname, pBirthdate, pEmail, pGender, 1);

		INSERT INTO `secretary` (`idUser`) VALUES (newSecretaryId);
	COMMIT;
END