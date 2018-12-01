import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';



import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Notification from 'grommet/components/Notification';
import Paragraph from 'grommet/components/Paragraph';
import SearchInput from 'grommet/components/SearchInput';
import Animate from 'grommet/components/Animate';
import Section from 'grommet/components/Section';
import CurrencyIcon from 'grommet/components/icons/base/Currency';
import { pageLoaded } from './utils';
import { login } from '../actions/session';


const suggestions = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

class Splash extends Component {
  constructor () {
    super();
    this.state = {
      value: ''
    }
    this.handleFormChange = this.handleFormChange.bind(this);
  }
  componentDidMount() {
    pageLoaded('Home');
  }

  handleFormChange(event) {
    this.setState({
      value: event.target.value
    })
    if(this.state.value.toLowerCase()=="texas") {
      window.location.replace("/states/tx/");
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
        <SearchInput
          value={this.state.value}
          onDOMChange={this.handleFormChange}
          placeholder="State"
        />
        <Box pad='medium'>
          <Heading tag='h3' strong={true}>
          </Heading>
          <Animate enter={{"animation": "fade", "duration": 1000, "delay": 0}}>
          <Paragraph size='large'>
            Analyze all your data here. Tktk lorem ipsum. Generate insights. More buzzwords. Analyzing campaign finance with blockchain, deep learning, generative approaches.
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

const select = state => ({ ...state.splash });

export default connect(select)(Splash);
