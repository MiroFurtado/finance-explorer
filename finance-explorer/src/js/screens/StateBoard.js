import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Label from 'grommet/components/Label';
import Meter from 'grommet/components/Meter';
import Notification from 'grommet/components/Notification';
import Value from 'grommet/components/Value';
import Spinning from 'grommet/components/icons/Spinning';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import Animate from 'grommet/components/Animate';
import Paragraph from 'grommet/components/Paragraph';

import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';


import {
  loadState, unloadState
} from '../actions/states';
import { pageLoaded } from './utils';

import PartyBoard from './PartyBoard';
import {DemIcon, RepIcon} from './PartyIcon';
import { nominalTypeHack } from 'prop-types';


class StateBoard extends Component {
  constructor() {
      super();
      
      this.state = {
        demActive: false,
        repActive: false,
        name: '',
        cands: "ah",
      };
      
      this._onClickDemButton = this._onClickDemButton.bind(this);
      this._onClickRepButton = this._onClickRepButton.bind(this);
  }

  _onClickDemButton() {
    this.setState({ demActive: true })
  }

  _onClickRepButton() {
    this.setState({ repActive: true })
  }

  componentDidMount() {
    const { match: { params }, dispatch } = this.props;

    this.setState({name: params.name.toUpperCase()})

    fetch("http://127.0.0.1:5000/api/"+params.name.toUpperCase()+"/cands/")
    .then((response) => response.json())
    .then((result) => {
          this.setState({ cands: result.candidates});
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentWillUnmount() {
  }

  render() {
    const { error, task } = this.props;


    const layer = (this.state.demActive || this.state.repActive)
      ?        <div><PartyBoard dem={this.state.demActive} rep={this.state.repActive} state={this.state.name}/></div>
      : <div><Box pad="small" align="center">
              <Heading margin='none' strong={true}>
          Pick your party<br/><br/>
          <Anchor icon={<DemIcon />} onClick={this._onClickDemButton}  href='#' />
      <Anchor icon={<RepIcon />} onClick={this._onClickRepButton}  href='#' />
        </Heading>
        <Paragraph size='xlarge'>
          Or select an affiliated campaign!
          </Paragraph>
    </Box>
    <List selectable={true}>
  <ListItem justify='between'
    separator='horizontal'>
    <span>
      Beto O'Rourke
    </span>
    <span className='secondary'>
      US Senate
    </span>
  </ListItem>
  <ListItem justify='between'>
    <span>
      Ted Cruz
    </span>
    <span className='secondary'>
      US Senate
    </span>
  </ListItem>
</List></div>;

    let errorNode;
    let taskNode;
    if (error) {
      errorNode = (
        <Notification
          status='critical'
          size='large'
          state={error.message}
          message='An unexpected error happened, please try again later'
        />
      );
    } else if (!task) {
      taskNode = (
        <Box
          direction='row'
          responsive={false}
          pad={{ between: 'small', horizontal: 'medium', vertical: 'medium' }}
        >
          <Spinning /><span>Loading...</span>
        </Box>
      );
    } else {
      taskNode = (
        <Box pad='medium'>
          <Label>Status: {task.status}</Label>
          <Box
            direction='row'
            responsive={false}
            pad={{ between: 'small' }}
          >
            <Value
              value={task.percentComplete}
              units='%'
              align='start'
              size='small'
            />
            <Meter value={task.percentComplete} />
          </Box>
        </Box>
      );
    }

    return (
      <Article primary={true} full={true}>
        <Header
          direction='row'
          size='medium'
          colorIndex='neutral-4-t'
          align='center'
          responsive={false}
          pad={{ horizontal: 'small' }}
        >
          <Anchor path='/'>
            <LinkPrevious a11yTitle='Back to Splash' />
          </Anchor>
          <Heading margin='none' strong={true}>
            {this.state.name}
            {this.state.demActive ?  '→ Dem → Finance Dashboard' : ''}
            {this.state.repActive ?  '→ Rep → Finance Dashboard' : ''}
          </Heading>
        </Header>
        
        <Animate enter={{"animation": "fade", "duration": 1000, "delay": 0}}>
        {layer}
      </Animate>
      </Article>
    );
  }
}

StateBoard.defaultProps = {
  error: undefined,
  task: undefined
};

StateBoard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  match: PropTypes.object.isRequired,
  task: PropTypes.object
};
export default StateBoard;

// const select = state => ({ ...state.tasks });

// export default connect(select)(StateBoard);
