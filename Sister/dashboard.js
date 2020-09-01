url = 'https://act.api.mgtv.com/api/v1/cfpldjj/getRank'

function get_num(response){
    data = response.data.data
    data.sort((a,b) => parseInt(a.id.replace('rank',''))-parseInt(b.id.replace('rank','')) )
    return data.map(d => d.num)
}

new Vue({
  el: '#app',
  data () {
    return {
      final_result: null
    }
  },
  mounted () {

    const requestfinal = axios.get(url,{params:{'_support': 10000000, 'type': 'final'}});
    const requestpast = axios.get(url,{params:{'_support': 10000000, 'type': 'past'}});
    const requestteam = axios.get(url,{params:{'_support': 10000000, 'type': 'team'}});
    axios.all([requestfinal, requestpast, requestteam]).then(axios.spread((...responses) => {
        console.log(responses[0])
        const final = get_num(responses[0])
        const past = get_num(responses[1])
        const team = get_num(responses[2])

        this.final_result = get_final_result(final,past,team)
    })).catch(errors => {
        console.log(errors)
    })
    /*
    const final = [133921,398988,242066,96344,246583,453266]
    const past = [231110,5151,19512,15118,70136,2685,10497,80590,3431,4394,2149,233682,9720,19292,18537,2965,26427,11384,32872,5058,12800,22572,5466,4798,29342,32141,453534]
    const team = [143196,56274,53239,249785,147497,67744,51311,202934,66060,121233,227541,20669,121894,123406]
    this.final_result = get_final_result(final,past,team)
    */
  }
})