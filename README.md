# mpg2co2

This is a small sample application used to experiment with various application deployment methods.

Data From : https://www.fueleconomy.gov/feg/download.shtml

Live Url : https://mpg2co2.com

## Database

The database for this application is hosted on bit.io : https://bit.io/aaronblondeau/mpg2co2

## Development

```
yarn install
yarn dev
```

## Local PM2

To start locally with PM2

```
pm2 start ecosystem.config.js
```

To stop locally with PM2

```
pm2 stop ecosystem.config.js
```

## Hosting on Vultr w/ Caddy and PM2

### Staging

1) Deploy new instance
- Cloud Compute
- Intel Regular Performance
- New York
- Debian 11
- $3.50 Box
- No Backups
- Added id_ed25519.pub key
- hostname & label : staging.mpg2co2.com
