--Appel de la procédure stockée et stockage du résultat dans la variable @id
CALL createPatient('dhfklsbdfdbsflsbdf', 'Ramzan', 'Rachidov', null, 'rtr@gmail.com', 'male', true, @id);
SELECT @id;