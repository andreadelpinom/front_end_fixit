export type Request = {
  id: string; title: string; description: string;
  client: string; clientPhone: string;
  clientRating: number; clientReviews: number;
  date: string; time: string; location: string; address: string;
  price: number; urgency: 'Normal' | 'Urgente';
  status: string; isNew: boolean; category: string;
  details: string[]; requirements: string[];
};