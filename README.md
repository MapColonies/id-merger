# id-merger

----------------------------------

![badge-alerts-lgtm](https://img.shields.io/lgtm/alerts/github/MapColonies/id-merger?style=for-the-badge)

![grade-badge-lgtm](https://img.shields.io/lgtm/grade/javascript/github/MapColonies/id-merger?style=for-the-badge)

![snyk](https://img.shields.io/snyk/vulnerabilities/github/MapColonies/id-merger?style=for-the-badge)

----------------------------------

This repo is a RESTful service for getting a matching between ids between `external-id` (external feature id) and `osm-id`, this service is part of sync workflow between external sources to OSM DB.

## Installation

Install deps with npm

```bash
npm install
```

### Install Git Hooks
```bash
npx husky install
```

## Run Locally

Clone the project

```bash

git clone https://github.com/MapColonies/id-merger.git

```

Go to the project directory

```bash

cd id-merger

```

Install dependencies

```bash

npm install

```

Start the server

```bash

npm run start

```

## Running Tests

To run tests, run the following command

```bash

npm run test

```

To only run unit tests:
```bash
npm run test:unit
```

To only run integration tests:
```bash
npm run test:integration
```
