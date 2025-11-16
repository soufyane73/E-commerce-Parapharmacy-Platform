import { useState, useMemo, useEffect } from "react";
import { Header } from "./components/Header";
import { CategoryNav } from "./components/CategoryNav";
import { HeroSection } from "./components/HeroSection";
import { ProductCard } from "./components/ProductCard";
import { ShoppingCartSheet } from "./components/ShoppingCartSheet";
import { ProductModal } from "./components/ProductModal";
import { ContactPage } from "./components/ContactPage";
import { CheckoutModal } from "./components/CheckoutModal";
import { AuthModal, User } from "./components/AuthModal";
import { UserProfile } from "./components/UserProfile";
import { B2BDashboard } from "./components/B2BDashboard";
import { FavoritesSheet } from "./components/FavoritesSheet";
import { SettingsModal } from "./components/SettingsModal";
import { Footer } from "./components/Footer";
import { Product, CartItem } from "./types/product";
import { toast, Toaster } from "sonner@2.0.3";
import { Notification } from "./components/NotificationsMenu";
import { apiService } from "./services/api";

type PageType = "home" | "contact" | "profile" | "dashboard";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [bulkOrderModalOpen, setBulkOrderModalOpen] = useState(false);
  const [clientManagementModalOpen, setClientManagementModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadInitialData();
    checkAuth();
  }, []);

  // Load cart and favorites when user logs in
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setCartItems([]);
      setFavorites([]);
      setNotifications([]);
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      // Load products
      const productsResponse = await apiService.getProducts({ per_page: 100 });
      const productsData = Array.isArray(productsResponse.data) 
        ? productsResponse.data 
        : productsResponse.data?.data || productsResponse;
      
      const formattedProducts: Product[] = productsData.map((p: any) => ({
        id: String(p.id),
        name: p.name,
        description: p.description,
        price: parseFloat(p.price),
        originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
        image: p.image,
        category: p.category?.slug || p.category_id,
        brand: p.brand,
        rating: parseFloat(p.rating || 0),
        reviews: p.reviews_count || 0,
        inStock: p.in_stock,
        tags: p.tags || [],
      }));
      setProducts(formattedProducts);

      // Load categories
      const categoriesResponse = await apiService.getCategories();
      const categoriesData = categoriesResponse.categories || categoriesResponse.data || [];
      setCategories(categoriesData);
    } catch (error: any) {
      console.error("Error loading data:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      if (apiService.getToken()) {
        const response = await apiService.getProfile();
        const apiUser = response.user;
        const user: User = {
          id: String(apiUser.id),
          email: apiUser.email,
          name: apiUser.name,
          type: apiUser.type,
          phone: apiUser.phone,
          address: apiUser.address,
          city: apiUser.city,
          companyName: apiUser.company_name,
          taxId: apiUser.tax_id,
          licenseNumber: apiUser.license_number,
        };
        setUser(user);
      }
    } catch (error) {
      // Token invalid or expired
      apiService.setToken(null);
    }
  };

  const loadUserData = async () => {
    try {
      // Load cart
      const cartResponse = await apiService.getCart();
      const cartData = cartResponse.cartItems || [];
      const formattedCart: CartItem[] = cartData.map((item: any) => ({
        id: String(item.product.id),
        name: item.product.name,
        description: item.product.description,
        price: parseFloat(item.product.price),
        originalPrice: item.product.original_price ? parseFloat(item.product.original_price) : undefined,
        image: item.product.image,
        category: item.product.category?.slug || item.product.category_id,
        brand: item.product.brand,
        rating: parseFloat(item.product.rating || 0),
        reviews: item.product.reviews_count || 0,
        inStock: item.product.in_stock,
        tags: item.product.tags || [],
        quantity: item.quantity,
      }));
      setCartItems(formattedCart);

      // Load favorites
      const favoritesResponse = await apiService.getFavorites();
      const favoritesData = favoritesResponse.favorites || [];
      const formattedFavorites: Product[] = favoritesData.map((fav: any) => ({
        id: String(fav.product.id),
        name: fav.product.name,
        description: fav.product.description,
        price: parseFloat(fav.product.price),
        originalPrice: fav.product.original_price ? parseFloat(fav.product.original_price) : undefined,
        image: fav.product.image,
        category: fav.product.category?.slug || fav.product.category_id,
        brand: fav.product.brand,
        rating: parseFloat(fav.product.rating || 0),
        reviews: fav.product.reviews_count || 0,
        inStock: fav.product.in_stock,
        tags: fav.product.tags || [],
      }));
      setFavorites(formattedFavorites);

      // Load notifications
      const notificationsResponse = await apiService.getNotifications();
      const notificationsData = notificationsResponse.data || notificationsResponse;
      const formattedNotifications: Notification[] = notificationsData.map((notif: any) => ({
        id: String(notif.id),
        type: notif.type,
        title: notif.title,
        message: notif.message,
        timestamp: new Date(notif.created_at),
        isRead: notif.is_read,
        icon: notif.icon,
        actionLabel: notif.action_label,
        actionType: notif.action_type,
        actionData: notif.action_data,
      }));
      setNotifications(formattedNotifications);
    } catch (error: any) {
      console.error("Error loading user data:", error);
    }
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Filter by category (can be slug or id)
    if (selectedCategory) {
      const category = categories.find(c => String(c.id) === selectedCategory || c.slug === selectedCategory);
      if (category) {
        filtered = filtered.filter(p => {
          const productCategory = typeof p.category === 'string' ? p.category : String(p.category);
          return productCategory === category.slug || productCategory === String(category.id);
        });
      }
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [products, selectedCategory, searchQuery, categories]);

  const handleAddToCart = async (product: Product, quantity: number = 1) => {
    if (!user) {
      toast.error("Veuillez vous connecter pour ajouter au panier");
      setIsAuthOpen(true);
      return;
    }

    try {
      await apiService.addToCart(product.id, quantity);
      toast.success(`${product.name} ajouté au panier`);
      // Reload cart
      const cartResponse = await apiService.getCart();
      const cartData = cartResponse.cartItems || [];
      const formattedCart: CartItem[] = cartData.map((item: any) => ({
        id: String(item.product.id),
        name: item.product.name,
        description: item.product.description,
        price: parseFloat(item.product.price),
        originalPrice: item.product.original_price ? parseFloat(item.product.original_price) : undefined,
        image: item.product.image,
        category: item.product.category?.slug || item.product.category_id,
        brand: item.product.brand,
        rating: parseFloat(item.product.rating || 0),
        reviews: item.product.reviews_count || 0,
        inStock: item.product.in_stock,
        tags: item.product.tags || [],
        quantity: item.quantity,
      }));
      setCartItems(formattedCart);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'ajout au panier");
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    try {
      const cartItem = cartItems.find(item => item.id === productId);
      if (!cartItem) return;

      // Find the cart item ID from API
      const cartResponse = await apiService.getCart();
      const cartData = cartResponse.cartItems || [];
      const apiCartItem = cartData.find((item: any) => String(item.product.id) === productId);
      
      if (apiCartItem) {
        await apiService.updateCartItem(String(apiCartItem.id), quantity);
        // Reload cart
        await loadUserData();
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const cartResponse = await apiService.getCart();
      const cartData = cartResponse.cartItems || [];
      const apiCartItem = cartData.find((item: any) => String(item.product.id) === productId);
      
      if (apiCartItem) {
        await apiService.removeFromCart(String(apiCartItem.id));
        toast.info("Produit retiré du panier");
        // Reload cart
        await loadUserData();
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const handleOrderComplete = async (orderData: any) => {
    try {
      const response = await apiService.createOrder(orderData);
      toast.success(`Commande créée avec succès ! Numéro: ${response.order.order_number}`);
      
      // Reload cart (should be empty now)
      await loadUserData();
      
      setCurrentPage("home");
      setIsCheckoutOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création de la commande");
    }
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    toast.success(`Bienvenue ${loggedInUser.name} !`);
    // loadUserData will be called by useEffect when user changes
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      // Ignore logout errors
    }
    setUser(null);
    setCurrentPage("home");
    setFavorites([]);
    setCartItems([]);
    setNotifications([]);
    toast.info("Vous êtes déconnecté");
  };

  const handleToggleFavorite = async (product: Product) => {
    if (!user) {
      toast.error("Veuillez vous connecter pour ajouter aux favoris");
      setIsAuthOpen(true);
      return;
    }

    try {
      const response = await apiService.toggleFavorite(product.id);
      if (response.isFavorite) {
        toast.success(`${product.name} ajouté aux favoris`);
      } else {
        toast.info(`${product.name} retiré des favoris`);
      }
      // Reload favorites
      await loadUserData();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la modification des favoris");
    }
  };

  const handleRemoveFavorite = async (productId: string) => {
    try {
      const favoritesResponse = await apiService.getFavorites();
      const favoritesData = favoritesResponse.favorites || [];
      const favorite = favoritesData.find((fav: any) => String(fav.product.id) === productId);
      
      if (favorite) {
        await apiService.removeFavorite(String(favorite.id));
        toast.info("Produit retiré des favoris");
        // Reload favorites
        await loadUserData();
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some((item) => item.id === productId);
  };

  const handleNavigateToProfile = () => {
    setCurrentPage("profile");
  };

  const handleNavigateToDashboard = () => {
    setCurrentPage("dashboard");
  };

  const handleNavigate = (page: "home" | "contact") => {
    setCurrentPage(page);
  };

  const handleNavigateToHome = () => {
    setCurrentPage("home");
    setSelectedCategory(null);
    setSearchQuery("");
  };

  // Notification handlers
  const handleMarkNotificationAsRead = async (id: string) => {
    try {
      await apiService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error: any) {
      toast.error(error.message || "Erreur");
    }
  };

  const handleMarkAllNotificationsAsRead = async () => {
    try {
      await apiService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
    } catch (error: any) {
      toast.error(error.message || "Erreur");
    }
  };

  const handleRemoveNotification = async (id: string) => {
    try {
      await apiService.deleteNotification(id);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error: any) {
      toast.error(error.message || "Erreur");
    }
  };

  const handleNotificationAction = (notification: Notification) => {
    switch (notification.actionType) {
      case "view_order":
        toast.info(`Redirection vers la commande ${notification.actionData?.orderId || ""}...`);
        // En production, naviguer vers la page de commande
        break;
      
      case "view_promo":
        if (notification.actionData?.category) {
          setSearchQuery(notification.actionData.category);
          setCurrentPage("home");
          toast.success("Affichage des promotions !");
        } else {
          setCurrentPage("profile");
          toast.info("Consultation de vos points de fidélité...");
        }
        break;
      
      case "view_product":
        const productId = notification.actionData?.productId;
        if (productId) {
          const product = products.find((p) => p.id === String(productId));
          if (product) {
            setSelectedProduct(product);
            toast.success("Affichage du produit !");
          }
        }
        break;
      
      default:
        break;
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <Header
        cartItemsCount={totalItems}
        onCartClick={() => setIsCartOpen(true)}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        onNavigate={handleNavigate}
        currentPage={currentPage === "home" || currentPage === "contact" ? currentPage : "home"}
        user={user}
        onLogin={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onNavigateToProfile={handleNavigateToProfile}
        onNavigateToDashboard={handleNavigateToDashboard}
        onNavigateToHome={handleNavigateToHome}
        favoritesCount={favorites.length}
        onFavoritesClick={() => setIsFavoritesOpen(true)}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        onRemoveNotification={handleRemoveNotification}
        onNotificationAction={handleNotificationAction}
        onBulkOrder={() => setBulkOrderModalOpen(true)}
        onManageClients={() => setClientManagementModalOpen(true)}
        onSettings={() => setIsSettingsOpen(true)}
      />

      {isLoading && currentPage === "home" ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des produits...</p>
          </div>
        </div>
      ) : currentPage === "home" ? (
        <>
          <CategoryNav
            categories={categories.map(cat => ({
              id: String(cat.id),
              name: cat.name,
              icon: cat.icon || "Package",
            }))}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />

          {!searchQuery && !selectedCategory && <HeroSection />}

          <main className="container mx-auto px-4 py-8">
            {/* Results info */}
            <div className="mb-6">
              <h2 className="text-gray-600">
                {searchQuery || selectedCategory ? (
                  <>
                    {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""} trouvé{filteredProducts.length > 1 ? "s" : ""}
                    {searchQuery && ` pour "${searchQuery}"`}
                  </>
                ) : (
                  "Tous nos produits"
                )}
              </h2>
            </div>

            {/* Products grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 mb-4">Aucun produit trouvé</p>
                <p className="text-sm text-gray-400">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onProductClick={setSelectedProduct}
                    isFavorite={isFavorite(product.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </main>
        </>
      ) : currentPage === "contact" ? (
        <ContactPage />
      ) : currentPage === "profile" && user ? (
        <UserProfile 
          user={user} 
          onUpdateUser={setUser}
          favorites={favorites}
          onRemoveFavorite={handleRemoveFavorite}
          onAddToCart={handleAddToCart}
          onProductClick={setSelectedProduct}
        />
      ) : currentPage === "dashboard" && user?.type === "b2b" ? (
        <B2BDashboard user={user} />
      ) : null}

      <Footer onNavigate={handleNavigate} />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
      />

      <FavoritesSheet
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onRemoveFavorite={handleRemoveFavorite}
        onAddToCart={handleAddToCart}
        onProductClick={setSelectedProduct}
      />

      <ShoppingCartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        total={cartTotal}
        onOrderComplete={handleOrderComplete}
        user={user}
      />

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onUpdateUser={setUser}
      />
    </div>
  );
}