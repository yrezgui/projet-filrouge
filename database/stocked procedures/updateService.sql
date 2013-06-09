-- --------------------------------------------------------------------------------
-- Routine DDL
-- Note: comments before and after the routine body will not be stored by the server
-- --------------------------------------------------------------------------------
DELIMITER $$

CREATE PROCEDURE `updateService`(INOUT pServiceId INT, IN pName VARCHAR(50))
mainJob:BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SET pServiceId = NULL;
		ROLLBACK;
	END;

	DECLARE EXIT HANDLER FOR SQLWARNING
	BEGIN
		SET pServiceId = NULL;
		ROLLBACK;
	END;

	START TRANSACTION;
		SELECT id INTO pServiceId FROM service ORDER BY id DESC LIMIT 1;
		
		IF pServiceId IS NULL THEN
			LEAVE mainJob;
		END IF;

		UPDATE `service` SET `name` = pName WHERE id = pServiceId;
	COMMIT;
END