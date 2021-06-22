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
import User from './user-model.js';
import { authenticate } from '../security/authentication.js';
import { checkId } from '../utils/payload-checker.js';
import AppError from '../error/AppError.js';

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;
const selectionFields = '_id username lastname firstname state password age gender';

const checkUser = (user) => {
    let state = "";
    let username = "";
    if(!user.username || !user.password || !user.state || !user.lastname || !user.gender || !user.age ) {
        return "username/password/state/lastname not given";
    }

    if(!ObjectId.isValid(user._id)) {
        return "ObjectId not valid";
    }
    try{
        state = user.state.toLowerCase();
    } catch(err) {
        return "state is not a String";
    }
    if((state.toLowerCase() != 'offline' && state.toLowerCase() != 'online')) {
        return "state is not correct";
    }
    if(user.username.length < 4 || user.username.length > 40) {
        return "length of username not valid";
    }
    try{
        username = user.username.toString(); 
    } catch(err) {
        return "username is not a String";
    }

    let splitName = username.split("@");
    if(!isString(user.lastname)){
        return "lastname was not a String"
    }
    if(user.firstname){
        if(!isString(user.firstname)){
            return "firstname was not a String"
        }
    }
    if (splitName.length<2) {
        return "username does not contain a @"
    } else if(splitName.length>2){
        return "username containes @ more than once "
    }

    return null;
}

const checkUserForUpdate = (user) => {
    let state = "";
    let username = "";

    if(!user || Object.keys(user).length == 0) {
        return "no user defined";
    }

    let allowedKeys = ["_id", "username", "password", "state", "firstname", "lastname", "gender", "age"];

    for(var key in user) {
        if(allowedKeys.indexOf(key) == -1)
            return "not allowed parameter "+key;
    }
    if(user.state != null) {
        if(!user.state)
            return "no state defined";
        try{
            state = user.state.toLowerCase();
        } catch(err) {
            return "state is not a String";
        }
        if((state.toLowerCase() != 'active' && state.toLowerCase() != 'inactive')) {
            return "state is not correct";
        }
    }
    
    if(user.username != null) {
        if(user.username.length < 4 || user.username.length > 20) {
            return "length of username not valid";
        }
        try{
            username = user.username.toString(); 
        } catch(err) {
            return "username is not a String";
        }
    
        let splitName = username.split("@");
        if (splitName.length<2) {
            return "username does not contain a @"
        } else if(splitName.length>2){
            return "username containes @ more than once "
        }
    }


    if(user.lastname != null) {
        if(!user.lastname)
            return "lastname is not defined";
        if(!isString(user.lastname)){
            return "lastname was not a String"
        }
    }
    if(user.firstname != null) {
        if(!isString(user.firstname)){
            return "firstname was not a String"
        }
    }

    if(user.password != null) {
        if(!user.password)
            return "no password defined";
        if(!isString(user.password)) {
            return "password not a String";
        }
    }
    
}

router.get('/', authenticate, async (req, res, next) => {
    try {
        let users = await User.find({}, selectionFields);
        res.status(200).send(users);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', authenticate, async (req, res, next) => {
    try {
        checkId(req.params.id);
        let user = await select(req.params.id);
        res.status(200).send(user);
    } catch (err) {
        next(err);
    }
});

async function select(id) {
    let user = await User.findOne({ _id: id }, selectionFields);
    if (user == null) throw new AppError(404, `User with id: ${id} not found.`);

    return user;
}


router.post('/', async (req, res, next) => {
    let user = req.body;
    if (user._id) {
        return res.status(400).send("Id is given!");
    }
    user._id = ObjectId().toString();
    user.state = 'offline';

    try{
        if (!user.username || !user.password || !user.state || !user.lastname) {
            return res.status(400).send("username/password/state/lastname not given");
        }
        if (checkUser(user) != null) {
            return res.status(400).send(checkUser(user));
        } else {
            let userToAdd = new User(user);
            await userToAdd.save();
            return res.status(201).send({ '_id': `${user._id}` });
        }
    }
    catch(err){
        next(err);
    }
});

router.patch('/:id', authenticate, (req, res) => {
    let userbody = req.body;
    let userid = req.params.id;

    User.findById(userid, (err, user) => {
        if(err)
            return res.status(400).send(err);
        if(!user)
            return res.status(404).send("User not found");
        
        if (checkUserForUpdate(userbody))
            return res.status(400).send(checkUserForUpdate(userbody));
    
        User.findByIdAndUpdate(userid, userbody, { useFindAndModify: false}, (err, user) => {
            if(err)
                return res.status(400).send(err);

            User.findById(userid, selectionFields, (err, user) => {
                return res.status(200).send(user);
            });
        });
    });
});


router.delete('/:id', authenticate, async (req, res, next) => {
    try {
        if(req.params.id.length != 24) return res.status(400).send("no Mongo Id")
        checkId(req.params.id);
        let user = await select(req.params.id);
        await user.delete();
        return res.status(204).send('deleted');
    } catch (err) {
        next(err);
    }
    done();
});

export { router as userRouter };