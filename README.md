# PersonalFinance
A small React + Node app that allows for you to track your bank statements over time.

Currently, the project will allow you to upload bank statements, which will then be sorted by category and month to demonstrate where you are spending money. You defined the categories and filter methods yourself within the UI. This can help with seeing trends in your spending and takes the stress out of managing multiple accounts on seperate systems.

A few additional features are in the works. Some are the ability to add a budget and monitor progress in meeting it, more visually appealing methods of viewing transactions over time, and better management of diverse account types (ie supporting saving and investing accounts in addition to simple credit/debit accounts).  

## Set-up and Configuration
Some small configuration has to be completed before running. The parsers have to be defined for each statement type until I can find a better way to universally handle all statement types or build up a library of parsers.

An example parser is defined in `src/utility/ParsingOptionsInstancesExample.js`. The actual parsers will have to be created in the file `src/utility/ParsingOptionsInstances.js`.

## Run Instructions
The project is built using webkit. To run, simply run `npm run build && npm run start`. I haven't incorporated hot-loading yet but may do that soon with any extra development on the project.

## Contact
email: joshasharpe@gmail.com
