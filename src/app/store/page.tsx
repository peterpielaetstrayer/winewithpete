import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function StorePage(){
  const ProductCard = ({ 
    title, 
    price, 
    image, 
    description, 
    badge, 
    featured = false 
  }: {
    title: string;
    price: string;
    image: string;
    description: string;
    badge?: string;
    featured?: boolean;
  }) => (
    <div className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-lg transition-all duration-300 ${featured ? 'md:col-span-2' : ''}`}>
      {badge && (
        <Badge className="absolute top-4 left-4 z-10 bg-[var(--wwp-ember)] text-white">
          {badge}
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
          <Button className="bg-black hover:bg-black/80 text-white rounded-full px-4 py-2 text-sm self-start sm:self-auto">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">Wine With Pete Store</h1>
        <p className="text-lg text-black/70 max-w-2xl mx-auto">
          Thoughtful products for those who appreciate the slower things in life. 
          From art prints to conversation starters.
        </p>
      </div>

      {/* Featured Product */}
      <div className="mb-16">
        <h2 className="text-2xl font-serif mb-8">Featured</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <ProductCard
            title="Wine Lady Art Print"
            price="from $50.00"
            image="/wine-lady.jpg"
            description="A stunning Art Nouveau-inspired illustration of a sophisticated wine lady. Perfect for creating an elegant atmosphere in your home."
            badge="Bestseller"
            featured={true}
          />
        </div>
      </div>

      {/* Wine Bear Collection */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-serif">Wine Bear Collection</h2>
          <Badge variant="outline" className="text-[var(--wwp-ember)] border-[var(--wwp-ember)]">
            Playful
          </Badge>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            title="Wine Bear Baseball Cap"
            price="$34.99"
            image="/wine-bear-cap.jpg"
            description="Comfortable trucker cap featuring our beloved wine bear. Perfect for casual wine tastings and outdoor gatherings."
          />
          <ProductCard
            title="Wine Bear T-Shirt"
            price="$29.99"
            image="/wine-bear-shirt.jpg"
            description="Soft cotton tee with embroidered wine bear patch. Available in multiple colors and sizes."
          />
          <ProductCard
            title="Campfire Bear T-Shirt"
            price="$29.99"
            image="/campfire-bear.jpg"
            description="Cozy campfire scene with our bear friend. Perfect for those who love both wine and the great outdoors."
          />
        </div>
      </div>

      {/* Wine With Collection */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-serif">Wine With Collection</h2>
          <Badge variant="outline" className="text-[var(--wwp-ember)] border-[var(--wwp-ember)]">
            Essential
          </Badge>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            title="Hardcover Bound Notebook"
            price="$19.99"
            image="/notebook.jpg"
            description="Premium hardcover notebook for capturing thoughts, wine notes, and conversations. Elastic closure and ribbon bookmark included."
          />
          <ProductCard
            title="Wine Tumbler"
            price="$29.99"
            image="/wine-tumbler.jpg"
            description="Insulated wine tumbler with thought bubble design. Keeps your wine at the perfect temperature for hours."
          />
          <ProductCard
            title="Wine With Pete Trucker Cap"
            price="$34.99"
            image="/trucker-cap.jpg"
            description="Classic trucker cap with embroidered Wine With Pete logo. Mesh back for breathability."
          />
        </div>
      </div>

      {/* Wine Art Collection */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-serif">Wine Art Collection</h2>
          <Badge variant="outline" className="text-[var(--wwp-ember)] border-[var(--wwp-ember)]">
            Artistic
          </Badge>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            title="#winestagram Hoodie"
            price="from $49.99"
            image="/winestagram-hoodie.jpg"
            description="Comfortable hoodie featuring vibrant wine-inspired artwork. Perfect for cozy wine nights at home."
          />
          <ProductCard
            title="#MEGA-PINT Hoodie"
            price="from $49.99"
            image="/mega-pint-hoodie.jpg"
            description="Bold design celebrating the art of wine appreciation. Available in multiple colors."
          />
          <ProductCard
            title="Gothic Wine Lady Tapestry"
            price="from $79.99"
            image="/gothic-tapestry.jpg"
            description="Dramatic gothic-style wine lady tapestry. Perfect for creating an atmospheric wine room or study."
          />
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-white rounded-2xl p-12 border">
        <h3 className="text-2xl font-serif mb-4">Questions about our products?</h3>
        <p className="text-black/70 mb-6 max-w-lg mx-auto">
          We're here to help you find the perfect piece for your wine journey. 
          Reach out with any questions about sizing, materials, or custom orders.
        </p>
        <Button className="bg-[var(--wwp-ember)] hover:opacity-90 text-white rounded-full px-8">
          Contact Us
        </Button>
      </div>
    </div>
  );
}
