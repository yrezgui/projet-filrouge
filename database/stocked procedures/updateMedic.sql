-- --------------------------------------------------------------------------------
-- Routine DDL
-- Note: comments before and after the routine body will not be stored by the server
-- --------------------------------------------------------------------------------
DELIMITER $$

CREATE PROCEDURE `updateMedic`(INOUT pMedicId INT, IN pPassword VARCHAR(100), IN pFirstname VARCHAR(50), IN pLastname VARCHAR(50), IN pBirthdate DATE, IN pEmail VARCHAR(100), IN pGender ENUM('male','female'), IN pService INT, IN pSpeciality INT)
mainJob:BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SET pMedicId = NULL;
		ROLLBACK;
	END;

	DECLARE EXIT HANDLER FOR SQLWARNING
	BEGIN
		SET pMedicId = NULL;
		ROLLBACK;
	END;

	START TRANSACTION;
		SELECT id INTO pMedicId FROM medic ORDER BY id DESC LIMIT 1;
		
		IF pMedicId IS NULL THEN
			LEAVE mainJob;
		END IF;

		SELECT id INTO pService FROM service WHERE id = pService;
		
		IF pService IS NULL THEN
			LEAVE mainJob;
		END IF;


		SELECT id INTO pSpeciality FROM speciality WHERE id = pSpeciality;
		
		IF pSpeciality IS NULL THEN
			LEAVE mainJob;
		END IF;

		UPDATE `user` SET 
			`password` = pPassword,
			`firstname` = pFirstname,
			`lastname` = pLastname,
			`birthdate` = pBirthdate,
			`email` = pEmail,
			`gender` = pGender
		WHERE id = pMedicId;


		UPDATE `medic` SET
			`idService` = pService,
			`idSpeciality` = pSpeciality
		WHERE id = pMedicId;
	COMMIT;
END