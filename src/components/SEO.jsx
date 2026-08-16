import { useEffect } from 'react';

export default function SEO({ 
  title = "AuraMart - Premier Multi-Vendor Online Marketplace", 
  description = "AuraMart is the leading multi-vendor online marketplace. Discover thousands of products from verified sellers with express delivery.",
  canonical = "https://auramart.vercel.app/"
}) {
  useEffect(() => {
    // Update Page Title
    document.title = title;

    // Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // Update OG Title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }

    // Update OG Description
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description);
    }

    // Update Canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonical);
    }
  }, [title, description, canonical]);

  return null;
}
