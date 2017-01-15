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
      class: true,
      paragonLevel: true,
      hardcore: true,
      seasonal: true,
      skill:{
        active: {
          '*' : {
            skill: {
              slug: true,
              name: true,
              icon: true,
              tooltipUrl: 'tooltipParams',
            },
            rune: {
              slug: true,
              name: true,
              tooltipParams: true,
            }
          }
        }
      },
      items: {
        '*' : {
          id: true,
          tooltipParams:true,
          setItemsEquipped: true,
        }
      },
      followers: {
        '*': {
          slug: true,
          items: {
            '*': {
              id: true,
              tooltipParams: true,
            }
          },
          skills: {
            '*' : {
              skill: {
                slug: true,
                name: true,
                icon: true,
                tooltipUrl: true
              }
            }
          }
        }
      },
      stats: true,
      legendaryPowers: {
        '*' : {
          id: true
        }
      }
    },
    modelMapping: []
  },
  getItem: {
    allowedArgs: {
      id: true,
      name: true,
      icon: true,
      displayColor: true,
      tooltipParams: true,
      slots: true,
      set: {
        name: true,
        items:{
          '*' : {
            id: true
          }
        }, 
        slug: true,
        ranks: {
          '*': {
            required: true
          }
        }
      },
    }
  }
};

module.exports = apiTransformationObject;

