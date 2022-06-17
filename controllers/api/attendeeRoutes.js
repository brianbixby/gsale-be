"use strict";

const router = require("express").Router();
const { Attendee } = require("../../models");
const bearerAuth = require("../../lib/bearer-auth-middleware");

// get all
router.get('/', async (req, res) => {
    try {
        const data = await Attendee.findAll({ include: { all: true }, order: [['createdOn', 'DESC']] });
        res.json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json({ msg: "an error occurred: ", err });
    }
});

// get by id
router.get('/:id', async (req, res) => {
    try {
        const data = await Attendee.findByPk(req.params.id, { include: { all: true } });
        data === null ? res.status(404).json({ message: 'No attendee with this id!' }) : res.status(200).json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json(err);
    }
});

// get all attendees by garageSaleEventId
router.get('/garageSaleEvent/:garageSaleEventId', async (req, res) => {
    try {
        const data = await Attendee.findAll({ where: { garageSaleEvent_id: req.params.garageSaleEventId }, include: { all: true }, order: [['createdOn', 'DESC']] });
        data === null ? res.status(404).json({ message: 'No attendee with this garageSaleEventId!' }) : res.status(200).json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json(err);
    }
});

// post
router.post('/', bearerAuth, async (req, res) => {
    try {
        const message = !req.body.profile_id ? 'expected a profile_id'
            : !req.body.garageSaleEvent_id ? 'expected an garageSaleEvent_id'
                : null;
        if (message)
            return res.status(400).json(`BAD REQUEST ERROR: ${message}`);
        const data = await Attendee.create(req.body);
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json(err);
    }
});

//put by id
router.put('/:id', bearerAuth, async (req, res) => {
    try {
        const data = await Attendee.update(req.body, { where: { id: req.params.id } });
        data[0] === 0 ? res.status(404).json({ message: 'No attendee with this id!' }) : res.status(200).json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json(err);
    }
});

//delete by id
router.delete("/:id", bearerAuth, async (req, res) => {
    try {
        const data = await Attendee.destroy({ where: { id: req.params.id } });
        data === 0 ? res.status(404).json({ message: 'No attendee with this id!' }) : res.json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json(err);
    }
});

module.exports = router;