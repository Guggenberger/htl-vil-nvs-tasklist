/* ************************************************************************* */
/*                          login-router.js                                  */
/*  HTTP Endpoints for the login - REST API                                  */
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
import User from '../users/user-model.js';
import { authenticate, loginUser, logoutUser, getUser } from '../security/authentication.js';

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;
const selectionFields = '_id username password lastname firstname state';

// @POST /login
router.post('/login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let user = await User.findOne({ username: username, password: password });
    if (user == null) 
      return res.status(401).send("Unauthorized");
    else {
      User.updateOne( { username: user.username}, {$set: {state: "online"}}, function(err) {
        if (err) {
          console.log(err);
        }
      })

      let authorizationId = mongoose.Types.ObjectId();
      delete user.password;
      loginUser(authorizationId, user);
      
      return res.status(200).send(authorizationId);
    }
});

// @POST /logout
router.post('/logout', authenticate, (req, res) => {
  let authorizationId = req.headers['authorization'];
  let user = getUser(authorizationId);
  if (user == null) 
    return res.status(401).send("Unauthorized");
  else {
    User.updateOne( { username: user.username}, {$set: {state: "offline"}}, function(err) {
      if (err) {
        console.log(err);
      }
    })
  }
  logoutUser(authorizationId);
  return res.status(200);
});

// @GET /
router.get('/', authenticate, (req, res) => {
  let authorizationId = req.headers['authorization'];
  return res.status(200).send(getUser(authorizationId));
});

export { router as loginRouter };