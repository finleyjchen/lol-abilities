module.exports = {
    env: {
        RIOT_LOL_API_KEY: 'RGAPI-1f54c385-2a79-4d41-8124-bf922c7f3394',
    },
    webpack: (config, { isServer }) => {
        // Fixes npm packages that depend on `fs` module
        if (!isServer) {
          config.node = {
            fs: 'empty'
          }
        }
    
        return config
      }
  }