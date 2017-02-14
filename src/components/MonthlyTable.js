import React, { Component } from 'react';
import {Glyphicon, FormGroup, FormControl } from 'react-bootstrap';

export default class MonthlyTable extends Component {
  render() {
    return (
      <div>
        <div className="table">
          <table className="table">
            <thead>
              <tr >
                <th className="text-center">Label</th>
                <th className="text-center">Cost</th>
                <th className="text-center">Account</th>
                <th className="text-center">Date</th>
                <th className="text-center">Categories</th>
                <th className="text-center">Type (Revenue/Expense)</th>
              </tr>
            </thead>
            <tbody>
            {
              Object.keys(this.props.financialData).map((category) => {
                let count = 0;
                if(this.props.financialData[category].items != null){
                  let sortedData = this.props.financialData[category].items.sort((a, b)=>{return parseInt(a.day) - parseInt(b.day)});
                  console.log("sortedData: ", sortedData);
                  return (sortedData.map((transaction) => {
                    return (
                      <tr key={transaction.label+"-"+count++}>
                        <td className="text-left" >{transaction.label}</td>
                        <td className="text-center" >$ {transaction.cost}</td>
                        <td className="text-center" >{transaction.account}</td>
                        <td className="text-center" >{transaction.year} - {transaction.month} - {transaction.day}</td>
                        <td className="text-center">
                        <FormGroup controlId="formControlsSelect" id={transaction.label+"-"+count+"-category"} key={transaction.label+"-"+count+"-category"}>
                          <FormControl componentClass="select" placeholder="select" defaultValue={category} onChange={(e)=> this.props.updateCategoryForTransaction(transaction, e.target.value)}>
                            {
                                this.props.categories.map((newCategory) => {
                                  return (<option key={transaction.label+"-"+count+"-"+newCategory} value={newCategory} >{newCategory}</option>);
                              })
                            }
                          </FormControl>
                        </FormGroup>
                        </td>
                        <td className="text-center">
                          <FormControl componentClass="select" placeholder="select" defaultValue={transaction.type} onChange={(e) => this.props.updateType(transaction, e.target.value)}>
                            <option value="revenue">Revenue</option>
                            <option value="expense">Expense</option>
                          </FormControl>
                        </td>
                        <td>
                          <Glyphicon glyph="remove" onClick={() => this.props.removeTransaction(transaction)}></Glyphicon>
                        </td>
                      </tr>
                    )
                  }))
                }
                return null;
              })
            }
            </tbody>
          </table>
        </div>
      </div>
    );
  }

}
