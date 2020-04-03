const express = require('express');
const router = express.Router();
const request = require('superagent');
const async = require('async');
const token = process.env.RIOT_LOL_API_KEY

// gets the most up-to-date version number of DDragon
router.get('/patch', (req, res) => {
    request.get('https://ddragon.leagueoflegends.com/api/versions.json')
    .type('json')
    .end((err, response) => {
        if(err) {
            return res.status(500).json(err);
        }
        res.status(200).json(response.body[0]);
    })
})

router.get('/search', (req, res) => {
    async.auto({
        get_summoner_id: function(callback) {
            request
            .get('https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + req.query.query)
            .set({
                'Content-Type': 'application/json',
                'X-Riot-Token': token
              })
            .query({
              q: req.query.query,
            })
            .end((err, response) => callback(err, response.body.id));
        },

        active_game: ['get_summoner_id', function(results, callback) {
            request.get('https://na1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/' + results.get_summoner_id)
            .set({
                'Content-Type': 'application/json',
                'X-Riot-Token': token
              })
              .end((err, response) => callback(err, response.body))
        }],

        champion_ids: ['active_game', function(results, callback) {
            var champions = results.active_game["participants"].map(summoner => summoner.championId)
            // console.log( champions)
            callback(null, champions)
        }],

        summoner_names: ['active_game', function(results, callback) {
            var names = results.active_game["participants"].map(summoner => summoner.summonerName)
            callback(null, names)
        }],

    },
    (err, results) => {
        if (err) {
          return res.status(500).json(err);
        }

        res.status(200).json(results);
    }
    );
  
//   .then(res => {
//       res.status(200).json(response.body);
//   })
//   .catch(err => {
//       if(err) {

//           return res.status(500).json(err);
//         }
//   });
});


router.get('/champion/:id', (req, res) => {
    async.auto({
        get_champion_name: function(callback) {
            // request.get('http://ddragon.leagueoflegends.com/cdn/' + req.query.patch + '/data/en_US/champion.json')
            request.get('http://ddragon.leagueoflegends.com/cdn/10.6.1/data/en_US/champion.json')
            .type('json')
            .end((err, response) => callback(err, Object.values(response.body['data']).filter(champion => champion.key == req.params.id)[0].id))
        },

        get_champion_data: ['get_champion_name', function(results, callback) {
            var name = results.get_champion_name.replace(/\s+|\.+/g, '')
            request.get('http://ddragon.leagueoflegends.com/cdn/10.6.1/data/en_US/champion/' + name + '.json')
            .type('json')
            .end((err, response) => {
                if(err) {
                    return res.status(500).json(err);
                }
                res.status(200).json(response.body.data);
            })
        }]
    },
        (err, results) => {
            if (err) {
            return res.status(500).json(err);
            }
            res.status(200).json(results.data);
        }
    )
})

router.get('/artist/:id', (req, res) => {
  async.auto({
    artist: function(callback) {
      request
      .get('https://api.spotify.com/v1/artists/' + req.params.id)
      .end((err, response) => callback(err, response.body));
    },
    albums: ['artist', (results, callback) => {
      request
      .get('https://api.spotify.com/v1/artists/' + req.params.id + '/albums')
      .query({
        album_type: 'album',
        limit: req.query.limit,
        offset: req.query.offset
      })
      .end((err, response) => {
        callback(err, {
          'items': response.body.items,
          'limit': response.body.limit,
          'offset': response.body.offset,
          'total': response.body.total
        });
      });
    }]
  }, (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(200).json(results);
  });
});

router.get('/album/:id', (req, res) => {
  request
  .get('https://api.spotify.com/v1/albums/' + req.params.id)
  .end((err, response) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(200).json(response.body);
    
  });
});

module.exports = router;