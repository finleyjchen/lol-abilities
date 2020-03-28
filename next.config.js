module.exports = {
    env: {
        RIOT_LOL_API_KEY: 'RGAPI-bdda7360-5b43-4ae7-aeb0-064fb6af547e',
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