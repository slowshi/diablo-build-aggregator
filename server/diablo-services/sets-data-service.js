var _ = require('lodash');
var Promise = require('promise');
var itemDataService = require('./item-data-service.js');
var heroDataService = require('./hero-data-service.js');
var allHeroes = {};
var allSets = [];
var allItemIds = [];
var allItems = {};
var heroSets = {};

var heroGear = [];
var popularItems = {};
var popularGearSets = [];
var addToAllSets = function addToAllSets(heroSet) {
  var hasSet = false;
  for(var j in allSets) {
    var validSet = allSets[j];
    if(_.isEqual(validSet.sets, heroSet.sets)) {
      validSet.heroIds.push(heroSet.heroId);
      hasSet = true;
    }
  }
  if(!hasSet) {
    allSets.push({
      sets: heroSet.sets,
      heroIds: [heroSet.heroId]
    });
  }
}
var findSetSlug = function findSetSlug(wornSet, heroId) {
  var slug = allItems[wornSet[0]].set.slug;
  if(heroSets[slug] == void 0) {
    heroSets[slug] = {};
  }
  if(heroSets[slug][wornSet.length] == void 0) {
    heroSets[slug][wornSet.length] = {
      heroes: [],
      popularItemBuild: {
        head: [],
        torso: [],
        feet: [],
        hands: [],
        shoulders: [],
        legs: [],
        bracers: [],
        mainHand: [],
        offHand: [],
        waist: [],
        rightFinger: [],
        leftFinger: [],
        neck: []
      }
    };
  }
  heroSets[slug][wornSet.length].heroes.push(allHeroes[heroId]);
}
var findHeroSets = function getHeroItems(data) {
  var heroSets = [];
  for(var i in data.items) {
    var item = data.items[i];
    if(item.setItemsEquipped !== void 0) {
      var set = item.setItemsEquipped.sort();
      var hasSet = false;
      for(var j in heroSets) {
        if(_.isEqual(heroSets[j], set)) {
          hasSet = true;
        }
      }
      if (!hasSet) { 
        findSetSlug(set,data.id);
        heroSets.push(set);
      }
    }
  }
}
var getPopularItems = function getPopularItems() {
  for(var i in heroSets) {
    var setName = heroSets[i];
    for(var j in setName) {
      var setCount = setName[j];
      for(var k in setCount.heroes) {
        var heroItems = setCount.heroes[k].items;
        for(var m in heroItems) {
          var slot = m;
          var item = heroItems[m];
          var popularSlot = setCount.popularItemBuild[slot];
          var hasSetItem = false;
          for(var n in popularSlot) {
            var popularItem = popularSlot[n];
            if(popularItem.id == item.id) {
              hasSetItem = true;
              popularItem.count++;
            }
          } 
          if (!hasSetItem) { 
            var genericItem = itemDataService.getItem(item.id);
            genericItem.count = 1;
            popularSlot.push(genericItem);
          }
        }
      }
    }
  }
  sortPopularItems();
}
var sortPopularItems = function sortPopularItems() {
  for(var i in heroSets) {
    var setName = heroSets[i];
    for(var j in setName) {
      var setCount = setName[j];
      for(var k in setCount.heroes) {
        var heroItems = setCount.heroes[k].items;
        for(var m in heroItems) {
          var slot = m;
          var popularSlot = setCount.popularItemBuild[slot];
          popularSlot.sort(function(a, b){
            return a.count < b.count;
          });
        }
      }
    }
  }
}
var rankGearSet = function(gearSet) {
  var rank = 0;
  for(var j in gearSet) {
    var gearSetItemId = gearSet[j];
    for(var i in popularItems) {
      var itemId = popularItems[i].id;
      var itemRank = popularItems[i].rank;
      if(gearSetItemId == itemId) {
        rank += itemRank;
      }
    }
  }
  rank = Math.floor(rank/gearSet.length);
  return rank;
}
var getHeroGear = function getHeroGear(heroData) {
  var gearSet = [];
  for(var i in heroData.items) {
    var item = heroData.items[i];
    gearSet.push(item.id)
    
  }
  if(heroData.legendaryPowers !== void 0) {
    gearSet = gearSet.concat(heroData.legendaryPowers)
  }
  if(gearSet.length < 15) return;
  var hasSet = false;
  for(var j in popularGearSets) {
    gearSet = gearSet.sort();
    if(_.isEqual(popularGearSets[j].set, gearSet)){
      hasSet = true;
      popularGearSets[j].heroes.push(heroData.id);
    }
  }
  if(!hasSet) {
    var newGearSet = {
      set: gearSet,
      heroes: [heroData.id],
      rank: rankGearSet(gearSet)
    };
    popularGearSets.push(newGearSet)
  }
};
var parsePopularGearSets = function parsePopularGearSet() {
  console.log('do this')
    var rankings = [];
    for(var i in popularGearSets) {
      rankings.push(popularGearSets[i].rank)
    }
    rankings = _.uniq(rankings).sort(function(a,b){
      return a - b;
    });
    for(var j in popularGearSets) {
      var item = popularGearSets[j];
      item.rank = rankings.indexOf(item.rank) + 1;
    }
    popularGearSets = popularGearSets.sort(function(a, b){
      return parseInt(a.rank) - parseInt(b.rank);
    });
    console.log('don')
    for(var j in popularGearSets) {
      var item = popularGearSets[j];
      console.log(item.rank)
    }
    // for(var o = popularGearSets.length; o >= 0; o--) {
    //   var set = popularGearSets[o];
    //   console.log(set.rank);
    //   // if(popularGearSets[o].heroes.length < 10 && popularGearSets[o].rank > 2) {
    //   //   popularGearSets.slice(i, 1);
    //   // }
    // }
}
var parseHeroSets = function parseHeroSets() {
  for(var i in allHeroes) {
    var heroData = allHeroes[i];
    //findHeroSets(heroData);
    getHeroGear(heroData);
  }
  parsePopularGearSets();
  //  popularGearSets = popularGearSets.sort(function(a, b){
  //   return parseInt(a.rank) - parseInt(b.rank);
  // });
  // console.log(popularGearSets);

}
var parsePopularItems = function() {
    popularItems = popularItems.sort(function(a, b){
      return parseInt(a.count) - parseInt(b.count);
    }).reverse();
    var rankings = [];
    for(var i in popularItems) {
      rankings.push(popularItems[i].count)
    }
    rankings = _.uniq(rankings).sort(function(a,b){
      return a - b;
    }).reverse();
    for(var j in popularItems) {
      var item = popularItems[j];
      item.rank = rankings.indexOf(item.count);
    }
}
var init = function init(){
  return new Promise(function (resolve, reject) {
    allItems = itemDataService.getAllItems();
    allSets = itemDataService.getAllSets();
    allHeroes = heroDataService.getAllHeroes();
    popularItems = heroDataService.getPopularItems();
    parsePopularItems();
    parseHeroSets();
    resolve();
  });
};
var getHeroSets = function getHeroSets(slug) {
  if (slug === '') { 
    return _.cloneDeep(heroSets);
  }
  return _.cloneDeep(heroSets[slug]);
}
var getPopularGearSets = function getPopularGearSets() {
  console.log("GET POPULAR SETS");
  var top10 = [];
  for(var i in popularGearSets) {
    if(popularGearSets[i].rank <= 5) {
      top10.push(popularGearSets[i])
    }
  }
  console.log(top10);
  return top10;
}
module.exports = {
  init: init,
  getHeroSets: getHeroSets,
  getPopularGearSets: getPopularGearSets
};