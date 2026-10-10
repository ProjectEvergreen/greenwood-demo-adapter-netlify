# greenwood-demo-adapter-netlify

[![Netlify Status](https://api.netlify.com/api/v1/badges/7ad371a0-a026-423f-8a92-73b762975cc6/deploy-status)](https://app.netlify.com/sites/harmonious-gaufre-bb14cf/deploys)

A demonstration repo for deploying a full-stack [**Greenwood**](https://www.greenwoodjs.dev/) app with Netlify static hosting and Serverless + Edge functions.

## Setup

To run locally
1. Clone the repo
1. Run `npm ci`

You can now run these npm scripts
- `npm run dev` - Start the demo with Greenwood local dev server
- `npm run serve` - Start the demo with a production Greenwood build
- `npm run serve:netlify` - Start the Netlify CLI server for testing production Greenwood builds locally (see caveats section in the plugin's README)

> 👉 **Note**: _If deploying to your own Netlify instance, make sure you set the `AWS_LAMBDA_JS_RUNTIME` environment accordingly [in your Netlify UI](https://answers.netlify.com/t/aws-lambda-js-runtime-nodejs14-x/32161/2).