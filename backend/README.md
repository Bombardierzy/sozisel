# Sozisel Backend

This is an introduction file on how to setup backend environment.


## Modules

* `sozisel` - an API server written in elixir providing GraphQL API for managing the whole sozisel business logic
* `docker-jitsi-meet` - docker setup of jitsi meet, used only for embedding video conference in frontend app

## Instalation

First of all make sure you have `docker` and `docker-compose` installed.

Upon that you will need to install elixir, preferably via `asdf` as root folder
contains `.tool-versions` file specifing elixir and nodejs versions.

Tested with versions:
* `Docker version 20.10.5`
* `docker-compose version 1.28.5`
* `elixir 1.11.2-otp-23`  

For jitsi to work you have to create necessary directories: 
```bash
mkdir -p ~/.jitsi-meet-cfg/{web/letsencrypt,transcripts,prosody/config,prosody/prosody-plugins-custom,jicofo,jvb,jigasi,jibri}
```

Moreover, for development you will need to create and self-sign SSL certificate for Jitsy-Meet to work.

### Generating certificate

```
$ openssl req -newkey rsa:2048 -nodes -keyout key.pem -x509 -days 365 -out certificate.pem
```

Note that this certificate is not validated and thus may cause warnings in browser.

To trust self-signed certificate follow instructions below:

#### Debian (yes, ubuntu is built on debian)

```
$ apt install ca-certificates
$ cp certificate.pem /usr/local/share/ca-certificates/
$ update-ca-certificates
```

#### MacOS

```
$ security import certificate.pem -k ~/Library/Keychains/login.keychain-db
```

Then, find your certificate in Keychains, open it, expand the Trust section and change
the SSL setting to "Always Trust".



### After certificate generation

You have to rename certificate and key accordingly to:
```bash
mv certificate.pem cert.crt
mv key.pem cert.key
```

And after that move them to given directory (or any directory where you keep your jitsi configs): `~/.jitsi-meet-cfg/web/keys/`.


## Run

### Running general use docker-compose setup

In `backend` directory:
```bash
docker-compose up
```

### Running elixir server

In `backend/sozisel` directory:
```bash
mix deps.get
mix phx.server
```

### Running jitsi-meet docker-compose setup


In `backend` directory:
```bash
docker-compose -f jitsi-compose.yml --env-file .jitsi_env up
```

Jitsy by default will be available on port `8443`.


## IMPORTANT

File `.jitsy_env` is only meant for development as it contains secrets.
Be aware not to use it in produciton, ever.


