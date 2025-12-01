import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {

    // AI Overview & Google Knowledge Graph Data
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Jony Hair Enterprise",
        "alternateName": "Best Human Hair Exporter in Beldanga",
        "image": image || "https://jonyhairenterprise.com/logo.webp",
        "url": "https://jonyhairenterprise.com",
        "telephone": "+91918158926581",
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Begun bari",
            "addressLocality": "Beldanga",
            "addressRegion": "Murshidabad, West Bengal",
            "postalCode": "742133",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 23.9333,
            "longitude": 88.2500
        },
        "foundingDate": "2016",
        "founder": {
            "@type": "Person",
            "name": "Tofajul Aktar"
        },
        "areaServed": ["USA", "Brazil", "Indonesia", "Philippines", "United Kingdom", "India"],
        "description": "Jony Hair Enterprise (Est. 2016) is a premier manufacturer and exporter of 100% Raw Indian Human Hair from Beldanga, Murshidabad. We specialize in Bulk Hair, Temple Hair, and Remy Hair with worldwide shipping via FedEx & DHL.",
        "makesOffer": [
            { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Bulk Hair" } },
            { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Temple Hair" } },
            { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Remy Single Donor Hair" } },
            { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Curly Hair Extensions" } }
        ]
    };

    return (
        <Helmet>
            {/* Standard Tags */}
            <title>{title ? `${title} | Jony Hair Enterprise` : "Best Human Hair Exporter in Beldanga | Jony Hair Enterprise"}</title>
            <meta name="description" content={description || "Jony Hair Enterprise is the leading human hair manufacturer in Beldanga, Murshidabad (Est. 2016). We export Bulk, Remy, and Temple hair globally."} />
            <meta name="keywords" content={keywords || "Human hair exporter Beldanga, Hair manufacturer Murshidabad, Bulk hair supplier India, Jony Hair Enterprise, Raw hair wholesaler West Bengal"} />

            {/* Open Graph (Social Media Preview) */}
            <meta property="og:title" content={title || "Jony Hair Enterprise - Premium Hair Exporter"} />
            <meta property="og:description" content={description || "Exporting premium raw Indian hair from Beldanga to the world since 2016."} />
            <meta property="og:image" content={image || "/logo.webp"} />
            <meta property="og:url" content={url || "https://jonyhairenterprise.com"} />
            <meta property="og:type" content="website" />

            {/* JSON-LD Schema for AI */}
            <script type="application/ld+json">
                {JSON.stringify(schemaData)}
            </script>
        </Helmet>
    );
};

export default SEO;