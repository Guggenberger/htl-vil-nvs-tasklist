import mongoose from 'mongoose';

export const healthChecker = async (req, res) => {
  let con = mongoose.connection;
  if (!con) {
    res.status(500).send('no database connection');
    return;
  }

  let currentState = con.states[con.readyState];
  if (currentState !== con.states[mongoose.STATES.connected]) {
    res.status(500).send('database not connected yet');
    return;
  }

  try {
    await con.collection('system.indexes').findOne({});
    res.status(200).send('OK App healthy and connected to database');
  } catch (err) {
    res.status(500).send(err);
  }
};
