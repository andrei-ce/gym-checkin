# App

GymPass-style backend application

## Basic setup

1. Run `npm install`
2. Create a .env file, following the example under .env.example. The main variable to
   change is the local database connection string. Add a username, password, port and
   name of your liking.
3. With docker installed locally, run `docker compose up -d`
4. Checkout some of the scripts at pagkage.json, but start with `npm run dev`
5. You can make any request to http://localhost:3333. Check some of the requests you
   can make under `./src/controllers/**/routes.ts`. We will soon add some examples.

## Functional requirements

- [x] It should be able to register
- [x] It should be able to authenticate
- [x] It should be able to get the logged user's profile
- [x] It should be able to show how many times a logged user has checked in
- [x] It should be able to get a user's check-in history
- [x] It should be able to show nearby gyms (< 10km)
- [x] It should be able to search for a specific gym by name
- [x] It should be able to check in a user into a gym
- [x] It should be able to validate a user's check-in
- [x] It should be able to register a new gym

## Business logic

- [x] User should not be able to register with an existing email
- [x] User should not be able to check-in > 1x per day
- [x] User should only be able to check into a gym that is <= 100m
- [x] Check-in should be validated <= 20 min after its been created
- [x] Check-in can only be validated by admins
- [x] The gym can only be registered by admins

## Non-functional requirements

- [x] User password must be encrypted
- [x] Service data should be persisted on a PostgreSQL db
- [x] All data listed should be paginated with limit = 20
- [x] User should be identified by JWT
