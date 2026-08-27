# n8n-nodes-apivault-walmart-seller-analyzer

An [n8n](https://n8n.io) community node for **Walmart Seller Analyzer**, powered by the [`apivault_labs/walmart-seller-revenue-product-opportunity-analyzer` Apify Actor](https://apify.com/apivault_labs/walmart-seller-revenue-product-opportunity-analyzer).

Walmart Seller Analyzer estimates competitor sales, revenue, profit, and product opportunities. Run bulk Walmart seller and product research with no login or cookies. Pay per result from $5/1K products. Export Walmart data to CSV, JSON, Excel, API, or webhooks.

The node is a thin connector: collection, analysis, retries and billing run in the hosted Actor. It contains no private scraper implementation or embedded credentials.

## Installation

1. Open **Settings → Community Nodes** in your n8n instance.
2. Select **Install**.
3. Enter `n8n-nodes-apivault-walmart-seller-analyzer` and confirm.

## Credentials

Create an **Apify API** credential in n8n and paste your personal token from [Apify Console → Integrations](https://console.apify.com/account/integrations). The token is sent to Apify as a bearer credential and is never bundled with this package.

## Usage

Add **Walmart Seller Analyzer** to a workflow, fill the public Actor inputs below, and execute the node. Every Dataset result becomes one n8n item, so it can flow into Sheets, databases, CRMs, alerts or your own code. The node respects n8n's **Continue On Fail** behavior.

| Input | Type | Description |
|---|---|---|
| `mode` | `string` | Choose seller portfolio analysis, individual product analysis, or keyword-based niche research. |
| `sellerUrls` | `array` | Public Walmart seller storefront URLs used in seller mode. |
| `productUrls` | `array` | Public Walmart product URLs used in product mode. |
| `productIds` | `array` | Numeric Walmart US item IDs used in product mode. |
| `searchQueries` | `array` | Product keywords searched on Walmart in niche mode. |
| `maxProductsPerSeller` | `integer` | Maximum number of unique seller products included in one report. |
| `maxResultsPerQuery` | `integer` | Maximum number of unique Walmart search products returned for each keyword. |
| `includeProductDetails` | `boolean` | Add UPC, seller, offer, price, fulfillment, and additional market intelligence when available. |
| `maxDetailedProducts` | `integer` | Maximum number of products enriched with additional market intelligence per seller or query. |
| `postalCode` | `string` | Requested location context. Compare it with locationText in the output because Walmart may retain a different public-session location. |
| `storeId` | `string` | Requested Walmart store context recorded alongside the observed location. |
| `costOfGoodsPercent` | `number` | Estimated product acquisition cost as a percentage of selling price. |
| `shippingCostPerOrderUsd` | `number` | Average seller-paid shipping cost per order in USD. |
| `wfsFeePerOrderUsd` | `number` | Estimated Walmart Fulfillment Services cost per order in USD. |
| `advertisingRatePercent` | `number` | Estimated advertising spend as a percentage of product revenue. |
| `refundRatePercent` | `number` | Estimated refunds and returns allowance as a percentage of revenue. |
| `maxConcurrency` | `integer` | Controls parallel processing. The default provides a reliable speed/cost balance. |
| `proxyConfiguration` | `object` | Apify Residential Proxy is recommended for reliable Walmart access. |

## Pricing

The package is free. Actor runs are billed by Apify using the pricing shown on the [Actor page](https://apify.com/apivault_labs/walmart-seller-revenue-product-opportunity-analyzer); platform usage may also apply.

## Resources

- [Actor and live input schema](https://apify.com/apivault_labs/walmart-seller-revenue-product-opportunity-analyzer)
- [Source repository](https://github.com/apivault-labs/n8n-nodes-apivault-walmart-seller-analyzer)
- [n8n community-node documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

MIT. The hosted Actor is a separate paid service governed by Apify terms.
