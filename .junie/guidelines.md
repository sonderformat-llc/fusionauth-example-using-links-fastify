# Project Guidelines

This project is based on Fastify, presenting an example implementation for using links from FusionAuth in a Fastify app with Google and Twitter.

The example application is located in ./complete-application/.

A base FusionAuth instance is started with ./docker-compose.yml using .env and ./kickstart/.

# Fastify

## Core Documents

For the full table of contents (TOC), see [below](#reference-toc). The following
list is a subset of the full TOC that detail core Fastify APIs and concepts in
order of most likely importance to the reader:

+ [Server](https://fastify.dev/docs/latest/Reference/Server/): Documents the core Fastify API. Includes documentation
  for the factory function and the object returned by the factory function.
+ [Lifecycle](https://fastify.dev/docs/latest/Reference/Lifecycle/): Explains the Fastify request lifecycle and
  illustrates where [Hooks](https://fastify.dev/docs/latest/Reference/Hooks/) are available for integrating with it.
+ [Routes](https://fastify.dev/docs/latest/Reference/Routes/): Details how to register routes with Fastify and how
  Fastify builds and evaluates the routing trie.
+ [Request](https://fastify.dev/docs/latest/Reference/Request/): Details Fastify's request object that is passed into
  each request handler.
+ [Reply](https://fastify.dev/docs/latest/Reference/Reply/): Details Fastify's response object available to each
  request handler.
+ [Validation and Serialization](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/): Details
  Fastify's support for validating incoming data and how Fastify serializes data
  for responses.
+ [Plugins](https://fastify.dev/docs/latest/Reference/Plugins/): Explains Fastify's plugin architecture and API.
+ [Encapsulation](https://fastify.dev/docs/latest/Reference/Encapsulation/): Explains a core concept upon which all
  Fastify plugins are built.
+ [Decorators](https://fastify.dev/docs/latest/Reference/Decorators/): Explains the server, request, and response
  decorator APIs.
+ [Hooks](https://fastify.dev/docs/latest/Reference/Hooks/): Details the API by which Fastify plugins can inject
  themselves into Fastify's handling of the request lifecycle.

## Reference Documentation Table Of Contents

This table of contents is in alphabetical order.

+ [Content Type Parser](https://fastify.dev/docs/latest/Reference/ContentTypeParser/): Documents Fastify's default
  content type parser and how to add support for new content types.
+ [Decorators](https://fastify.dev/docs/latest/Reference/Decorators/): Explains the server, request, and response
  decorator APIs.
+ [Encapsulation](https://fastify.dev/docs/latest/Reference/Encapsulation/): Explains a core concept upon which all
  Fastify plugins are built.
+ [Errors](https://fastify.dev/docs/latest/Reference/Errors/): Details how Fastify handles errors and lists the
  standard set of errors Fastify generates.
+ [Hooks](https://fastify.dev/docs/latest/Reference/Hooks/): Details the API by which Fastify plugins can inject
  themselves into Fastify's handling of the request lifecycle.
+ [HTTP2](https://fastify.dev/docs/latest/Reference/HTTP2/): Details Fastify's HTTP2 support.
+ [Lifecycle](https://fastify.dev/docs/latest/Reference/Lifecycle/): Explains the Fastify request lifecycle and
  illustrates where [Hooks](https://fastify.dev/docs/latest/Reference/Hooks/) are available for integrating with it.
+ [Logging](https://fastify.dev/docs/latest/Reference/Logging/): Details Fastify's included logging and how to
  customize it.
+ [Long Term Support](https://fastify.dev/docs/latest/Reference/LTS/): Explains Fastify's long term support (LTS)
  guarantee and the exceptions possible to the [semver](https://semver.org)
  contract.
+ [Middleware](https://fastify.dev/docs/latest/Reference/Middleware/): Details Fastify's support for Express.js style
  middleware.
+ [Plugins](https://fastify.dev/docs/latest/Reference/Plugins/): Explains Fastify's plugin architecture and API.
+ [Reply](https://fastify.dev/docs/latest/Reference/Reply/): Details Fastify's response object available to each
  request handler.
+ [Request](https://fastify.dev/docs/latest/Reference/Request/): Details Fastify's request object that is passed into
  each request handler.
+ [Routes](https://fastify.dev/docs/latest/Reference/Routes/): Details how to register routes with Fastify and how
  Fastify builds and evaluates the routing trie.
+ [Server](https://fastify.dev/docs/latest/Reference/Server/): Documents the core Fastify API. Includes documentation
  for the factory function and the object returned by the factory function.
+ [TypeScript](https://fastify.dev/docs/latest/Reference/TypeScript/): Documents Fastify's TypeScript support and
  provides recommendations for writing applications in TypeScript that utilize
  Fastify.
+ [Validation and Serialization](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/): Details
  Fastify's support for validating incoming data and how Fastify serializes data
  for responses.
+ [Warnings](https://fastify.dev/docs/latest/Reference/Warnings/): Details the warnings Fastify emits and how to
  solve them.
