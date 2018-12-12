import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';



import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Notification from 'grommet/components/Notification';
import Paragraph from 'grommet/components/Paragraph';
import Button from 'grommet/components/Button';
import Search from 'grommet/components/Search';
import Animate from 'grommet/components/Animate';
import Section from 'grommet/components/Section';
import CurrencyIcon from 'grommet/components/icons/base/Currency';
import { pageLoaded } from './utils';
import { login } from '../actions/session';


const suggestions = { 'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD', 'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC', 'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY', }

class Splash extends Component {
  constructor () {
    super();
    this.state = {
      initial: true,
      value: ''
    }
    this.handleFormChange = this.handleFormChange.bind(this);
  }
  componentDidMount() {
    pageLoaded('Home');
  }

  handleFormChange(event) {
    this.setState({
      value: event.target.value,
    })
    if(this.state.value.toLowerCase() in suggestions) {
      window.location.replace("/states/"+suggestions[this.state.value.toLowerCase()]+"/");
    }
  }


  render() {
    const { error, tasks } = this.props;
    const { intl } = this.context;

    let errorNode;
    let listNode;
    if (error) {
      errorNode = (
        <Notification
          status='critical'
          size='large'
          state={error.message}
          message='An unexpected error happened, please try again later'
        />
      );
    }
    return (
      <Box align="center">
      <Section
            full={true}
            colorIndex='neutral-4-t'
            pad='medium'
            justify='center'
            align='center'
          >
        <Header
          direction='row'
          justify='between'
          size='large'
          pad={{ horizontal: 'medium', between: 'small' }}
        >
          <Animate enter={{"animation": "slide-left", "duration": 1000, "delay": 0}}>
          <CurrencyIcon size='large'/>
          </Animate>
          <Animate enter={{"animation": "fade", "duration": 2000, "delay": 100}}>
          <Paragraph size='xlarge'>
          Campaign Finance Analysis
          </Paragraph>
          </Animate>
        </Header>     
        {errorNode}
        <Search
        size={'medium'} inline={true}
          value={this.state.value}
          onDOMChange={this.handleFormChange}
          placeHolder={'State to explore'}
        />
        <Box pad='medium'>
          <Heading tag='h3' strong={true}>
          </Heading>
          <Animate enter={{"animation": "fade", "duration": 1000, "delay": 0}}>
          <Paragraph size='large'>
          Campaign finance data is <b>messy</b>, <b>complicated</b>, and <b>difficult to interpret.</b> This tool is designed to abstract away from itemized lists of contributions so that you can visualize emergent trends in campaign finance state-by-state.
          </Paragraph>
          </Animate>
        </Box>
      </Section>
      </Box>
    );
  }
}

Splash.defaultProps = {
  error: undefined,
  tasks: []
};

Splash.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  tasks: PropTypes.arrayOf(PropTypes.object)
};

Splash.contextTypes = {
  intl: PropTypes.object
};


export default connect()(Splash);
