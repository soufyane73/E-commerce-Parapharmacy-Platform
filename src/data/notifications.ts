import { Notification } from "../components/NotificationsMenu";

export const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "promotion",
    title: "🎉 Promotion Exclusive",
    message: "Profitez de -30% sur toute la gamme Vichy jusqu'à dimanche !",
    timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    isRead: false,
    actionLabel: "Voir l'offre",
    actionType: "view_promo",
    actionData: { category: "vichy", discount: 30 },
  },
  {
    id: "2",
    type: "order",
    title: "Commande expédiée",
    message: "Votre commande #12345 a été expédiée et arrivera demain.",
    timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
    isRead: false,
    actionLabel: "Suivre ma commande",
    actionType: "view_order",
    actionData: { orderId: "12345" },
  },
  {
    id: "3",
    type: "product",
    title: "Nouveau produit disponible",
    message: "Découvrez la nouvelle crème hydratante CeraVe Moisturizing Cream maintenant en stock !",
    timestamp: new Date(Date.now() - 6 * 3600000), // 6 hours ago
    isRead: false,
    actionLabel: "Voir le produit",
    actionType: "view_product",
    actionData: { productId: "1" },
  },
  {
    id: "4",
    type: "promotion",
    title: "Points de fidélité",
    message: "Vous avez gagné 150 points ! Utilisez-les pour votre prochaine commande.",
    timestamp: new Date(Date.now() - 24 * 3600000), // 1 day ago
    isRead: true,
    actionLabel: "Voir mes points",
    actionType: "view_promo",
  },
  {
    id: "5",
    type: "info",
    title: "Conseil santé",
    message: "N'oubliez pas de prendre vos vitamines quotidiennes pour renforcer votre immunité.",
    timestamp: new Date(Date.now() - 2 * 24 * 3600000), // 2 days ago
    isRead: true,
  },
  {
    id: "6",
    type: "order",
    title: "Commande livrée",
    message: "Votre commande #12340 a été livrée avec succès. N'hésitez pas à laisser un avis !",
    timestamp: new Date(Date.now() - 3 * 24 * 3600000), // 3 days ago
    isRead: true,
    actionLabel: "Laisser un avis",
    actionType: "view_order",
    actionData: { orderId: "12340" },
  },
];