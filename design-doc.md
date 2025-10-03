# SmartPump

**Author:** [Jorge Castillo](https://github.com/schorts99)

## Table of Contents

1. [Links](#links)
2. [Summary](#summary)
3. [Detailed Design](#detailed-design)

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


