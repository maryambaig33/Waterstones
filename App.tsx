import React, { useState, useEffect } from 'react';
import { ViewState, Book, CartItem } from './types';
import { MOCK_BOOKS, CATEGORIES } from './constants';
import BookCard from './components/BookCard';
import ChatWidget from './components/ChatWidget';
import { generateBookInsights, getMoodBasedRecommendations } from './services/geminiService';
import { 
  Search, 
  ShoppingBag, 
  Menu, 
  ArrowLeft, 
  BrainCircuit, 
  Heart,
  Share2,
  BookOpen,
  X,
  Loader2,
  Sparkles
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookInsights, setBookInsights] = useState<string | null>(null);
  const [mood, setMood] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [isGeneratingRecs, setIsGeneratingRecs] = useState(false);

  // --- Handlers ---

  const addToCart = (book: Book, e: React.MouseEvent) => {
    e.stopPropagation();
    setCart(prev => {
      const existing = prev.find(item => item.id === book.id);
      if (existing) {
        return prev.map(item => item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  };

  const handleBookClick = (book: Book) => {
    setActiveBook(book);
    setBookInsights(null); // Reset insights
    setView(ViewState.DETAIL);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setView(ViewState.HOME);
    setActiveBook(null);
  };

  const loadInsights = async () => {
    if (!activeBook) return;
    setBookInsights("Analyzing literary patterns...");
    const insights = await generateBookInsights(activeBook.title, activeBook.author);
    setBookInsights(insights);
  };

  const handleMoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim()) return;
    setIsGeneratingRecs(true);
    const jsonStr = await getMoodBasedRecommendations(mood, MOCK_BOOKS);
    try {
      const recs = JSON.parse(jsonStr);
      setAiRecommendations(recs);
    } catch (e) {
      console.error("Failed to parse recommendations");
    } finally {
      setIsGeneratingRecs(false);
    }
  };

  // --- Render Sections ---

  const renderHeader = () => (
    <header className="sticky top-0 z-30 bg-ws-cream/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-4">
             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 -ml-2 hover:bg-black/5 rounded-full md:hidden">
               <Menu size={24} />
             </button>
             <div onClick={() => setView(ViewState.HOME)} className="cursor-pointer">
                <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-ws-black">
                  WATERSTONES
                </h1>
                <p className="hidden md:block text-[10px] uppercase tracking-[0.3em] text-ws-gold font-bold">
                  Next Generation
                </p>
             </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 items-center">
            {['Bestsellers', 'New Releases', 'Fiction', 'Non-Fiction', 'Children'].map(item => (
              <button key={item} className="text-sm font-medium text-ws-black hover:text-ws-gold transition-colors uppercase tracking-wider">
                {item}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? 'w-48 md:w-64' : 'w-10'}`}>
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="absolute left-0 p-2 z-10 hover:text-ws-gold">
                <Search size={20} />
              </button>
              <input 
                type="text" 
                placeholder="Search authors, titles..." 
                className={`w-full bg-transparent border-b border-ws-black pl-10 pr-4 py-1.5 focus:outline-none text-sm transition-all ${isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button className="p-2 hover:text-ws-gold relative">
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span className="absolute top-1 right-0 bg-ws-gold text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-ws-black/95 backdrop-blur-xl md:hidden flex flex-col p-8">
           <div className="flex justify-end">
             <button onClick={() => setIsMenuOpen(false)} className="text-white">
               <X size={32} />
             </button>
           </div>
           <nav className="flex flex-col gap-8 mt-12 text-center">
             {['Bestsellers', 'New Releases', 'Coming Soon', 'Signed & Special', 'Gift Cards'].map(item => (
                <button key={item} className="text-2xl font-serif text-white hover:text-ws-gold">
                  {item}
                </button>
             ))}
           </nav>
        </div>
      )}
    </header>
  );

  const renderHome = () => (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-16">
      
      {/* Hero Section */}
      <section className="relative bg-ws-black text-ws-cream rounded-2xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1507842217121-9e962835d75d?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative p-10 md:p-20 max-w-2xl space-y-6">
          <span className="inline-block bg-ws-gold text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-2">Book of the Month</span>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight">Stories that shape the world.</h2>
          <p className="text-lg md:text-xl text-gray-300 font-light">Discover our curated selection of groundbreaking fiction and essential non-fiction for the modern mind.</p>
          <button className="bg-white text-ws-black px-8 py-3 rounded-md font-bold uppercase tracking-widest hover:bg-ws-gold hover:text-white transition-colors">
            Shop The Edit
          </button>
        </div>
      </section>

      {/* Mood Matcher (AI Feature) */}
      <section className="py-12 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
         <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
               <div className="flex items-center gap-2 text-ws-gold">
                 <BrainCircuit size={24} />
                 <span className="font-bold uppercase tracking-widest text-xs">AI Mood Matcher</span>
               </div>
               <h3 className="font-serif text-3xl text-ws-black">What are you in the mood for?</h3>
               <p className="text-gray-600">Tell us how you want to feel, or what kind of world you want to escape to.</p>
               
               <form onSubmit={handleMoodSubmit} className="relative">
                 <input 
                   type="text" 
                   value={mood}
                   onChange={(e) => setMood(e.target.value)}
                   placeholder="e.g., 'A cozy mystery in the English countryside' or 'Existential sci-fi'"
                   className="w-full bg-gray-50 border border-gray-200 rounded-lg py-4 px-6 pr-14 focus:ring-2 focus:ring-ws-gold focus:outline-none transition-shadow"
                 />
                 <button 
                   type="submit"
                   disabled={isGeneratingRecs} 
                   className="absolute right-2 top-2 bottom-2 bg-ws-black text-white px-4 rounded-md hover:bg-gray-800 disabled:opacity-50"
                 >
                   {isGeneratingRecs ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                 </button>
               </form>
            </div>
            
            <div className="flex-1 w-full">
               {isGeneratingRecs ? (
                 <div className="h-48 flex items-center justify-center text-gray-400 gap-3">
                    <BrainCircuit className="animate-pulse" size={32} />
                    <span className="font-serif italic">Consulting the digital librarian...</span>
                 </div>
               ) : aiRecommendations.length > 0 ? (
                 <div className="space-y-4">
                    <h4 className="font-serif text-lg border-b border-gray-100 pb-2">We recommend:</h4>
                    {aiRecommendations.map((rec, idx) => (
                      <div key={idx} className="flex gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                         <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0" />
                         <div>
                            <p className="font-serif font-bold text-ws-black">{rec.title}</p>
                            <p className="text-xs text-gray-500">{rec.author}</p>
                            <p className="text-xs text-gray-600 mt-1 italic line-clamp-2">"{rec.reason}"</p>
                         </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 border border-dashed border-gray-200">
                    <span className="text-sm">Recommendations will appear here</span>
                 </div>
               )}
            </div>
         </div>
      </section>

      {/* Featured Shelves */}
      <section>
        <div className="flex items-center justify-between mb-8">
           <h3 className="font-serif text-2xl md:text-3xl text-ws-black">Bestsellers</h3>
           <button className="text-sm font-bold underline decoration-ws-gold underline-offset-4 hover:text-ws-gold">View All</button>
        </div>
        <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x">
          {MOCK_BOOKS.filter(b => b.isBestseller).map(book => (
            <div key={book.id} className="snap-start">
               <BookCard book={book} onClick={handleBookClick} onAddToCart={addToCart} />
            </div>
          ))}
        </div>
      </section>

       <section>
        <div className="flex items-center justify-between mb-8">
           <h3 className="font-serif text-2xl md:text-3xl text-ws-black">New & Noteworthy</h3>
           <button className="text-sm font-bold underline decoration-ws-gold underline-offset-4 hover:text-ws-gold">View All</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-12 gap-x-6">
          {MOCK_BOOKS.map(book => (
             <BookCard key={book.id} book={book} onClick={handleBookClick} onAddToCart={addToCart} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="pb-16">
        <h3 className="font-serif text-2xl mb-8">Browse by Category</h3>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map(cat => (
            <button key={cat} className="px-6 py-3 border border-gray-300 rounded-full text-sm hover:border-ws-black hover:bg-ws-black hover:text-white transition-all">
              {cat}
            </button>
          ))}
        </div>
      </section>
    </main>
  );

  const renderDetail = () => {
    if (!activeBook) return null;

    return (
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-500">
        <button onClick={handleBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-ws-black mb-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to browsing
        </button>

        <div className="grid md:grid-cols-12 gap-12">
           {/* Left Col - Image */}
           <div className="md:col-span-4 lg:col-span-3">
              <div className="sticky top-24">
                <div className="aspect-[2/3] w-full rounded-lg overflow-hidden shadow-2xl mb-6">
                  <img src={activeBook.coverUrl} alt={activeBook.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-4">
                  <button className="flex-1 bg-ws-black text-white py-3 rounded-md font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors">
                    Add to Bag
                  </button>
                  <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600">
                    <Heart size={20} />
                  </button>
                  <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
           </div>

           {/* Right Col - Details */}
           <div className="md:col-span-8 lg:col-span-9 space-y-8">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl text-ws-black mb-2">{activeBook.title}</h1>
                <p className="text-xl text-gray-600 font-medium">{activeBook.author}</p>
                <div className="flex items-center gap-4 mt-4">
                   <div className="flex text-ws-gold">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} size={16} fill={i < Math.floor(activeBook.rating) ? "currentColor" : "none"} strokeWidth={i < Math.floor(activeBook.rating) ? 0 : 2} />
                     ))}
                   </div>
                   <span className="text-sm text-gray-400">|</span>
                   <span className="text-sm text-gray-500">{activeBook.category}</span>
                </div>
                <p className="text-2xl font-bold font-serif mt-6">£{activeBook.price.toFixed(2)}</p>
              </div>

              <div className="prose prose-lg text-gray-600">
                 <p>{activeBook.description}</p>
                 <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              </div>

              {/* AI Insights Module */}
              <div className="bg-ws-cream p-6 rounded-xl border border-ws-gold/20 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                   <BrainCircuit size={100} />
                 </div>
                 
                 <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="p-2 bg-ws-black rounded-lg text-white">
                       <Sparkles size={20} />
                     </div>
                     <h3 className="font-serif text-xl font-bold">Genie's Literary Analysis</h3>
                   </div>
                   
                   {!bookInsights ? (
                     <div className="text-center py-8">
                       <p className="text-gray-600 mb-4">Unlock deeper themes and literary connections using our AI engine.</p>
                       <button 
                         onClick={loadInsights}
                         className="bg-white border border-ws-black px-6 py-2 rounded-full text-sm font-bold hover:bg-ws-black hover:text-white transition-all flex items-center gap-2 mx-auto"
                       >
                         <BrainCircuit size={16} /> Analyze This Book
                       </button>
                     </div>
                   ) : (
                     <div className="bg-white/50 p-4 rounded-lg animate-in fade-in slide-in-from-bottom-2">
                       {bookInsights === "Analyzing literary patterns..." ? (
                          <div className="flex items-center gap-2 text-ws-gold">
                            <Loader2 className="animate-spin" />
                            <span>Reading between the lines...</span>
                          </div>
                       ) : (
                         <div className="prose prose-sm font-serif text-ws-black whitespace-pre-wrap">
                           {bookInsights}
                         </div>
                       )}
                     </div>
                   )}
                 </div>
              </div>
              
              {/* Additional Tabs (Mock) */}
              <div className="border-t border-gray-200 pt-8 mt-12">
                 <div className="flex gap-8 mb-6">
                    <button className="font-bold border-b-2 border-ws-black pb-1">Reviews</button>
                    <button className="text-gray-500 hover:text-black">Product Details</button>
                    <button className="text-gray-500 hover:text-black">About the Author</button>
                 </div>
                 <div className="space-y-6">
                    {[1, 2].map((i) => (
                      <div key={i} className="border-b border-gray-100 pb-6 last:border-0">
                         <div className="flex items-center gap-2 mb-2">
                            <div className="flex text-yellow-500"><Star size={12} fill="currentColor" /></div>
                            <span className="font-bold text-sm">A Reader</span>
                         </div>
                         <p className="text-gray-600 text-sm">An absolute masterpiece. Couldn't put it down.</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </main>
    );
  };

  const Star = ({ size = 24, fill = "none", strokeWidth = 2, className = "" }: any) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={fill} 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );

  return (
    <div className="min-h-screen bg-ws-cream font-sans selection:bg-ws-gold selection:text-white pb-24">
      {renderHeader()}
      {view === ViewState.HOME && renderHome()}
      {view === ViewState.DETAIL && renderDetail()}
      
      {/* Footer */}
      <footer className="bg-ws-black text-white py-12 mt-12">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
               <h2 className="font-serif text-2xl font-bold mb-4">WATERSTONES</h2>
               <p className="text-gray-400 max-w-sm">The last remaining chain of bookshops on the High Street, reimagined for the AI age.</p>
            </div>
            <div>
               <h4 className="font-bold mb-4">Help & Support</h4>
               <ul className="space-y-2 text-gray-400 text-sm">
                  <li>Delivery Options</li>
                  <li>Returns</li>
                  <li>Help Centre</li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold mb-4">About Us</h4>
               <ul className="space-y-2 text-gray-400 text-sm">
                  <li>Careers</li>
                  <li>Our Story</li>
                  <li>Sustainability</li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-xs">
            © 2024 Waterstones NextGen Demo. All rights reserved.
         </div>
      </footer>

      <ChatWidget />
    </div>
  );
};

export default App;