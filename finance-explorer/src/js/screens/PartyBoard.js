import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Box from 'grommet/components/Box';
import Paragraph from 'grommet/components/Paragraph';
import Split from 'grommet/components/Split';
import Tiles from 'grommet/components/Tiles';
import Tile from 'grommet/components/Tile';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Sidebar from 'grommet/components/Sidebar';

import GraphDisplay from './GraphDisplay';

import { pageLoaded } from './utils';



class PartyBoard extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
          demActive: props.dem,
          repActive: props.rep,
          currentGraph: 'coh',
        };

    }

    componentDidMount() {
      pageLoaded('Summary Charts');
    }

    _onClickTile(graph) {
      this.setState({ currentGraph: graph});
    }

    render () {
      if(this.state.demActive) {
          return (<Split separator={true} priority='left' fixed={false}>
            <Box
    justify='center'
    align='center'
    pad='medium' margin={{'left': 'large'}}>
    <GraphDisplay graph={this.state.currentGraph} state={this.props.state} dem={this.state.demActive}/> </Box>
    <Box align='right'>
    <Sidebar>
    <Tiles fill={true}
  selectable={true}>
  <Tile separator='top'
    align='start' onClick={this._onClickTile.bind(this, 'coh')}>>
    <Header size='small'
      pad={{"horizontal": "small"}}>
      <Heading tag='h4'
        strong={true}
        margin='none'>
        Dollars Raised
      </Heading>
    </Header>
    <Box pad='small'>
      <Paragraph margin='none'>
        Dollars raised by Democrats by Congressional District in your state in 2018
      </Paragraph>
    </Box>
  </Tile>
  <Tile separator='top'
    align='start'
    onClick={this._onClickTile.bind(this, 'stack')}>>
    <Header size='small'
      pad={{"horizontal": "small"}}>
      <Heading tag='h4'
        strong={true}
        margin='none'>
        Per Voter Finances
      </Heading>
    </Header>
    <Box pad='small'>
      <Paragraph margin='none'>
        Breaks down per voter fundraising in Congressional races. 
      </Paragraph>
    </Box>
  </Tile>
  <Tile separator='top'
    align='start'
    onClick={this._onClickTile.bind(this, 'pvi-scatter')}>>
    <Header size='small'
      pad={{"horizontal": "small"}}>
      <Heading tag='h4'
        strong={true}
        margin='none'>
        Fundraising Scatter
      </Heading>
    </Header>
    <Box pad='small'>
      <Paragraph margin='none'>
        Scatter plot displaying the trend between district partisan leaning and fundraising share for your state.
      </Paragraph>
    </Box>
  </Tile>
  <Tile separator='top'
    align='start'
    onClick={this._onClickTile.bind(this, 'pvi-performance')}>>
    <Header size='small'
      pad={{"horizontal": "small"}}>
      <Heading tag='h4'
        strong={true}
        margin='none'>
        Financial Performance Chart
      </Heading>
    </Header>
    <Box pad='small'>
      <Paragraph margin='none'>
        Identifies districts that are over and under-performing their fundraising expectations given their partisan lean.
      </Paragraph>
    </Box>
  </Tile>
  <Tile separator='top'
    align='start'
    onClick={this._onClickTile.bind(this, 'incumbent-pie')}>>
    <Header size='small'
      pad={{"horizontal": "small"}}>
      <Heading tag='h4'
        strong={true}
        margin='none'>
        Incumbent Fundraising Pie
      </Heading>
    </Header>
    <Box pad='small'>
      <Paragraph margin='none'>
        Visualizes the incumbency advantage for your state by showing the incumbent share of fundraising in contested races.
      </Paragraph>
    </Box>
  </Tile>
  <Tile separator='top'
    align='start'
    onClick={this._onClickTile.bind(this, 'incumbent-scatter')}>>
    <Header size='small'
      pad={{"horizontal": "small"}}>
      <Heading tag='h4'
        strong={true}
        margin='none'>
        Incumbent Scatter
      </Heading>
    </Header>
    <Box pad='small'>
      <Paragraph margin='none'>
        Show the incumbency advantage for your state by displaying fundraising share race-by-race.
      </Paragraph>
    </Box>
  </Tile>
  <Tile separator='top'
    align='start'
    onClick={this._onClickTile.bind(this, 'sector')}>>
    <Header size='small'
      pad={{"horizontal": "small"}}>
      <Heading tag='h4'
        strong={true}
        margin='none'>
        Industry Breakdown
      </Heading>
    </Header>
    <Box pad='small'>
      <Paragraph margin='none'>
        Breaks down funding for Republican and Democrats by industry
      </Paragraph>
    </Box>
  </Tile>
</Tiles>
</Sidebar>
    </Box>
  </Split>);
    }
      if(this.state.repActive) {
        return (<Split separator={true} priority='left' fixed={false}>
        <Box
justify='center'
align='center'
pad='medium' margin={{'left': 'large'}}>
<GraphDisplay graph={this.state.currentGraph} state={this.props.state} dem={this.state.demActive}/> </Box>
<Box align='right'>
<Tiles fill={true}
selectable={true}>
<Tile separator='top'
align='start' onClick={this._onClickTile.bind(this, 'coh')}>>
<Header size='small'
  pad={{"horizontal": "small"}}>
  <Heading tag='h4'
    strong={true}
    margin='none'>
    Dollars Raised
  </Heading>
</Header>
<Box pad='small'>
  <Paragraph margin='none'>
    Dollars raised by Republicans by Congressional District in your state in 2018
  </Paragraph>
</Box>
</Tile>
<Tile separator='top'
align='start'
onClick={this._onClickTile.bind(this, 'stack')}>>
<Header size='small'
  pad={{"horizontal": "small"}}>
  <Heading tag='h4'
    strong={true}
    margin='none'>
    Per Voter Finances
  </Heading>
</Header>
<Box pad='small'>
  <Paragraph margin='none'>
    Breaks down per voter fundraising in Congressional races. 
  </Paragraph>
</Box>
</Tile>
<Tile separator='top'
align='start'
onClick={this._onClickTile.bind(this, 'pvi-scatter')}>>
<Header size='small'
  pad={{"horizontal": "small"}}>
  <Heading tag='h4'
    strong={true}
    margin='none'>
    Fundraising Scatter
  </Heading>
</Header>
<Box pad='small'>
  <Paragraph margin='none'>
    Scatter plot displaying the trend between district partisan leaning and fundraising share for your state.
  </Paragraph>
</Box>
</Tile>
<Tile separator='top'
align='start'
onClick={this._onClickTile.bind(this, 'pvi-performance')}>>
<Header size='small'
  pad={{"horizontal": "small"}}>
  <Heading tag='h4'
    strong={true}
    margin='none'>
    Financial Performance Chart
  </Heading>
</Header>
<Box pad='small'>
  <Paragraph margin='none'>
    Identifies districts that are over and under-performing their fundraising expectations given their partisan lean.
  </Paragraph>
</Box>
</Tile>
<Tile separator='top'
align='start'
onClick={this._onClickTile.bind(this, 'incumbent-pie')}>>
<Header size='small'
  pad={{"horizontal": "small"}}>
  <Heading tag='h4'
    strong={true}
    margin='none'>
    Incumbent Fundraising Pie
  </Heading>
</Header>
<Box pad='small'>
  <Paragraph margin='none'>
    Visualizes the incumbency advantage for your state by showing the incumbent share of fundraising in contested races.
  </Paragraph>
</Box>
</Tile>
<Tile separator='top'
align='start'
onClick={this._onClickTile.bind(this, 'incumbent-scatter')}>>
<Header size='small'
  pad={{"horizontal": "small"}}>
  <Heading tag='h4'
    strong={true}
    margin='none'>
    Incumbent Scatter
  </Heading>
</Header>
<Box pad='small'>
  <Paragraph margin='none'>
    Show the incumbency advantage for your state by displaying fundraising share race-by-race.
  </Paragraph>
</Box>
</Tile>
<Tile separator='top'
align='start'
onClick={this._onClickTile.bind(this, 'sector')}>>
<Header size='small'
  pad={{"horizontal": "small"}}>
  <Heading tag='h4'
    strong={true}
    margin='none'>
    Industry Breakdown
  </Heading>
</Header>
<Box pad='small'>
  <Paragraph margin='none'>
    Breaks down funding for Republican and Democrats by industry
  </Paragraph>
</Box>
</Tile>
</Tiles>
</Box>
</Split>);
      }
    }

}

PartyBoard.defaultProps = {
    error: undefined,
    task: undefined
  };
  
PartyBoard.propTypes = {
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.object,
    match: PropTypes.object.isRequired,
    task: PropTypes.object
  };

export default connect()(PartyBoard);