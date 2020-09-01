function from_final_votes(votes){
    nj_pick = 0;
    lsdn_pick = 0;
    // Max final vote
    index = votes.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    if(index <= 2){
        nj_pick += 1;
    }else{
        lsdn_pick += 1;
    }
    // Max total final vote
    nj_points = votes.slice(0,3).reduce((total,x) => total+x)
    lsdn_points = votes.slice(3).reduce((total,x) => total+x)
    if(nj_points < lsdn_points){
        lsdn_pick += 2;
    }else{
        nj_pick += 2;
    }
    return [nj_pick,lsdn_pick]
}

function from_past_votes(votes){
    nj_pick = 0;
    lsdn_pick = 0;
    nj_points = 0;
    lsdn_points = 0;
    for(i=0;i<27;i++){
        point = votes[i]
        if(past[i]['nj_weight']+past[i]['lsdn_weight']>0){
            nj_points += point*past[i]['nj_weight']/(past[i]['nj_weight']+past[i]['lsdn_weight'])
            lsdn_points += point*past[i]['lsdn_weight']/(past[i]['nj_weight']+past[i]['lsdn_weight'])
        }
    }

    if(nj_points > lsdn_points){
        nj_pick += 2;
    }else{
        lsdn_pick += 2;
    }
    return [nj_pick, lsdn_pick]
}

function from_personal_votes(votes){
    nj_pick = 0
    lsdn_pick = 0
    nj_points = votes.slice(0,7).reduce((total,x) => total+x)
    lsdn_points = votes.slice(7).reduce((total,x) => total+x)
    if(nj_points > lsdn_points){
        nj_pick += 1;
    }else{
        lsdn_pick += 1;
    }
    return [nj_pick, lsdn_pick]
}

function get_final_result(final, past, team){
    n1 = from_final_votes(final);
    n2 = from_past_votes(past);
    n3 = from_personal_votes(team);
    nj_pick = n1[0]+n2[0]+n3[0];
    lsdn_pick = n1[1]+n2[1]+n3[1];
    nj_team_list = nj_team.map((name,i) => {return {"name": name, "votes": team[i]}}).sort((a,b) => b.votes-a.votes)
    lsdn_team_list = lsdn_team.map((name,i) =>{return {"name": name, "votes": team[7+i]}}).sort((a,b) => b.votes-a.votes)
    return {
        'nj_team_list':nj_team_list,
        'lsdn_team_list':lsdn_team_list,
        'nj_pick': nj_pick,
        'lsdn_pick': lsdn_pick,
        'final_team': nj_team_list.slice(0,nj_pick).concat(lsdn_team_list.slice(0,lsdn_pick))
    }
}
