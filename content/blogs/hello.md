---
title: How To Connect You Namecheap Domain With Vercel Deployed App
date: 2023-01-23
description: Here you will lean how to connect your namecheap domain to vercel deployed app.
image: /keroro_cry.jpg
alt: How-To-Connect-You-Namecheap-Domain-With-Vercel-Deployed-App
ogImage: /keroro_cry.jpg
tags: ['namecheap', 'vercel']
published: true
---
# blog主題

![my image](/keroro_cry.jpg)

### Introduction

If you've purchased a domain from Namecheap and you want to connect it to your Vercel app, there are a few steps you need to follow. In this blog, we'll guide you through the process of connecting your Namecheap domain with your Vercel app.

### code

```js [file.js]{2} meta-info=val
  export default () => {
    console.log('Code block')
  }
```

### Step 1: Add a custom domain to your Vercel app

The first step is to add your custom domain to your Vercel app. To do this, log in to your Vercel account and go to your app dashboard. Click on "Settings" and then "Domains". Click on "Add Domain" and enter your custom domain name. Then click on "Add".

### Step 2: Get the DNS records from Vercel

Once you've added your custom domain to your Vercel app, you'll need to get the DNS records from Vercel. To do this, go back to the "Domains" section and click on the custom domain you just added. Then click on "DNS Records".

You'll see a list of DNS records that you need to add to your Namecheap account. These include the A record, the CNAME record, and the TXT record.

### Step 3: Add DNS records to Namecheap

Now that you have the DNS records from Vercel, you need to add them to your Namecheap account. To do this, log in to your Namecheap account and go to your domain dashboard. Click on "Advanced DNS" and then "Add New Record".

Add the A record first. In the "Type" dropdown menu, select "A (Address)". In the "Host" field, enter "@" (without the quotes). In the "Value" field, enter the IP address from the Vercel DNS records.

Next, add the CNAME record. In the "Type" dropdown menu, select "CNAME (Alias)". In the "Host" field, enter "www" (without the quotes). In the "Value" field, enter the value from the Vercel DNS records.

Finally, add the TXT record. In the "Type" dropdown menu, select "TXT (Text)". In the "Host" field, enter "@" (without the quotes). In the "Value" field, enter the value from the Vercel DNS records.

### Step 4: Verify DNS records

Once you've added the DNS records to your Namecheap account, you need to verify that they're correct. To do this, go back to your Vercel app dashboard and click on the custom domain. Then click on "Verify DNS Configuration". Vercel will check if the DNS records have been set up correctly.
