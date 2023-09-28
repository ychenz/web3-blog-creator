# Web3 Blog creator

Make it easy for everyday people to create & host their blogs on Web3 with 1 click. 

## Features for creators/influencers

1. Create blog site easily with just a few clicks.
2. Create your exclusive membership subscriptions with a few clicks, payments will be handled by smart contract transparently.
3. 0 downtime guaranteed by the Blockchain.
4. Your data will be forever safe because it is hosted on a decentralized blockchain.
5. Censor free. No one can ever take down your blog.

## Project Presentation

https://docs.google.com/presentation/d/1r1rB2AG8jCJ3d0qMdu8YVyJKUsXD87uWaa7hzpEY-UQ/edit?usp=sharing

## Project Design

![image](https://github.com/ychenz/web3-blog-creator/assets/10768904/732ea363-d3d9-4d17-8b96-689b1d7385f0)

## Local Development

### Pre-requisites

This project work closely with the other 3 components shown in the above architecture, please visit their repo and set them up in the following order

- [Smart contract](https://github.com/ychenz/web3-blog-creator-tables-contract)
- [Web3 blog creator API](https://github.com/ychenz/web3-blog-creator-api)
- [Blog template (creator created blog site)](https://github.com/ychenz/web3-fvm-blog-template)

Before attempt to run this project, please follow the checklist below to make sure you have everything setup correctly:
- The Smart contract deployed on local hardhat node (By running `npm run up` and in another terminal, run `npm run deploy:up`)
- The smart contract address is copied & pasted to the `constants.js` file's `blogTablesContractAddress` variable in the API, and the `constants.ts` file's `blogTablesContractAddress` variable of the blog template.
- Run `yarn release` for the blog template (after the contract address is updated), copy the `build` folder to the API repo's root, rename it to `blog_template`
- The API's `.env` has been updated with your own keys
- The API is started by running `yarn start`

### Start the dev site

```
yarn
yarn start
```

