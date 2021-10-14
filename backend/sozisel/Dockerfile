FROM elixir:alpine

# Install required libraries on Alpine
# note: build-base required to run mix “make” for
# one of my dependecies (bcrypt)
RUN apk update && apk upgrade && \
    apk add postgresql-client && \
    apk add build-base && \
    apk add ffmpeg && \
    rm -rf /var/cache/apk/*

ENV MIX_ENV prod

# Install hex package manager and rebar
RUN mix do local.hex --force \
    mix do local.rebar --force

# Create the application build directory
RUN mkdir /app
COPY . ./app
WORKDIR /app

RUN chmod +x entrypoint.sh
CMD ["./entrypoint.sh"] 