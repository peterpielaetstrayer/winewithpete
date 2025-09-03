import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function StorePage(){
  const ProductCard = ({ 
    title, 
    price, 
    image, 
    description, 
    badge, 
    featured = false,
    comingSoon = false
  }: {
    title: string;
    price: string;
    image: string;
    description: string;
    badge?: string;
    featured?: boolean;
    comingSoon?: boolean;
  }) => (
    <div className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-lg transition-all duration-300 ${featured ? 'md:col-span-2' : ''}`}>
      {badge && (
        <Badge className="absolute top-4 left-4 z-10 bg-[var(--wwp-ember)] text-white">
          {badge}
        </Badge>
      )}
      {comingSoon && (
        <Badge className="absolute top-4 right-4 z-10 bg-gray-500 text-white">
          Coming Soon
        </Badge>
      )}
      <div className={`aspect-square bg-gray-100 relative overflow-hidden ${featured ? 'md:aspect-[4/3]' : ''}`}>
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Product Image</div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-medium text-lg mb-2">{title}</h3>
        <p className="text-sm text-black/70 mb-4 line-clamp-2">{description}</p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="text-xl font-serif text-[var(--wwp-ember)]">{price}</span>
          <Button 
            className="bg-black hover:bg-black/80 text-white rounded-full px-4 py-2 text-sm self-start sm:self-auto"
            disabled={comingSoon}
          >
            {comingSoon ? 'Coming Soon' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">Wine With Pete Store</h1>
        <p className="text-lg text-black/70 max-w-2xl mx-auto">
          Curated essentials for the slow living community. 
          Quality over quantity, meaning over mass production.
        </p>
      </div>

      {/* Community Favorites */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-serif">Community Favorites</h2>
          <Badge variant="outline" className="text-[var(--wwp-ember)] border-[var(--wwp-ember)]">
            Best Sellers
          </Badge>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <ProductCard
            title="#winestagram Hoodie"
            price="from $49.99"
            image="/winestagram-hoodie.jpg"
            description="Comfortable hoodie featuring vibrant wine-inspired artwork. Perfect for cozy wine nights at home."
            badge="Popular"
          />
          <ProductCard
            title="#MEGA-PINT Hoodie"
            price="from $49.99"
            image="/mega-pint-hoodie.jpg"
            description="Bold design celebrating the art of wine appreciation. Available in multiple colors."
            badge="Popular"
          />
        </div>
      </div>

      {/* Digital Recipes - Coming Soon */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-serif">Fire & Food Collection</h2>
          <Badge variant="outline" className="text-[var(--wwp-ember)] border-[var(--wwp-ember)]">
            Digital
          </Badge>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            title="Open Fire Recipe Collection"
            price="$12.99"
            image="/fire-recipes.jpg"
            description="10 carefully crafted recipes designed for cooking over open fire. Includes wine pairings and conversation starters."
            comingSoon={true}
          />
          <ProductCard
            title="Salon Dinner Menu Guide"
            price="$8.99"
            image="/dinner-guide.jpg"
            description="Curated menu ideas for intimate gatherings. Wine pairings, conversation topics, and hosting tips included."
            comingSoon={true}
          />
          <ProductCard
            title="Seasonal Fire Cooking"
            price="$15.99"
            image="/seasonal-recipes.jpg"
            description="Year-round recipes that celebrate the seasons. From summer beach fires to winter hearth cooking."
            comingSoon={true}
          />
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="mb-16">
        <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
          <h3 className="text-2xl font-serif font-semibold mb-4">More Coming Soon</h3>
          <p className="text-black/70 mb-6 max-w-2xl mx-auto">
            We're working on bringing you more thoughtful products that align with our mission. 
            Think conversation starter cards, fire-starting kits, and curated wine selections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="border-[var(--wwp-ember)] text-[var(--wwp-ember)] hover:bg-[var(--wwp-ember)] hover:text-white rounded-full px-6">
              Get Notified
            </Button>
            <Button className="bg-[var(--wwp-ember)] hover:opacity-90 text-white rounded-full px-6">
              Join the Circle
            </Button>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="text-center bg-white rounded-2xl p-12 border">
        <h3 className="text-2xl font-serif font-semibold mb-4">Our Store Philosophy</h3>
        <p className="text-black/70 mb-6 max-w-3xl mx-auto">
          We believe in quality over quantity. Every product we offer is carefully selected 
          to enhance your slow living journey. No mass production, no fast fashion, no meaningless merch. 
          Just thoughtful items that bring people together around fire, food, and conversation.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-xl">🔥</span>
            </div>
            <h4 className="font-medium mb-2">Quality First</h4>
            <p className="text-sm text-black/70">Every item is chosen for its quality and alignment with our values.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-xl">🌱</span>
            </div>
            <h4 className="font-medium mb-2">Slow & Sustainable</h4>
            <p className="text-sm text-black/70">We prioritize sustainable practices and thoughtful consumption.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-[var(--wwp-gold)] to-amber-500 rounded-full flex items-center justify-center">
              <span className="text-xl">🤝</span>
            </div>
            <h4 className="font-medium mb-2">Community Focused</h4>
            <p className="text-sm text-black/70">Products that bring people together and enhance connection.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
