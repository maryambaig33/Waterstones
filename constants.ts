import { Book } from './types';

export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    price: 16.99,
    coverUrl: 'https://picsum.photos/id/24/300/450',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
    category: 'Fiction',
    rating: 4.8,
    isBestseller: true
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 14.99,
    coverUrl: 'https://picsum.photos/id/20/300/450',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving--every day.',
    category: 'Non-Fiction',
    rating: 4.9,
    isBestseller: true
  },
  {
    id: '3',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    price: 18.99,
    coverUrl: 'https://picsum.photos/id/1015/300/450',
    description: 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.',
    category: 'Sci-Fi',
    rating: 4.9,
    isBestseller: true
  },
  {
    id: '4',
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    price: 15.99,
    coverUrl: 'https://picsum.photos/id/1060/300/450',
    description: 'A modern classic about video games, love, and the complexity of human connection.',
    category: 'Fiction',
    rating: 4.5
  },
  {
    id: '5',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    price: 12.99,
    coverUrl: 'https://picsum.photos/id/1050/300/450',
    description: 'Explore the history of our species from the Stone Age to the Silicon Age.',
    category: 'History',
    rating: 4.7
  },
  {
    id: '6',
    title: 'Dune',
    author: 'Frank Herbert',
    price: 20.00,
    coverUrl: 'https://picsum.photos/id/1044/300/450',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange.',
    category: 'Sci-Fi',
    rating: 4.8
  },
  {
    id: '7',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    price: 13.99,
    coverUrl: 'https://picsum.photos/id/1035/300/450',
    description: 'The major work of the Nobel Prize winner, explaining the two systems that drive the way we think.',
    category: 'Psychology',
    rating: 4.6
  },
  {
    id: '8',
    title: 'The Thursday Murder Club',
    author: 'Richard Osman',
    price: 10.00,
    coverUrl: 'https://picsum.photos/id/1031/300/450',
    description: 'In a peaceful retirement village, four unlikely friends meet weekly in the Jigsaw Room to discuss unsolved crimes.',
    category: 'Crime',
    rating: 4.4,
    isBestseller: true
  }
];

export const CATEGORIES = ['Fiction', 'Non-Fiction', 'Sci-Fi', 'History', 'Crime', 'Biography', 'Children', 'Art'];
