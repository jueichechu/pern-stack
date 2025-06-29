import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";

// method 1: 
import "dotenv/config"; // get config method, and access environment variables using process.env.
// method 2: import dotenv from "dotenv"; dotenv.config();

// Init Arcjet
export const aj = arcjet({
    // Get your site key from https://app.arcjet.com and set it as an environment variable rather than hard coding
    key: process.env.ARCJET_KEY,
    characteristics:["ip.src"], // track requests by source IP address
    rules: [
        // shileld protects your app from common attacks, such as SQL injection, XSS< CSRF attacks
        shield({ mode: "LIVE" }),
        detectBot({ // create a bot detection rule
            mode:"LIVE", // Blocks requests. Use "DRY_RUN" to log only
            // Block all bots except the following
            allow:[
                "CATEGORY:SEARCH_ENGINE", // // block all bots except search engines: Google, Bing, etc
                // Uncomment to allow these other common bot categories
                // See the full list at https://arcjet.com/bot-list
                //"CATEGORY:MONITOR", // Uptime monitoring services
                //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
            ],
        }),
        // Create a token bucket rate limit. Other algorithms are supported
        // sliding window, fixed window, and leaky bucket
        tokenBucket({
            mode: "LIVE",
            refillRate: 30, // Refill 30 tokens per interval
            interval: 5, // Refill every 5 seconds
            capacity: 20, // Bucket capacity of 20 tokens
        }),
    ],
});
