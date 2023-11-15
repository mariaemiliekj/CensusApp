const express = require('express');
const router = express.Router();
const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("odd-jade-pig-robeCyclicDB")
let participants = db.collection('participants')


// POST handler for /participants/add
router.post('/add', async (req, res) => {
    const {
        email, firstname, lastname, dob, active,
        work: { companyname, salary, currency },
        home: { country, city }
    } = req.body;

     const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    const isValidDate = (date) => {
        const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
        return dateRegex.test(date) && !isNaN(new Date(date).getTime());
    };
    
    if (!email || !isValidEmail(email))
    return res.status(400).json({ error: 'Invalid email, missing @' });

    if (!firstname || !lastname)
    return res.status(400).json({ error: 'Need both name and last name' });

    if (!dob || !isValidDate(dob))
    return res.status(400).json({ error: 'Date has to be in (YYYY/MM/DD) format' });

    if (active === undefined || !active)
    return res.status(400).json({ error: 'Add the new user as active' });

    if (!companyname)
    return res.status(400).json({ error: 'Add company name' });

    if (isNaN(salary))
    return res.status(400).json({ error: 'Salary has to be a number' });

    if (!currency)
    return res.status(400).json({ error: 'Add currency' });

    if (!country)
    return res.status(400).json({ error: 'Add country' });

    if (!city)
    return res.status(400).json({ error: 'Add city' });
                  

    try {
          const existingParticipant = await participants.get(email);
          if (existingParticipant) {
              return res.status(409).json({ error: 'Participant with this email already exists' });
          }
        await participants.set(email, {
            firstname,
            lastname,
            dob,
            active,
            work: { companyname, salary, currency },
            home: { country, city }
        });

        res.status(201).json({ message: 'Participant added successfully' });
    } catch (error) {
        console.error('Error adding participant:', error);
        res.status(500).json({ error: 'Error adding participant to the database' });
    }
});



// returning a list of all participants in a JSON object.
router.get('/', async (req, res) => {
    try {
        const allParticipants = await participants.list();
        res.status(200).json(allParticipants);

    } catch (error) {
        console.error('Error retrieving participants:', error);
        res.status(500).json({ error: 'Error retrieving participants from the database' });
    }
});

  

//////////////- PARTICIPANT DETAILS-//////////

//returning the personal details of all active participants (including first name and last name).
router.get('/details', async (req, res) => {
    try {
        const participantItemsResponse = await participants.list();
        const participantKeys = participantItemsResponse.results.map(item => item.key);

        if (!Array.isArray(participantKeys) || participantKeys.length === 0) {
            return res.status(200).json([]);
        }

        const allParticipantsDetailsPromises = participantKeys.map(key => participants.get(key));
        const allParticipantsDetails = await Promise.all(allParticipantsDetailsPromises);

        const activeParticipantsDetails = allParticipantsDetails
            .filter(participant => participant && participant.props && participant.props.active)
            .map(({ props }) => ({ firstname: props.firstname, lastname: props.lastname, dob: props.dob, active: props.active }));

        res.status(200).json(activeParticipantsDetails);
    } catch (error) {
        console.error('Error retrieving participant details:', error.message);
        res.status(500).json({ error: 'Error retrieving details of active participants from the database: ' + error.message });
    }
});




//returning all deleted participants' personal details (including first name and last name).
router.get('/details/deleted', async (req, res) => {
    try {
        const participantItemsResponse = await participants.list();
        const participantKeys = participantItemsResponse.results.map(item => item.key);

        if (!Array.isArray(participantKeys) || participantKeys.length === 0) {
            return res.status(200).json([]);
        }

        const allParticipantsDetailsPromises = participantKeys.map(key => participants.get(key));
        const allParticipantsDetails = await Promise.all(allParticipantsDetailsPromises);


const deletedParticipantsDetails = allParticipantsDetails
    .filter(participant => participant && participant.props && participant.props.active === false)
    .map(participant => {
        const { firstname, lastname, dob, active } = participant.props || {};
        return { firstname, lastname, dob, active };
    });

        res.status(200).json(deletedParticipantsDetails);
    } catch (error) {
        console.error('Error retrieving deleted participant details:', error.message);
        res.status(500).json({ error: 'Error retrieving details of deleted participants from the database: ' + error.message });
    }
});



// returning only the personal details of the specified participant (including first name, last name, active). (Only for participants that are not deleted)
router.get('/details/:email', async (req, res) => {
    const email = req.params.email;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const participant = await participants.get(email);

        if (!participant || participant.props.active === false) {
            return res.status(404).json({ error: 'Participant not found, is deleted or not provided' });
        }

        const { firstname, lastname, active } = participant.props || {};

        res.status(200).json({ firstname, lastname, active });
    } catch (error) {
        console.error('Error retrieving participant details:', error.message);
        res.status(500).json({ error: 'Error retrieving participant details from the database: ' + error.message });
    }
});



//returning only the specified participant's work details that are not deleted (including their company name and salary with currency).
router.get('/work/:email', async (req, res) => {
    const email = req.params.email;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const participant = await participants.get(email);

        if (!participant || participant.props.active === false) {
            return res.status(404).json({ error: 'Participant not found, is deleted or not provided' });
        }

        const { companyname, salary, currency } = participant.props.work || {};

        res.status(200).json({ companyname, salary, currency });
    } catch (error) {
        console.error('Error retrieving participant work details:', error.message);
        res.status(500).json({ error: 'Error retrieving participant work details from the database: ' + error.message });
    }
});



// returning only the specified participant's home details that are not deleted (including their country and city).
router.get('/home/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const participant = await participants.get(email);

        if (!participant || participant.props.active === false) {
            return res.status(404).json({ error: 'Participant not found, is deleted or not provided' });
        }

        const { country, city } = participant.props.home || {};

        res.status(200).json({ country, city });
    } catch (error) {
        console.error('Error retrieving participant home details:', error.message);
        res.status(500).json({ error: 'Error retrieving participant home details from the database: ' + error.message });
    }
});




/////////////////DELETING / UPDATING THE PARTICIPANT/////////////////77



//‘deletes’ the participant of the provided email from the database.
router.delete('/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const existingParticipant = await participants.get(email);
        if (!existingParticipant) {
            return res.status(404).json({ error: 'Participant not found or provided' });
        }

        if (existingParticipant.props.active === false) {
            return res.status(400).json({ error: 'Participant is already deleted' });
        }
        await participants.set(email, { ...existingParticipant, active: false });

        res.status(200).json({ message: email + ' was deleted successfully' });
    } catch (error) {
        console.error('Error in soft-deleting participant:', error);
        res.status(500).json({ error: 'Error in soft-deleting participant from the database' });
    }
});



//updates the participant of the provided email from the database. The request should have the exact same format as for /participants/add POST request.
router.put('/:email', async (req, res) => {
    const emailToUpdate = req.params.email;

    const {
        email, firstname, lastname, dob, active,
        work: { companyname, salary, currency },
        home: { country, city }
    } = req.body;

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    const isValidDate = (date) => {
        const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
        return dateRegex.test(date) && !isNaN(new Date(date).getTime());
    };
    
    if (!email || !isValidEmail(email))
    return res.status(400).json({ error: 'Invalid email, missing @' });

    if (!firstname || !lastname)
    return res.status(400).json({ error: 'Need both name and last name' });

    if (!dob || !isValidDate(dob))
    return res.status(400).json({ error: 'Date has to be in (YYYY/MM/DD) format' });

    if (active === undefined || !active)
    return res.status(400).json({ error: 'The updated user should be active' });

    if (!companyname)
    return res.status(400).json({ error: 'Add company name' });

    if (isNaN(salary))
    return res.status(400).json({ error: 'Salary has to be a number' });

    if (!currency)
    return res.status(400).json({ error: 'Add currency' });

    if (!country)
    return res.status(400).json({ error: 'Add country' });

    if (!city)
    return res.status(400).json({ error: 'Add city' });
                  

    try {
        const existingParticipant = await participants.get(emailToUpdate);
        if (!existingParticipant) {
            return res.status(404).json({ error: 'Participant not found or provided' });
        }

        await participants.set(emailToUpdate, {
            firstname,
            lastname,
            dob,
            active,
            work: { companyname, salary, currency },
            home: { country, city }
        });

        res.status(200).json({ message: emailToUpdate +' was updated successfully' });
    } catch (error) {
        console.error('Error updating participant:', error);
        res.status(500).json({ error: 'Error updating participant in the database' });
    }
});


module.exports = router;





