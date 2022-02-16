<p align="center">
    <h1 align="center">
        Interep subgraph
    </h1>
    <p align="center">Interep subgraph definition (The Graph).</p>
</p>

<p align="center">
    <a href="https://github.com/interep-project" target="_blank">
        <img src="https://img.shields.io/badge/project-Interep-blue.svg?style=flat-square">
    </a>
    <a href="https://eslint.org/" target="_blank">
        <img alt="Linter eslint" src="https://img.shields.io/badge/linter-eslint-8080f2?style=flat-square&logo=eslint">
    </a>
    <a href="https://prettier.io/" target="_blank">
        <img alt="Code style prettier" src="https://img.shields.io/badge/code%20style-prettier-f8bc45?style=flat-square&logo=prettier">
    </a>
    <img alt="Repository top language" src="https://img.shields.io/github/languages/top/interep-project/contracts?style=flat-square">
</p>

<div align="center">
    <h4>
        <a href="https://docs.interep.link/contributing">
            👥 Contributing
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://docs.interep.link/code-of-conduct">
            🤝 Code of conduct
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://t.me/interrep">
            🗣️ Chat &amp; Support
        </a>
    </h4>
</div>

The Interep subgraph allows groups and group members to be queried using GraphQL. It is available at https://thegraph.com/hosted-service/subgraph/interep-project/kovan, currently only for testnet data.

---

## Install

Clone this repository and install the dependencies:

```bash
$ git clone https://github.com/interep-project/subgraph.git
$ cd subgraph
$ yarn # or `npm i`
```

## Usage

The subgraph definition consists of a few files:

* `subgraph.yaml`: a YAML file containing the subgraph manifest,
* `schema.graphql`: a GraphQL schema that defines what data is stored for the subgraph, and how to query it via GraphQL,
* `src/mappings.ts`: AssemblyScript code that translates from the event data to the entities defined in the schema.

### Lint

Lint the `src` AssemblyScript code:

```bash
yarn lint
```

### Code generation

Generate AssemblyScript types for the subgraph (required every time the schema changes):

```bash
yarn codegen
```

### Authorization

Set the authorisation code that links your account on thegraph.com:

```bash
yarn auth <access-token>
```

### Deploy

Deploy the subgraph to the [hosted service](https://thegraph.com/docs/hostedservice/deploy-subgraph-hosted):

```bash
yarn deploy <subgraph-name> 
```


