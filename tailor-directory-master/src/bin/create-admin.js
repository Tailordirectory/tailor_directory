#!/usr/bin/env node

require('../db/db');
const User = require('../models/User');

const { userRoles } = require('../enums/user');

const admin = new User({
  email: 'admin@admin.com',
  password: 'password',
  firstName: 'admin',
  lastName:  'admin',
  role: userRoles.ADMIN,
});

admin
  .save()
  .then(v => {
    console.log(v);
  })
  .catch(error => {
    console.log(error.message);
  }).finally(()=>{
    process.exit()
  });
