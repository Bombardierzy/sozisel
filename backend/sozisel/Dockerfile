FROM elixir:1.12.3-alpine AS build

# install build dependencies
RUN \
    apk add --no-cache \
    inotify-tools \
    build-base \
    git \
    openssl-dev  

# Create build workdir
WORKDIR /app

# install hex + rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# set build ENV
ENV MIX_ENV=prod

# install mix dependencies
COPY mix.exs mix.lock ./
COPY config config
RUN mix do deps.get, deps.compile

COPY priv priv
RUN mix phx.digest

# compile and build release
COPY lib lib

RUN mix do compile, release

# prepare release image
FROM alpine:3.13 AS app

# install runtime dependencies
RUN \
    apk add --no-cache \
    inotify-tools \
    openssl \
    ncurses-libs \
    curl \
    libstdc++ \
    ffmpeg

WORKDIR /app

RUN chown nobody:nobody /app

USER nobody:nobody

COPY --from=build --chown=nobody:nobody /app/_build/prod/rel/sozisel ./

ENV HOME=/app

EXPOSE 4000

CMD ["bin/sozisel", "start"]