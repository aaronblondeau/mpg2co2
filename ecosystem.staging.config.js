module.exports = {
    apps : [{
        name   : "mpg2co2",
        script: './index.js',
        watch: '.',
        env_staging: {
            "PORT": 3000
        }
    }],
  
    deploy : {
        staging : {
            user : 'root',
            host : '104.238.135.191',
            key  : '.\github_action_key',
            ref  : 'origin/staging',
            repo : 'git@github.com:aaronblondeau/mpg2co2.git',
            path : '/var/www/mpg2co2',
            'post-setup': 'yarn install',
            'post-deploy' : 'pm2 reload ecosystem.staging.config.js --env staging',
        }
    }
};