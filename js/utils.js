// ======================================
// Number Helpers
// ======================================

function round(value,digits=1){

    return Number(value.toFixed(digits));

}

function average(arr){

    if(arr.length===0) return null;

    return arr.reduce((a,b)=>a+b,0)/arr.length;

}

function sum(arr){

    return arr.reduce((a,b)=>a+b,0);

}

function clamp(v,min,max){

    return Math.min(max,Math.max(min,v));

}

function percent(current,total){

    if(!total) return 0;

    return Math.round(current/total*100);

}
