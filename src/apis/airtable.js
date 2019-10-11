var Airtable = require("airtable");
var AirtableKey = require("../env.json");
var base = new Airtable({ apiKey: AirtableKey.AIRTABLE_KEY }).base(
  AirtableKey.AIRTABLE_BASE
);

export const getIndustries = () => {
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
          let recordName = record.get("Name");
          console.log("Retrieved", recordName);
          if (recordName) {
            resultsArray.push(record.get("Name"));
          }
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        console.log("api records", records);
        resolve(resultsArray);
      });
  });
};

export const getResults = filterValue => {
  return new Promise((resolve, reject) => {
    base("business")
      .select({
        // Selecting the first 3 records in Grid view:
        maxRecords: 8,
        view: "Grid view",
        filterByFormula: `{Name}=${filterValue}`
      })
      .firstPage(function page(error, records) {
        if (error) reject(error);
        // This function (`page`) will get called for each page of records.
        let resultsArray = [];
        records.forEach(function(record) {
          let recordName = record.get("Name");
          console.log("Retrieved", recordName);
          if (recordName) {
            resultsArray.push(record.get("Name"));
          }
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        console.log("api records", records);
        resolve(resultsArray);
      });
  });
};
