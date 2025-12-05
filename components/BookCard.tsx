import React from 'react';
import { Book } from '../types';
import { Star, ShoppingBag } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
  onAddToCart: (book: Book, e: React.MouseEvent) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick, onAddToCart }) => {
  return (
    <div 
      className="group relative flex flex-col w-[200px] flex-shrink-0 cursor-pointer transition-transform hover:-translate-y-2 duration-300"
      onClick={() => onClick(book)}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md shadow-md group-hover:shadow-xl transition-shadow">
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        
        {book.isBestseller && (
          <span className="absolute top-2 right-2 bg-ws-gold text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Bestseller
          </span>
        )}
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="font-serif text-lg leading-tight text-ws-black line-clamp-2 group-hover:underline decoration-ws-gold decoration-2 underline-offset-4">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 font-medium">{book.author}</p>
        
        <div className="flex items-center justify-between pt-2">
          <span className="font-serif text-lg font-bold">£{book.price.toFixed(2)}</span>
          <div className="flex items-center text-yellow-500 text-xs gap-0.5">
             <Star size={12} fill="currentColor" />
             <span>{book.rating}</span>
          </div>
        </div>
      </div>
      
      <button 
        onClick={(e) => onAddToCart(book, e)}
        className="mt-3 w-full bg-transparent border border-ws-black text-ws-black py-2 text-xs font-bold uppercase tracking-widest hover:bg-ws-black hover:text-white transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100"
      >
        <ShoppingBag size={14} /> Add to Bag
      </button>
    </div>
  );
};

export default BookCard;
