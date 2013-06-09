-- --------------------------------------------------------------------------------
-- Routine DDL
-- Note: comments before and after the routine body will not be stored by the server
-- --------------------------------------------------------------------------------
DELIMITER $$

CREATE PROCEDURE `createMedic`(OUT newMedicId INT, IN pPassword VARCHAR(100), IN pFirstname VARCHAR(50), IN pLastname VARCHAR(50), IN pBirthdate DATE, IN pEmail VARCHAR(100), IN pGender ENUM('male','female'), IN pService INT, IN pSpeciality INT)
mainJob:BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SET newMedicId = NULL;
		ROLLBACK;
	END;

	DECLARE EXIT HANDLER FOR SQLWARNING
	BEGIN
		SET newMedicId = NULL;
		ROLLBACK;
	END;

	START TRANSACTION;
		SELECT id INTO pService FROM service WHERE id = pService;
		
		IF pService IS NULL THEN
			LEAVE mainJob;
		END IF;


		SELECT id INTO pSpeciality FROM speciality WHERE id = pSpeciality;
		
		IF pSpeciality IS NULL THEN
			LEAVE mainJob;
		END IF;


		SELECT id INTO newMedicId FROM user ORDER BY id DESC LIMIT 1;

		IF newMedicId IS NULL THEN
			SET newMedicId = 1;
		ELSE
			SET newMedicId = newMedicId + 1;
		END IF;


		INSERT INTO `user` (`id`, `password`, `firstname`, `lastname`, `birthdate`, `email`, `gender`, `active`)
			VALUES (newMedicId, pPassword, pFirstname, pLastname, pBirthdate, pEmail, pGender, 1);

		INSERT INTO `medic` (`idUser`, `idService`, `idSpeciality`) VALUES (newMedicId, pService, pSpeciality);
	COMMIT;
END