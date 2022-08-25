module.exports = {
    apps : [{
        name   : "mpg2co2",
        script: './index.js',
        watch: '.'
    }],
  
    deploy : {
        staging : {
            user : 'TODO',
            host : '104.238.135.191',
            ref  : 'origin/staging',
            repo : 'git@github.com:aaronblondeau/mpg2co2.git',
            path : '/var/www/staging/mpg2co2',
            'post-setup': 'yarn install',
            'post-deploy' : 'pm2 reload ecosystem.config.js --env staging',
        }
    }
};
  