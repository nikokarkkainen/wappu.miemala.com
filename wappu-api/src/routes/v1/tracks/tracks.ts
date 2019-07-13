import {Router} from 'express';
import {BAD_REQUEST, CREATED, NO_CONTENT, NOT_FOUND} from 'http-status-codes';
import {ValidationError} from 'sequelize';
import {Track} from '../../../db/models/Track'; // TODO: alias?
import {logger} from '../../../shared'; // TODO: alias?

const router = Router();
const path = '/tracks';

// TODO: query filter for startDate and endDate (compared to playedAt)

router.get('/', async (req, res, next) => {
    try {
        const tracks = await Track.findAll();
        res.json(tracks);
    } catch (e) {
        logger.error(e.message, e);
        next(e);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const track = await Track.findByPk(req.params.id);
        if (!track) {
            res.sendStatus(NOT_FOUND);
        } else {
            res.json(track);
        }
    } catch (e) {
        logger.error(e.message, e);
        next(e);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const track = await Track.create(req.body);
        res.status(CREATED).json(track);
    } catch (e) {
        if (e instanceof ValidationError) {
            res.status(BAD_REQUEST).json({error: e.message});
        } else {
            logger.error(e.message, e);
            next(e);
        }
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const track = await Track.findByPk(req.params.id);
        if (!track) {
            res.sendStatus(NOT_FOUND);
        } else {
            await track.update(req.body);
            res.sendStatus(NO_CONTENT);
        }
    } catch (e) {
        if (e instanceof ValidationError) {
            res.status(BAD_REQUEST).json({error: e.message});
        } else {
            logger.error(e.message, e);
            next(e);
        }
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const track = await Track.findByPk(req.params.id);
        if (!track) {
            res.sendStatus(NOT_FOUND);
        } else {
            await track.destroy();
            res.sendStatus(NO_CONTENT);
        }
    } catch (e) {
        logger.error(e.message, e);
        next(e);
    }
});

export default { router, path };
