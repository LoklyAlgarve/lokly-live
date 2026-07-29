export type Event = {
  id: number;
  title: string;
  location: string;
  date: string;
  time: string;
  category: string;
  price: string;
  image: string;
  featured: boolean;
};

export const events: Event[] = [
  {
    id: 1,
    title: "Alte Summer Market",
    location: "Alte",
    date: "Today",
    time: "18:00",
    category: "Markets",
    price: "Free",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200",
    featured: true,
  },
  {
    id: 2,
    title: "Lagoa Wine Festival",
    location: "Lagoa",
    date: "Saturday",
    time: "17:00",
    category: "Food & Drink",
    price: "€12",
    image:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200",
    featured: true,
  },
  {
    id: 3,
    title: "Silves Street Festival",
    location: "Silves",
    date: "Sunday",
    time: "14:00",
    category: "Music",
    price: "Free",
    image:
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200",
    featured: true,
  },
];