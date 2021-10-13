<p align="center">
    <h1 align="center">
        InterRep subgraph
    </h1>
    <p align="center">InterRep subgraph definition (The Graph).</p>
</p>

<p align="center">
    <a href="https://github.com/InterRep" target="_blank">
        <img src="https://img.shields.io/badge/project-InterRep-blue.svg?style=flat-square">
    </a>
    <a href="https://eslint.org/" target="_blank">
        <img alt="Linter eslint" src="https://img.shields.io/badge/linter-eslint-8080f2?style=flat-square&logo=eslint">
    </a>
    <a href="https://prettier.io/" target="_blank">
        <img alt="Code style prettier" src="https://img.shields.io/badge/code%20style-prettier-f8bc45?style=flat-square&logo=prettier">
    </a>
    <img alt="Repository top language" src="https://img.shields.io/github/languages/top/InterRep/contracts?style=flat-square">
</p>

<div align="center">
    <h4>
        <a href="https://docs.interrep.link/contributing">
            👥 Contributing
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://docs.interrep.link/code-of-conduct">
            🤝 Code of conduct
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://t.me/interrep">
            🗣️ Chat &amp; Support
        </a>
    </h4>
</div>

The subgraph allows groups and group members to be queried using graphql.

The subgraph is available at https://thegraph.com/hosted-service/subgraph/glamperd/interrep-groups-kovan, currently only for testnet data.

The hosting service provided by the graph protocol community is used, so that data is updated soon after a smart contract event is emitted. Only `addRootHash` events are currently supported.

---

## Install

Clone this repository and install the dependencies:

```bash
$ git clone https://github.com/InterRep/subgraph.git
$ cd subgraph
$ yarn # or `npm i`
```

## Usage

### Authorisation

Prior to code generation or deployment, set the authorisation code that links your account on thegraph.com with this deployment.

```bash
$ graph auth  --product hosted-service <auth code>
```

### Build the subgraph

Useful for discovering compile errors before deploying

```bash
$ yarn graph:build
````

### Code Generation

Required if the schema has changed. 

```bash
$ yarn graph:codegen
```
