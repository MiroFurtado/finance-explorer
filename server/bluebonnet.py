'''
Bluebonnet Campaign Finance Analysis Module (SERVER VERSION)

AUTHOR: Miro Furtado
'''

from requests import get
import json
from house_list import candidates_list
import pickle

#Plotly imports
import plotly.offline as plt
import plotly.graph_objs as go


#Math/Analysis imports
from sklearn import linear_model
import numpy as np
import pandas as pd

#Surpress pandas warnings
import warnings
warnings.filterwarnings(action="ignore", module="scipy", message="^internal gelsd")


#This function will be incorporated
def get_candidates(state):
    ftm_df_fed = pd.read_pickle('data/df_merged_fed')
    return list(ftm_df_fed[ftm_df_fed['Election_Jurisdiction_id']==state.upper()]['Career_Summary_Career_Summary'])


def return_year(df, year):
    "Returns all of the follow the money data for a given year from the dataframe!"
    year = str(year)
    if year not in ['2016', '2018']:
        print("NOT A VALID YEAR")
        return
    else:
        return df[df['Election_Year_id'] == year]

class Campaign:
    """Campaign class.
    This is where we will represent information about projected turnout, finance etc. 
    """
    def __init__(self, state, number, party):
        self.state = state
        self.number = number
        self.cash = 0
        self.party = party
        self.expenditures = 0
        self.json_538 = None
        self.raised_indiv = 0
        self.opposition = None
    
    def is_incumbent(self):
        return self.opposition is None
    
    def funding_share(self):
        "Calculates the share of individual contributions raised by Campaign vs opponent"
        if(self.is_incumbent()):
            return 1.
        return self.raised_indiv/(self.raised_indiv+self.opposition.raised_indiv)
    
    def set_coh(self, coh):
        "Updates the cash on hand for campaign"
        self.cash = coh

    def set_raised_indiv(self, amt):
        "Updates the cash on hand for campaign"
        self.raised_indiv = amt

    def set_expenditures(self, expenditures):
        "Updates the expenditures for campaign"
        self.expenditures = expenditures

class State:
    def __init__(self, name, party='DEM'):
        self.name = name
        self.party = party
        if self.party=='DEM':
            self.opp = 'REP'
        else:
            self.opp = 'DEM'
        self.districts = {}
        self.regr = None
    
    def gen_report(self,states=None):
        to_return = ''
        to_return += self.gen_coh_graph()
        to_return += self.gen_stack_graph()
        if(states and len(self.districts) <= 15):
            temp_full, temp_regr = gen_full_pvi_scatter(states)
            self.regr = temp_regr
            to_return += temp_full
        else:
            to_return += self.gen_pvi_fundraising_scatter()

        to_return += self.gen_performance_graph()
        return to_return


    def gen_pvi_fundraising_scatter(self,states=None):
        if(states and len(self.districts) <= 15):
            temp_full, temp_regr = gen_full_pvi_scatter(states)
            self.regr = temp_regr
            return temp_full

        pvi_list = []
        share_list = []
        num_districts = []
        for i,district in self.districts.items():
            pvi = district.json_538['pvi']
            share = district.funding_share()
            num_districts.append(i)
            pvi_list.append(pvi)
            share_list.append(share)

        regr = linear_model.LinearRegression()
        shaped_share = np.array(share_list).reshape(-1,1)
        regr.fit(shaped_share,pvi_list)

        trace = go.Scatter(
            x = 100*share_list,
            y = pvi_list,
            mode = 'markers',
            text=num_districts
        )
        trace2 = go.Scatter(
            x=share_list, 
            y=regr.predict(shaped_share),
            mode='lines',
            line=dict(color='blue', width=3)
        )


        data = [trace,trace2]
        layout = go.Layout(
            title=('Fundraising share by Cook PVI (%s %s)' % (self.name, self.party)),
            showlegend=False,
            annotations=[
                dict(
                    x=0.15,
                    y=43,
                    xref='x',
                    yref='y',
                    text='R squared = %.3f' % regr.score(shaped_share,pvi_list),
                    showarrow=False,
                )],
                xaxis=dict(title='Share of Fundraising'),
                yaxis=dict(title='Cook PVI')
        )

        fig = go.Figure(data=data, layout=layout)
        #pio.write_image(fig, 'pvi_scatter.png',scale=4)

        # Plot and embed in ipython notebook!
        #plt.iplot(fig, filename='basic-scatter',show_link=False,config={'displayModeBar': False})
        return plt.plot(fig, include_plotlyjs=True, output_type='div', config={'displayModeBar': False}, show_link=False)
    def gen_performance_graph(self,out_file=None):
        if(len(self.districts) <= 15):
            return "<b>Too few data points for performance graph.</b>"
        if(not out_file):
            out_file = ("%s_%s_performance_viz.html" % (self.name,self.party))
        pvi_list = []
        share_list = []
        nums_district = []
        for i,district in self.districts.items():
            nums_district.append(i)
            pvi = district.json_538['pvi']
            share = district.funding_share()
            pvi_list.append(pvi)
            share_list.append(share)

        shaped_pvi = np.array(pvi_list).reshape(-1,1)
        shaped_share = np.array(share_list).reshape(-1,1)
        if(not self.regr):
            regr = linear_model.LinearRegression()
            regr.fit(shaped_pvi,shaped_share)
        else:
            regr = self.regr
        

        performance = list(np.transpose((shaped_share-np.clip(regr.predict(shaped_pvi),0,1)))[0])
        nums_district, performance = list(zip(*sorted(zip(nums_district,performance),key= lambda x: x[1])[::-1]))
        trace1 = go.Bar(
            x=nums_district,
            y=100*performance
        )
        for i in range(len(performance)):
            if performance[i] < 0:
                break
            last = nums_district[i]
            last_i = i
        first = nums_district[i]

        data = [trace1]
        layout = go.Layout(
            title='Financial Performance Chart by %s District'%self.name,
            xaxis=dict(type='category', tickangle=45),
            yaxis=dict(title='Actual Minus Expected Share', tickformat="%f%"),
            shapes= [
                {
                    'type': 'rect',
                    'xref': 'x',
                    'yref': 'y',
                    'x0': nums_district[0],
                    'y0': -0.15,
                    'x1': last,
                    'y1': -0.02,
                    'line': {
                        'width': 0,
                    },
                    'fillcolor': 'rgba(50, 171, 96, 1.0)',
                },
                {
                    'type': 'rect',
                    'xref': 'x',
                    'yref': 'y',
                    'x0': first,
                    'y0': 0.02,
                    'x1': nums_district[-1],
                    'y1': 0.15,
                    'line': {
                        'width': 0,
                    },
                    'fillcolor': 'rgba(0,0,0, 1.0)',
                }
            ],
            annotations=[
                dict(
                    x=nums_district[int(last_i/2)],
                    y=-0.08,
                    xref='x',
                    yref='y',
                    text='Over-Performing Candidates',
                    showarrow=False,
                    font=dict(family='Arial', size=17, color='#ffffff')
                ),
                dict(
                    x=nums_district[int((len(nums_district)-last_i)/2)+last_i],
                    y=0.08,
                    xref='x',
                    yref='y',
                    text='Under-Performing Candidates',
                    showarrow=False,
                    font=dict(family='Arial', size=15, color='#ffffff')
                )
            ],
        )
        fig = go.Figure(data=data,layout=layout)
        #pio.write_image(fig, 'performance_graph.png',scale=4)
        #plt.iplot(fig, filename=out_file,show_link=False, config={'displayModeBar': False})
        return(plt.plot(fig, include_plotlyjs=True, output_type='div', config={'displayModeBar': False}, show_link=False))
        

    def gen_stack_graph(self,out_file=None):
        if(not out_file):
            out_file = ("%s_%s_coh_viz.html" % (self.name,self.party))
        fundings = []
        for i,district in self.districts.items():
            total = (district.cash+district.expenditures)/district.json_538['vep']
            fundings.append((str(i), district.cash/district.json_538['vep'], district.expenditures/district.json_538['vep'], total))
        cash = list(zip(*sorted(fundings,key= lambda x: x[3])[::-1]))

        trace2 = go.Bar(
            x=cash[0],
            y=cash[1],
            name='Unspent',
        )
        trace1 = go.Bar(
            x=cash[0],
            y=cash[2],
            name='Spent'
        )

        data = [trace1, trace2]
        layout = go.Layout(
            title=('%s %s per Voter Finances' % (self.name, self.party)),
            barmode='stack',
            xaxis=dict(type='category',tickangle=45, tickmode='linear',tickfont=dict(
            size=10,
            color='black'
        )),
            yaxis=dict(tickformat="$",hoverformat = '$.2f')
        )

        fig = go.Figure(data=data, layout=layout)
        #plt.iplot(fig, filename=out_file,show_link=False, config={'displayModeBar': False})
        return plt.plot(fig, include_plotlyjs=True, output_type='div', config={'displayModeBar': False}, show_link=False)


    def gen_coh_graph(self,out_file=None):
        "This code is a mess, but this generates a cash on hand per eligible voter per district barchart"

        if(not out_file):
            out_file = ("%s_%s_coh_viz.html" % (self.name,self.party))
        fundings = []
        for i,district in self.districts.items():
            fundings.append((str(i), district.raised_indiv/district.json_538['vep']))
        cash = list(zip(*sorted(fundings,key= lambda x: x[1])[::-1])) #This line of complicated function magic sorts the two lists by size

        trace1 = go.Bar(
            x=cash[0],
            y=cash[1],
            name='Cash per voter',
        )

        data = [trace1]#[trace1, trace2]
        layout = go.Layout(
            title='%s Dollars RAISED per Voter (%s)' % (self.party, self.name),
            xaxis=dict(type='category',tickangle=45),
            yaxis=dict(tickformat="$",hoverformat = '$.2f')
        )
        fig = go.Figure(data=data,layout=layout)
        #pio.write_image(fig, 'coh_graph.png',scale=4)
        #plt.iplot(fig, filename=out_file,show_link=False, config={'displayModeBar': False})

        return(plt.plot(fig, include_plotlyjs=True, output_type='div', config={'displayModeBar': False}, show_link=False))

    def gen_incumbent_effect_scatter(self,year=2018, in_percentile = 100, ni_percentile = 100):
        
        subset_df = return_year(self.FTM_incumbency,year)
        
            
        incum_raise = subset_df['i_raised'].values.tolist()
        nincum_raise = subset_df['ni_raised'].values.tolist()
        name = subset_df['text'].values.tolist()
        
                
        trace = go.Scatter(
            x = nincum_raise,
            y = incum_raise,
            mode = 'markers',
            text = name
        )

        layout= go.Layout(
            title= 'Incumbent Effect',
            hovermode= 'closest',
            xaxis= dict(
        
                range = [0, np.percentile(np.array(nincum_raise), ni_percentile)], 
                title= 'Non Incumbent Contributions',
        

            ),
            yaxis=dict(
                range = [0, np.percentile(np.array(incum_raise), in_percentile)], 
                title= 'Incumbent Contributions',

            ),
        )


        data = [trace]
        fig = go.Figure(data = data, layout = layout)
        #plt.iplot(fig, filename='basic-scatter')
        return plt.plot(fig, include_plotlyjs=True, output_type='div', config={'displayModeBar': False}, show_link=False)



    def gen_sector_viz(self,year=2018,industry_only=False):
        df_clean = return_year(self.FTM_merged,year)
        df_clean['Specific_Party_Specific_Party'] = df_clean['Specific_Party_Specific_Party'].map(lambda x: x.replace(" WRITEIN", ''))
        df_dem = df_clean[df_clean['Specific_Party_Specific_Party'] == 'DEMOCRATIC']
        df_rep = df_clean[df_clean['Specific_Party_Specific_Party'] == 'REPUBLICAN']

        dem_values = []
        rep_values = []
        
        labels = ['Unitemized', 'Cand Contr', 'Gov & Edu', 'Law & Lobby', 
                'Fin, Insur, RE', 'Comm & Elect', 'Health', "Gen Bus",
                'Energy & Natural Rec', 'Construction', 'Transp', 'Sing Issue', "Agriculture",
                'Defense', 'Party', 'Non Contr' ]
        if industry_only:
            labels = ['Gov & Edu', 'Law & Lobby', 
                'Fin, Insur, RE', 'Comm & Elect', 'Health', "Gen Bus",
                'Energy & Natural Rec', 'Construction', 'Transp', 'Sing Issue', "Agriculture",
                'Defense', 'Party', 'Non Contr' ]
        if not industry_only:
            # unitemized
            dem_values.append(df_dem['unitem_st'].mean())
            rep_values.append(df_rep['unitem_st'].mean())

            # candidate contributions
            dem_values.append(df_dem['cand_cont_st'].mean())
            rep_values.append(df_rep['cand_cont_st'].mean())

        # government and education
        dem_values.append(df_dem['gov_edu_st'].mean())
        rep_values.append(df_rep['gov_edu_st'].mean())

        # lawyers / lobbyists
        dem_values.append(df_dem['law_lob_st'].mean())
        rep_values.append(df_rep['law_lob_st'].mean())

        # finance insurance real estate
        dem_values.append(df_dem['fin_ins_est_st'].mean())
        rep_values.append(df_rep['fin_ins_est_st'].mean())

        # communications and electronics
        dem_values.append(df_dem['comm_elec_st'].mean())
        rep_values.append(df_rep['comm_elec_st'].mean())

        # communications and electronics
        dem_values.append(df_dem['comm_elec_st'].mean())
        rep_values.append(df_rep['comm_elec_st'].mean())

        # health
        dem_values.append(df_dem['health_st'].mean())
        rep_values.append(df_rep['health_st'].mean())

        # general business
        dem_values.append(df_dem['gen_bus_st'].mean())
        rep_values.append(df_rep['gen_bus_st'].mean())

        # energy natural recources
        dem_values.append(df_dem[ 'ener_nat_st'].mean())
        rep_values.append(df_rep[ 'ener_nat_st'].mean())

        # construction
        dem_values.append(df_dem['construct_st'].mean())
        rep_values.append(df_rep['construct_st'].mean())

        # transportation
        dem_values.append(df_dem['transport_st'].mean())
        rep_values.append(df_rep['transport_st'].mean())

        # Single Issue
        dem_values.append(df_dem['ideal_sing_st'].mean())
        rep_values.append(df_rep['ideal_sing_st'].mean())

        # Agriculture
        dem_values.append(df_dem['ag_st'].mean())
        rep_values.append(df_rep['ag_st'].mean())

        # Labor
        dem_values.append(df_dem['labor_st'].mean())
        rep_values.append(df_rep['labor_st'].mean())

        # Defense
        dem_values.append(df_dem['defense_st'].mean())
        rep_values.append(df_rep['defense_st'].mean())

        # Party
        dem_values.append(df_dem['party_st'].mean())
        rep_values.append(df_rep['party_st'].mean())

        # Non contributions
        dem_values.append(df_dem['non_cont_st'].mean())
        rep_values.append(df_rep['non_cont_st'].mean())


        trace1 = go.Bar(
            x= labels,
            y= dem_values,
            name='Democrats',

        )
        trace2 = go.Bar(
            x= labels,
            y=rep_values,
            name='Republicans',
            marker = dict(
                color='rgb(255,0,0)',
            )
        )

        data = [trace1, trace2]


        layout = go.Layout(
                barmode='group',
                title='Contributions by Sector',
            xaxis=dict(
                title='Sector',

            ),
            yaxis=dict(
                title='Average $',

                )
            )

        fig = go.Figure(data=data, layout=layout)
        #plt.iplot(fig, filename='grouped-bar')
        return plt.plot(fig, include_plotlyjs=True, output_type='div', config={'displayModeBar': False}, show_link=False)

    def gen_incumbent_effect_pie(self, year=2018):

        
        df = return_year(self.FTM_incumbency, year)
        df = df[df['i_raised'] != 0]
            
        in_mean = df.i_raised.mean()
        ni_mean = df.ni_raised.mean()
                    
        trace = [{
        "hole": 0.6, 
        "labels": ['Incumbent', 'Non-incumbent'],
        "type": "pie", 
        "values": [in_mean, ni_mean]
        }]


        data = go.Data(trace)


        layout = go.Layout(
                title='Incumbent vs Non Incumbent Average Contributions' ,
            xaxis=dict(
                title='Status',

            ),
            yaxis=dict(
                title='Average $',

                )
            )


        fig = go.Figure(data = data, layout = layout)
        #plt.iplot(fig,  filename='basic-bar')
        return plt.plot(fig, include_plotlyjs=True, output_type='div', config={'displayModeBar': False}, show_link=False)
        

    def add_district(self, number, party=None):
        """Adds a district to a state by its number
        """
        if(not party):
            party=self.party
        dist = Campaign(self.name,number, party=party)
        self.districts[number] = dist
        return dist

    def build_from_FTM(self,df_merged,df_inc):
        """Builds out a State (ie. gets local races) from FTM data
        """
        self.FTM_merged = df_merged[df_merged['Election_Jurisdiction_Election_Jurisdiction'] == self.name]
        self.FTM_incumbency = df_inc[df_inc['i_state'] == self.name]

    def build_from_FEC(self,cash_df):
        """Builds out a State (ie. populates its districts) from an FEC housesenate finance dataframe
        """
        #Pare down the relevant dataframe by party and state
        campaigns = cash_df[(cash_df[4]==self.party) & (cash_df[18]==self.name)]
        
        #Checks if given district is in dictionary
        for idx, candidate in campaigns.iterrows():
            if(candidate[19]==0):
                continue #We ignore senate campaigns for now!
            elif(not str(candidate[19]) in self.districts):
                dist = Campaign(self.name,candidate[19],party=self.party)
                self.districts[str(candidate[19])] = dist
                dist.set_coh(candidate[10])
                dist.set_expenditures(candidate[7])
                dist.set_raised_indiv(candidate[17])
            else:
                dist = self.districts[str(candidate[19])]
                dist.set_coh(max(dist.cash, candidate[10]))
                dist.set_expenditures(max(dist.expenditures,candidate[7]))
                dist.set_raised_indiv(max(dist.raised_indiv, candidate[17]))

        
        campaigns = cash_df[(cash_df[4]==self.opp) & (cash_df[18]==self.name)]
        
        #Checks if given district is in dictionary
        for idx, candidate in campaigns.iterrows():
            if(candidate[19]==0):
                continue #We ignore senate campaigns for now!
            elif(not self.districts[str(candidate[19])].opposition ):
                dist = Campaign(self.name,candidate[19],party=self.opp)
                self.districts[str(candidate[19])].opposition = dist
                dist.set_coh(candidate[10])
                dist.set_expenditures(candidate[7])
                dist.set_raised_indiv(candidate[17])
            else:
                dist = self.districts[str(candidate[19])].opposition
                dist.set_coh(max(dist.cash, candidate[10]))
                dist.set_expenditures(max(dist.expenditures,candidate[7]))
                dist.set_raised_indiv(max(dist.raised_indiv, candidate[17]))

def build_all_from_538(party):
    """Builds out entire country dictionary from 538 data
    """
    state_dict = {}
    for district in candidates_list:
        state = district[0]
        if state not in state_dict:
            state_obj = State(state,party=party)
            state_dict[state] = state_obj 
        else:
            state_obj = state_dict[state]
        district_number = district[1]
        if not district_number in state_obj.districts:
            dist = state_obj.add_district(district_number)
        else:
            dist = state_obj.districts[district_number]

        # this url stores FiveThirtyEight's prediction data for each district
        url = 'https://projects.fivethirtyeight.com/2018-midterm-election-forecast/house/{state}-{district_number}.json'.format(state=state, district_number=district_number)
        response = get(url)
        loaded_json = json.loads(response.text)
        
        dist.json_538 = loaded_json
    return state_dict

def filter_fec_duplicates(cash_df):
    bad_list = ["H2TX16185"]
    for campaign_id in bad_list:
        cash_df = cash_df[cash_df[0]!=campaign_id]
    return cash_df

def build_all(fec_df,party='DEM'):
    print("Cleaning duplicates from the FEC data")
    fec_df = filter_fec_duplicates(fec_df)
    print("Borrowing some data from Nate Silvers...")
    states = build_all_from_538(party)
    print("Building in FEC campaign finance details...")
    for state in states.values():
        state.build_from_FEC(fec_df)
    print("Pickling data as all_states.pickle")
    with open('all_states.pickle', 'wb') as handle:
        pickle.dump(states, handle, protocol=pickle.HIGHEST_PROTOCOL)
    print("Done!")
    return states

def gen_full_pvi_scatter(states):
    pvi_list = []
    share_list = []
    for state in states.values():
        for i,district in state.districts.items():
            pvi = district.json_538['pvi']
            share = district.funding_share()
            pvi_list.append(float(pvi))
            share_list.append(float(share))
    regr = linear_model.LinearRegression()
    shaped_share = np.array(share_list).reshape(-1,1)
    pvi_list = np.array(pvi_list).reshape(-1,1)
    regr.fit(shaped_share,pvi_list)

    trace = go.Scatter(
        x = 100*share_list,
        y = pvi_list,
        mode = 'markers'
    )
    trace2 = go.Scatter(
        x=share_list, 
        y=regr.predict(shaped_share),
        mode='lines',
        line=dict(color='blue', width=3)
    )

    data = [trace,trace2]
    layout = go.Layout(
        title=('Fundraising share by Cook PVI (Nationwide)'),
        showlegend=False,
        annotations=[
            dict(
                x=0.3,
                y=43,
                xref='x',
                yref='y',
                text='R squared = %.3f' % regr.score(shaped_share,pvi_list),
                showarrow=False,
            )],
            xaxis=dict(title='Share of Fundraising'),
            yaxis=dict(title='Cook PVI')
    )

    fig = go.Figure(data=data, layout=layout)

    # Plot and embed in ipython notebook!
    #plt.iplot(fig, filename='basic-scatter',show_link=False, config={'displayModeBar': False})
    return(plt.plot(fig, include_plotlyjs=True, output_type='div', config={'displayModeBar': False}, show_link=False)), regr
    #return linear_model.LinearRegression().fit(pvi_list,shaped_share)



def rebuild_fec(states, fec_df):
    "Builds out a State's dataframe with FEC data"
    for state in states.values():
        state.build_from_FEC(fec_df)
    return states

def rebuild_ftm(states, df_merged, incumbent_merged):
    "Builds out a State's dataframe with Follow The Money data"
    for state in states.values():
        state.build_from_FTM(df_merged, incumbent_merged)
    return states

def load(file):
    with open(file, 'rb') as handle:
        return pickle.load(handle)