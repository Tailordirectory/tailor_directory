#!/usr/bin/env node

require('../db/db');
const User = require('../classes/models-controllers/User');
const Business = require('../classes/models-controllers/Business'); 

User.model.remove({}).then(async()=>{
  await Business.model.remove({}).catch(e=>{console.log})
  console.log('deleted')
  process.exit()
}).catch(e=>{
  console.log('delete failed')
  process.exit()
})
