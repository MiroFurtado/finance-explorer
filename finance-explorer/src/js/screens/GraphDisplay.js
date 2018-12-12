import React, {Component} from 'react';
import { connect } from 'react-redux';

import Toast from 'grommet/components/Toast';
import Button from 'grommet/components/Button';
import Box from 'grommet/components/Box';
import Split from 'grommet/components/Split';
import Add from 'grommet/components/icons/base/Add';

import Form from 'grommet/components/Form';





class GraphDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toast: false,
    };

    this._onSubmit = this._onSubmit.bind(this);
  }

  iframe(state, page,dem) {
    if(dem) return {__html: '<iframe frameBorder="0" src="http://127.0.0.1:8080/api/'+state+'/d/'+page+'" width="900" height="500"></iframe>'}
    return {__html: '<iframe frameBorder="0" src="http://127.0.0.1:8080/api/'+state+'/r/'+page+'" width="900" height="500"></iframe>'}
  }

  iframe_save(state, page,dem) {
    if(dem) return {__html: '<iframe frameBorder="0" src="http://127.0.0.1:8080/api/save/'+state+'/d/'+page+'" width="0" height="0"></iframe>'}
    return {__html: '<iframe frameBorder="0" src="http://127.0.0.1:8080/api/save/'+state+'/r/'+page+'" width="0" height="0"></iframe>'}
  }

  _onSubmit(fields) {
    fields.preventDefault();

    this.setState({
      toast: true,
    });
    var form_url;
    if(this.props.dem) form_url = "http://127.0.0.1:8080/api/save/"+this.props.state+"/d/"+this.props.graph;
    else form_url = "http://127.0.0.1:8080/api/save/"+this.props.state+"/r/"+this.props.graph;
    
    const data = new FormData(fields.target);
    
    fetch(form_url, {
      method: 'POST',
      body: data,
    });

  }

  _OnToastClose() {
    this.setState({
      toast: false,
    });
  }

  render() {
    var form_url;
    if(this.props.dem) form_url = "http://127.0.0.1:8080/api/save/"+this.props.state+"/d/"+this.props.graph;
    else form_url = "http://127.0.0.1:8080/api/save/"+this.props.state+"/r/"+this.props.graph;

    var toast = this.state.toast ? <Toast status='ok' onClose={this._OnToastClose.bind(this)}> Graph saved!</Toast> : <div></div>;

    return (
      <div>
        <div dangerouslySetInnerHTML={ this.iframe(this.props.state,this.props.graph,this.props.dem) } />
        {toast}
        <Split>
        <Box
            justify='center'
            align='center'
            pad='medium'>
            <Button form="report_form" label='Add to report' type="submit" icon={<Add/>} accent={true}></Button>
          </Box>
          <Box
            justify='center'
            align='right'
            pad='none'>
            <Form id="report_form" onSubmit={this._onSubmit}>
            <textarea name="note" placeholder="Add your (markdown enabled) insights here!" rows="3" cols="45"/>
            </Form>
          </Box>
      </Split>
      </div>
    );
  }
}

export default connect()(GraphDisplay);
