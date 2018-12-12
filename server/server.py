from flask import Flask, jsonify, request, url_for
import bluebonnet as bb
import markdown2

#Load in the data directly to memory from pickles. In the future, we'll have a database to interface with.
states_dem=bb.load('data/all_states_dem.pickle')
states_rep=bb.load('data/all_states_rep.pickle')
states = states_dem

plot_cache = dict()
saved_plots = dict()




app = Flask(__name__)

@app.route('/api/save/<state>/<party>/<graph>',methods=['POST', 'GET'])
def save_graph(state,party,graph,session="dev-session"):
    state,party=state.lower(),party.lower()
    note = ""
    if request.method == 'POST':
        note += markdown2.markdown(request.form['note'])
    

    if(not (graph+state+party) in plot_cache):
        return "<h1>Graph has not been created yet! Try asking for the graph before API requesting a save</h1>"
    if session in saved_plots:
        saved_plots[session].append((plot_cache[graph+state+party],note))
    else:
        saved_plots[session] = [(plot_cache[graph+state+party],note)]
    return "<b>Saved!</b>"

@app.route('/api/show',methods=['POST', 'GET'])
def display_saved(session="dev-session"):
    to_ret = "<link href='https://fonts.googleapis.com/css?family=Quicksand:300,400,700' rel='stylesheet' type='text/css'><link href='https://fonts.googleapis.com/css?family=Lato:400,400italic,900' rel='stylesheet' type='text/css'><link rel='stylesheet' type='text/css' href="+url_for('static', filename='report.css')+">"
    if session not in saved_plots:
        return "<p>You haven't saved any graphs!</p>"
    for graph,note in saved_plots[session]:
        to_ret += note
        to_ret += graph
    return to_ret

@app.route('/api/clear')
def clear_saved(session="dev-session"):
    if session not in saved_plots: return "Nothing to clear!"
    saved_plots[session] = []
    return "Cleared!"


@app.route('/api/<state>/<party>/')
def get_report(state,party):
    state,party=state.lower(),party.lower()
    if not state.upper() in states_dem:
        return "<h1>Invalid access!</h1>"
    states = states_dem if (party.upper()=="D") else states_rep
    return states[state.upper()].gen_report(states=states)

@app.route('/api/<state>/<party>/stack')
def get_stack(state,party):
    state,party=state.lower(),party.lower()
    if not state.upper() in states_dem:
        return "<h1>Invalid access!</h1>"
    if(not (("stack"+state+party) in plot_cache)):
        print("Cache miss on stack for %s %s"%(state,party))
        states = states_dem if (party.upper()=="D") else states_rep
        plot_cache["stack"+state+party] = states[state.upper()].gen_stack_graph()
    return plot_cache["stack"+state+party]

@app.route('/api/<state>/<party>/coh')
def get_coh(state,party):
    state,party=state.lower(),party.lower()
    if not state.upper() in states_dem:
        return "<h1>Invalid access!</h1>"
    if(not (("coh"+state+party) in plot_cache)):
        print("Cache miss on coh for %s %s"%(state,party))
        states = states_dem if (party.upper()=="D") else states_rep
        plot_cache["coh"+state+party] = states[state.upper()].gen_coh_graph()
    return plot_cache["coh"+state+party]

@app.route('/api/<state>/<party>/pvi-scatter')
def get_scatter(state,party):
    state,party=state.lower(),party.lower()
    if not state.upper() in states_dem:
        return "<h1>Invalid access!</h1>"
    if(not (("pvi-scatter"+state+party) in plot_cache)):
        print("Cache miss on pvi for %s %s"%(state,party))
        states = states_dem if (party.upper()=="D") else states_rep
        plot_cache["pvi-scatter"+state+party] = states[state.upper()].gen_pvi_fundraising_scatter(states=states)
    return plot_cache["pvi-scatter"+state+party]

@app.route('/api/<state>/<party>/pvi-performance')
def get_performance(state,party):
    state,party=state.lower(),party.lower()
    if not state.upper() in states_dem:
        return "<h1>Invalid access!</h1>"
    if(not (("pvi-performance"+state+party) in plot_cache)):
        print("Cache miss on perf graph for %s %s"%(state,party))
        states = states_dem if (party.upper()=="D") else states_rep
        plot_cache["pvi-performance"+state+party] = states[state.upper()].gen_performance_graph()
    return plot_cache["pvi-performance"+state+party]

@app.route('/api/<state>/<party>/incumbent-pie')
def get_incumbent_pie(state,party):
    state,party=state.lower(),party.lower()
    if not state.upper() in states_dem:
        return "<h1>Invalid access!</h1>"
    if(not (("incumbent-pie"+state+party) in plot_cache)):
        print("Cache miss on inc pie graph for %s %s"%(state,party))
        states = states_dem
        plot_cache["incumbent-pie"+state+party] = states[state.upper()].gen_incumbent_effect_pie()
    return plot_cache["incumbent-pie"+state+party]


@app.route('/api/<state>/<party>/incumbent-scatter')
def get_incumbent_scatter(state,party):
    state,party=state.lower(),party.lower()
    if not state.upper() in states_dem:
        return "<h1>Invalid access!</h1>"
    if(not (("incumbent-scatter"+state+party) in plot_cache)):
        print("Cache miss on inc scatter graph for %s %s"%(state,party))
        states = states_dem
        plot_cache["incumbent-scatter"+state+party] = states[state.upper()].gen_incumbent_effect_scatter(in_percentile=80,ni_percentile=80)
    return plot_cache["incumbent-scatter"+state+party]

@app.route('/api/<state>/<party>/sector/full')
def get__full_sector_bar(state,party):
    if not state.upper() in states_dem:
        return "<h1>Invalid access!</h1>"
    state,party=state.lower(),party.lower()
    states = states_dem# if (party.upper()=="D") else states_rep
    return states[state.upper()].gen_sector_viz()

@app.route('/api/<state>/<party>/sector/')
def get__sector_bar(state,party):
    state,party=state.lower(),party.lower()
    if not state.upper() in states_dem:
        return "<h1>Invalid access!</h1>"
    if(not (("sector"+state+party) in plot_cache)):
        print("Cache miss on sector graph for %s %s"%(state,party))
        states = states_dem
        plot_cache["sector"+state+party] = states[state.upper()].gen_sector_viz(industry_only=True)
    return plot_cache["sector"+state+party]


@app.route('/api/<state>/cands/')
def get_candidates(state):
    return jsonify(candidates=bb.get_candidates(state))

@app.route("/")
def index():
    return "Working configuration! The interesting stuff is hidden behind /api/"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port='8080')
