const mongoose = require('mongoose');

const creditCardSchema = new mongoose.Schema({
  id: { type: Number, required: true},
  name: { type: String, required: true },
  image: { type: String, required: true },
  features: { type: [String], required: true },
  link: { type: String, required: true },
});

module.exports = mongoose.model('CreditCard', creditCardSchema);
