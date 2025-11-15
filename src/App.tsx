import { useState, useMemo } from "react";
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
import { products, categories } from "./data/products";
import { Product, CartItem } from "./types/product";
import { toast, Toaster } from "sonner@2.0.3";
import { Notification } from "./components/NotificationsMenu";
import { initialNotifications } from "./data/notifications";
import { NotificationGenerator } from "./utils/notificationHelpers";

type PageType = "home" | "contact" | "profile" | "dashboard";

export default function App() {
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
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        toast.success(`Quantité mise à jour pour ${product.name}`);
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      toast.success(`${product.name} ajouté au panier`);
      return [...prev, { ...product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
    toast.info("Produit retiré du panier");
  };

  const handleOrderComplete = () => {
    // Générer un numéro de commande
    const orderId = `CMD${Date.now().toString().slice(-6)}`;
    
    // Ajouter une notification de nouvelle commande
    const orderNotification = NotificationGenerator.newOrder(orderId);
    setNotifications((prev) => [orderNotification, ...prev]);
    
    // Simuler une notification de commande expédiée après 5 secondes
    setTimeout(() => {
      const shippedNotification = NotificationGenerator.orderShipped(orderId);
      setNotifications((prev) => [shippedNotification, ...prev]);
      toast.success("Votre commande a été expédiée !");
    }, 5000);
    
    setCartItems([]);
    setCurrentPage("home");
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    toast.success(`Bienvenue ${loggedInUser.name} !`);
    
    // Ajouter une notification de bienvenue avec points de fidélité
    setTimeout(() => {
      const loyaltyNotification = NotificationGenerator.loyaltyPoints(150);
      setNotifications((prev) => [loyaltyNotification, ...prev]);
    }, 2000);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("home");
    setFavorites([]);
    toast.info("Vous êtes déconnecté");
  };

  const handleToggleFavorite = (product: Product) => {
    setFavorites((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        toast.info(`${product.name} retiré des favoris`);
        return prev.filter((item) => item.id !== product.id);
      } else {
        toast.success(`${product.name} ajouté aux favoris`);
        return [...prev, product];
      }
    });
  };

  const handleRemoveFavorite = (productId: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== productId));
    toast.info("Produit retiré des favoris");
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
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const handleRemoveNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
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
          const product = products.find((p) => p.id === productId);
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

      {currentPage === "home" ? (
        <>
          <CategoryNav
            categories={categories}
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