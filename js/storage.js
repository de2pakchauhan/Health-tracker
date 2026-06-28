const Storage={

saveTarget(weight){

localStorage.setItem(

CONFIG.STORAGE_KEY,

weight

);

},

loadTarget(){

return Number(

localStorage.getItem(

CONFIG.STORAGE_KEY

)

)||CONFIG.TARGET_WEIGHT;

}

};
