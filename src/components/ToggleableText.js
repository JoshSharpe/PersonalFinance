import React, { Component } from 'react';
import {Form, Col, ControlLabel, FormControl,FormGroup, Glyphicon} from 'react-bootstrap';

export default class ToggleableText extends Component {
  constructor(){
    super();

    this.state = {
      newValue: ""
    }
    this.trackChange = this.trackChange.bind(this);
  }

  trackChange(evt){
    if(this.props.add == null){
      this.props.change(this.props.initValue, evt.target.value)
    }
    this.setState({newValue: evt.target.value})
  }

  render(){
    if(this.props.isStatic){
      return (
        <div>{this.props.initValue}</div>
      );
    } else {
      return (
          <Form horizontal>
            <FormGroup >
              <Col hidden={this.props.remove == null} componentClass={ControlLabel} xs={2}>
                <Glyphicon  glyph="remove" onClick={() => this.props.remove(this.props.initValue)}/>
              </Col>
              <Col hidden={this.props.add == null} componentClass={ControlLabel} xs={2}>
                <Glyphicon  glyph="plus" onClick={() => this.props.add(this.state.newValue)}/>
              </Col>
              <Col xs={8}>
                <FormControl  type="text" bsStyle="xs" defaultValue={this.props.initValue} onChange={this.trackChange} />
              </Col>
            </FormGroup>
          </Form>
      );
    }
  }

}
