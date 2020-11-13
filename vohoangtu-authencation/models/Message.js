var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessagesSchema = new Schema({
  idUserSender: {
    type: String,
    required: true
  },
  idUserReceiver: {
    type: String,
    required: true   
  },
  content: {
    type: String,
    required: true   
  },
  date: {
    type: Date,
    required: true   
  }
  
}, { collection: 'dataMessagesSchema' });

module.exports = mongoose.model('Messages', MessagesSchema);
