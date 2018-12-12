import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Split from 'grommet/components/Split';
import Sidebar from 'grommet/components/Sidebar';
import LoginForm from 'grommet/components/LoginForm';
import Article from 'grommet/components/Article';
import Section from 'grommet/components/Section';
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';
import Footer from 'grommet/components/Footer';
import Logo from 'grommet/components/icons/Grommet';

import { login } from '../actions/session';
import { navEnable } from '../actions/nav';
import { pageLoaded } from './utils';

class Login extends Component {
  constructor() {
    super();
    this._onSubmit = this._onSubmit.bind(this);
  }

  componentDidMount() {
    pageLoaded('Login');
    this.props.dispatch(navEnable(false));
  }

  componentWillUnmount() {
    this.props.dispatch(navEnable(true));
  }

  _onSubmit(fields) {
    const { dispatch } = this.props;
    const { router } = this.context;

    window.localStorage.email = fields.email;
    window.localStorage.name = fields.email;
    window.localStorage.token = 'no-token';
    dispatch(login(() => (
      router.history.push('/')
    )));
  }

  render() {
    const { session: { error } } = this.props;

    return (
      <Split flex='left' separator={true}>

        <Article>
          <Section
            full={true}
            colorIndex='grey-2-a'
            pad='large'
            justify='center'
            align='center'
          >
            <Heading tag='h1' strong={true}>Campaign Finance Explorer</Heading>
            <Paragraph align='center' size='large'>
              We've never had so much data before. This tool was custom-built to leverage campaign finance data to provide critical insights for your political organizing. 
            </Paragraph>
          </Section>
        </Article>

        <Sidebar justify='between' align='center' pad='none' size='large'>
          <span />
          <LoginForm
            align='start'
            logo={<Logo className='logo' colorIndex='grey-2-a' />}
            title='Finance Explorer'
            onSubmit={this._onSubmit}
            errors={[error]}
            usernameType='text'
          />
          <Footer
            direction='row'
            size='small'
            pad={{ horizontal: 'medium', vertical: 'small' }}
          >
            <span className='secondary'>&copy; 2018 Miro Furtado - Bluebonnet</span>
          </Footer>
        </Sidebar>

      </Split>
    );
  }
}

Login.defaultProps = {
  session: {
    error: undefined
  }
};

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  session: PropTypes.shape({
    error: PropTypes.string
  })
};

Login.contextTypes = {
  router: PropTypes.object.isRequired,
};

const select = state => ({
  session: state.session
});

export default connect(select)(Login);
