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

#### 1. Deploy new instance
- Cloud Compute
- Intel Regular Performance
- New York
- Debian 11
- $3.50 Box
- No Backups
- Added id_ed25519.pub key
- hostname & label : staging.mpg2co2.com

Note - Had to re-apply ssh key after first install

#### 2. Install caddy : https://caddyserver.com/docs/install#debian-ubuntu-raspbian

```
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

#### 3. Configure firewall

```
sudo ufw allow 80
sudo ufw allow 443
```

Also added and applied "web" firewall group (allows : ssh, http, https, 3000)

#### 4. Install node

```
sudo apt update
curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
sudo apt -y install nodejs
```

#### 5. Install pm2 and yarn

```
npm install -g yarn pm2
```

#### 6. Configure PM2 to run on startup : https://pm2.keymetrics.io/docs/usage/startup/

```
pm2 startup
```

#### 7. Install git and setup ssh key

```
sudo apt -y install git
```

Setup key so machine can access git https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account
https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent

```
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Then copy contents of ~/.ssh/id_ed25519.pub into a new SSH key in GitHub user account settings.

Run a test clone to accept github fingerprint.

```
cd
git clone git@github.com:aaronblondeau/mpg2co2.git
rm -Rf mpg2co2
```

#### 8. Create app directory

```
mkdir /var/www
```

#### 9. Configure env vars

Add to .bashrc

```
export PGHOST=db.bit.io
export PGUSER=HIDDEN
export PGPASSWORD=HIDDEN
export PGPORT=5432
export PGDATABASE=HIDDEN
export PGSSL=yes
```

#### 10. Run PM2 setup and deploy

These commands are run from your local development environment in the same directory as this readme.

Note, if on Windows, you may get a "spawn sh ENOENT" error.  You can resolve this by making sure "sh" is in your path : https://github.com/Unitech/pm2/issues/3839#issuecomment-484347776

```
pm2 deploy ecosystem.staging.config.js staging setup
```

```
pm2 deploy ecosystem.staging.config.js staging
```

#### 11. Setup DNS records

Do this first, before configuring Caddyfile, so that it can complete the Let's Encrypt SSL setup on the first go.

A : staging -> 104.238.135.191

#### 12. Configure caddyfile reverse proxy

Back on the server, add the following to /etc/caddy/Caddyfile

```
staging.mpg2co2.com {
	reverse_proxy localhost:3000
}
```

Reload caddy (run this in /etc/caddy)

```
sudo caddy reload
```

### Production

Production deploy was done on staging box (different port and caddyfile entry) to save $.

```
pm2 deploy ecosystem.production.config.js production
```

For production domain setup A record for @ and www, and did www strip in Caddyfile:

```
mpg2co2.com {
        reverse_proxy localhost:3001
}

www.mpg2co2.com {
        redir https://mpg2co2.com{uri}
}
```