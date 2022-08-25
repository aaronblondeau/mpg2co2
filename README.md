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

## Deployment with pm2

In progress...

To start locally with PM2

```
pm2 start ecosystem.config.js
```

To stop locally with PM2

```
pm2 stop ecosystem.config.js
```