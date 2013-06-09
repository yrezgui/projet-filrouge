-- --------------------------------------------------------------------------------
-- Routine DDL
-- Note: comments before and after the routine body will not be stored by the server
-- --------------------------------------------------------------------------------
DELIMITER $$

CREATE PROCEDURE `createRendezVous`(OUT newRendezVousId INT, IN pPatientId INT, IN pMedicId INT, IN pDate VARCHAR(50), IN pTimetable DATE, IN pComment TEXT)
mainJob:BEGIN
	
	DECLARE CheckExists int;

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SET newRendezVousId = NULL;
		ROLLBACK;
	END;

	DECLARE EXIT HANDLER FOR SQLWARNING
	BEGIN
		SET newRendezVousId = NULL;
		ROLLBACK;
	END;

	START TRANSACTION;
		SELECT id INTO pPatientId FROM patient WHERE id = pPatientId;
		
		IF pPatientId IS NULL THEN
			LEAVE mainJob;
		END IF;

		SELECT id INTO pMedicId FROM medic WHERE id = pMedicId;
		
		IF pMedicId IS NULL THEN
			LEAVE mainJob;
		END IF;

		SELECT count(*) INTO CheckExists FROM rendezvous WHERE `date` = pDate;

		IF (CheckExists > 0) THEN
			LEAVE mainJob;
		END IF;
		
		SELECT count(*) INTO CheckExists FROM rendezvous WHERE timetable = pTimetable;
		
		IF (CheckExists > 0) THEN
			LEAVE mainJob;
		END IF;

		SELECT id INTO newRendezVousId FROM rendezvous ORDER BY id DESC LIMIT 1;
		
		IF newRendezVousId IS NULL THEN
			SET newRendezVousId = 1;
		ELSE
			SET newRendezVousId = newRendezVousId + 1;
		END IF;

		INSERT INTO `rendezvous` (`id`, `idPatient`, `idMedic`, `date`, `timetable`, `comment`)
			VALUES (newRendezVousId, pPatientId, pMedicId, pDate, pTimetable, pComment);

	COMMIT;
END