import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';

// ==========================================
// 🛒 1. WHATSAPP CART DRAWER
// ==========================================
function CartDrawer({ isOpen, setIsOpen, cartItems, removeFromCart }) {
  const [address, setAddress] = useState('');
  const total = cartItems.reduce((acc, item) => acc + parseInt(item.price.replace('₹', '').replace(',', '') || 0), 0);

  const handleWhatsAppCheckout = () => {
    if (!address.trim()) return alert("Please enter your delivery address.");
    let message = `*🔥 NEW ORDER REQUEST 🔥*\n\n`;
    cartItems.forEach((item) => { message += `▪️ *${item.name}*\n   Size: ${item.size}\n   Price: ${item.price}\n\n`; });
    message += `*📍 Delivery Address:*\n${address}\n\n*💰 TOTAL:* ₹${total.toLocaleString('en-IN')}\n\nPlease confirm my order.`;
    window.open(`https://wa.me/919830858489?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" onClick={() => setIsOpen(false)}></div>}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#050505] border-l border-white/10 z-[100] transform transition-transform duration-500 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h3 className="text-3xl font-anton uppercase text-brand-white tracking-wider">YOUR <span className="text-brand-neon">CART</span></h3>
          <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-brand-neon text-xl">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 [&::-webkit-scrollbar]:hidden">
          {cartItems.length === 0 ? <p className="text-center text-brand-white/30 font-mono text-xs uppercase mt-10">Cart is empty.</p> : cartItems.map((item, i) => (
            <div key={i} className="flex gap-4 border border-white/5 bg-[#0A0A0A] p-3">
              <div className="w-20 h-24 bg-[#111] overflow-hidden">{item.image_url ? <img src={item.image_url} className="w-full h-full object-cover opacity-70" alt="product" /> : <span className="text-white/20 font-anton text-xl">KIT</span>}</div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div><h4 className="text-brand-white font-bold uppercase text-xs line-clamp-1">{item.name}</h4><p className="text-brand-white/50 font-mono text-[10px] mt-1">SIZE: <span className="text-brand-neon">{item.size}</span></p></div>
                <div className="flex justify-between items-center"><span className="text-brand-neon font-anton">{item.price}</span><button onClick={() => removeFromCart(i)} className="text-red-500 text-xs font-bold uppercase">Remove</button></div>
              </div>
            </div>
          ))}
          {cartItems.length > 0 && (
            <div className="mt-4 pt-6 border-t border-white/10">
              <label className="text-brand-white/50 text-xs font-bold tracking-widest uppercase mb-2 block">Delivery Address Details</label>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full Name, Street Address, City, Pincode..." className="w-full h-24 bg-[#111] border border-white/20 p-3 text-white text-sm focus:border-brand-neon outline-none resize-none"></textarea>
            </div>
          )}
        </div>
        <div className="p-6 border-t border-white/10 bg-[#0A0A0A]">
          <div className="flex justify-between items-end mb-6"><span className="text-brand-white/50 font-bold text-xs uppercase">Subtotal</span><span className="text-brand-white font-anton text-3xl">₹{total.toLocaleString('en-IN')}</span></div>
          <button onClick={handleWhatsAppCheckout} disabled={cartItems.length === 0} className="w-full py-5 bg-[#25D366] text-black font-anton text-xl tracking-widest hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-3">ORDER VIA WHATSAPP</button>
        </div>
      </div>
    </>
  );
}

function VaultProductCard({ product, addToCart }) {
  const [selectedSize, setSelectedSize] = useState('L');
  const isSoldOut = product.stock <= 0;

  return (
    <div className={`group relative bg-brand-black border border-white/10 transition-all duration-300 ${isSoldOut ? 'opacity-60 grayscale' : 'hover:border-brand-neon'}`}>
      <div className="aspect-[4/5] bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center border-b border-white/5">
        <div className={`absolute top-3 left-3 text-brand-black text-[9px] font-bold px-2 py-1 z-10 uppercase ${isSoldOut ? 'bg-red-500 text-white' : 'bg-brand-white'}`}>{isSoldOut ? 'SOLD OUT' : product.tag}</div>
        <div className="w-full h-full relative z-10 group-hover:scale-105 transition-transform duration-700 flex justify-center items-center">
           {product.image_url ? <img src={product.image_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" alt="product" /> : <h4 className="text-brand-white/20 font-anton text-5xl transform -skew-x-6">IMAGE</h4>}
        </div>
      </div>
      <div className="p-5 flex flex-col gap-4">
        <div>
          <h4 className="text-brand-white font-bold uppercase text-sm line-clamp-1">{product.name}</h4>
          <div className="flex justify-between items-center mt-1">
             <span className="text-brand-white/40 text-[10px] font-mono uppercase">{product.category}</span>
             {!isSoldOut && <span className="text-brand-neon text-[10px] font-bold">{product.stock} IN STOCK</span>}
          </div>
          <span className="text-brand-white font-anton text-2xl block mt-2">{product.price}</span>
        </div>
        <div className="flex gap-2">
          {['S','M','L','XL'].map(size => <button key={size} disabled={isSoldOut} onClick={() => setSelectedSize(size)} className={`flex-1 py-2 text-xs font-bold transition-colors ${selectedSize === size && !isSoldOut ? 'bg-brand-neon text-brand-black' : 'bg-white/5 text-brand-white/50 disabled:opacity-30'}`}>{size}</button>)}
        </div>
        <button disabled={isSoldOut} onClick={() => addToCart(product, selectedSize)} className="w-full py-3 border border-white/20 text-brand-white font-bold text-xs uppercase hover:bg-brand-neon hover:text-brand-black transition-all disabled:hover:bg-transparent disabled:hover:text-brand-white disabled:opacity-50">
          {isSoldOut ? 'OUT OF STOCK' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

// ==========================================
// ⚡ 2. HOMEPAGE & CUSTOM PAGES
// ==========================================
function CustomPage({ pages, settings, cartItems, setIsCartOpen }) {
  const { slug } = useParams();
  const page = pages.find(p => p.slug === slug);
  if (!page) return <div className="min-h-screen bg-brand-black flex items-center justify-center text-brand-neon font-anton text-4xl">404 - PAGE NOT FOUND</div>;

  return (
    <div className="min-h-screen bg-brand-black font-sans selection:bg-brand-neon selection:text-brand-black overflow-x-hidden">
      <nav className="fixed w-full z-50 flex justify-between items-center px-6 md:px-12 py-5 border-b border-white/5 bg-brand-black/80 backdrop-blur-md">
        <Link to="/" className="text-3xl font-anton tracking-tight text-brand-white">{settings.logo_text}<span className="text-brand-neon">.</span></Link>
        <div className="hidden md:flex space-x-8 text-xs font-bold uppercase text-brand-white/80 items-center tracking-widest"><Link to="/" className="hover:text-brand-neon cursor-pointer">Back to Store</Link></div>
        <button onClick={() => setIsCartOpen(true)} className="px-6 py-2 border border-brand-neon text-brand-neon text-xs font-bold uppercase hover:bg-brand-neon hover:text-brand-black transition-colors">Cart ({cartItems.length})</button>
      </nav>
      <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
        {page.banner_url && <div className="w-full h-64 md:h-96 mb-12 border border-white/10"><img src={page.banner_url} alt="Banner" className="w-full h-full object-cover opacity-60" /></div>}
        <h1 className="text-6xl md:text-8xl font-anton uppercase text-brand-white tracking-tighter mb-12 border-l-4 border-brand-neon pl-6">{page.title}</h1>
        <div className="text-brand-white/70 font-medium leading-relaxed space-y-6 text-lg whitespace-pre-wrap">{page.content}</div>
      </div>
      <footer className="relative py-16 text-center bg-[#030303] border-t border-white/10">
        <h1 className="text-4xl font-anton tracking-tight text-brand-white mb-6 opacity-50">{settings.logo_text}<span className="text-brand-neon">.</span></h1>
        <span className="text-brand-white/30 text-[10px] uppercase tracking-[0.3em] font-bold">{settings.footer_text}</span>
      </footer>
    </div>
  );
}

function HomePage({ products, categories, gallery, pages, cartItems, setIsCartOpen, addToCart, settings }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const visibleProducts = products.filter(p => p.visibility);
  const filteredProducts = activeCategory === 'ALL' ? visibleProducts : visibleProducts.filter(p => p.category === activeCategory);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-brand-black font-sans overflow-x-hidden relative">
      <a href="https://wa.me/919830858489" target="_blank" rel="noreferrer" className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-black font-anton tracking-widest text-lg px-6 py-4 flex items-center gap-3 shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:bg-white hover:scale-105 transition-all">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.12.553 4.103 1.545 5.836L.25 23.75l6.082-1.583A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.966c-1.815 0-3.567-.468-5.132-1.354l-.368-.207-3.81.993.998-3.76-.228-.383C2.468 15.65 2.033 13.864 2.033 12c0-5.501 4.482-9.983 9.967-9.983 5.485 0 9.967 4.482 9.967 9.983 0 5.501-4.482 9.983-9.967 9.983z"/></svg>
        MESSAGE US
      </a>
      <nav className="fixed w-full z-50 flex justify-between items-center px-6 md:px-12 py-5 border-b border-white/5 bg-brand-black/90 backdrop-blur-md">
        <h1 className="text-3xl font-anton text-brand-white cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>{settings.logo_text}<span className="text-brand-neon">.</span></h1>
        <div className="hidden md:flex space-x-8 text-xs font-bold uppercase text-brand-white/80 items-center tracking-widest">
          <a onClick={() => scrollTo('vault')} className="hover:text-brand-neon cursor-pointer border-b border-transparent hover:border-brand-neon transition-all">Shop</a>
          {settings.show_trust_builder && <a onClick={() => scrollTo('about')} className="hover:text-brand-neon cursor-pointer border-b border-transparent hover:border-brand-neon transition-all">About</a>}
          {pages.map(p => <Link key={p.id} to={`/p/${p.slug}`} className="hover:text-brand-neon cursor-pointer border-b border-transparent hover:border-brand-neon transition-all">{p.title}</Link>)}
        </div>
        <button onClick={() => setIsCartOpen(true)} className="px-6 py-2 bg-brand-neon text-black text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors">Cart ({cartItems.length})</button>
      </nav>

      {/* HERO SECTION */}
      <header className="relative w-full min-h-screen pt-20 flex flex-col-reverse md:flex-row border-b border-white/10 bg-[#050505]">
        <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-full relative overflow-hidden flex items-center justify-center border-t md:border-t-0 md:border-r border-white/10">
          {settings.hero_video_url ? <video src={settings.hero_video_url} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60"></video> : <div className="absolute inset-0 bg-[#0A0A0A] flex items-center justify-center"><span className="text-white/10 font-anton text-6xl md:text-8xl">VIDEO</span></div>}
          <div className="relative z-10 px-8 py-20 md:p-20 text-center md:text-left flex flex-col justify-center h-full bg-gradient-to-t md:bg-gradient-to-r from-black/80 to-transparent w-full">
             <h2 className="text-[70px] md:text-[120px] font-anton uppercase leading-[0.85] text-brand-white tracking-tighter m-0 drop-shadow-2xl">{settings.hero_title_1}<br/>{settings.hero_title_2}<br/><span className="text-brand-neon">{settings.hero_title_3}</span></h2>
             <p className="mt-8 text-brand-white/80 max-w-md text-lg md:text-xl font-medium">{settings.hero_subtitle}</p>
             <div className="mt-10"><button onClick={() => scrollTo('vault')} className="px-12 py-5 bg-brand-neon text-brand-black font-anton text-2xl hover:bg-brand-white transition-colors shadow-[0_0_30px_rgba(163,255,18,0.3)]">SHOP NOW →</button></div>
          </div>
        </div>
        <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-full relative overflow-hidden group">
          {settings.hero_image_url ? <img src={settings.hero_image_url} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-[2000ms]" alt="hero" /> : <div className="absolute inset-0 bg-[#111] flex items-center justify-center"><span className="text-white/10 font-anton text-6xl md:text-8xl">IMAGE</span></div>}
        </div>
      </header>

      {/* DYNAMIC MARQUEE */}
      <div className="relative w-full bg-brand-neon text-brand-black py-4 overflow-hidden"><div className="flex w-[200%] animate-marquee font-anton text-2xl uppercase whitespace-nowrap px-4">{settings.marquee_text} &nbsp; {settings.marquee_text} &nbsp; {settings.marquee_text}</div></div>

      {/* DYNAMIC PROMO BANNER */}
      {settings.promo_text && (
        <section className="py-24 md:py-32 px-6 bg-[#030303] border-b border-white/5 text-center flex items-center justify-center">
          <h2 className="text-5xl md:text-8xl font-anton text-brand-white uppercase tracking-tighter max-w-5xl mx-auto leading-none">
            {settings.promo_text.split('. ').map((sentence, idx) => (
              <span key={idx} className={idx % 2 !== 0 ? 'text-brand-neon' : ''}>{sentence}{sentence ? '. ' : ''}</span>
            ))}
          </h2>
        </section>
      )}

      {/* FIXED DYNAMIC ABOUT SECTION */}
      {settings.show_trust_builder && (
        <section id="about" className="w-full bg-brand-black border-b border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2">
             <div className="flex flex-col justify-center px-8 py-20 md:p-24 bg-[#050505]"><h3 className="text-5xl md:text-7xl font-anton text-brand-neon uppercase tracking-tighter mb-6">{settings.trust_title_1}</h3><p className="text-brand-white/70 text-lg md:text-xl font-medium leading-relaxed max-w-xl whitespace-pre-wrap">{settings.trust_desc_1}</p></div>
             <div className="aspect-square md:aspect-auto md:h-[70vh] relative overflow-hidden">{settings.about_img_1 ? <img src={settings.about_img_1} className="w-full h-full object-cover" alt="feature" /> : <div className="w-full h-full bg-[#111] flex items-center justify-center"><span className="text-white/10 font-anton text-6xl">PHOTO 1</span></div>}</div>
             <div className="aspect-square md:aspect-auto md:h-[70vh] relative overflow-hidden">{settings.about_img_2 ? <img src={settings.about_img_2} className="w-full h-full object-cover" alt="feature" /> : <div className="w-full h-full bg-[#111] flex items-center justify-center"><span className="text-white/10 font-anton text-6xl">PHOTO 2</span></div>}</div>
             <div className="flex flex-col justify-center px-8 py-20 md:p-24 bg-[#0A0A0A] md:text-right items-start md:items-end"><h3 className="text-5xl md:text-7xl font-anton text-brand-white uppercase tracking-tighter mb-6">{settings.trust_title_2}</h3><p className="text-brand-white/70 text-lg md:text-xl font-medium leading-relaxed max-w-xl whitespace-pre-wrap">{settings.trust_desc_2}</p></div>
          </div>
        </section>
      )}

      {/* CATEGORY SPLIT */}
      {settings.show_category_split && (
        <section className="w-full flex flex-col md:flex-row min-h-[70vh] border-b border-white/5">
          <div onClick={() => scrollTo('vault')} className="w-full md:w-1/2 h-[50vh] md:h-auto relative group overflow-hidden cursor-pointer bg-[#0A0A0A] border-b md:border-b-0 md:border-r border-white/5 flex items-center justify-center">
            {settings.training_bg_url ? <img src={settings.training_bg_url} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" alt="category" /> : <span className="text-brand-white/5 font-anton text-8xl">VISUAL</span>}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-10 md:bottom-16 w-full text-center z-10"><h3 className="text-5xl md:text-7xl font-anton text-brand-white tracking-tighter uppercase">{settings.category_1_title}</h3></div>
          </div>
          <div onClick={() => scrollTo('vault')} className="w-full md:w-1/2 h-[50vh] md:h-auto relative group overflow-hidden cursor-pointer bg-[#050505] flex items-center justify-center">
            {settings.matchday_bg_url ? <img src={settings.matchday_bg_url} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" alt="category" /> : <span className="text-brand-white/5 font-anton text-8xl">VISUAL</span>}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-10 md:bottom-16 w-full text-center z-10"><h3 className="text-5xl md:text-7xl font-anton text-brand-neon tracking-tighter uppercase">{settings.category_2_title}</h3></div>
          </div>
        </section>
      )}

      {/* SHOP VAULT */}
      <section id="vault" className="relative px-6 md:px-12 pt-32 pb-24 max-w-[100rem] mx-auto border-b border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <h3 className="text-6xl md:text-8xl font-anton uppercase text-brand-white tracking-tighter">LIVE <span className="text-brand-neon">VAULT</span></h3>
          <div className="flex flex-wrap gap-2 bg-[#111] p-1 border border-white/10 rounded-full overflow-hidden w-full md:w-auto overflow-x-auto [&::-webkit-scrollbar]:hidden">
            <button onClick={() => setActiveCategory('ALL')} className={`px-6 py-3 text-xs font-bold uppercase rounded-full whitespace-nowrap ${activeCategory === 'ALL' ? 'bg-brand-neon text-brand-black shadow-lg' : 'text-brand-white/50 hover:text-white'}`}>ALL</button>
            {categories.map(cat => <button key={cat.id} onClick={() => setActiveCategory(cat.name)} className={`px-6 py-3 text-xs font-bold uppercase rounded-full whitespace-nowrap ${activeCategory === cat.name ? 'bg-brand-neon text-brand-black shadow-lg' : 'text-brand-white/50 hover:text-white'}`}>{cat.name}</button>)}
          </div>
        </div>
        {filteredProducts.length === 0 ? <p className="text-center text-brand-white/30 font-mono text-sm uppercase py-32">No items in this category.</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => <VaultProductCard key={product.id} product={product} addToCart={addToCart} />)}
          </div>
        )}
      </section>

      {/* INFINITE PLAYER SLIDER */}
      {settings.show_social_proof && gallery.length > 0 && (
        <section className="py-24 md:py-32 pl-6 md:pl-12 border-b border-white/5 bg-[#030303] overflow-hidden">
          <h3 className="text-4xl md:text-6xl font-anton uppercase text-brand-white tracking-widest mb-12 pr-6"><span className="text-brand-neon">{settings.social_title.split(' ')[0]}</span> {settings.social_title.split(' ').slice(1).join(' ')}</h3>
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 pr-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {gallery.map((img) => (
              <div key={img.id} className="min-w-[75vw] md:min-w-[400px] snap-center aspect-[4/5] bg-[#111] relative group border border-white/5 flex-shrink-0 cursor-grab active:cursor-grabbing">
                <img src={img.image_url} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 pointer-events-none" alt="player" />
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="relative py-24 text-center bg-[#030303]">
        <h1 className="text-5xl font-anton text-brand-white mb-6 opacity-30">{settings.logo_text}<span className="text-brand-neon">.</span></h1>
        <span className="text-brand-white/30 text-[10px] uppercase tracking-[0.3em] font-bold">{settings.footer_text}</span>
      </footer>
    </div>
  );
}

// ==========================================
// 🔒 4. FULL CMS ADMIN ROUTE
// ==========================================
function AdminPage({ fetchAllData, products, categories, gallery, settings, pages }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState('hero'); 
  
  const [productData, setProductData] = useState({ name: '', price: '', tag: '', image_url: '', category: categories.length > 0 ? categories[0].name : 'Jerseys', stock: 10, visibility: true });
  const [catName, setCatName] = useState('');
  const [pageData, setPageData] = useState({ slug: '', title: '', banner_url: '', content: '' });
  const [cmsData, setCmsData] = useState(settings);

  useEffect(() => { setCmsData(settings); }, [settings]);
  useEffect(() => { if (categories.length > 0 && !productData.category) { setProductData(prev => ({...prev, category: categories[0].name})); } }, [categories]);

  const uploadFileToServer = async (file) => {
    const formData = new FormData(); formData.append("file", file);
    try { const res = await fetch('http://https://jersey-7jhu.onrender.com/api/upload/', { method: 'POST', body: formData }); return (await res.json()).url; } 
    catch (err) { alert("Upload Failed! Check backend connection."); return null; }
  };

  const handleSettingsUpload = async (e, field) => { if (e.target.files[0]) { const url = await uploadFileToServer(e.target.files[0]); if (url) setCmsData({ ...cmsData, [field]: url }); } };
  const handleProductUpload = async (e) => { if (e.target.files[0]) { const url = await uploadFileToServer(e.target.files[0]); if (url) setProductData({ ...productData, image_url: url }); } };
  
  const handleGalleryUpload = async (e) => {
    if (!e.target.files[0]) return;
    const url = await uploadFileToServer(e.target.files[0]);
    if (url) {
       await fetch('http://https://jersey-7jhu.onrender.com/api/gallery/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image_url: url }) });
       fetchAllData(); alert("Photo added to Slider!");
    }
  };
  const handleDeleteGallery = async (id) => { await fetch(`http://https://jersey-7jhu.onrender.com/api/gallery/${id}`, { method: 'DELETE' }); fetchAllData(); };

  const handleAddCategory = async (e) => { e.preventDefault(); await fetch('http://https://jersey-7jhu.onrender.com/api/categories/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: catName }) }); setCatName(''); fetchAllData(); };
  const handleDeleteCategory = async (id) => { await fetch(`http://https://jersey-7jhu.onrender.com/api/categories/${id}`, { method: 'DELETE' }); fetchAllData(); };

  const handleLogin = (e) => { e.preventDefault(); if (passwordInput === 'MINERVA') setIsAuthenticated(true); else { alert('DENIED.'); setPasswordInput(''); } };
  const handleAddProduct = async (e) => { e.preventDefault(); await fetch('http://https://jersey-7jhu.onrender.com/api/products/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productData) }); setProductData({ ...productData, name: '', price: '', tag: '', image_url: ''}); fetchAllData(); alert("Asset added!"); };
  const handleDeleteProduct = async (id) => { if(window.confirm("Delete permanently?")) { await fetch(`http://https://jersey-7jhu.onrender.com/api/products/${id}`, { method: 'DELETE' }); fetchAllData(); } };
  const toggleVisibility = async (product) => { await fetch(`http://https://jersey-7jhu.onrender.com/api/products/${product.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({...product, visibility: !product.visibility}) }); fetchAllData(); };
  const handleCreatePage = async (e) => { e.preventDefault(); await fetch('http://https://jersey-7jhu.onrender.com/api/pages/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...pageData, slug: pageData.slug.toLowerCase().replace(/ /g, '-') }) }); setPageData({ slug: '', title: '', banner_url: '', content: '' }); fetchAllData(); alert(`Page Created!`); };
  const handleDeletePage = async (id) => { if(window.confirm("Delete Page?")) { await fetch(`http://https://jersey-7jhu.onrender.com/api/pages/${id}`, { method: 'DELETE' }); fetchAllData(); } };
  const handleUpdateSettings = async (e) => { e.preventDefault(); await fetch('http://https://jersey-7jhu.onrender.com/api/settings/', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cmsData) }); fetchAllData(); alert("Website content saved!"); };

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-6"><form onSubmit={handleLogin} className="bg-[#0A0A0A] p-12 border border-white/10 flex flex-col gap-6 text-center max-w-md w-full shadow-2xl"><h3 className="text-4xl font-anton text-brand-white uppercase">SYSTEM OVERRIDE</h3><input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="PASSCODE" className="bg-transparent border border-white/20 p-4 text-center text-white font-mono uppercase focus:border-brand-neon outline-none" /><button type="submit" className="bg-brand-neon text-black font-anton text-xl py-4 hover:bg-white transition-colors">ENTER COMMAND</button></form></div>
  );

  return (
    <div className="min-h-screen bg-brand-black flex flex-col md:flex-row">
      <div className="w-full md:w-72 bg-[#050505] border-r border-white/10 p-6 flex flex-col gap-2">
        <h3 className="text-2xl font-anton text-brand-white uppercase mb-8">V5 DASHBOARD</h3>
        <button onClick={() => setActiveTab('hero')} className={`text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeTab==='hero'?'bg-brand-neon text-black':'text-white/40 hover:bg-white/5'}`}>1. Identity & Promos</button>
        <button onClick={() => setActiveTab('about')} className={`text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeTab==='about'?'bg-brand-neon text-black':'text-white/40 hover:bg-white/5'}`}>2. About Section</button>
        <button onClick={() => setActiveTab('players')} className={`text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeTab==='players'?'bg-brand-neon text-black':'text-white/40 hover:bg-white/5'}`}>3. Infinite Slider</button>
        <button onClick={() => setActiveTab('categories')} className={`text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeTab==='categories'?'bg-brand-neon text-black':'text-white/40 hover:bg-white/5'}`}>4. Shop Categories</button>
        <button onClick={() => setActiveTab('products')} className={`text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeTab==='products'?'bg-brand-neon text-black':'text-white/40 hover:bg-white/5'}`}>5. Live Inventory</button>
        <button onClick={() => setActiveTab('pages')} className={`text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all border-t border-white/10 mt-6 pt-6 ${activeTab==='pages'?'bg-brand-neon text-black':'text-white/40 hover:bg-white/5'}`}>Custom Pages</button>
        <Link to="/" className="text-left px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-neon mt-auto border border-brand-neon/30 text-center hover:bg-brand-neon hover:text-black transition-colors">Launch Live Site</Link>
      </div>

      <div className="flex-1 p-8 md:p-12 bg-[#0A0A0A] overflow-y-auto h-screen selection:bg-brand-neon selection:text-black">
        
        {/* HERO & PROMOS */}
        {activeTab === 'hero' && (
          <form onSubmit={handleUpdateSettings} className="max-w-4xl space-y-10 animate-in fade-in duration-500">
            <h4 className="text-3xl font-anton text-white uppercase border-l-4 border-brand-neon pl-4 mb-8">IDENTITY & PROMOS</h4>
            <div className="grid grid-cols-2 gap-6">
              <div><label className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Logo Branding</label><input type="text" value={cmsData.logo_text} onChange={e=>setCmsData({...cmsData, logo_text: e.target.value})} className="w-full bg-transparent border border-white/10 p-3 text-white uppercase"/></div>
              <div><label className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Rolling Marquee Text</label><input type="text" value={cmsData.marquee_text} onChange={e=>setCmsData({...cmsData, marquee_text: e.target.value})} className="w-full bg-transparent border border-white/10 p-3 text-white uppercase"/></div>
            </div>
            
            <div className="bg-[#111] p-6 border border-white/5">
               <label className="text-brand-neon text-[10px] uppercase font-bold tracking-widest mb-4 block">Massive Promo Banner (Homepage)</label>
               <textarea value={cmsData.promo_text} onChange={e=>setCmsData({...cmsData, promo_text: e.target.value})} className="w-full h-24 bg-transparent border border-white/20 p-4 text-white font-anton text-2xl uppercase" placeholder="WE ARE THE BEST..."/>
            </div>

            <div className="grid md:grid-cols-2 gap-6 bg-[#111] p-8 border border-white/5">
              <div><label className="block text-white font-bold text-xs uppercase mb-3">Background Video File</label><input type="file" accept="video/*" onChange={(e) => handleSettingsUpload(e, 'hero_video_url')} className="text-white/50 text-xs file:mr-4 file:py-2 file:px-4 file:bg-brand-neon file:border-0 file:text-black cursor-pointer"/></div>
              <div><label className="block text-white font-bold text-xs uppercase mb-3">Hero Side Image File</label><input type="file" accept="image/*" onChange={(e) => handleSettingsUpload(e, 'hero_image_url')} className="text-white/50 text-xs file:mr-4 file:py-2 file:px-4 file:bg-brand-neon file:border-0 file:text-black cursor-pointer"/></div>
            </div>
            <button type="submit" className="w-full py-5 bg-brand-neon text-black font-anton text-xl tracking-widest hover:bg-white transition-colors">SAVE IDENTITY</button>
          </form>
        )}

        {/* FIXED: ABOUT SECTION */}
        {activeTab === 'about' && (
          <form onSubmit={handleUpdateSettings} className="max-w-4xl space-y-10 animate-in fade-in duration-500">
            <h4 className="text-3xl font-anton text-white uppercase border-l-4 border-brand-neon pl-4 mb-8 tracking-wider">ABOUT STORY BLOCKS</h4>
            <label className="flex items-center gap-4 cursor-pointer p-4 bg-[#111] border border-white/5"><input type="checkbox" checked={cmsData.show_trust_builder} onChange={(e) => setCmsData({...cmsData, show_trust_builder: e.target.checked})} className="w-5 h-5 accent-brand-neon" /><span className="text-white font-bold uppercase text-xs tracking-widest">Display About Grid on Homepage</span></label>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-[#111] border border-white/5 p-8 flex flex-col gap-6">
                <input type="text" value={cmsData.trust_title_1} onChange={e=>setCmsData({...cmsData, trust_title_1: e.target.value})} className="w-full bg-transparent border border-brand-neon/50 p-3 text-brand-neon font-anton text-2xl uppercase" placeholder="Block 1 Title"/>
                <textarea value={cmsData.trust_desc_1} onChange={e=>setCmsData({...cmsData, trust_desc_1: e.target.value})} className="w-full h-40 bg-transparent border border-white/10 p-3 text-white/70 leading-relaxed" placeholder="Tell your story..."/>
                <div><label className="block text-[10px] text-white/40 uppercase mb-3 font-bold tracking-widest">Story Image 1</label><input type="file" accept="image/*" onChange={(e) => handleSettingsUpload(e, 'about_img_1')} className="text-white/50 text-[10px] file:mr-3 file:py-1 file:px-4 file:bg-white/10 file:text-white file:border-0 cursor-pointer"/></div>
              </div>
              <div className="bg-[#111] border border-white/5 p-8 flex flex-col gap-6">
                <input type="text" value={cmsData.trust_title_2} onChange={e=>setCmsData({...cmsData, trust_title_2: e.target.value})} className="w-full bg-transparent border border-white/10 p-3 text-white font-anton text-2xl uppercase" placeholder="Block 2 Title"/>
                <textarea value={cmsData.trust_desc_2} onChange={e=>setCmsData({...cmsData, trust_desc_2: e.target.value})} className="w-full h-40 bg-transparent border border-white/10 p-3 text-white/70 leading-relaxed" placeholder="Tell your story..."/>
                <div><label className="block text-[10px] text-white/40 uppercase mb-3 font-bold tracking-widest">Story Image 2</label><input type="file" accept="image/*" onChange={(e) => handleSettingsUpload(e, 'about_img_2')} className="text-white/50 text-[10px] file:mr-3 file:py-1 file:px-4 file:bg-white/10 file:text-white file:border-0 cursor-pointer"/></div>
              </div>
            </div>
            <button type="submit" className="w-full py-5 bg-brand-neon text-black font-anton text-xl tracking-widest hover:bg-white transition-colors">SAVE ALL CHANGES</button>
          </form>
        )}

        {/* INFINITE PLAYER SLIDER */}
        {activeTab === 'players' && (
          <div className="max-w-5xl space-y-10 animate-in fade-in duration-500">
            <h4 className="text-3xl font-anton text-white uppercase border-l-4 border-brand-neon pl-4 mb-8">INFINITE PLAYER SLIDER</h4>
            
            <form onSubmit={handleUpdateSettings} className="flex flex-col gap-4 bg-[#111] p-6 border border-white/5 mb-8">
               <label className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Slider Title</label>
               <input type="text" value={cmsData.social_title} onChange={e=>setCmsData({...cmsData, social_title: e.target.value})} className="w-full max-w-md bg-transparent border-b border-brand-neon/40 py-2 text-brand-neon font-anton text-2xl uppercase outline-none"/>
               <button type="submit" className="self-start px-8 py-3 bg-white/10 text-white text-xs font-bold uppercase mt-2 hover:bg-white hover:text-black transition-colors">Save Title</button>
            </form>

            <div className="border border-white/10 p-8 bg-[#111] flex flex-col gap-4 items-center">
                 <h5 className="text-brand-neon font-anton text-xl">ADD PHOTO TO SLIDER</h5>
                 <input type="file" accept="image/*" onChange={handleGalleryUpload} className="text-white/50 text-xs file:mr-4 file:py-3 file:px-8 file:bg-brand-neon file:border-0 file:text-black file:font-bold file:uppercase cursor-pointer"/>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {gallery.map(img => (
                <div key={img.id} className="relative aspect-[4/5] bg-black border border-white/10 group">
                  <img src={img.image_url} className="w-full h-full object-cover opacity-60" alt="gallery"/>
                  <button onClick={() => handleDeleteGallery(img.id)} className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-bold px-3 py-1 uppercase opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DYNAMIC CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="max-w-4xl space-y-10 animate-in fade-in duration-500">
            <h4 className="text-3xl font-anton text-white uppercase border-l-4 border-brand-neon pl-4 mb-8">SHOP CATEGORIES</h4>
            <form onSubmit={handleAddCategory} className="flex gap-4">
              <input type="text" placeholder="New Category (e.g. Boots)" required value={catName} onChange={e=>setCatName(e.target.value)} className="flex-1 bg-[#111] border border-white/10 p-4 text-white uppercase font-bold tracking-widest outline-none focus:border-brand-neon"/>
              <button type="submit" className="px-8 bg-brand-neon text-black font-bold uppercase tracking-widest hover:bg-white transition-colors">ADD</button>
            </form>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map(cat => (
                 <div key={cat.id} className="bg-[#111] border border-white/5 p-4 flex justify-between items-center">
                    <span className="text-white font-bold uppercase text-sm tracking-wider">{cat.name}</span>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 text-[10px] font-bold uppercase hover:underline">Remove</button>
                 </div>
              ))}
            </div>

            <form onSubmit={handleUpdateSettings} className="mt-16 space-y-8 pt-8 border-t border-white/10">
              <h4 className="text-xl font-anton text-brand-neon uppercase">HOMEPAGE CATEGORY BANNERS</h4>
              <label className="flex items-center gap-4 cursor-pointer p-4 bg-[#111] border border-white/5 transition-colors hover:border-brand-neon/30"><input type="checkbox" checked={cmsData.show_category_split} onChange={(e) => setCmsData({...cmsData, show_category_split: e.target.checked})} className="w-5 h-5 accent-brand-neon" /><span className="text-white font-bold uppercase text-xs tracking-widest">Display Category Section</span></label>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="bg-[#111] border border-white/5 p-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-1"><label className="text-[9px] uppercase font-bold text-white/30">Left Banner Title</label><input type="text" value={cmsData.category_1_title} onChange={e=>setCmsData({...cmsData, category_1_title: e.target.value})} className="w-full bg-transparent border-b border-white/10 py-3 text-white font-anton text-xl focus:border-brand-neon outline-none"/></div>
                  <div className="mt-4"><label className="block text-white font-bold text-[10px] uppercase mb-2">Upload Left Visual</label><input type="file" accept="image/*" onChange={(e) => handleSettingsUpload(e, 'training_bg_url')} className="text-white/50 text-[10px] file:mr-2 file:py-1 file:px-3 file:bg-brand-neon file:border-0 file:text-black cursor-pointer"/></div>
                </div>
                <div className="bg-[#111] border border-white/5 p-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-1"><label className="text-[9px] uppercase font-bold text-white/30">Right Banner Title</label><input type="text" value={cmsData.category_2_title} onChange={e=>setCmsData({...cmsData, category_2_title: e.target.value})} className="w-full bg-transparent border-b border-brand-neon/30 py-3 text-brand-neon font-anton text-xl focus:border-brand-neon outline-none"/></div>
                  <div className="mt-4"><label className="block text-white font-bold text-[10px] uppercase mb-2">Upload Right Visual</label><input type="file" accept="image/*" onChange={(e) => handleSettingsUpload(e, 'matchday_bg_url')} className="text-white/50 text-[10px] file:mr-2 file:py-1 file:px-3 file:bg-brand-neon file:border-0 file:text-black cursor-pointer"/></div>
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-brand-neon text-black font-anton text-xl tracking-widest hover:bg-white transition-colors">SAVE BANNERS</button>
            </form>
          </div>
        )}

        {/* LIVE INVENTORY */}
        {activeTab === 'products' && (
          <div className="grid lg:grid-cols-2 gap-16 animate-in slide-in-from-right duration-500">
             <form onSubmit={handleAddProduct} className="flex flex-col gap-6">
              <h4 className="text-3xl font-anton text-white uppercase border-l-4 border-brand-neon pl-4 mb-4">NEW ASSET</h4>
              <input type="text" placeholder="Product Name" required value={productData.name} onChange={e=>setProductData({...productData, name: e.target.value})} className="bg-[#111] border border-white/10 p-4 text-white uppercase font-bold tracking-widest outline-none focus:border-brand-neon"/>
              <div className="flex gap-4">
                <input type="text" placeholder="₹4,999" required value={productData.price} onChange={e=>setProductData({...productData, price: e.target.value})} className="w-1/3 bg-[#111] border border-white/10 p-4 text-brand-neon font-anton text-xl outline-none focus:border-brand-neon"/>
                <input type="number" placeholder="Stock Qty" required value={productData.stock} onChange={e=>setProductData({...productData, stock: parseInt(e.target.value) || 0})} className="w-1/3 bg-[#111] border border-white/10 p-4 text-white font-mono text-xl text-center outline-none focus:border-brand-neon"/>
                <select value={productData.category} onChange={e=>setProductData({...productData, category: e.target.value})} className="w-1/3 bg-[#111] border border-white/10 p-4 text-white font-bold uppercase text-xs tracking-widest outline-none focus:border-brand-neon">
                  {categories.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="border border-white/10 p-6 bg-[#111] flex flex-col items-center">
                 <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">Main Product Image</label>
                 <input type="file" accept="image/*" onChange={handleProductUpload} className="text-white/50 text-[10px] file:mr-4 file:py-2 file:px-6 file:bg-brand-neon file:border-0 file:text-black cursor-pointer"/>
              </div>
              <button type="submit" className="py-5 bg-brand-neon text-black font-anton text-xl tracking-widest hover:bg-white transition-colors">ADD TO INVENTORY</button>
            </form>
            <div className="flex flex-col gap-6">
              <h4 className="text-3xl font-anton text-white uppercase border-l-4 border-brand-neon pl-4 mb-4">LIVE INVENTORY</h4>
              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-4 [&::-webkit-scrollbar]:hidden">
                {products.length === 0 ? <p className="text-white/20 font-mono text-xs uppercase">Vault is empty.</p> : products.map(p => (
                  <div key={p.id} className={`p-5 border flex justify-between items-center transition-all ${p.visibility ? 'bg-[#111] border-white/5' : 'bg-red-950/20 border-red-900/30'} ${p.stock <= 0 ? 'opacity-50 grayscale' : ''}`}>
                    <div className="flex items-center gap-5">
                      {p.image_url ? <img src={p.image_url} className="w-14 h-14 object-cover" alt="product"/> : <div className="w-14 h-14 bg-black border border-white/10"></div>}
                      <div>
                        <h6 className="text-white text-sm font-bold uppercase tracking-tighter">{p.name}</h6>
                        <div className="flex gap-3 mt-1 items-center">
                           <span className="text-brand-neon font-anton">{p.price}</span>
                           <span className={`text-[10px] font-bold ${p.stock <= 0 ? 'text-red-500' : 'text-white/50'}`}>{p.stock <= 0 ? 'SOLD OUT' : `QTY: ${p.stock}`}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <button type="button" onClick={() => toggleVisibility(p)} className={`text-[9px] font-bold uppercase tracking-widest px-4 py-1 border transition-colors ${p.visibility ? 'text-white border-white/20 hover:bg-white hover:text-black' : 'text-brand-neon border-brand-neon bg-brand-neon/10 hover:bg-brand-neon hover:text-black'}`}>{p.visibility ? 'Active' : 'Hidden'}</button>
                      <button type="button" onClick={() => handleDeleteProduct(p.id)} className="text-red-500 text-[9px] uppercase font-bold hover:underline tracking-widest">Wipe Item</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PAGES MANAGEMENT */}
        {activeTab === 'pages' && (
          <div className="grid md:grid-cols-2 gap-16 animate-in slide-in-from-bottom duration-500">
            <form onSubmit={handleCreatePage} className="flex flex-col gap-6">
              <h4 className="text-3xl font-anton text-white uppercase border-l-4 border-brand-neon pl-4 mb-4">NEW PAGE</h4>
              <input type="text" placeholder="URL-SLUG (e.g., wash-care)" required value={pageData.slug} onChange={e=>setPageData({...pageData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="bg-[#111] border border-brand-neon/30 p-4 text-brand-neon font-mono text-sm focus:border-brand-neon outline-none"/>
              <input type="text" placeholder="OFFICIAL PAGE TITLE" required value={pageData.title} onChange={e=>setPageData({...pageData, title: e.target.value})} className="bg-[#111] border border-white/10 p-4 text-white font-anton text-2xl tracking-widest focus:border-brand-neon outline-none"/>
              <div className="border border-white/10 p-6 bg-[#111] flex flex-col gap-3">
                 <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Banner Image Visual (Optional)</label>
                 <input type="file" accept="image/*" onChange={handlePageUpload} className="text-white/50 text-[10px] file:mr-3 file:py-1 file:px-4 file:bg-brand-neon file:text-black file:border-0 cursor-pointer"/>
              </div>
              <textarea placeholder="Enter body text (Markdown supported)..." required value={pageData.content} onChange={e=>setPageData({...pageData, content: e.target.value})} className="bg-[#111] border border-white/10 p-6 text-white/80 min-h-[400px] leading-relaxed focus:border-brand-neon outline-none"/>
              <button type="submit" className="py-5 bg-brand-neon text-black font-anton text-xl tracking-widest hover:bg-white transition-colors">PUBLISH PAGE</button>
            </form>
            <div className="flex flex-col gap-6">
              <h4 className="text-3xl font-anton text-white uppercase border-l-4 border-brand-neon pl-4 mb-4">ACTIVE PAGES</h4>
              <div className="space-y-4">
                {pages.length === 0 ? <p className="text-white/20 font-mono text-xs uppercase">No custom pages.</p> : pages.map(page => (
                  <div key={page.id} className="p-6 border border-white/5 bg-[#111] flex justify-between items-center group hover:border-brand-neon/30 transition-all">
                    <div><h5 className="text-white font-bold text-xl tracking-tight">{page.title}</h5><a href={`/p/${page.slug}`} target="_blank" rel="noreferrer" className="text-brand-neon text-xs font-mono hover:underline">/p/{page.slug}</a></div>
                    <button onClick={() => handleDeletePage(page.id)} className="text-red-500 text-[10px] font-bold uppercase border border-red-500/30 px-5 py-2 hover:bg-red-500 hover:text-white transition-all">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ==========================================
// 🚀 5. MAIN APP ENTRY
// ==========================================
export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [pages, setPages] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [settings, setSettings] = useState({
    logo_text: "JERSEY", hero_title_1: "OUTPLAY", hero_title_2: "THEM—", hero_title_3: "ALL.", hero_subtitle: "Elite gear for matchday dominance.", hero_image_url: "", hero_video_url: "",
    marquee_text: "LIMITED STOCK ⚡ NEW DROP", promo_text: "WE ARE THE BEST IN THE GAME. PERIOD.", footer_text: "© 2026",
    category_1_title: "TRAINING GEAR", category_2_title: "MATCHDAY KITS", training_bg_url: "", matchday_bg_url: "", 
    social_title: "WORN BY PLAYERS.", trust_title_1: "Performance Fabric", trust_desc_1: "Aerodynamic materials.", trust_title_2: "Combat Durability", trust_desc_2: "Reinforced stitching.",
    about_img_1: "", about_img_2: "",
    show_category_split: true, show_social_proof: true, show_trust_builder: true
  });

  const fetchAllData = async () => {
    try {
      const pRes = await fetch('http://https://jersey-7jhu.onrender.com/api/products/'); if (pRes.ok) setProducts(await pRes.json());
      const cRes = await fetch('http://https://jersey-7jhu.onrender.com/api/categories/'); if (cRes.ok) setCategories(await cRes.json());
      const gRes = await fetch('http://https://jersey-7jhu.onrender.com/api/gallery/'); if (gRes.ok) setGallery(await gRes.json());
      const pgRes = await fetch('http://https://jersey-7jhu.onrender.com/api/pages/'); if (pgRes.ok) setPages(await pgRes.json());
      const sRes = await fetch('http://https://jersey-7jhu.onrender.com/api/settings/'); if (sRes.ok) setSettings(await sRes.json());
    } catch (error) { console.error("Backend offline."); }
  };
  
  useEffect(() => { 
    fetchAllData(); 
    const interval = setInterval(fetchAllData, 10000); 
    return () => clearInterval(interval);
  }, []);

  const addToCart = (product, size) => { setCartItems([...cartItems, { ...product, size }]); setIsCartOpen(true); };
  const removeFromCart = (idx) => setCartItems(cartItems.filter((_, i) => i !== idx));

  return (
    <Router>
      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} cartItems={cartItems} removeFromCart={removeFromCart} />
      <Routes>
        <Route path="/" element={<HomePage products={products} categories={categories} gallery={gallery} pages={pages} cartItems={cartItems} setIsCartOpen={setIsCartOpen} addToCart={addToCart} settings={settings} />} />
        <Route path="/admin" element={<AdminPage fetchAllData={fetchAllData} products={products} categories={categories} gallery={gallery} settings={settings} pages={pages} />} />
        <Route path="/p/:slug" element={<CustomPage pages={pages} settings={settings} cartItems={cartItems} setIsCartOpen={setIsCartOpen} />} />
      </Routes>
    </Router>
  );
}