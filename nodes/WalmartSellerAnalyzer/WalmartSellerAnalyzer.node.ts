import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	IRequestOptions,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

const ACTOR_ID = 'apivault_labs~walmart-seller-revenue-product-opportunity-analyzer';

export class WalmartSellerAnalyzer implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Walmart Seller Analyzer',
		name: 'walmartSellerAnalyzer',
		icon: 'file:walmartselleranalyzer.svg',
		group: ['transform'],
		version: 1,
		description: 'Walmart Seller Analyzer estimates competitor sales, revenue, profit, and product opportunities. Run bulk Walmart seller and product research with no login or cookies. Pay per result from $5/1K products. Export Walmart data to CSV, JSON, Excel, API, or webhooks.',
		defaults: { name: 'Walmart Seller Analyzer' },
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [{ name: 'apifyApi', required: true }],
		properties: [
   {
      "displayName": "Analysis mode",
      "name": "mode",
      "description": "Choose seller portfolio analysis, individual product analysis, or keyword-based niche research.",
      "type": "options",
      "options": [
         {
            "name": "Seller revenue",
            "value": "seller"
         },
         {
            "name": "Product analysis",
            "value": "product"
         },
         {
            "name": "Niche opportunity",
            "value": "niche"
         }
      ],
      "default": "niche"
   },
   {
      "displayName": "Walmart seller storefront URLs",
      "name": "sellerUrls",
      "description": "Public Walmart seller storefront URLs used in seller mode. (comma or new-line separated)",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "Walmart product URLs",
      "name": "productUrls",
      "description": "Public Walmart product URLs used in product mode. (comma or new-line separated)",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "Walmart item IDs",
      "name": "productIds",
      "description": "Numeric Walmart US item IDs used in product mode. (comma or new-line separated)",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "Keywords / niches",
      "name": "searchQueries",
      "description": "Product keywords searched on Walmart in niche mode. (comma or new-line separated)",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "Products per seller",
      "name": "maxProductsPerSeller",
      "description": "Maximum number of unique seller products included in one report.",
      "type": "number",
      "default": 25,
      "typeOptions": {
         "minValue": 1,
         "maxValue": 500
      }
   },
   {
      "displayName": "Results per keyword",
      "name": "maxResultsPerQuery",
      "description": "Maximum number of unique Walmart search products returned for each keyword.",
      "type": "number",
      "default": 40,
      "typeOptions": {
         "minValue": 1,
         "maxValue": 500
      }
   },
   {
      "displayName": "Enhanced product analysis",
      "name": "includeProductDetails",
      "description": "Add UPC, seller, offer, price, fulfillment, and additional market intelligence when available.",
      "type": "boolean",
      "default": true
   },
   {
      "displayName": "Products to enrich",
      "name": "maxDetailedProducts",
      "description": "Maximum number of products enriched with additional market intelligence per seller or query.",
      "type": "number",
      "default": 20,
      "typeOptions": {
         "minValue": 0,
         "maxValue": 100
      }
   },
   {
      "displayName": "US ZIP code",
      "name": "postalCode",
      "description": "Requested location context. Compare it with locationText in the output because Walmart may retain a different public-session location.",
      "type": "string",
      "default": "95829"
   },
   {
      "displayName": "Walmart store ID (optional)",
      "name": "storeId",
      "description": "Requested Walmart store context recorded alongside the observed location.",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "Cost of goods, %",
      "name": "costOfGoodsPercent",
      "description": "Estimated product acquisition cost as a percentage of selling price.",
      "type": "number",
      "default": 30,
      "typeOptions": {
         "minValue": 0,
         "maxValue": 100
      }
   },
   {
      "displayName": "Seller shipping per order",
      "name": "shippingCostPerOrderUsd",
      "description": "Average seller-paid shipping cost per order in USD.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0
      }
   },
   {
      "displayName": "WFS fee per order",
      "name": "wfsFeePerOrderUsd",
      "description": "Estimated Walmart Fulfillment Services cost per order in USD.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0
      }
   },
   {
      "displayName": "Advertising cost, %",
      "name": "advertisingRatePercent",
      "description": "Estimated advertising spend as a percentage of product revenue.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0,
         "maxValue": 100
      }
   },
   {
      "displayName": "Refund allowance, %",
      "name": "refundRatePercent",
      "description": "Estimated refunds and returns allowance as a percentage of revenue.",
      "type": "number",
      "default": 2,
      "typeOptions": {
         "minValue": 0,
         "maxValue": 100
      }
   },
   {
      "displayName": "Processing concurrency",
      "name": "maxConcurrency",
      "description": "Controls parallel processing. The default provides a reliable speed/cost balance.",
      "type": "number",
      "default": 4,
      "typeOptions": {
         "minValue": 1,
         "maxValue": 10
      }
   },
   {
      "displayName": "Proxy configuration",
      "name": "proxyConfiguration",
      "description": "Apify Residential Proxy is recommended for reliable Walmart access.",
      "type": "json",
      "default": "{}"
   }
],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		for (let i = 0; i < items.length; i++) {
			try {
				const body: Record<string, unknown> = {};
				body["mode"] = this.getNodeParameter("mode", i);
				{ const _v = this.getNodeParameter("sellerUrls", i, '') as string; const _a = _v.split(/[,\n]/).map(s=>s.trim()).filter(s=>s.length>0); if (_a.length) body["sellerUrls"] = _a; }
				{ const _v = this.getNodeParameter("productUrls", i, '') as string; const _a = _v.split(/[,\n]/).map(s=>s.trim()).filter(s=>s.length>0); if (_a.length) body["productUrls"] = _a; }
				{ const _v = this.getNodeParameter("productIds", i, '') as string; const _a = _v.split(/[,\n]/).map(s=>s.trim()).filter(s=>s.length>0); if (_a.length) body["productIds"] = _a; }
				{ const _v = this.getNodeParameter("searchQueries", i, '') as string; const _a = _v.split(/[,\n]/).map(s=>s.trim()).filter(s=>s.length>0); if (_a.length) body["searchQueries"] = _a; }
				body["maxProductsPerSeller"] = this.getNodeParameter("maxProductsPerSeller", i);
				body["maxResultsPerQuery"] = this.getNodeParameter("maxResultsPerQuery", i);
				body["includeProductDetails"] = this.getNodeParameter("includeProductDetails", i);
				body["maxDetailedProducts"] = this.getNodeParameter("maxDetailedProducts", i);
				body["postalCode"] = this.getNodeParameter("postalCode", i);
				body["storeId"] = this.getNodeParameter("storeId", i);
				body["costOfGoodsPercent"] = this.getNodeParameter("costOfGoodsPercent", i);
				body["shippingCostPerOrderUsd"] = this.getNodeParameter("shippingCostPerOrderUsd", i);
				body["wfsFeePerOrderUsd"] = this.getNodeParameter("wfsFeePerOrderUsd", i);
				body["advertisingRatePercent"] = this.getNodeParameter("advertisingRatePercent", i);
				body["refundRatePercent"] = this.getNodeParameter("refundRatePercent", i);
				body["maxConcurrency"] = this.getNodeParameter("maxConcurrency", i);
				{ const _r = this.getNodeParameter("proxyConfiguration", i, '') as string|object; if (_r) { try { body["proxyConfiguration"] = typeof _r === 'string' ? JSON.parse(_r) : _r; } catch { throw new NodeOperationError(this.getNode(), "proxyConfiguration" + ' must be valid JSON', { itemIndex: i }); } } }
				const options: IRequestOptions = {
					method: 'POST' as IHttpRequestMethods,
					url: `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items`,
					body,
					json: true,
				};
				const response = await this.helpers.requestWithAuthentication.call(this, 'apifyApi', options);
				const results = Array.isArray(response) ? response : [response];
				for (const result of results) returnData.push({ json: result, pairedItem: { item: i } });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}
		return [returnData];
	}
}
