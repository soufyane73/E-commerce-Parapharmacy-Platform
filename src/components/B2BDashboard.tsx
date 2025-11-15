import { BarChart3, Package, TrendingUp, Users, ShoppingCart, DollarSign, Calendar, Download, Filter, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { User } from "./AuthModal";
import { BulkOrderModal, BulkOrder } from "./BulkOrderModal";
import { ClientManagementModal, Client } from "./ClientManagementModal";
import { useState } from "react";
import { toast } from "sonner@2.0.3";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface B2BDashboardProps {
  user: User;
}

export function B2BDashboard({ user }: B2BDashboardProps) {
  const [bulkOrderModalOpen, setBulkOrderModalOpen] = useState(false);
  const [clientManagementModalOpen, setClientManagementModalOpen] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderFilterStatus, setOrderFilterStatus] = useState("all");
  
  // États pour les commandes et clients
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>([]);
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "Ahmed El Fassi",
      email: "ahmed.elfassi@gmail.com",
      phone: "+212 661234567",
      address: "123 Rue Mohammed V",
      city: "Casablanca",
      totalOrders: 15,
      totalSpent: 18750,
      lastOrderDate: "10 Nov 2024",
      status: "vip",
    },
    {
      id: "2",
      name: "Fatima Zahra",
      email: "fatima.zahra@gmail.com",
      phone: "+212 662345678",
      address: "45 Avenue Hassan II",
      city: "Rabat",
      totalOrders: 8,
      totalSpent: 7120,
      lastOrderDate: "09 Nov 2024",
      status: "active",
    },
    {
      id: "3",
      name: "Karim Benjelloun",
      email: "karim.b@gmail.com",
      phone: "+212 663456789",
      address: "78 Boulevard Zerktouni",
      city: "Casablanca",
      totalOrders: 12,
      totalSpent: 25800,
      lastOrderDate: "08 Nov 2024",
      status: "vip",
    },
    {
      id: "4",
      name: "Salma Idrissi",
      email: "salma.idrissi@gmail.com",
      phone: "+212 664567890",
      address: "32 Rue Allal Ben Abdellah",
      city: "Fès",
      totalOrders: 3,
      totalSpent: 1350,
      lastOrderDate: "08 Nov 2024",
      status: "active",
    },
    {
      id: "5",
      name: "Youssef El Amrani",
      email: "youssef.ea@gmail.com",
      phone: "+212 665678901",
      address: "15 Avenue Mohammed VI",
      city: "Tanger",
      totalOrders: 1,
      totalSpent: 450,
      lastOrderDate: "05 Nov 2024",
      status: "inactive",
    },
  ]);

  const handleSubmitBulkOrder = (order: BulkOrder) => {
    setBulkOrders([order, ...bulkOrders]);
    toast.success(`Commande ${order.id} créée avec succès !`);
    
    // Mettre à jour le client si nécessaire
    const clientIndex = clients.findIndex(c => c.email === order.customerEmail);
    if (clientIndex >= 0) {
      const updatedClients = [...clients];
      updatedClients[clientIndex] = {
        ...updatedClients[clientIndex],
        totalOrders: updatedClients[clientIndex].totalOrders + 1,
        totalSpent: updatedClients[clientIndex].totalSpent + order.total,
        lastOrderDate: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      };
      setClients(updatedClients);
    }
  };

  const handleAddClient = (client: Omit<Client, "id">) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
    };
    setClients([newClient, ...clients]);
  };

  const handleEditClient = (id: string, updates: Partial<Client>) => {
    setClients(clients.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
  };

  // Mock data
  const stats = [
    {
      title: "Ventes du mois",
      value: "45,280 DH",
      change: "+12.5%",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Commandes",
      value: (24 + bulkOrders.length).toString(),
      change: "+8.2%",
      icon: ShoppingCart,
      trend: "up",
    },
    {
      title: "Produits actifs",
      value: "156",
      change: "+3",
      icon: Package,
      trend: "up",
    },
    {
      title: "Clients",
      value: clients.length.toString(),
      change: "+5",
      icon: Users,
      trend: "up",
    },
  ];

  const recentOrders = [
    {
      id: "CMD-2024-001",
      date: "10 Nov 2024",
      customer: "Ahmed El Fassi",
      products: 5,
      amount: "1,250 DH",
      status: "delivered",
    },
    {
      id: "CMD-2024-002",
      date: "09 Nov 2024",
      customer: "Fatima Zahra",
      products: 3,
      amount: "890 DH",
      status: "in_progress",
    },
    {
      id: "CMD-2024-003",
      date: "08 Nov 2024",
      customer: "Karim Benjelloun",
      products: 7,
      amount: "2,150 DH",
      status: "delivered",
    },
    {
      id: "CMD-2024-004",
      date: "08 Nov 2024",
      customer: "Salma Idrissi",
      products: 2,
      amount: "450 DH",
      status: "pending",
    },
    ...bulkOrders.map(order => ({
      id: order.id,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      customer: order.customerName,
      products: order.items.length,
      amount: `${order.total.toFixed(2)} DH`,
      status: "pending",
    })),
  ];

  const filteredOrders = recentOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(orderSearchQuery.toLowerCase());
    const matchesStatus = orderFilterStatus === "all" || order.status === orderFilterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge className="bg-green-500 gap-1">
            <CheckCircle className="h-3 w-3" />
            Livrée
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-500 gap-1">
            <Clock className="h-3 w-3" />
            En cours
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            En préparation
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Annulée
          </Badge>
        );
      default:
        return null;
    }
  };

  const topProducts = [
    { name: "Doliprane 1000mg", sales: 45, revenue: "2,250 DH" },
    { name: "Ventoline Spray", sales: 32, revenue: "3,840 DH" },
    { name: "Aspirine 500mg", sales: 28, revenue: "1,120 DH" },
    { name: "Paracétamol 500mg", sales: 25, revenue: "1,000 DH" },
    { name: "Ibuprofène 400mg", sales: 22, revenue: "1,320 DH" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-2">Tableau de bord B2B</h1>
              <p className="text-blue-100">Bienvenue, {user.companyName || user.name}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
              <Button variant="secondary" size="sm" className="gap-2">
                <Calendar className="h-4 w-4" />
                Ce mois
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl mb-1">{stat.value}</div>
                  <p className={`text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {stat.change} vs mois dernier
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Commandes récentes</TabsTrigger>
            <TabsTrigger value="products">Produits populaires</TabsTrigger>
            <TabsTrigger value="analytics">Analyses</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Commandes récentes</CardTitle>
                <CardDescription>Vos dernières commandes reçues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-4">
                  <Input
                    placeholder="Rechercher une commande..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full max-w-sm"
                  />
                  <Select
                    value={orderFilterStatus}
                    onValueChange={setOrderFilterStatus}
                    className="w-full max-w-sm"
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {orderFilterStatus === "all" ? "Tous les statuts" : orderFilterStatus}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="delivered">Livrées</SelectItem>
                      <SelectItem value="in_progress">En cours</SelectItem>
                      <SelectItem value="pending">En préparation</SelectItem>
                      <SelectItem value="cancelled">Annulées</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Commande</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Produits</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.products} articles</TableCell>
                        <TableCell className="text-emerald-600">{order.amount}</TableCell>
                        <TableCell>
                          {getStatusBadge(order.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Produits les plus vendus</CardTitle>
                <CardDescription>Top 5 des produits ce mois-ci</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead>Ventes</TableHead>
                      <TableHead>Revenu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((product, index) => (
                      <TableRow key={product.name}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                              {index + 1}
                            </Badge>
                            {product.name}
                          </div>
                        </TableCell>
                        <TableCell>{product.sales} unités</TableCell>
                        <TableCell className="text-emerald-600">{product.revenue}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance mensuelle</CardTitle>
                  <CardDescription>Ventes des 6 derniers mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Novembre", "Octobre", "Septembre", "Août", "Juillet", "Juin"].map((month, index) => {
                      const value = 100 - index * 15;
                      return (
                        <div key={month} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{month}</span>
                            <span className="text-emerald-600">{(45280 - index * 5000).toLocaleString()} DH</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-emerald-600 h-2 rounded-full"
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informations du compte</CardTitle>
                  <CardDescription>Détails de votre compte professionnel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom de la pharmacie</p>
                    <p>{user.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p>{user.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Adresse</p>
                    <p>{user.address}</p>
                  </div>
                  {user.taxId && (
                    <div>
                      <p className="text-sm text-gray-500">ICE</p>
                      <p className="font-mono">{user.taxId}</p>
                    </div>
                  )}
                  {user.licenseNumber && (
                    <div>
                      <p className="text-sm text-gray-500">Licence</p>
                      <p className="font-mono">{user.licenseNumber}</p>
                    </div>
                  )}
                  <div>
                    <Badge className="bg-green-600">
                      Compte vérifié
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-6 flex flex-col gap-2" onClick={() => setBulkOrderModalOpen(true)}>
                <Package className="h-6 w-6" />
                <span>Nouvelle commande</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex flex-col gap-2" onClick={() => setClientManagementModalOpen(true)}>
                <Users className="h-6 w-6" />
                <span>Gérer les clients</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
                <TrendingUp className="h-6 w-6" />
                <span>Voir les stats</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
                <Download className="h-6 w-6" />
                <span>Télécharger rapport</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Order Modal */}
      <BulkOrderModal 
        isOpen={bulkOrderModalOpen} 
        onClose={() => setBulkOrderModalOpen(false)} 
        onSubmit={handleSubmitBulkOrder} 
      />

      {/* Client Management Modal */}
      <ClientManagementModal 
        isOpen={clientManagementModalOpen} 
        onClose={() => setClientManagementModalOpen(false)} 
        clients={clients}
        onAddClient={handleAddClient} 
        onEditClient={handleEditClient} 
        onDeleteClient={handleDeleteClient} 
      />
    </div>
  );
}