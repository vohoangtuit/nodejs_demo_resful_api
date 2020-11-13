var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConversationsSchema = new Schema({
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
    type: String
   
  }
  
}, { collection: 'dataConversations' });

module.exports = mongoose.model('Conversation', ConversationsSchema);
