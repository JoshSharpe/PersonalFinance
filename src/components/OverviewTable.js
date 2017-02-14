import React, { Component } from 'react';
import ToggleableText from './ToggleableText.js';
import styles from "../static/App.css";

export default class OverviewTable extends Component {
  constructor(){
    super();

    this.state = {
      editingCategories: false
    }

    this.toggleEditingCategories = this.toggleEditingCategories.bind(this);
    this.nullCheckAnnualTotal = this.nullCheckAnnualTotal.bind(this);
  }

  toggleEditingCategories() {
    this.setState({editingCategories: !this.state.editingCategories});
  }

  nullCheckAnnualTotal(category){
      if(this.props.financialData[category] == null){
        return (<td >$ 0.00</td>)
      }
      return(<td>$ {this.props.financialData[category].toFixed(2)}</td>)
  }

  render() {
    return (
      <div className="table">
        <table className="table">
          <caption className="text-center"><h2>{this.props.year} Summary</h2></caption>
          <thead>
            <tr>
              <th onClick={this.toggleEditingCategories} className={styles.highlightHover}>Categories</th>
              {
                this.props.months.map((month) => {
                    return (
                      <th key={month} className="text-center highlight-hover" onClick={() => this.props.changeToMonth(month, this.props.year)}>{month}</th>
                    );
                })
              }
              <th className="text-center">Annual</th>
            </tr>
          </thead>
          <tbody>
          {
            this.props.categories.map((category) => {
              return (
                <tr key={category}>
                  <td className="text-left">
                    <ToggleableText
                      isStatic={!this.state.editingCategories}
                      change={this.props.updateCategory}
                      initValue={category}
                      remove={this.props.removeCategory}>
                    </ToggleableText>
                  </td>

                  {
                    this.props.months.map((month) => {
                      if(this.props.financialData[month][category] == null || this.props.financialData[month][category]["net"] == null){
                        return (<td key={month+"-"+category}>$ 0.00</td>)
                      }

                      return (
                        <td key={month+"-"+category}>$ {this.props.financialData[month][category]["net"].toFixed(2)}</td>
                      )
                    })
                  }
                  {this.nullCheckAnnualTotal(category)}
                </tr>
              )
            })
          }
          <tr hidden={!this.state.editingCategories}>
            <td className="text-left">
            <ToggleableText
              isStatic={!this.state.editingCategories}
              change={this.props.updateCategory}
              initValue=""
              add={this.props.addCategory}>
            </ToggleableText>
            </td>
          </tr>

          <tr>
            <td className="text-left">Total</td>
            {
              this.props.months.map((month) => {
                if(this.props.financialData[month]["net"] == null){
                  return (<td key={month+"-expense"}>$ 0.00</td>)
                }

                return (
                  <td key={month+"-expense"}>$ {this.props.financialData[month]["net"].toFixed(2)}</td>
                )
              })
            }
            {this.nullCheckAnnualTotal("net")}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
