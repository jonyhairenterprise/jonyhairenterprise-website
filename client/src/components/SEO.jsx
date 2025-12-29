import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url, type = 'website' }) => {

    const siteTitle = "Jony Hair Enterprise";
    const currentUrl = url || window.location.href;
    const defaultImage = "https://jonyhairenterprise.com/logo.webp"; // Ensure this matches your actual domain
    const defaultDescription = "Jony Hair Enterprise (Est. 2016) is the best human hair manufacturer & wholesaler in Beldanga, Murshidabad. We export premium Bulk Hair, Remy Hair, and Temple Hair globally.";

    // Aapke diye huye keywords ko default list mein daal rahe hain
    const defaultKeywords = [
        "Best human hair exporter in Beldanga",
        "Best human hair manufactures in beldanga",
        "best human hair supplier in beldanga",
        "best human hair wholeseller in beldanga",
        "Best Bulk Hair supplier in Beldanga",
        "Best Curly Hair supplier in Beldanga",
        "Best Blonde Hair supplier in Beldanga",
        "Best Human Wig Hair supplier in Beldanga",
        "Best Frontal Hair supplier in Beldanga",
        "Best I-Tip Extension supplier in Beldanga",
        "Best Baby Curly Extension supplier in Beldanga",
        "Best Single Doner Extension supplier in Beldanga",
        "Best Double Doner Extension supplier in Beldanga",
        "Best Weft Extension supplier in Beldanga",
        "Best Double Drawn Extension supplier in Beldanga",
        "Best Clouser Extension supplier in Beldanga",
        "Best Remy Extension supplier in Beldanga",
        "Best Temple Hair Extension supplier in Beldanga",
        "Best Guti Hair Extension supplier in Beldanga",
        "Raw Indian Hair",
        "Temple Hair India"
    ].join(", ");

    // --- FUTURE PROOF SCHEMA.ORG (JSON-LD) ---
    // Ye Google AI Overview trigger karne ke liye bohot zaruri hai
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness", // Local SEO ke liye critical
        "name": "Jony Hair Enterprise",
        "alternateName": "Jony Hair Beldanga",
        "image": [
            image || defaultImage,
            "https://jonyhairenterprise.com/logo.webp"
        ],
        "url": "https://jonyhairenterprise.com",
        "telephone": "+91918158926581", // Ensure format is correct
        "email": "support@jonyhairenterprise.com", // Verify email
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
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
            ],
            "opens": "09:00",
            "closes": "22:00"
        },
        // Social Profiles - Google Knowledge Graph ke liye Zaruri
        "sameAs": [
            "https://www.facebook.com/jonyhairenterprise",
            "https://www.instagram.com/jonyhairenterprise",
            "https://twitter.com/jonyhairenterprise",
            "https://www.linkedin.com/company/jonyhairenterprise"
            // Add actual links here
        ],
        // Google ko batane ke liye ki hum kis cheez ke expert hain
        "knowsAbout": [
            "Human Hair Export",
            "Bulk Hair Manufacturing",
            "Machine Weft Extensions",
            "Raw Indian Temple Hair",
            "Blonde Hair Processing",
            "Curly Hair Textures"
        ],
        // Specific Ranking Keywords ko 'hasOfferCatalog' mein daal rahe hain
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Human Hair Products",
            "itemListElement": [
                { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Bulk Hair" } },
                { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Machine Weft Hair" } },
                { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "I-Tip Extensions" } },
                { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Frontals and Closures" } },
                { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Wigs" } }
            ]
        },
        "areaServed": {
            "@type": "GeoCircle",
            "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": 23.9333,
                "longitude": 88.2500
            },
            "geoRadius": "50000" // 50km radius around Beldanga specifically implies local dominance
        }
    };

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{title ? `${title} | ${siteTitle}` : `Best Human Hair Exporter in Beldanga | ${siteTitle}`}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />
            <link rel="canonical" href={currentUrl} />
            <meta name="author" content="Tofajul Aktar" />
            <meta name="robots" content="index, follow" />

            {/* Open Graph (Social Media Preview) */}
            <meta property="og:site_name" content={siteTitle} />
            <meta property="og:title" content={title || `Best Human Hair Manufacturer Beldanga | ${siteTitle}`} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:locale" content="en_US" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title || siteTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={image || defaultImage} />

            {/* JSON-LD Schema for AI & Knowledge Graph */}
            <script type="application/ld+json">
                {JSON.stringify(schemaData)}
            </script>
        </Helmet>
    );
};

export default SEO;