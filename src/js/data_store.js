
function DataStore(){
  this.rules = [];
  this.options = {};
  return this;
}

DataStore.prototype = {
  load: function(dataCb, optionCb){
    chrome.storage.local.get('rules', function(items) {
      if (items.rules)
      {
        this.rules = JSON.parse(items.database);
      }

      if(dataCb.constructor == Function){
        dataCb();
      }
    });

    chrome.storage.local.get('options', function(items) {
      if (items.options)
      {
        this.options = JSON.parse(items.option);
      }

      if(optionCb && optionCb.constructor == Function){
        optionCb();
      }

    });
  },

  save: function(){
    var dbString = JSON.stringify(this.rules);
    chrome.storage.local.set({'rules': dbString}, function() {
      // Notify that we saved.
    });

    var sOption = JSON.stringify(this.options);
		chrome.storage.local.set({'options': sOption}, function() {
		});
  },

  setOption: function(key, val){
    this.options[key] = val;
  },

  getOption: function(key){
    return this.options[key];
  }
}

var store = new DataStore();

export default store;
