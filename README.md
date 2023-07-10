# App

GymPass-style backend application

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
- [] Check-in can only be validated by admins
- [] The gym can only be registered by admins

## Non-functional requirements

- [x] User password must be encrypted
- [x] Service data should be persisted on a PostgreSQL db
- [x] All data listed should be paginated with limit = 20
- [] User should be identified by JWT
