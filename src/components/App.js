import React, { Component } from 'react';
import OverviewTable from './OverviewTable.js';
import MonthlyTable from './MonthlyTable.js';
import UploadStatement from './UploadStatement.js';
import {Row, Grid } from 'react-bootstrap';
import parsingOptions from '../utility/ParsingOptionInstances.js';
import styles from "../static/App.css";

export default class App extends Component {
  constructor(){
    super();

    this.state = {
      financialData: null,
      sortedData: null,
      years: [],
      months: [],
      categories: [],
      view: null,
      uploadStatementOptions: parsingOptions,
      categoryFilters: [],
    };

    this.getCategories();
    this.getCategoryFilters();
    this.getFinancialData().then(() => {
      if(this.state.years.length == 0) {
        this.changeToUploadStatement();
      } else {
        this.changeToOverview();
      }
    });

    this.changeToOverview = this.changeToOverview.bind(this);
    this.changeToUploadStatement = this.changeToUploadStatement.bind(this);
    this.changeToMonth = this.changeToMonth.bind(this);
    this.updateCategoryForTransaction = this.updateCategoryForTransaction.bind(this);
    this.updateType = this.updateType.bind(this);
    this.removeTransaction = this.removeTransaction.bind(this);
    this.appendFinancialData = this.appendFinancialData.bind(this);
    this.removeFilters = this.removeFilters.bind(this);
    this.addFilters = this.addFilters.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.removeCategory = this.removeCategory.bind(this);
    this.addCategory = this.addCategory.bind(this);
  }

  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new Error(`HTTP Error ${response.statusText}`);
      error.status = response.statusText;
      error.response = response;
      console.log(error);
      throw error;
    }
  }

  parseJSON(response) {
    return response.json();
  }

  sortData(data) {
    let sortedData = {};
    let years = [];
    let months = [];
    data.forEach((item) => {

      if(this.state.categories.indexOf(item.category) < 0){
        return;
      }

      if(sortedData[item.year] == null) {
        sortedData[item.year] = {};
        sortedData[item.year]["net"] = 0;
        sortedData[item.year]["years"] = [];

        if(years.indexOf(item.year) < 0){
          years.push(item.year);
        }
      }

      if(sortedData[item.year][item.category] == null){
        sortedData[item.year][item.category] = 0.0;
      }

      if(sortedData[item.year][item.month] == null) {
        sortedData[item.year][item.month] = {};
        sortedData[item.year][item.month]["net"] = 0;

        if(months.indexOf(item.month) < 0){
          months.push(item.month);
        }
      }

      if(sortedData[item.year][item.month][item.category] == null) {
        sortedData[item.year][item.month][item.category] = {};
        sortedData[item.year][item.month][item.category]["net"] = 0;
        sortedData[item.year][item.month][item.category]["items"] = [];
      }

      if(item.type === "expense") {
        sortedData[item.year]["net"] -= item.cost;
        sortedData[item.year][item.month]["net"] -= item.cost;
        sortedData[item.year][item.month][item.category]["net"] -= item.cost;
        sortedData[item.year][item.category] -= item.cost;
      } else if(item.type === "revenue"){
        sortedData[item.year]["net"] += item.cost;
        sortedData[item.year][item.month]["net"] += item.cost;
        sortedData[item.year][item.month][item.category]["net"] += item.cost;
        sortedData[item.year][item.category] += item.cost;
      }
      sortedData[item.year][item.month][item.category]["items"].push(item);

    });

    function sortNumber(a,b) {
        return a - b;
    }

    years.sort(sortNumber);
    months.sort(sortNumber);
    return {sortedData, years,  months};
  }

  changeToOverview() {
    this.setState({view: "overview"});
  }

  changeToUploadStatement() {
    this.setState({view: "uploadStatement"});
  }

  changeToMonth(month, year){
    this.setState({view : {
        filter: "month",
        month: month,
        year: year
      }
    });
  }

  updateCategoryForTransaction(transaction, newCategory) {
    let newData = this.state.financialData.slice();
    newData.forEach((item, index, arr)=> {
      if(item.id === transaction.id){
        item.category = newCategory;
        return;
      }
    });

    this.setState({financialData: newData});
    this.postFinancialData(newData);
  }

  updateType(transaction, newType) {
    let newData = this.state.financialData.slice();
    newData.forEach((item, index, arr)=> {
      if(item.id === transaction.id){
        item.type = newType;
        return;
      }
    });

    this.setState({financialData: newData});
    this.postFinancialData(newData);
  }

  removeTransaction(transaction) {
    let newData = this.state.financialData.slice();
    newData.forEach((item, index, arr)=> {
      if(item.id === transaction.id){
        newData.splice(index,1);
      }
    });

    this.setState({financialData: newData});
    this.postFinancialData(newData);
  }

  appendFinancialData(newStatement) {
    let newData = this.state.financialData.slice();
    let allData = newData.concat(newStatement);
    this.setState({financialData: allData});
    this.postFinancialData(allData);
    let values = this.sortData(allData);
    this.setState({allData: allData});
    this.setState({sortedData: values.sortedData});
    this.setState({years: values.years});
    this.setState({months: values.months});
    this.changeToOverview();
  }

  removeFilters(filter) {
    let filters = this.state.categoryFilters.slice();
    filters.forEach((item, index)=> {
      if(item.id === filter.id){
        if(filters.length === 1){
          filters = [];
          return;
        }
        filters.splice(index,1);
      }
    });
    this.setState({categoryFilters: filters});
    this.postCategoryFilters(filters);
  }

  addFilters(filter) {
    let filters = this.state.categoryFilters.slice();
    filters.push(filter);
    this.setState({categoryFilters: filters});
    this.postCategoryFilters(filters);
  }

  updateFilter(filter) {
    let filters = this.state.categoryFilters.slice();
    filters.forEach((item, index)=> {
      if(item.id === filter.id){
        filters[index] = filter;
      }
    });
    this.setState({categoryFilters: filters});
    this.postCategoryFilters(filters);
  }

  addCategory(newCategory) {
    let categories = this.state.categories.slice();
    categories.push(newCategory);
    this.setState({categories: categories});
    this.postCategories(categories);
  }

  removeCategory(category) {
    let categories = this.state.categories.slice();
    let index = categories.indexOf(category);
    categories.splice(index,1);
    this.setState({categories: categories});
    this.postCategories(categories);
  }

  updateCategory(oldCategory, newCategory) {
    let categories = this.state.categories.slice();
    let index = categories.indexOf(oldCategory);
    categories[index] = newCategory;

    this.setState({categories: categories});
    this.postCategories(categories);
  }

  getFinancialData(){
    return fetch("/api/v1/transactions", {
      accept: "application/json"
    }).then(this.checkStatus)
      .then(this.parseJSON)
      .then((financialData) => {
        let values = this.sortData(financialData);
        this.setState({financialData: financialData});
        this.setState({sortedData: values.sortedData});
        this.setState({years: values.years});
        this.setState({months: values.months});
    });
  }

  postFinancialData(newData) {
    fetch("/api/v1/transactions", {
      accept: "application/json",
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData)
    }).then(this.checkStatus)
      .then((response) => {
        let newSortedData = this.sortData(newData);
        this.setState({sortedData: newSortedData.sortedData});
    });
  }

  getCategoryFilters(){
    fetch("/api/v1/filters", {
      accept: "application/json"
    }).then(this.checkStatus)
      .then(this.parseJSON)
      .then((filters) => {
        this.setState({categoryFilters: filters});
    });
  }

  postCategoryFilters(newData) {
    fetch("/api/v1/filters", {
      accept: "application/json",
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData)
    }).then(this.checkStatus)
  }

  getCategories(){
    fetch("/api/v1/categories", {
      accept: "application/json"
    }).then(this.checkStatus)
      .then(this.parseJSON)
      .then((categories) => {
        this.setState({categories: categories});
    });
  }

  postCategories(newData) {
    fetch("/api/v1/categories", {
      accept: "application/json",
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData)
    }).then(this.checkStatus)
  }

  render() {
    if (this.state == null || this.state.view == null){
      return (<div className={styles.App}>Waiting...</div>)
    } else if(this.state.view === "overview"){
      return (
        <div className={styles.App}>
          <div className={styles.AppHeader}>
            <h2>Welcome to Money</h2>
          </div>
          <div className="container">
            <button className="btn btn-success pull-left" onClick={this.changeToUploadStatement}>Upload Statement</button>
            {
              this.state.years.map((year) => {
                  return (<OverviewTable
                    key={year}
                    months={this.state.months}
                    categories={this.state.categories}
                    financialData={this.state.sortedData[year]}
                    year={year}
                    changeToMonth={this.changeToMonth}
                    updateCategory={this.updateCategory}
                    removeCategory={this.removeCategory}
                    addCategory={this.addCategory}
                    className={styles.AppIntro} ></OverviewTable>);
                })
              }
          </div>
        </div>
      );
    } else if(this.state.view === "uploadStatement") {
      return (
        <div className={styles.App}>
          <div className={styles.AppHeader}>
            <h2>Upload Statement</h2>
          </div>
          <div className="container">
            <Grid>
              <Row>
                <button className="btn btn-success pull-left" onClick={this.changeToOverview}> Back to Overview </button>
              </Row>
            </Grid>
            <UploadStatement
              uploadStatementOptions={this.state.uploadStatementOptions}
              appendFinancialData={this.appendFinancialData}
              categoryFilters={this.state.categoryFilters}
              categories={this.state.categories}
              removeFilters={this.removeFilters}
              addFilters={this.addFilters}
              updateFilter={this.updateFilter}
              updateCategory={this.updateCategory}
              removeCategory={this.removeCategory}
              addCategory={this.addCategory}
              emptyData={this.state.sortedData == null || this.state.sortedData.years == null || this.state.sortedData.years.length == 0}>
            </UploadStatement>
          </div>
        </div>
      );
    } else if(this.state.view.filter != null && this.state.view.filter === "month") {
      return (
        <div className={styles.App}>
          <div className={styles.AppHeader}>
            <h2>Year {this.state.view.year} - Month {this.state.view.month}</h2>
          </div>
          <div className="container">
            <Grid>
              <Row>
                <button className="btn btn-success pull-left" onClick={this.changeToOverview}> Back to Overview </button>
              </Row>
            </Grid>
            <MonthlyTable key={this.state.view.month}
                          categories={this.state.categories}
                          financialData={this.state.sortedData[this.state.view.year][this.state.view.month]}
                          year={this.state.view.year}
                          changeToOverview={this.changeToOverview}
                          updateCategoryForTransaction={this.updateCategoryForTransaction}
                          updateType={this.updateType}
                          removeTransaction={this.removeTransaction}
                          className={styles.AppIntro} >
            </MonthlyTable>
          </div>
        </div>
      );
    } else {
      return (<div className={styles.App}>Waiting...</div>);
    }
  }
}
