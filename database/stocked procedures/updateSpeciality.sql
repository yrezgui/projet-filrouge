-- --------------------------------------------------------------------------------
-- Routine DDL
-- Note: comments before and after the routine body will not be stored by the server
-- --------------------------------------------------------------------------------
DELIMITER $$

CREATE PROCEDURE `updateSpeciality`(INOUT pSpecialityId INT, IN pName VARCHAR(50))
mainJob:BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SET pSpecialityId = NULL;
		ROLLBACK;
	END;

	DECLARE EXIT HANDLER FOR SQLWARNING
	BEGIN
		SET pSpecialityId = NULL;
		ROLLBACK;
	END;

	START TRANSACTION;
		SELECT id INTO pSpecialityId FROM speciality ORDER BY id DESC LIMIT 1;
		
		IF pSpecialityId IS NULL THEN
			LEAVE mainJob;
		END IF;

		UPDATE `user` SET `name` = pName WHERE id = pSpecialityId;
	COMMIT;
END