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
import Layer from 'grommet/components/Layer';

import Columns from 'grommet/components/Columns';


import SVGIcon from 'grommet/components/SVGIcon';

// import Page from './piv_template.html';
// var htmlDoc = {__html: Page};



import Animate from 'grommet/components/Animate';

import {
  loadState, unloadState
} from '../actions/states';

import { pageLoaded } from './utils';

//SVG for the Democratic Icon
const DemIcon = () => (
  <SVGIcon viewBox='0 0 130 108'
  version='1.1'
  type='logo'
  a11yTitle='Dem'
  size='xlarge'>
  <g stroke='#00aef3'
    strokeWidth='11'
    fill='#ffffff'>
    <circle cy="43" cx="43" r="37.5"/>
  </g>
  <g
    fill='#00aef3'>
    <path d='M28.5,25.5v35h16.5a17.5,17.5 0 0,0 0,-35zM38.5,34h5a9,9 0 0,1 0,18h-5z' />
  </g>
</SVGIcon>
);

const RepIcon = () => (
  <SVGIcon viewBox='0 0 320 320'
  version='1.1'
  type='logo'
  a11yTitle='Dem'
  size='xlarge'>
<g transform="translate(-593.21 -786.43)">
  <g transform="matrix(.15 0 0 .15 601.1 764.97)">
   <circle cy="900.93" cx="705.71" r="750" fill="#e81b23"/>
   <circle cy="900.93" cx="705.71" r="675" fill="#fff"/>
   <path id="trunk" d="m720.56 288.69c-3.8785-0.004-7.7816 0.007-11.707 0.0312-215.33 1.3515-401.98 49.795-401.96 287.12 0.004 61.448 2.107 66.398 38 66.291 35.505-0.10987 736.28-0.85005 736.79-0.84375 27.427 0.34084 34.753-6.3263 34.623-53.201-0.6688-241.48-151.4-299.15-395.75-299.39zm371.68 377.5c-27.439 0.54879-708.75 0.66317-753.26 0.42187-22.202-0.12723-29.979 5.9118-29.979 24.912 0 39.304-2.973 342.86-1.2656 392.25 0.67134 19.419 11.401 25.145 25.756 25.334 32.092 0.4223 111.89 1.4725 141.45 0.8437 20.267-0.4223 28.992-10.111 29.979-39.268 0.92446-27.335-0.43421-72.631 0.42188-113.16 0.28867-13.666 5.0664-23.644 19-24.066 35.315-1.0701 171.06-1.0878 198.03-0.42187 34.201 0.84449 39.691 0.42137 40.535 35.889 1.0035 42.148 0.84287 67.981-0.42382 100.49-1.3533 34.735 10.135 38 28.713 38.422 27.438 0.6236 90.779-0.8903 122.45-0.4219 42.103 0.604 41.319-12.226 41.801-67.135 0.21772-23.648 0.0356-106.02-0.84375-143.56-0.21842-9.3247 4.646-15.94 10.979-16.045 25.815-0.4222 31.19 67.146 37.578 100.91 23.683 125.18 78.428 141.15 128.36 141.45 62.59 0.3921 122.23-51.499 122.45-158.34 0.033-16.086-3.3787-29.979-15.201-29.979-52.792 0-21.963 0.7739-49.822 0-14.778-0.4222-27.868 1.6879-24.912 24.488 2.9556 22.8 4.2539 65.3-24.49 66.291-12.245 0.4222-21.955-8.4458-21.955-33.357 0-24.912-1.7543-278.69-2.5332-298.94-0.4223-10.978-0.8449-27.446-22.801-27.023z" fill-rule="evenodd" transform="translate(-44.286 150.93)" fill="#e81b23"/>
   <path d="m651.38 387.97 23.482 73.174-62.135 45.787 76.848 0.27929 24.346 73.244 24.014-73 77.182-0.52343-62.008-45.395 23.355-73.566-62.336 44.945-62.748-44.945zm235.18 0.8457 23.482 73.172-62.135 45.789 76.848 0.2793 24.348 73.242 24.012-73 77.182-0.52148-62.006-45.396 23.353-73.564-62.336 44.943-62.748-44.943zm-470.79 0.0274 23.482 73.172-62.135 45.789 76.848 0.27735 24.346 73.244 24.014-73 77.182-0.52149-62.008-45.396 23.354-73.564-62.334 44.943-62.748-44.943z" fill-rule="evenodd" transform="translate(-44.286 150.93)" fill="#fff"/>
  </g>
 </g>
</SVGIcon>
);

//Hacky way to include 
const iframe = '<iframe frameBorder="0" src="../../piv.html" width="900" height="450"></iframe>'; 
const IframeComp = React.createClass({
  iframe: function () {
    return {
      __html: this.props.iframe
    }
  },

  render: function() {
    return (
      <div>
        <div dangerouslySetInnerHTML={ this.iframe() } />
      </div>
    );
  }
});


class StateBoard extends Component {
  constructor() {
      super();
      
      this.state = {
        demActive: false,
        repActive: false,
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
    pageLoaded('State');
    dispatch(loadState(params.id));
  }

  componentWillUnmount() {
    const { match: { params }, dispatch } = this.props;
    dispatch(unloadState(params.id));
  }

  render() {
    const { error, task } = this.props;


    const layer = (this.state.demActive)
      ?         <Box pad="large" align="center">
      <IframeComp iframe={iframe} /></Box>
      : <Box pad="small" align="center">
              <Heading margin='none' strong={true}>
          Pick your party
        </Heading>
      <Anchor icon={<DemIcon />} onClick={this._onClickDemButton}  href='#' />
      <Anchor icon={<RepIcon />} onClick={this._onClickRepButton}  href='#' />
    </Box>;

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
            {'Texas'}
            {this.state.demActive ?  '→ Dem → Finance Summary Report' : ''}
            {this.state.repActive ?  '→ Rep → Finance Summary Report' : ''}
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

const select = state => ({ ...state.tasks });

export default connect(select)(StateBoard);
