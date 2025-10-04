# SmartPump

**Author:** [Jorge Castillo](https://github.com/schorts99)

## Table of Contents

1. [Links](#links)
2. [Summary](#summary)
3. [Detailed Design](#detailed-design)
4. [Testing and Validation]()
5. [Future Considerations](#future-considerations)

## Links

- [Express](https://expressjs.com/)
- [ReactJS](https://react.dev/)
- [LowDB](https://github.com/typicode/lowdb)
- [TailwindCSS](https://tailwindcss.com/)
- [Value Objects](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/implement-value-objects)
- [JSON API](https://jsonapi.org/)
- [DAO](https://www.oscarblancarteblog.com/2018/12/10/data-access-object-dao-pattern/)
- [Unit Of Work](https://learn.microsoft.com/en-us/aspnet/mvc/overview/older-versions/getting-started-with-ef-5-using-mvc-4/implementing-the-repository-and-unit-of-work-patterns-in-an-asp-net-mvc-application#creating-the-unit-of-work-class)

## Summary

This document outlines a solution for the SmartPump code challenge, which involves creating a web app with `NodeJS` and `JavaScript` where users can login with their email and password, update their details and see their account balance.

## Context

We need to create an API that uses `[LowDB](https://github.com/typicode/lowdb)` as database and repliatecate the UI from the provided wireframe.

## Detailed Design

### Backend

Version the API since the beggining to prevent future issues.

#### Authentication

To authenticate an user we're only matching to email and password (not the best way but password are saved in plain text so we have to take this path).

Here's we're we implemente the DAO pattern to create a Criteria that matches both and returns it if match or null if it doesn't.

I choose to implement the DAO pattern because if in the future is neccesary to change the database we will only need to create a new implementation of the DAO and use change it without affecting the application.

Same with the Criteria, we're not tied to a specific query way. We only have to create the query executor for the new database implementation and everything else is untouched.

Then we create a `JWT` with the user ID and mark it as `httpOnly` to prevent that any malicious `JavaScript` can access to it.

Auth validations we're at application level to easily migrate if needed. Of this way the application services remain untouched even if the express part is replaced by anything else like nextjs, nest or any other stuff.

Middleware only verifies the token presence.

### Frontend

Start the project on the "client" folder with the `React Router` create package:

```bash
npx create-react-router@latest
```

This package creates a project with `TypeScript` but the requirements indicates that we should use `JavaScript` so we have to remove it and refactor files to only use `JavaScript`.

We're introducing API url and versioning since the beggining through env variables.

#### Login

To authenticate the user, we're requesting the API a `JWT` that only will be available to the API.

## Future Considerations

Add a dependency container to do the dependency injection through the container and be able to have for example a singleton for the AuthProviders and only request for auth once.

Not implemented directly to the possible change of the piece.

`JSONAPIConnector` will handle errors better in future releases.

#### Authentication

We're skipping some security issues due to the current data structure.

Skipped the refresh token feature.

**Notes:** A `isActive = false` use should be able to login? maybe it only indicates that the user has not being logged for a long time.

#### Profile

Don't know what to do with the menu button, obviously it should open a menu but I don't know what to put inside that menu so I'm going to make it a logout button for now.

Seems like the picture urls from the database are not available.

#### Balance

Didn't know if the balance button should show the balance or do something else so I leaved it as a button without action and show the balance below. Maybe the button allow the user to execute some actions related to the balance.

#### Editing details

As I don't have a clear idea about which details can be modified or what rules have every field to follow, I'm going to skip a some value objects and just add the ones where I have some idea about what value is valid and where I think it can be modified.

I didn't consider the username (email), phone and password fields due to unknown considerations. Like vallidations or side effects. Probably when updating the password we should send an email to revoke the change or something like. Same with username, probably the user should validate the username or phone after for the change to have effect.
