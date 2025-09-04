'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, Event, Order } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'events' | 'orders'>('products');
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchData();
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoginError(error.message);
        return;
      }

      setUser(data.user);
      fetchData();
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProducts([]);
    setEvents([]);
    setOrders([]);
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('No session found');
        return;
      }

      // Fetch products with session
      const productsRes = await fetch('/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      const productsData = await productsRes.json();
      setProducts(productsData.data || []);

      // Fetch events
      const eventsRes = await fetch('/api/events');
      const eventsData = await eventsRes.json();
      setEvents(eventsData.data || []);

      // Fetch recent orders with session
      const ordersRes = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      const ordersData = await ordersRes.json();
      setOrders(ordersData.data || []);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (productId: string, isActive: boolean) => {
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('No session found');
        return;
      }

      const response = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          id: productId,
          is_active: !isActive,
        }),
      });

      if (response.ok) {
        setProducts(products.map(p => 
          p.id === productId ? { ...p, is_active: !isActive } : p
        ));
      }
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-ember border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-black/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-charcoal mb-2">Admin Login</h1>
          <p className="text-black/70">Sign in to access the admin dashboard</p>
        </div>
        
        <Card className="p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ember"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ember"
                required
              />
            </div>
            
            {loginError && (
              <div className="text-red-600 text-sm">{loginError}</div>
            )}
            
            <Button type="submit" className="w-full btn-ember">
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-ember border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-black/70">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-serif text-charcoal mb-2">Admin Dashboard</h1>
            <p className="text-black/70">Manage your Wine With Pete community</p>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        {(['products', 'events', 'orders'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-1 capitalize font-medium ${
              activeTab === tab
                ? 'text-ember border-b-2 border-ember'
                : 'text-black/70 hover:text-charcoal'
            }`}
          >
            {tab} ({tab === 'products' ? products.length : tab === 'events' ? events.length : orders.length})
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-serif text-charcoal">Products</h2>
            <Button className="btn-ember">Add Product</Button>
          </div>
          <div className="grid gap-4">
            {products.map((product) => (
              <Card key={product.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-lg">{product.name}</h3>
                      <Badge variant={product.is_active ? 'default' : 'secondary'}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{product.product_type}</Badge>
                    </div>
                    <p className="text-black/70 mb-2">{product.description}</p>
                    <p className="text-ember font-medium">${product.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleProductStatus(product.id, product.is_active)}
                    >
                      {product.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-serif text-charcoal">Events</h2>
            <Button className="btn-ember">Add Event</Button>
          </div>
          <div className="grid gap-4">
            {events.map((event) => (
              <Card key={event.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-lg">{event.title}</h3>
                      <Badge variant={event.is_active ? 'default' : 'secondary'}>
                        {event.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{event.event_type}</Badge>
                    </div>
                    <p className="text-black/70 mb-2">{event.description}</p>
                    <p className="text-sm text-black/60">
                      {new Date(event.event_date).toLocaleDateString()} • {event.current_attendees}/{event.max_attendees || '∞'} attendees
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">View RSVPs</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-xl font-serif text-charcoal">Recent Orders</h2>
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-lg">{order.name}</h3>
                      <Badge variant={
                        order.status === 'completed' ? 'default' :
                        order.status === 'pending' ? 'secondary' :
                        order.status === 'failed' ? 'destructive' : 'outline'
                      }>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-black/70 mb-1">{order.email}</p>
                    <p className="text-ember font-medium">${order.total_amount}</p>
                    <p className="text-sm text-black/60">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
