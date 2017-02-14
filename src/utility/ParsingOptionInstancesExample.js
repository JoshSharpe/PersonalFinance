import ParsingOption from './ParsingOption.js';
import guid from './GUID.js';

export default [
  new ParsingOption (
    "Credit Card",
    "Placeholder for example data split (ie \"MM/YY $COST LABEL\")",
    (statement, appendData, filters, year, account) => {
      return () => {
        let transactions = [];
        let statementByLine = statement.split("\n");
        statementByLine.forEach((line, index) => {
          let transaction = {};
          let tokens = line.split(" ");
          if (tokens.length < 3) {
            console.log("Had to skip line in parsing, invalid format: ", line);
            return;
          }
          transaction.account = account;
          transaction.id = guid();

          // Here is just a made up example of setting transaction data.
          // Would need to be adjusted based on your statement's format.

          // Get the date
          let date = new Date(Date.parse(tokens[0]));
          transaction.month = date.getMonth() + 1;
          transaction.year = year;

          // Get the cost (or income) of the transaction
          transaction.cost = tokens[1];

          // Set the label of the transaction
          transaction.label = tokens[2];

          // Check if the category+type should be set for this transaction
          // Else will stay the defaults.
          transaction.category = "Other";
          transaction.type = "expense";
          filters.forEach((filter) => {
            if(transaction.label.includes(filter.contains)){
              transaction.category = filter.category;
              transaction.type = filter.type;
              return;
            }
          });

          // Add transaction
          transactions.push(transaction);

        });
        appendData(transactions);
      }
    }
  )
];
