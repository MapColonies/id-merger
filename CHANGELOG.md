# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.3.3](https://github.com/MapColonies/id-merger/compare/v1.3.2...v1.3.3) (2022-08-14)


### Bug Fixes

* helm changes ([106d52b](https://github.com/MapColonies/id-merger/commit/106d52bbde01f92b45639e9471692922fe3da1a9))

### [1.3.2](https://github.com/MapColonies/id-merger/compare/v1.3.1...v1.3.2) (2022-06-15)

### [1.3.1](https://github.com/MapColonies/id-merger/compare/v1.3.0...v1.3.1) (2022-06-15)

## [1.3.0](https://github.com/MapColonies/id-merger/compare/v1.2.1...v1.3.0) (2021-08-25)


### Features

* **configurations:** add helm chart for service ([#33](https://github.com/MapColonies/id-merger/issues/33)) ([830498e](https://github.com/MapColonies/id-merger/commit/830498e55196019f13d0018643b1e811ce961696))

### [1.2.1](https://github.com/MapColonies/id-merger/compare/v1.2.0...v1.2.1) (2021-07-06)

## [1.2.0](https://github.com/MapColonies/id-merger/compare/v1.1.3...v1.2.0) (2021-07-01)


### Features

* added traceparent header on response ([#36](https://github.com/MapColonies/id-merger/issues/36)) ([a6af72d](https://github.com/MapColonies/id-merger/commit/a6af72d188461d0b0f1a617ed3b691742e86f6b3))

### [1.1.3](https://github.com/MapColonies/id-merger/compare/v1.1.2...v1.1.3) (2021-06-07)


### Bug Fixes

* **configurations:** changed how server is initialized ([#27](https://github.com/MapColonies/id-merger/issues/27)) ([af5162a](https://github.com/MapColonies/id-merger/commit/af5162a485eb84950239d9b43707d14a2dbded56))

### [1.1.2](https://github.com/MapColonies/id-merger/compare/v1.1.1...v1.1.2) (2021-06-06)


### Features

* **configurations:** updates openapi3 version on release ([18abcea](https://github.com/MapColonies/id-merger/commit/18abcead2c5b8b63430715d10dac62fca396ae9b))


### Bug Fixes

* **configurations:** fixed broken liveness ([#26](https://github.com/MapColonies/id-merger/issues/26)) ([b88ad75](https://github.com/MapColonies/id-merger/commit/b88ad75f347383bf9d1322e4bd3ac57a0184f798))
* **configurations:** update and rename .versionrc ([ebb706b](https://github.com/MapColonies/id-merger/commit/ebb706be288bf45c4a6870ff6de1abbde9c965f5))

### [1.1.1](https://github.com/MapColonies/id-merger/compare/v1.1.0...v1.1.1) (2021-05-05)


### Bug Fixes

* **configurations:** ignore no-empty-servers ([a51b9df](https://github.com/MapColonies/id-merger/commit/a51b9dfe2c6d324dc98791149e76a5ee4dd5b0af))

## [1.1.0](https://github.com/MapColonies/id-merger/compare/v1.0.0...v1.1.0) (2021-05-05)


### Features

* **configurations:** added otel support of tracing and metrics ([#20](https://github.com/MapColonies/id-merger/issues/20)) ([3813907](https://github.com/MapColonies/id-merger/commit/381390760ad2fe637a219f53609da25144c08cf0))


### Bug Fixes

* **configurations:** removed servers list from openapi3.yml ([609504f](https://github.com/MapColonies/id-merger/commit/609504f4c7d4579e5c9cfdb3ebaf2cb8c84ee177))

## 1.0.0 (2021-05-03)


### Features

* server payload size is configurable via config file ([1bebfc5](https://github.com/MapColonies/id-merger/commit/1bebfc58e57fb281a197bdda2aa43b8fa516a2cd))
* **merger:** added merger resource ([#1](https://github.com/MapColonies/id-merger/issues/1)) ([d8e0e53](https://github.com/MapColonies/id-merger/commit/d8e0e53ea29a6088165afa21c6141476e3f8a079))


### Bug Fixes

* **deps:** move openapi-express-viewer to dep from devDeps ([#5](https://github.com/MapColonies/id-merger/issues/5)) ([dcf7048](https://github.com/MapColonies/id-merger/commit/dcf70488c1ec85cacc9fab4e0d49d984c827fbe6))
* upgrade @map-colonies/error-express-handler from 1.1.0 to 1.2.0 ([abfe8c6](https://github.com/MapColonies/id-merger/commit/abfe8c63f000a6e04fa80bd3a8a5506181f924fb))
* upgrade express-openapi-validator from 4.10.1 to 4.10.5 ([22f4f52](https://github.com/MapColonies/id-merger/commit/22f4f52a73048731441699cf33976058bacdb14e))
