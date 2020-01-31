var Airtable = require("airtable");
// const dotenv = require('dotenv');
const AirtableKey = require("../env.production");

// const result = dotenv.config()

// if (result.error) {
//   throw result.error
// }

// console.log(result.parsed)
// console.log('process.env', process.env)

// var AirtableKey = require("../env.production");
var base = new Airtable({ apiKey: AirtableKey.AIRTABLE_KEY }).base(
  AirtableKey.AIRTABLE_BASE
);

export const getIndividuals = query => {
  return new Promise((resolve, reject) => {
    base("Individuals")
      .select({
        // Selecting the first 3 records in Grid view:
        // maxRecords: 100,
        view: "Grid view"
      })
      .firstPage(function page(error, records) {
        if (error) reject(error);
        // This function (`page`) will get called for each page of records.
        let resultsArray = [];
        records.forEach(function(record) {
          let resultObj = {};
          let recordName = record.get("FULL_NAME");
          let individualID = record.get("ID");
          // console.log("Retrieved", recordName);
          if (recordName) {
            resultObj.name = recordName;
            resultObj.code = recordName;
            resultObj.ID = individualID;
            resultsArray.push(resultObj);
          }
        });
        console.log("resultsArray", resultsArray);

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        console.log("api records", records);
        let results;
        if (resultsArray.length >= 1) {
          results = resultsArray.filter(element => {
            // console.log("element", element);
            // console.log("lowercase", element.name.toLowerCase());
            // console.log("query", query);
            return element.name.toLowerCase().includes(query.toLowerCase());
          });
          console.log("results", results);
          if (results.length <= 0) {
            let someArray = [];
            someArray.push({
              text: "supfoo",
              code: "No results found",
              name: "No results found"
            });
            console.log("serverside no results found log");
            resolve(someArray);
          }
          resolve(results);
        }
      });
  });
};

// console.log('look here', AirtableKey.AIRTABLE_KEY)
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
          let resultObj = {};
          let recordName = record.get("Name");
          // console.log("Retrieved", recordName);
          if (recordName) {
            resultObj.name = record.get("Name");
            resultObj.code = record.get("Name");
            resultsArray.push(resultObj);
          }
        });
        console.log("resultsArray", resultsArray);

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        console.log("api records", records);
        if (resultsArray.length) {
          const results = resultsArray.filter(element => {
            console.log("element", element);
            console.log("lowercase", element.name.toLowerCase());
            console.log("query", query);
            return element.name.toLowerCase().includes(query.toLowerCase());
          });
          console.log("results", results);
          resolve(results);
        } else {
          resolve([]);
        }
      });
  });
};

export const getReviews = id => {
  return new Promise((resolve, reject) => {
    let filterFormula = `FIND('${id}', {individual_being_reviewed})`;
    console.log("filterFormula", filterFormula);
    base("reviews")
      .select({
        maxRecords: 100,
        view: "Grid view",
        filterByFormula: filterFormula
      })
      .firstPage(function page(error, records) {
        console.log("records", records);
        console.log("error in airtable.js", error);
        if (error) reject(error);
        // This function (`page`) will get called for each page of records.
        let resultsArray = [];
        records.forEach(function(record) {
          let resultObj = {};
          let reviewID = record.get("review ID");
          let Nps = record.get(
            "NPS TEST"
          );
          let notes = record.get("Notes");

          // console.log("Retrieved", reviewID);
          if (reviewID) {
            resultObj.id = reviewID;
            resultObj.reviewScore = Nps;
            resultObj.notes = notes;
            resultsArray.push(resultObj);
          }
        });
        console.log("resultsArray", resultsArray);

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        console.log("api records", records);
        resolve(resultsArray);
      });
  });
};
