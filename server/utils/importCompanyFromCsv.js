const csv = require('csv-parser');
const path = require('path');
const fs = require('fs');
const Company = require('./../company/companyModel');
const { amexFile, nasdaqFile, nyseFile } = require('./../../config/keys');


const importExchangeFile = (exchange, exchangeFile) => {
  const companyLists = [];

  // Import Exchange Companies
  console.log(`${exchange} File: ${exchangeFile}`);
  fs.createReadStream(path.resolve(__dirname, `./../data/${exchangeFile}`))
    .pipe(csv({
      separator: ',',
      strict: true,
      mapHeader: ({ header }) => header.toLowerCase(),
    }))
    .on('data', (company) => {
      // Ensure the headers within the actual csv file
      // match the casing and spelling of the data.<properties>
      companyLists.push({
        symbol: company.symbol,
        exchange: `${exchange} Exchange`,
        name: company.name,
        marketCap: company.marketcap,
        ipoYear: company.ipoyear,
        lastSale: company.lastsale,
        sector: company.sector,
        industry: company.industry,
        summaryQuote: company.summaryquote
      });
    })
    .on('end', () => {
      // console.log(results);
      // Save records to database
      Company.create(companyLists, { j: true }, (err, resp) => {
        if (err) {
          throw new Error(`Error occured while saving ${exchange} Company documents: ${err}`);
        } else {
          console.log(`Successfully saved ${exchange} Company documents: `, resp);
        }
      });
    });
};

const importCompanies = (req, resp, next) => {
  // Import Exchange Companies
  Promise.all(
    importExchangeFile('AMEX', amexFile),
    importExchangeFile('NASDAQ', nasdaqFile),
    importExchangeFile('NYSE', nyseFile),
  )
    .then(() => next())
    .catch((err) => {
      resp.status(500);
      resp.json({ error: err });
    });
};

module.exports = importCompanies;
