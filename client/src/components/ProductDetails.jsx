import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "@/lib/axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import SEO from '../components/SEO';

// ✅ Import Child Components
import ProductInfo from './product/ProductInfo';
import ProductReviews from './product/ProductReviews';
import RelatedProducts from './product/RelatedProducts';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- GLOBAL STATES ---
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0); // Reset scroll on id change

        // 1. Get User Info
        const storedUser = JSON.parse(localStorage.getItem('userInfo'));
        setUserInfo(storedUser);

        // 2. Fetch Current Product
        const { data: currentProduct } = await api.get(`/products/${id}`);
        setProduct(currentProduct);

        // 3. Fetch All Products (for Related logic)
        const { data: allProds } = await api.get('/products');

        // 4. Filter Related Products (Same Category, Exclude Current)
        const related = allProds
          .filter((p) => p.category === currentProduct.category && p._id !== currentProduct._id)
          .slice(0, 4);
        setRelatedProducts(related);

        // 5. Fetch Site Settings (For WhatsApp logic)
        const { data: settings } = await api.get('/settings');
        setSiteSettings(settings);

        setLoading(false);

      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // --- RENDER HELPERS ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-300">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-gray-500 dark:text-slate-400 font-medium">Loading Product Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Product Not Found</h2>
        <button
          onClick={() => navigate('/shop')}
          className="text-primary hover:underline font-medium"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  // Construct Dynamic SEO Data
  // smart title combining Product Name + Location keywords for high ranking.
  const seoTitle = product ? `${product.name} - Best Manufacturer Price in Beldanga, India` : "Premium Human Hair";

  // rich description including category and quality assurance.
  const seoDesc = product ? `Buy ${product.name} directly from factory in Beldanga. 100% Raw Indian ${product.category}, single donor, unprocessed. Worldwide shipping available.` : "";

  // Dynamic keywords combining product specifics with location tags.
  const seoKeywords = product ? `${product.name}, ${product.category} exporter India, Best human hair Beldanga, Raw hair supplier Murshidabad, ${product.name} wholesale price` : "";

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
      
      {/* ✅ Inject Dynamic SEO Tags Here */}
      {product && (
        <SEO
          title={seoTitle}
          description={seoDesc}
          keywords={seoKeywords}
          image={product.image}
          url={window.location.href}
        />
      )}

      {/* --- AMBIENT BACKGROUND BLOBS --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-60">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-100/50 dark:bg-purple-900/10 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-50/60 dark:bg-blue-900/10 rounded-full blur-[100px] -z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary mb-8 transition-all duration-200"
        >
          <div className="p-2 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 group-hover:border-primary/30 mr-3 group-hover:-translate-x-1 transition-transform">
            <ArrowLeft className="h-4 w-4" />
          </div>
          <span className="font-medium">Back</span>
        </button>

        {/* 1. Main Info Section */}
        <ProductInfo
          product={product}
          siteSettings={siteSettings}
          userInfo={userInfo}
        />

        {/* 2. Reviews Section */}
        <ProductReviews
          product={product}
          userInfo={userInfo}
        />

        {/* 3. Related Products Section */}
        <RelatedProducts
          products={relatedProducts}
        />

      </div>
    </div>
  );
};

export default ProductDetails;