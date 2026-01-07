'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Product, Event, Order, FeaturedEssay } from '@/lib/types';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [essays, setEssays] = useState<FeaturedEssay[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'events' | 'orders' | 'campaigns' | 'printful' | 'essays'>('products');
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Campaign state
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignHtml, setCampaignHtml] = useState('');
  const [campaignText, setCampaignText] = useState('');
  const [campaignLimit, setCampaignLimit] = useState('');
  const [campaignSending, setCampaignSending] = useState(false);
  const [campaignResult, setCampaignResult] = useState<{success: boolean; message: string; sent?: number; failed?: number; total?: number} | null>(null);
  
  // Printful state
  const [printfulProducts, setPrintfulProducts] = useState<any[]>([]);
  const [printfulLoading, setPrintfulLoading] = useState(false);
  const [printfulError, setPrintfulError] = useState<{error: string; details?: string; suggestion?: string} | null>(null);
  const [selectedPrintfulProducts, setSelectedPrintfulProducts] = useState<Set<string>>(new Set());
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{success: boolean; message: string; synced?: number; errors?: any[]} | null>(null);
  
  // Essays state
  const [newEssayUrl, setNewEssayUrl] = useState('');
  const [fetchingMetadata, setFetchingMetadata] = useState(false);
  const [draggedEssayId, setDraggedEssayId] = useState<string | null>(null);
  const [essaysError, setEssaysError] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // Dynamic import to avoid build-time issues
      const { supabase } = await import('@/lib/supabase/client');
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
      const { supabase } = await import('@/lib/supabase/client');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.includes('rate limit') || error.message.includes('too many')) {
          setLoginError('Too many login attempts. Please wait before trying again.');
        } else {
          setLoginError('Invalid email or password.');
        }
        return;
      }

      setUser(data.user);
      fetchData();
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    const { supabase } = await import('@/lib/supabase/client');
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
      // Dynamic import to avoid build-time issues
      const { supabase } = await import('@/lib/supabase/client');
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

      // Fetch featured essays with session
      try {
        const essaysRes = await fetch('/api/admin/essays', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        const essaysData = await essaysRes.json();
        if (essaysData.error) {
          console.error('Essays fetch error:', essaysData.error, essaysData.details);
          setEssaysError(essaysData.details || essaysData.error);
          setEssays([]);
        } else {
          setEssaysError(null);
          setEssays(essaysData.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch essays:', error);
        setEssaysError('Failed to connect to server');
        setEssays([]);
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (productId: string, isActive: boolean) => {
    try {
      // Dynamic import to avoid build-time issues
      const { supabase } = await import('@/lib/supabase/client');
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
        {(['products', 'events', 'orders', 'campaigns', 'printful', 'essays'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-1 capitalize font-medium ${
              activeTab === tab
                ? 'text-ember border-b-2 border-ember'
                : 'text-black/70 hover:text-charcoal'
            }`}
          >
            {tab} {tab !== 'campaigns' && tab !== 'printful' && `(${tab === 'products' ? products.length : tab === 'events' ? events.length : tab === 'orders' ? orders.length : essays.length})`}
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
                      {product.is_featured && (
                        <Badge variant="default" className="bg-ember/20 text-ember border-ember/30">
                          Featured
                        </Badge>
                      )}
                      <Badge variant="outline">{product.product_type}</Badge>
                    </div>
                    <p className="text-black/70 mb-2">{product.description}</p>
                    <p className="text-ember font-medium">${product.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        const { supabase } = await import('@/lib/supabase/client');
                        const { data: { session } } = await supabase.auth.getSession();
                        if (!session) return;
                        
                        const response = await fetch('/api/admin/products', {
                          method: 'PATCH',
                          headers: {
                            'Authorization': `Bearer ${session.access_token}`,
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            id: product.id,
                            is_featured: !product.is_featured,
                          }),
                        });
                        
                        if (response.ok) {
                          setProducts(products.map(p => 
                            p.id === product.id ? { ...p, is_featured: !product.is_featured } : p
                          ));
                        }
                      }}
                      className={product.is_featured ? 'bg-ember/10 border-ember/30' : ''}
                    >
                      {product.is_featured ? '★ Featured' : '☆ Feature'}
                    </Button>
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

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-serif text-charcoal mb-2">Email Campaigns</h2>
            <p className="text-black/70">Send email campaigns to all newsletter subscribers using Resend</p>
          </div>

          <Card className="p-6">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCampaignSending(true);
                setCampaignResult(null);

                try {
                  const response = await fetch('/api/campaigns/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      subject: campaignSubject,
                      html: campaignHtml,
                      text: campaignText || undefined,
                      limit: campaignLimit ? parseInt(campaignLimit) : undefined,
                    }),
                  });

                  const data = await response.json();

                  if (response.ok) {
                    setCampaignResult({
                      success: true,
                      message: data.message || 'Campaign sent successfully!',
                      sent: data.sent,
                      failed: data.failed,
                      total: data.total,
                    });
                    // Clear form
                    setCampaignSubject('');
                    setCampaignHtml('');
                    setCampaignText('');
                    setCampaignLimit('');
                  } else {
                    setCampaignResult({
                      success: false,
                      message: data.error || 'Failed to send campaign',
                    });
                  }
                } catch (error) {
                  setCampaignResult({
                    success: false,
                    message: error instanceof Error ? error.message : 'Failed to send campaign',
                  });
                } finally {
                  setCampaignSending(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-charcoal mb-1">
                  Subject Line *
                </label>
                <Input
                  id="subject"
                  value={campaignSubject}
                  onChange={(e) => setCampaignSubject(e.target.value)}
                  placeholder="Weekly Newsletter - December 6"
                  required
                />
              </div>

              <div>
                <label htmlFor="html" className="block text-sm font-medium text-charcoal mb-1">
                  HTML Content *
                </label>
                <Textarea
                  id="html"
                  value={campaignHtml}
                  onChange={(e) => setCampaignHtml(e.target.value)}
                  placeholder='<h1>Hello {name}!</h1><p>Your weekly update...</p>'
                  rows={12}
                  required
                  className="font-mono text-sm"
                />
                <p className="text-xs text-black/60 mt-1">
                  Use {'{name}'} to personalize with subscriber names
                </p>
              </div>

              <div>
                <label htmlFor="text" className="block text-sm font-medium text-charcoal mb-1">
                  Plain Text Content (Optional)
                </label>
                <Textarea
                  id="text"
                  value={campaignText}
                  onChange={(e) => setCampaignText(e.target.value)}
                  placeholder="Plain text version for email clients that don't support HTML"
                  rows={6}
                />
                <p className="text-xs text-black/60 mt-1">
                  Recommended: Include plain text for better deliverability
                </p>
              </div>

              <div>
                <label htmlFor="limit" className="block text-sm font-medium text-charcoal mb-1">
                  Test Limit (Optional)
                </label>
                <Input
                  id="limit"
                  type="number"
                  value={campaignLimit}
                  onChange={(e) => setCampaignLimit(e.target.value)}
                  placeholder="Leave empty to send to all subscribers"
                  min="1"
                />
                <p className="text-xs text-black/60 mt-1">
                  Test with a small number before sending to everyone
                </p>
              </div>

              {campaignResult && (
                <div
                  className={`p-4 rounded-md ${
                    campaignResult.success
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <p className="font-medium">{campaignResult.message}</p>
                  {campaignResult.success && campaignResult.total && (
                    <p className="text-sm mt-1">
                      Sent: {campaignResult.sent} | Failed: {campaignResult.failed || 0} | Total: {campaignResult.total}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="btn-ember"
                  disabled={campaignSending || !campaignSubject || !campaignHtml}
                >
                  {campaignSending ? 'Sending...' : 'Send Campaign'}
                </Button>
                {campaignResult?.success && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCampaignResult(null)}
                  >
                    Clear Result
                  </Button>
                )}
              </div>
            </form>
          </Card>

          <Card className="p-6 bg-amber-50 border-amber-200">
            <h3 className="font-medium text-charcoal mb-2">💡 Tips</h3>
            <ul className="text-sm text-black/70 space-y-1 list-disc list-inside">
              <li>Always test with limit: 1 before sending to all subscribers</li>
              <li>Include both HTML and plain text for better deliverability</li>
              <li>Use {'{name}'} in your content to personalize emails</li>
              <li>Keep subject lines clear and engaging</li>
              <li>Check Resend dashboard for delivery status and analytics</li>
            </ul>
          </Card>
        </div>
      )}

      {/* Printful Tab */}
      {activeTab === 'printful' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-serif text-charcoal mb-2">Printful Products</h2>
              <p className="text-black/70">Browse your Printful catalog and sync products to your store</p>
            </div>
            <Button 
              className="btn-ember"
              onClick={async () => {
                setPrintfulLoading(true);
                setPrintfulProducts([]);
                setSyncResult(null);
                setPrintfulError(null);
                try {
                  const response = await fetch('/api/printful/catalog');
                  const data = await response.json();
                  if (data.success) {
                    setPrintfulProducts(data.data || []);
                    setPrintfulError(null);
                  } else {
                    // Store error for display
                    setPrintfulError({
                      error: data.error || 'Failed to fetch Printful products',
                      details: data.details,
                      suggestion: data.suggestion
                    });
                    console.error('Printful catalog error:', data);
                  }
                } catch (error) {
                  setPrintfulError({
                    error: 'Failed to fetch Printful products',
                    details: error instanceof Error ? error.message : String(error)
                  });
                  console.error('Printful fetch error:', error);
                } finally {
                  setPrintfulLoading(false);
                }
              }}
              disabled={printfulLoading}
            >
              {printfulLoading ? 'Loading...' : 'Fetch Printful Catalog'}
            </Button>
          </div>

          {/* Error Display for Catalog Fetch */}
          {printfulError && (
            <Card className="p-4 bg-red-50 border-red-200">
              <p className="font-medium text-red-800 mb-2">
                {printfulError.error}
              </p>
              {printfulError.details && (
                <p className="text-sm text-red-700 mb-2">
                  <strong>Details:</strong> {printfulError.details}
                </p>
              )}
              {printfulError.suggestion && (
                <p className="text-sm text-red-600 mt-2 italic">
                  💡 {printfulError.suggestion}
                </p>
              )}
            </Card>
          )}

          {!printfulError && printfulProducts.length === 0 && !printfulLoading && (
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <p className="text-sm text-yellow-800">
                No products loaded. Click "Fetch Printful Catalog" to load products.
              </p>
            </Card>
          )}

          {syncResult && (
            <Card className={`p-4 ${syncResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`font-medium ${syncResult.success ? 'text-green-800' : 'text-red-800'}`}>
                {syncResult.message}
              </p>
              {syncResult.success && syncResult.synced !== undefined && (
                <p className="text-sm mt-1 text-green-700">
                  Successfully synced {syncResult.synced} product(s)
                </p>
              )}
              {syncResult.errors && syncResult.errors.length > 0 && (
                <div className="mt-2 text-sm text-red-700">
                  <p className="font-medium">Errors:</p>
                  <ul className="list-disc list-inside">
                    {syncResult.errors.map((err: any, idx: number) => (
                      <li key={idx}>{err.product}: {err.error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          )}

          {printfulProducts.length > 0 && (
            <>
              <div className="flex justify-between items-center">
                <p className="text-black/70">
                  {selectedPrintfulProducts.size} product(s) selected
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPrintfulProducts(new Set())}
                  >
                    Clear Selection
                  </Button>
                  <Button
                    className="btn-ember"
                    onClick={async () => {
                      if (selectedPrintfulProducts.size === 0) {
                        alert('Please select at least one product');
                        return;
                      }
                      
                      setSyncing(true);
                      setSyncResult(null);
                      
                      const selectedProducts = printfulProducts.filter(p => 
                        selectedPrintfulProducts.has(p.id?.toString() || p.sync_product?.id?.toString())
                      );
                      
                      try {
                        const response = await fetch('/api/printful/sync', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ products: selectedProducts }),
                        });
                        
                        const data = await response.json();
                        
                        if (data.success) {
                          setSyncResult({
                            success: true,
                            message: `Successfully synced ${data.synced} product(s) to your store`,
                            synced: data.synced,
                            errors: data.errors,
                          });
                          setSelectedPrintfulProducts(new Set());
                          // Refresh products list
                          fetchData();
                        } else {
                          setSyncResult({
                            success: false,
                            message: data.error || 'Failed to sync products',
                            errors: data.errors,
                          });
                        }
                      } catch (error) {
                        setSyncResult({
                          success: false,
                          message: 'Failed to sync products',
                        });
                      } finally {
                        setSyncing(false);
                      }
                    }}
                    disabled={syncing || selectedPrintfulProducts.size === 0}
                  >
                    {syncing ? 'Syncing...' : `Sync ${selectedPrintfulProducts.size} Selected`}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {printfulProducts.map((product) => {
                  const productId = product.id?.toString() || product.sync_product?.id?.toString();
                  const isSelected = selectedPrintfulProducts.has(productId);
                  
                  // Better data extraction
                  const syncProduct = product.sync_product || product;
                  const syncVariants = product.sync_variants || product.variants || [];
                  const mainVariant = syncVariants[0];
                  
                  // Get image from multiple possible locations
                  const image = syncProduct.thumbnail_url || 
                               syncProduct.preview_url ||
                               syncProduct.image ||
                               mainVariant?.preview_image ||
                               mainVariant?.files?.[0]?.preview_url ||
                               mainVariant?.files?.[0]?.url ||
                               null;
                  
                  // Better price extraction
                  const retailPrice = mainVariant?.retail_price || mainVariant?.price;
                  const price = retailPrice 
                    ? `$${(retailPrice / 100).toFixed(2)}`
                    : mainVariant?.retail_price === 0 
                    ? 'Free'
                    : 'Price TBD';
                  
                  const name = syncProduct.name || product.name || 'Unnamed Product';
                  const description = syncProduct.description || product.description || '';
                  const isWineBear = name.toLowerCase().includes('wine bear') || 
                                   name.toLowerCase().includes('winebear') ||
                                   description.toLowerCase().includes('wine bear');
                  
                  // Get variant details
                  const variantCount = syncVariants.length;
                  const variantInfo = variantCount > 0 
                    ? `${variantCount} variant(s)${mainVariant?.name ? ` - ${mainVariant.name}` : ''}`
                    : 'No variants';

                  return (
                    <Card 
                      key={productId} 
                      className={`p-4 cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-ember bg-ember/5' : ''
                      }`}
                      onClick={() => {
                        const newSelected = new Set(selectedPrintfulProducts);
                        if (isSelected) {
                          newSelected.delete(productId);
                        } else {
                          newSelected.add(productId);
                        }
                        setSelectedPrintfulProducts(newSelected);
                      }}
                    >
                      {/* Product Image */}
                      {image ? (
                        <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100">
                          <img 
                            src={image} 
                            alt={name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="aspect-square mb-3 rounded-lg bg-gray-100 flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-xs">No Image</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Product Info */}
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-base line-clamp-2 flex-1 pr-2">{name}</h3>
                        {isWineBear && (
                          <Badge variant="outline" className="ml-2 text-xs border-ember text-ember shrink-0">
                            Wine Bear
                          </Badge>
                        )}
                      </div>
                      
                      {/* Description if available */}
                      {description && (
                        <p className="text-xs text-black/60 mb-2 line-clamp-2">{description}</p>
                      )}
                      
                      {/* Price and Variant Info */}
                      <div className="mb-2">
                        <p className="text-ember font-medium text-sm">{price}</p>
                        <p className="text-xs text-black/60 mt-1">
                          {variantInfo}
                        </p>
                      </div>
                      
                      {/* Printful ID for reference */}
                      <p className="text-xs text-black/40 mb-3 font-mono">
                        ID: {productId}
                      </p>
                      
                      {/* Selection Checkbox */}
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            const newSelected = new Set(selectedPrintfulProducts);
                            if (isSelected) {
                              newSelected.delete(productId);
                            } else {
                              newSelected.add(productId);
                            }
                            setSelectedPrintfulProducts(newSelected);
                          }}
                          className="w-4 h-4 text-ember border-gray-300 rounded focus:ring-ember"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <label className="text-xs text-black/70">Select to sync</label>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          )}

          {printfulProducts.length === 0 && !printfulLoading && (
            <Card className="p-8 text-center">
              <p className="text-black/70 mb-4">Click "Fetch Printful Catalog" to load your products</p>
            </Card>
          )}
        </div>
      )}

      {/* Essays Tab */}
      {activeTab === 'essays' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-serif text-charcoal mb-2">Featured Essays</h2>
              <p className="text-black/70">Manage your curated essay collection for the onboarding journey</p>
            </div>
          </div>

          {essaysError && (
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <p className="font-medium text-yellow-800 mb-2">⚠️ Setup Required</p>
              <p className="text-sm text-yellow-700 mb-2">{essaysError}</p>
              <p className="text-xs text-yellow-600">
                Run the SQL migration in Supabase: <code className="bg-yellow-100 px-1 rounded">create-featured-essays-table.sql</code>
              </p>
            </Card>
          )}

          {/* Add New Essay Form */}
          <Card className="p-6">
            <h3 className="font-medium mb-4">Add New Essay</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Substack URL</label>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    value={newEssayUrl}
                    onChange={(e) => setNewEssayUrl(e.target.value)}
                    placeholder="https://winewithpete.substack.com/p/essay-slug"
                    className="flex-1"
                  />
                  <Button
                    onClick={async () => {
                      if (!newEssayUrl.trim()) return;
                      setFetchingMetadata(true);
                      try {
                        // Fetch OG metadata
                        const metadataRes = await fetch('/api/og-metadata', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ url: newEssayUrl }),
                        });
                        const metadataData = await metadataRes.json();
                        
                        if (!metadataData.success) {
                          alert('Failed to fetch metadata: ' + (metadataData.error || 'Unknown error'));
                          setFetchingMetadata(false);
                          return;
                        }

                        // Log what we got for debugging
                        console.log('Fetched metadata:', metadataData.metadata);
                        
                        // Show preview of what will be saved
                        if (!metadataData.metadata.description && !metadataData.metadata.image) {
                          const confirm = window.confirm(
                            `Title: ${metadataData.metadata.title || 'Not found'}\n\n` +
                            `Description: ${metadataData.metadata.description || 'Not found'}\n\n` +
                            `Image: ${metadataData.metadata.image || 'Not found'}\n\n` +
                            `Continue anyway?`
                          );
                          if (!confirm) {
                            setFetchingMetadata(false);
                            return;
                          }
                        }

                        const { supabase } = await import('@/lib/supabase/client');
                        const { data: { session } } = await supabase.auth.getSession();
                        
                        if (!session) {
                          alert('Not authenticated');
                          return;
                        }

                        // Get max display_order
                        const currentEssaysRes = await fetch('/api/admin/essays', {
                          headers: { 'Authorization': `Bearer ${session.access_token}` },
                        });
                        const currentEssaysData = await currentEssaysRes.json();
                        const maxOrder = currentEssaysData.data?.length > 0
                          ? Math.max(...currentEssaysData.data.map((e: FeaturedEssay) => e.display_order))
                          : 0;

                        // Create essay
                        const createRes = await fetch('/api/admin/essays', {
                          method: 'POST',
                          headers: {
                            'Authorization': `Bearer ${session.access_token}`,
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            url: newEssayUrl,
                            title: metadataData.metadata.title || null,
                            excerpt: metadataData.metadata.description || null,
                            image_url: metadataData.metadata.image || null,
                            display_order: maxOrder + 1,
                          }),
                        });

                        const createData = await createRes.json();
                        if (createData.error) {
                          alert('Failed to create essay: ' + createData.error);
                        } else {
                          setNewEssayUrl('');
                          fetchData();
                        }
                      } catch (error) {
                        console.error('Add essay error:', error);
                        alert('Failed to add essay');
                      } finally {
                        setFetchingMetadata(false);
                      }
                    }}
                    disabled={fetchingMetadata || !newEssayUrl.trim()}
                    className="btn-ember"
                  >
                    {fetchingMetadata ? 'Fetching...' : 'Add Essay'}
                  </Button>
                </div>
                <p className="text-xs text-black/60 mt-1">
                  Enter a Substack URL and we'll automatically fetch the title, description, and image
                </p>
              </div>
            </div>
          </Card>

          {/* Essays List with Drag-and-Drop */}
          {essays.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-black/70">No featured essays yet. Add one above to get started.</p>
            </Card>
          ) : (
            <div 
              className="space-y-4"
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
            >
              <p className="text-sm text-black/60" id="essay-reorder-instructions">
                Drag essays to reorder. The order determines the narrative flow on your pages. 
                Use keyboard arrow keys to reorder when focused.
              </p>
              {essays.map((essay, index) => (
                <Card
                  key={essay.id}
                  draggable
                  role="button"
                  aria-label={`Essay: ${essay.title || 'Untitled'}. Position ${index + 1} of ${essays.length}. Drag to reorder.`}
                  aria-describedby="essay-reorder-instructions"
                  tabIndex={0}
                  onDragStart={(e) => {
                    setDraggedEssayId(essay.id);
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', essay.id);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (draggedEssayId && draggedEssayId !== essay.id) {
                      e.currentTarget.style.borderTop = '3px solid #c98a2b';
                    }
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.style.borderTop = '';
                  }}
                  onDrop={async (e) => {
                    e.preventDefault();
                    e.currentTarget.style.borderTop = '';
                    
                    if (!draggedEssayId || draggedEssayId === essay.id) {
                      setDraggedEssayId(null);
                      return;
                    }

                    const draggedIndex = essays.findIndex(e => e.id === draggedEssayId);
                    const targetIndex = index;
                    
                    if (draggedIndex === -1) {
                      setDraggedEssayId(null);
                      return;
                    }

                    // Reorder array
                    const newEssays = [...essays];
                    const [removed] = newEssays.splice(draggedIndex, 1);
                    newEssays.splice(targetIndex, 0, removed);

                    // Update display_order for all affected essays
                    const reorderedEssays = newEssays.map((e, i) => ({
                      id: e.id,
                      display_order: i + 1,
                    }));

                    try {
                      const { supabase } = await import('@/lib/supabase/client');
                      const { data: { session } } = await supabase.auth.getSession();
                      
                      if (!session) {
                        setDraggedEssayId(null);
                        return;
                      }

                      const reorderRes = await fetch('/api/admin/essays/reorder', {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${session.access_token}`,
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ essays: reorderedEssays }),
                      });

                      if (reorderRes.ok) {
                        setEssays(newEssays.map((e, i) => ({ ...e, display_order: i + 1 })));
                      } else {
                        // Revert on error
                        fetchData();
                      }
                    } catch (error) {
                      console.error('Reorder error:', error);
                      // Revert on error
                      fetchData();
                    }

                    setDraggedEssayId(null);
                  }}
                  className={`p-4 cursor-move transition-all ${
                    draggedEssayId === essay.id 
                      ? 'opacity-50 bg-ember/5' 
                      : 'hover:shadow-md hover:bg-cream/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 pt-1">
                      <div className="w-8 h-8 rounded-full bg-ember/10 flex items-center justify-center text-ember font-medium text-sm">
                        {essay.display_order}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-lg">{essay.title || 'Untitled Essay'}</h3>
                            {essay.featured_essay && (
                              <Badge variant="default" className="bg-ember/20 text-ember border-ember/30 text-xs">
                                Featured
                              </Badge>
                            )}
                          </div>
                          {essay.image_url && (
                            <img 
                              src={essay.image_url} 
                              alt={essay.title || ''} 
                              className="mt-2 w-32 h-20 object-cover rounded"
                            />
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              const { supabase } = await import('@/lib/supabase/client');
                              const { data: { session } } = await supabase.auth.getSession();
                              
                              if (!session) return;

                              const res = await fetch('/api/admin/essays', {
                                method: 'PATCH',
                                headers: {
                                  'Authorization': `Bearer ${session.access_token}`,
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  id: essay.id,
                                  featured_essay: !essay.featured_essay,
                                }),
                              });

                              if (res.ok) {
                                setEssays(essays.map(e => 
                                  e.id === essay.id ? { ...e, featured_essay: !essay.featured_essay } : e
                                ));
                              }
                            }}
                            className={essay.featured_essay ? 'bg-ember/10 border-ember/30' : ''}
                          >
                            {essay.featured_essay ? '★ Featured' : '☆ Feature'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              const { supabase } = await import('@/lib/supabase/client');
                              const { data: { session } } = await supabase.auth.getSession();
                              
                              if (!session) return;

                              const res = await fetch(`/api/admin/essays?id=${essay.id}`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${session.access_token}` },
                              });

                              if (res.ok) {
                                fetchData();
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-black/70 mb-2 line-clamp-2">{essay.excerpt || 'No description'}</p>
                      <a 
                        href={essay.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-ember hover:text-ember-light"
                      >
                        {essay.url}
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
