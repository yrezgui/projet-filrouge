-- --------------------------------------------------------------------------------
-- Routine DDL
-- Note: comments before and after the routine body will not be stored by the server
-- --------------------------------------------------------------------------------
DELIMITER $$

CREATE PROCEDURE `updateSecretary`(INOUT pSecretaryId INT, IN pPassword VARCHAR(100), IN pFirstname VARCHAR(50), IN pLastname VARCHAR(50), IN pBirthdate DATE, IN pEmail VARCHAR(100), IN pGender ENUM('male','female'))
mainJob:BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SET pSecretaryId = NULL;
		ROLLBACK;
	END;

	DECLARE EXIT HANDLER FOR SQLWARNING
	BEGIN
		SET pSecretaryId = NULL;
		ROLLBACK;
	END;

	START TRANSACTION;
		SELECT id INTO pSecretaryId FROM secretary ORDER BY id DESC LIMIT 1;
		
		IF pSecretaryId IS NULL THEN
			LEAVE mainJob;
		END IF;

		UPDATE `user` SET 
			`password` = pPassword,
			`firstname` = pFirstname,
			`lastname` = pLastname,
			`birthdate` = pBirthdate,
			`email` = pEmail,
			`gender` = pGender
		WHERE id = pSecretaryId;
	COMMIT;
END