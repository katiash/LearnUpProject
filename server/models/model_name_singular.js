//////////////////////////////////////////////////////////////////////////
//  SERVER/MODELS/MODEL_NAME_SINGULAR.JS FILE [ SCHEMA / MODEL] 
//////////////////////////////////////////////////////////////////////////
// Require Mongoose module (STEP 1) in the following files:
// - mongoose.js file, 
// - CONTROLLER file, 
// - HERE.
//////////////////////////////////////////////////////////////////////////

// STEP 1 (DB/SCHEMA SETUP):
// Require Mongoose module:
var mongoose = require('mongoose');

// STEP 3 (DB/SCHEMA SETUP):
// Name & Describe Schema:
var modelName = new mongoose.Schema({  //<--- SET MODEL NAME & DESCRIBE MODEL'S SCHEMA
    model_attribute: Number
})

// Set this Schema in our Models as 'Schema_Instance':
mongoose.model('model_instance', modelName);    //<-- NAME YOUR MODEL INSTANCE
