# Quantity Measurement Application - Frontend

A modern Angular-based web application for performing unit conversions and calculations across different measurement types including Length, Weight, Volume, and Temperature. This frontend provides an intuitive user interface for the Quantity Measurement System with user authentication and personalized calculation history.

## Overview

This application serves as the client-side interface for the Quantity Measurement API, enabling users to perform various measurement operations with a clean and responsive design. Built with Angular 21.2.6, it offers real-time calculations, user authentication via Google OAuth2, and secure session management.

## Key Features

- **Multi-Unit Support**: Convert and calculate across Length, Weight, Volume, and Temperature units
- **User Authentication**: Secure login with Google OAuth2 and traditional email/password
- **Personalized History**: Each user has their own private calculation history
- **Real-time Calculations**: Instant results for compare, convert, add, subtract, and divide operations
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Secure Communication**: JWT-based authentication with the backend API

## Supported Measurement Types

- **Length**: Feet, Inches, Yards, Centimeters
- **Weight**: Milligram, Gram, Kilogram, Pound, Tonne
- **Volume**: Litre, Millilitre, Gallon
- **Temperature**: Celsius, Fahrenheit, Kelvin

## Technology Stack

- Angular 21.2.6
- TypeScript
- RxJS for reactive programming
- Angular Router for navigation
- HttpClient for API communication
- Angular Forms for user input handling

## Project Structure

The application follows Angular best practices with a modular architecture, separating concerns into components, services, guards, and interceptors for maintainability and scalability.

---

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
