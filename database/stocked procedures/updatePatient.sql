-- --------------------------------------------------------------------------------
-- Routine DDL
-- Note: comments before and after the routine body will not be stored by the server
-- --------------------------------------------------------------------------------
DELIMITER $$

CREATE PROCEDURE `updatePatient`(INOUT pPatientId INT, IN pPassword VARCHAR(100), IN pFirstname VARCHAR(50), IN pLastname VARCHAR(50), IN pBirthdate DATE, IN pEmail VARCHAR(100), IN pGender ENUM('male','female'))
mainJob:BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SET pPatientId = NULL;
		ROLLBACK;
	END;

	DECLARE EXIT HANDLER FOR SQLWARNING
	BEGIN
		SET pPatientId = NULL;
		ROLLBACK;
	END;

	START TRANSACTION;
		SELECT id INTO pPatientId FROM patient ORDER BY id DESC LIMIT 1;
		
		IF pPatientId IS NULL THEN
			LEAVE mainJob;
		END IF;

		UPDATE `user` SET 
			`password` = pPassword,
			`firstname` = pFirstname,
			`lastname` = pLastname,
			`birthdate` = pBirthdate,
			`email` = pEmail,
			`gender` = pGender
		WHERE id = pPatientId;
	COMMIT;
END