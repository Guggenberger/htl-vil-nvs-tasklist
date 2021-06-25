/* ************************************************************************* */
/*                          user-router.js                                   */
/*  HTTP Endpoints for the user - REST API                                   */
/*                                                                           */
/*  Method   |   url                                                         */
/*  POST     |   /                                                           */
/*  GET      |   /                                                           */
/*  GET      |   /:id                                                        */
/*  PATCH    |   /:id                                                        */
/*  DELETE   |   /:id                                                        */
/*                                                                           */
/* ************************************************************************* */
import express from 'express';
import mongoose from 'mongoose';
import {isString} from 'util';
import Action from './action-model.js';
import { authenticate } from '../security/authentication.js';
import { checkId } from '../utils/payload-checker.js';
import AppError from '../error/AppError.js';

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;
const selectionFields = '_id personId date action notes';

router.post('/action', async (req, res, next) => {
    var date = new Date(req.body.date);
    var personId = req.body.personId;

    await Action.find({personId: `${personId}`}).then((items) => {
        if (JSON.stringify(items) !== "[]") {
            items.map(a => {
                var day = a.date.getDate();
                var month = a.date.getMonth();
                var year = a.date.getFullYear();
                
                if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
                    return res.status(201).send(a);
                }
            });
        }
    }).catch((err) => {
        next(err);
    })  
});

async function select(id) {
    let user = await User.findOne({ _id: id }, selectionFields);
    if (user == null) throw new AppError(404, `User with id: ${id} not found.`);
    return user;
}

router.post('/', async (req, res, next) => {
    let action = req.body;
    if (action._id !== "") {
        return res.status(400).send("Id is given!");
    }
    action._id = ObjectId().toString();

    try{
        let actionToAdd = new Action(action);
        await actionToAdd.save();
        return res.status(201).send({ '_id': `${action._id}` });
    }
    catch(err){
        next(err);
    }
});

export { router as actionRouter };