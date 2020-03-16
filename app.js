const express = require('express');
const app = express();
const apiPath = '/api/';
const version = 'v1';
const port = 3000;
const bodyParser = require('body-parser');
const utf8 = require('utf8');
app.use(bodyParser.json());

// ATH???????????????????????
let nextEventId = 2;
//let nextBookingId = 3;

//The following is an example of an array of two events. 
var events = [
    { id: 0, name: "The Whistlers", description: "Romania, 2019, 97 minutes", location: "Bio Paradís, Salur 1", capacity: 40, startDate: new Date(Date.UTC(2020, 02, 03, 22, 0)), endDate: new Date(Date.UTC(2020, 02, 03, 23, 45)), bookings: [0, 1, 2] },
    { id: 1, name: "HarpFusion: Bach to the Future", description: "Harp ensemble", location: "Harpa, Hörpuhorn", capacity: 100, startDate: new Date(Date.UTC(2020, 02, 12, 15, 0)), endDate: new Date(Date.UTC(2020, 02, 12, 16, 0)), bookings: [] }
];

//The following is an example of an array of three bookings.
var bookings = [
    { id: 0, firstName: "John", lastName: "Doe", tel: "+3541234567", email: "", spots: 3 },
    { id: 1, firstName: "Jane", lastName: "Doe", tel: "", email: "jane@doe.doe", spots: 1 },
    { id: 2, firstName: "Meðaljón", lastName: "Jónsson", tel: "+3541111111", email: "mj@test.is", spots: 5 }
];

//Events endpoints
app.get(apiPath + version + '/events', (req, res) => {
    let theEvents = [];
    for (let i = 0; i < events.length; i++) {
        theEvents.push({ name: events[i].name, id: events[i].id, capacity: events[i].capacity, startDate: events[i].startDate, endDate: events[i].endDate })
    }
    res.status(200).json(theEvents);
});

app.get(apiPath + version + '/events/:eId', (req, res) => {
    for (let i = 0; i < events.length; i++) {
        if (events[i].id == req.params.eId) {
            res.status(200).json(events[i]);
            return;
        }
    }
    res.status(404).json({ 'message': "Event with id " + req.params.eId + " does not exist." });
});

app.post(apiPath + version + '/events', (req, res) => {
    if (req.body === undefined || req.body.name === undefined || req.body.capacity === undefined || req.body.startDate === undefined || req.body.endDate === undefined) {
        res.status(400).json({ 'message': "name, capacity, startDate, endDate fields are required in the request body for events" });
    } else {

        // Ehv tjékk á að capacity sé tala, og líka að startDate og endDate sé rétt format

        let newEvent = { id: nextEventId, description: req.body.description, location: req.body.location, capacity: req.body.capacity, startDate: req.body.startDate, endDate: req.body.Date(endDate), bookings: [] };
        events.push(newEvent);
        nextEventId++;
        res.status(201).json(newEvent);
    }
});

app.put(apiPath + version + '/events/:eId', (req, res) => {
    if (req.body === undefined || req.body.name === undefined || req.body.capacity === undefined || req.body.startDate === undefined || req.body.endDate === undefined) {
        res.status(400).json({ 'message': "name, capacity, startDate, endDate fields are required in the request body for events" });
    } else {
        for (let i = 0; i < events.length; i++) {
            if (events[i].id == req.params.eId) {

                // Ehv tjékk á að capacity sé tala, og líka að startDate og endDate sé rétt format

                events[i].name = req.body.name;
                events[i].description = req.body.description;
                events[i].location = req.body.location;
                events[i].capacity = req.body.capacity;
                events[i].startDate = req.body.startDate;
                events[i].endDate = req.body.endDate;
                res.status(200).json(events[i]);
                return;
            }
        }
        res.status(404).json({ 'message': "Event with id " + req.params.eId + " does not exist." });
    }
});

app.delete(apiPath + version + '/events', (req, res) => {
    var theEvents = events.slice();
    events = [];

    for (let i = 0; i < events.length; i++) {
        let bId = theEvents[i].bookings.slice();
        theEvents[i].bookings = [];

        for (let j = bookings.length - 1; j >= 0; j--) {
            if (bId.includes(bookings[j].id)) {
                theEvents[i].bookings.push(bookings.splice(j, i));
            }
        }
    }


    res.status(200).json(theEvents);
});

app.delete(apiPath + version + '/events/:eId', (req, res) => {
    for (let i = 0; i < events.length; i++) {
        if (events[i].id == req.params.eId) {
            let bId = events[i].bookings.slice();
            events[i].bookings = [];

            for (let j = bookings.length - 1; j >= 0; j--) {
                if (bId.includes(bookings[j].id)) {
                    events[i].bookings.push(bookings.slice(j, 1));
                }
            }
            res.status(200).json(events.splice(i, 1));
            return;
        }
    }
    res.status(404).json({ 'message': "Event with id " + req.params.eventId + " does not exist." });


    res.status(200).json({ 'message': "Delete event with id " + req.params.id });
});


//Bookings endpoints
app.get(apiPath + version + '/events/:eId/bookings', (req, res) => {
    res.status(200).json({ 'message': "Get all bookings for event with id " + req.params.eId });
});

app.get(apiPath + version + '/events/:eid/bookings/:bId', (req, res) => {
    res.status(200).json({ 'message': "Get note with id " + req.params.bId + " for event with id " + req.params.eId });
});

app.post(apiPath + version + '/events/:eId/bookings', (req, res) => {
    res.status(201).json({ 'message': "Post a new note for event with id " + req.params.eId });
});

app.delete(apiPath + version + '/events/:eId/bookings/:bId', (req, res) => {
    res.status(200).json({ 'message': "Delete note with id " + req.params.bId + " for event with id " + req.params.eId });
});

app.delete(apiPath + version + '/events/:eId/bookings', (req, res) => {
    res.status(200).json({ 'message': "Delete all bookings for event with id " + req.params.eId });
});



//Default: Not supported
app.use('*', (req, res) => {
    res.status(405).send('Operation not supported.');
});

app.listen(port, () => {
    console.log('Express app listening on port ' + port);
});