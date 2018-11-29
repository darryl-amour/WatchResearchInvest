const mongoose = require('mongoose');

const Schema  = mongoose.Schema;

const companySchema = new Schema({
  symbol: {
    type: String,
    required: true,
  },
  exchange: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  country: String,
  marketCap: String,
  ipoYear: String,
  lastSale: String,
  sector: String,
  industry: String,
  summaryQuote: String,
}, { id: false });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
