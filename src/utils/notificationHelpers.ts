import { Notification } from "../components/NotificationsMenu";

/**
 * Générateur de notifications pour différents événements
 */
export const NotificationGenerator = {
  // Notification de nouvelle commande
  newOrder: (orderId: string): Notification => ({
    id: `order-${Date.now()}`,
    type: "order",
    title: "Nouvelle commande",
    message: `Votre commande #${orderId} a été confirmée et est en cours de traitement.`,
    timestamp: new Date(),
    isRead: false,
    actionLabel: "Suivre ma commande",
    actionType: "view_order",
    actionData: { orderId },
  }),

  // Notification de commande expédiée
  orderShipped: (orderId: string): Notification => ({
    id: `shipped-${Date.now()}`,
    type: "order",
    title: "Commande expédiée 📦",
    message: `Votre commande #${orderId} a été expédiée et arrivera bientôt !`,
    timestamp: new Date(),
    isRead: false,
    actionLabel: "Suivre le colis",
    actionType: "view_order",
    actionData: { orderId },
  }),

  // Notification de livraison
  orderDelivered: (orderId: string): Notification => ({
    id: `delivered-${Date.now()}`,
    type: "order",
    title: "Commande livrée ✅",
    message: `Votre commande #${orderId} a été livrée avec succès. Profitez de vos produits !`,
    timestamp: new Date(),
    isRead: false,
    actionLabel: "Laisser un avis",
    actionType: "view_order",
    actionData: { orderId },
  }),

  // Notification de promotion
  promotion: (productName: string, discount: number): Notification => ({
    id: `promo-${Date.now()}`,
    type: "promotion",
    title: `🎉 Promotion ${discount}% !`,
    message: `Profitez de -${discount}% sur ${productName} pendant une durée limitée !`,
    timestamp: new Date(),
    isRead: false,
    actionLabel: "Voir l'offre",
    actionType: "view_promo",
    actionData: { discount },
  }),

  // Notification de nouveau produit
  newProduct: (productName: string, productId: string): Notification => ({
    id: `product-${Date.now()}`,
    type: "product",
    title: "🆕 Nouveau produit disponible",
    message: `Découvrez ${productName}, maintenant en stock dans notre parapharmacie !`,
    timestamp: new Date(),
    isRead: false,
    actionLabel: "Voir le produit",
    actionType: "view_product",
    actionData: { productId },
  }),

  // Notification de retour en stock
  backInStock: (productName: string, productId: string): Notification => ({
    id: `stock-${Date.now()}`,
    type: "product",
    title: "✨ Produit de nouveau disponible",
    message: `${productName} est de retour en stock ! Ne manquez pas cette occasion.`,
    timestamp: new Date(),
    isRead: false,
    actionLabel: "Voir le produit",
    actionType: "view_product",
    actionData: { productId },
  }),

  // Notification de points de fidélité
  loyaltyPoints: (points: number): Notification => ({
    id: `loyalty-${Date.now()}`,
    type: "promotion",
    title: "🌟 Points de fidélité",
    message: `Félicitations ! Vous avez gagné ${points} points. Utilisez-les pour votre prochaine commande.`,
    timestamp: new Date(),
    isRead: false,
    actionLabel: "Voir mes points",
    actionType: "view_promo",
    actionData: { points },
  }),

  // Notification de conseil santé
  healthTip: (tip: string): Notification => ({
    id: `tip-${Date.now()}`,
    type: "info",
    title: "💡 Conseil santé du jour",
    message: tip,
    timestamp: new Date(),
    isRead: false,
  }),

  // Notification de rappel de panier abandonné
  abandonedCart: (): Notification => ({
    id: `cart-${Date.now()}`,
    type: "info",
    title: "🛒 Panier en attente",
    message: "Vous avez des produits dans votre panier. Finalisez votre commande avant qu'ils ne soient en rupture !",
    timestamp: new Date(),
    isRead: false,
    actionLabel: "Voir mon panier",
    actionType: "view_product",
  }),

  // Notification de code promo
  promoCode: (code: string, discount: number): Notification => ({
    id: `code-${Date.now()}`,
    type: "promotion",
    title: `🎁 Code promo exclusif`,
    message: `Utilisez le code ${code} pour bénéficier de -${discount}% sur votre prochaine commande !`,
    timestamp: new Date(),
    isRead: false,
    actionLabel: "Utiliser le code",
    actionType: "view_promo",
    actionData: { code, discount },
  }),
};
