-- --------------------------------------------------------------------------------
-- Routine DDL
-- Note: comments before and after the routine body will not be stored by the server
-- --------------------------------------------------------------------------------
DELIMITER $$

CREATE PROCEDURE `createPatient`(OUT newPatientId INT, IN pPassword VARCHAR(100), IN pFirstname VARCHAR(50), IN pLastname VARCHAR(50), IN pBirthdate DATE, IN pEmail VARCHAR(100), IN pGender ENUM('male','female'))
mainJob:BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SET newPatientId = NULL;
		ROLLBACK;
	END;

	DECLARE EXIT HANDLER FOR SQLWARNING
	BEGIN
		SET newPatientId = NULL;
		ROLLBACK;
	END;

	START TRANSACTION;
		SELECT id INTO newPatientId FROM user ORDER BY id DESC LIMIT 1;
		
		IF newPatientId IS NULL THEN
			SET newPatientId = 1;
		ELSE
			SET newPatientId = newPatientId + 1;
		END IF;

		INSERT INTO `user` (`id`, `password`, `firstname`, `lastname`, `birthdate`, `email`, `gender`, `active`)
			VALUES (newPatientId, pPassword, pFirstname, pLastname, pBirthdate, pEmail, pGender, 1);

		INSERT INTO `patient` (`idUser`) VALUES (newPatientId);
	COMMIT;
END