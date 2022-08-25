module.exports = {
    apps : [{
        name   : "mpg2co2-production",
        script: './index.js',
        watch: '.',
        env_production: {
            "PORT": 3001
        }
    }],
  
    deploy : {
        production : {
            user : 'root',
            host : '104.238.135.191',
            ref  : 'origin/main',
            repo : 'git@github.com:aaronblondeau/mpg2co2.git',
            path : '/var/www/mpg2co2_production',
            'post-setup': 'yarn install',
            'post-deploy' : 'pm2 reload ecosystem.config.js --env production',
        }
    }
};