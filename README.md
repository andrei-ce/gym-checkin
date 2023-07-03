# App

GymPass-style backend application

## Functional requirements

- [] A user should be able to register
- [] A user should be able to authenticate
- [] Service should be able to get the logged user's profile
- [] Service should be able to show how many times a logged user has checked in
- [] Service should be able to get their check-in history
- [] Service should be able to show nearby gyms
- [] User should be able to search for a specific gym by name
- [] User should be able to check into a gym
- [] Service should be able to validate a user's check-in
- [] Admin should be able to register a new gym

## Business logic

- [] User should not be able to register with an existing email
- [] User should only be able to check into a gym that is <= 100m
- [] User should not be able to check-in > 1x per day
- [] Check-in should be validated <= 20 min after its been created
- [] Check-in can only be validated by admins
- [] The gym can only be registered by admins

## Non-functional requirements

- [] User password must be encrypted
- [] Service data should be persisted on a PostgreSQL db
- [] All data listed should be paginated with limit = 20
- [] User should be identified by JWT