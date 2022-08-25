module.exports = {
    apps : [{
        name   : "mpg2co2",
        script: './index.js',
        watch: '.'
    }],
  
    deploy : {
        staging : {
            user : 'TODO',
            host : 'TODO',
            ref  : 'origin/staging',
            repo : 'TODO',
            path : '/var/www/staging/mpg2co2',
            'post-setup': 'yarn install',
            'post-deploy' : 'pm2 reload ecosystem.config.js --env staging',
        }
    }
};
  