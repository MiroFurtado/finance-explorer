from flask import Flask, jsonify
import bluebonnet as bb

#Load in the data
states_dem=bb.load('data/all_states_dem.pickle')
states = states_dem
states_rep=bb.load('data/all_states_rep.pickle')


app = Flask(__name__)

@app.route('/api/<state>/<party>/')
def get_report(state,party):
    states = states_dem if (party.upper()=="D") else states_rep
    return states[state.upper()].gen_report(states=states)

@app.route('/api/<state>/<party>/stack')
def get_stack(state,party):
    states = states_dem if (party.upper()=="D") else states_rep
    return states[state.upper()].gen_stack_graph()

@app.route('/api/<state>/<party>/coh')
def get_coh(state,party):
    states = states_dem if (party.upper()=="D") else states_rep
    return states[state.upper()].gen_coh_graph()

@app.route('/api/<state>/<party>/pvi-scatter')
def get_scatter(state,party):
    states = states_dem if (party.upper()=="D") else states_rep
    return states[state.upper()].gen_pvi_fundraising_scatter()

@app.route('/api/<state>/<party>/pvi-performance')
def get_performance(state,party):
    states = states_dem if (party.upper()=="D") else states_rep
    return states[state.upper()].gen_performance_graph()

@app.route('/api/<state>/<party>/incumbent-pie')
def get_incumbent_pie(state,party):
    states = states_dem if (party.upper()=="D") else states_rep
    return states[state.upper()].gen_incumbent_effect_pie()

@app.route('/api/<state>/<party>/incumbent-scatter')
def get_incumbent_scatter(state,party):
    states = states_dem if (party.upper()=="D") else states_rep
    return states[state.upper()].gen_incumbent_effect_scatter(in_percentile=80,ni_percentile=80)

@app.route('/api/<state>/sector/full')
def get__full_sector_bar(state):
    return states[state.upper()].gen_sector_viz()

@app.route('/api/<state>/sector/')
def get__sector_bar(state):
    return states[state.upper()].gen_sector_viz(industry_only=True)


@app.route('/api/<state>/cands/')
def get_candidates(state):
    return jsonify(candidates=bb.get_candidates(state))

@app.route("/")
def index():
    return "Working configuration! The interesting stuff is hidden behind /api/"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port='8080')
