var Airtable = require("airtable");
var AirtableKey = require("../env.json");
var base = new Airtable({ apiKey: AirtableKey.AIRTABLE_KEY }).base(
  AirtableKey.AIRTABLE_BASE
);

export const getIndustries = query => {
  return new Promise((resolve, reject) => {
    base("industries")
      .select({
        // Selecting the first 3 records in Grid view:
        maxRecords: 8,
        view: "Grid view"
      })
      .firstPage(function page(error, records) {
        if (error) reject(error);
        // This function (`page`) will get called for each page of records.
        let resultsArray = [];
        records.forEach(function(record) {
          let resultObj = {}
          let recordName = record.get("Name");
          console.log("Retrieved", recordName);
          if (recordName) {
            resultObj.name = record.get("Name")
            resultObj.code = record.get("Name")
            resultsArray.push(resultObj);
          }
        });
        console.log('resultsArray', resultsArray)

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        console.log("api records", records);
        if (resultsArray.length) {
          const results = resultsArray.filter(element => {
            console.log('element', element)
            console.log('lowercase', element.name.toLowerCase())
            console.log('query', query);
            return element.name.toLowerCase().includes(query.toLowerCase())
          }) 
          console.log('results', results) 
          resolve(results);
        } else {
          resolve([])
        }
      

      });
  });
};

export const getResults = filterValue => {
  console.log('process.env', process.env)
  console.log('AIRTABLE_BASE', process.env.AIRTABLE_BASE)
  return new Promise((resolve, reject) => {
    let filterFormula = `FIND('${filterValue}', {Industry})`;
    console.log('filterFormula', filterFormula);
    base("business")
      .select({
        maxRecords: 8,
        view: "Grid view",
        filterByFormula: filterFormula
      })
      .firstPage(function page(error, records) {
        console.log('records', records);
        console.log('error in airtable.js', error);
        if (error) reject(error);
        // This function (`page`) will get called for each page of records.
        let resultsArray = [];
        if (records.length) {
          records.forEach(function(record) {
            let recordName = record.get("Name");
            console.log("Retrieved", recordName);
            if (recordName) {
              resultsArray.push(record.get("Name"));
            }
          });
        }

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        console.log("api records", records);
        resolve(resultsArray);
      });
  });
};
