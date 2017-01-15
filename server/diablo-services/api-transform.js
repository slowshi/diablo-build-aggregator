/**
 * apiTransformationObject
 * Storage for configs of modelHelper
 * @type {Object}
 * */
var apiTransformationObject = {
  defaults: { // default config
    allowedArgs: {
      '*': true
    },
    modelMapping: []
  },
  getLadder: {
    allowedArgs: {
      row: {
        '*': {
          player: {
            heroBattleTag: true,
            heroId: true
          },
          data: {
            riftLevel: true,
            riftTime: true,
          },
          order: true
        }
      },
      greaterRift: true,
      greaterRiftSoloClass: true,
      season: true
    },
    modelMapping: []
  },
  getHero: {
    allowedArgs: {
      id: true,
      paragonLevel: true,
      hardcore: true,
      seasonal: true,
      skill:true,
      items: true,
      followers: true,
      stats: true
    },
    modelMapping: []
  }
};

module.exports = apiTransformationObject;

