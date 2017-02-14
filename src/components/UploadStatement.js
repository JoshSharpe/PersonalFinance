import React, { Component } from 'react';
import {Collapse, Well, Glyphicon, Form, Button, FormGroup, FormControl, Radio, ControlLabel, Col, Row, Grid } from 'react-bootstrap';
import guid from '../utility/GUID.js';
import styles from "../static/App.css";
import ToggleableText from './ToggleableText.js';

export default class OverviewTable extends Component {

  constructor(){
    super();

    this.state = {
      currentNewFilterCategory: "Groceries",
      currentNewFilterType: "expense",
      currentNewFilterContains: "",
      statementAccount: "",
      statementYear: 2017,
      openFilters: false,
      openCategories: false
    };

    this.updateStatementOption = this.updateStatementOption.bind(this);
    this.updateStatementData = this.updateStatementData.bind(this);
    this.updateNewFilterCategory = this.updateNewFilterCategory.bind(this);
    this.updateNewFilterType = this.updateNewFilterType.bind(this);
    this.updateNewFilterContains = this.updateNewFilterContains.bind(this);
    this.updateStatementYear = this.updateStatementYear.bind(this);
  }

  updateStatementOption(evt) {
    this.setState({selectedOption: this.props.uploadStatementOptions[evt.target.value]});
  }

  updateStatementData(evt) {
    this.setState({statementData: evt.target.value});
  }

  updateNewFilterCategory(newFilterCategory) {
    this.setState({currentNewFilterCategory: newFilterCategory});
  }

  updateNewFilterType(newFilterType) {
    this.setState({currentNewFilterType: newFilterType});
  }

  updateNewFilterContains(newFilterContains) {
    this.setState({currentNewFilterContains: newFilterContains.toUpperCase()});
  }

  updateStatementYear(newYear) {
    this.setState({statementYear: newYear});
  }

  componentWillMount(){
    this.setState({statementData: ""});
    this.setState({selectedOption: this.props.uploadStatementOptions[0]});
  }

  render() {
    return (
      <Grid>
        <Row hidden={!this.props.emptyData}>
          <Col smOffset={2} sm={8}>
            <Well>
              You current do not have any data saved with the app. Please enter a statement below to get started. You can also add categories and filters below for your statements to be automatically sorted into certain categories.
            </Well>
         </Col>
        </Row>
        <Row className="">
          <Col sm={4}>
            <ControlLabel>Select Card</ControlLabel>
            <FormGroup className="text-left">
            {
              this.props.uploadStatementOptions.map((option, index) => {
                return ( <Radio key={option.account} value={index} onChange={this.updateStatementOption} checked={option.account === this.state.selectedOption.account}>{option.account}</Radio> )
              })
            }
            </FormGroup>
            <ControlLabel>Statement Year</ControlLabel>
            <FormControl type="text" className="text-left" defaultValue={this.state.statementYear} onChange={(evt) => {this.updateStatementYear(evt.target.value)}}>
            </FormControl>
          </Col>
          <Col sm={8}>
            <FormGroup>
              <ControlLabel>Statement</ControlLabel>
              <FormControl componentClass="textarea" rows="20" onChange={this.updateStatementData} placeholder={this.state.selectedOption.placeholder} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Button bsStyle="success" block onClick={this.state.selectedOption.parse(this.state.statementData, this.props.appendFinancialData, this.props.categoryFilters, this.state.statementYear, this.state.selectedOption.account).bind(this)} block>
              Add Statement
          </Button>
        </Row>
        <Row>
          <Button type="button" bsSize="xsmall" bsStyle="default" block onClick={ ()=> this.setState({ openFilters: !this.state.openFilters })}><Glyphicon glyph="menu-down"></Glyphicon>
            Click here to add filters
          </Button>
        </Row>
        <Collapse in={this.state.openFilters} >
          <div id={styles.listOfFilters} className="collapse full-height">
            <Well className="scroll-overflow">
              <Row className="">
                <Form inline>
                  If transaction label contains <FormControl type="text" placeholder="Contains" value={this.state.currentNewFilterContains} onChange={(evt) => {this.updateNewFilterContains(evt.target.value)}}></FormControl> it will be marked <FormControl componentClass="select" placeholder="select" defaultValue={this.state.currentNewFilterType} onChange={(evt) => {this.updateNewFilterType(evt.target.value)}}>
                    <option value="revenue">Revenue</option>
                    <option value="expense">Expense</option>
                  </FormControl> and placed in category <FormGroup controlId="formControlsSelect" id="-category" >
                    <FormControl componentClass="select" placeholder="select" defaultValue={this.state.currentNewFilterCategory} onChange={(evt) => {this.updateNewFilterCategory(evt.target.value)}} >
                      {
                          this.props.categories.map((newCategory) => {
                            return (<option key={"-"+newCategory} value={newCategory} >{newCategory}</option>);
                        })
                      }
                    </FormControl>
                  </FormGroup> <Button bsStyle="primary" onClick={()=>{
                    this.props.addFilters({
                      type: this.state.currentNewFilterType,
                      category: this.state.currentNewFilterCategory,
                      contains: this.state.currentNewFilterContains,
                      id: guid()
                  })
                  this.setState({currentNewFilterContains: ""});
                }}>Add</Button>
                </Form>
              </Row>
              {
                this.props.categoryFilters.map((filter) => {
                  return (
                  <Row key={filter.id} className="">
                    <Form inline>
                      If transaction label contains <FormControl type="text" placeholder="Contains" value={filter.contains} onChange={(evt) => {filter.contains = evt.target.value; this.props.updateFilter(filter);}}></FormControl> it will be marked <FormControl componentClass="select" placeholder="select" defaultValue={filter.type} onChange={(evt) => {filter.type = evt.target.value; this.props.updateFilter(filter);}}>
                        <option value="revenue">Revenue</option>
                        <option value="expense">Expense</option>
                      </FormControl> and placed in category <FormGroup controlId="formControlsSelect" id="-category" >
                        <FormControl componentClass="select" placeholder="select" defaultValue={filter.category} onChange={(evt) => {filter.category = evt.target.value; this.props.updateFilter(filter);}}>
                          {
                              this.props.categories.map((newCategory) => {
                                return (<option key={"-"+newCategory} value={newCategory} >{newCategory}</option>);
                            })
                          }
                        </FormControl>
                      </FormGroup> <Glyphicon glyph="remove" onClick={() => {this.props.removeFilters(filter)}}></Glyphicon>
                    </Form>
                  </Row>
                );
                })
              }
              </Well>
            </div>
          </Collapse>

        <Row>
          <Button type="button" bsSize="xsmall" bsStyle="default" block onClick={ ()=> this.setState({ openCategories: !this.state.openCategories })}><Glyphicon glyph="menu-down"></Glyphicon>
            Click here to add categories
          </Button>
        </Row>

        <Collapse in={this.state.openCategories} >
          <div id={styles.listOfFilters} className="collapse full-height">
            <Well className="scroll-overflow">
              {
                this.props.categories.map((category) => {
                  return (
                    <ToggleableText
                      key={category}
                      isStatic={false}
                      change={this.props.updateCategory}
                      initValue={category}
                      remove={this.props.removeCategory}>
                    </ToggleableText>
                  )
                })
              }
              <ToggleableText
                isStatic={false}
                change={this.props.updateCategory}
                initValue=""
                add={this.props.addCategory}>
              </ToggleableText>
            </Well>
          </div>
        </Collapse>
      </Grid>
    );
  }
}
