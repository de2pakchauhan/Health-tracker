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

// ======================================
// Date Helpers
// ======================================

function formatDate(date){

    return new Date(date).toLocaleDateString(
        "en-GB",
        {
            day:"2-digit",
            month:"short"
        }
    );

}

function daysBetween(a,b){

    const one=86400000;

    return Math.round(

        (new Date(b)-new Date(a))/one

    );

}

// ======================================
// Moving Average
// ======================================

function movingAverage(data,windowSize=7){

    const result=[];

    for(let i=0;i<data.length;i++){

        const start=Math.max(0,i-windowSize+1);

        const slice=data.slice(start,i+1);

        result.push(

            average(slice)

        );

    }

    return result;

}

// ======================================
// Trend
// ======================================

function trend(first,last){

    if(first==null || last==null)
        return 0;

    return round(last-first,2);

}


