/**
 * cart.js — logique de panier partagée (localStorage)
 * À inclure sur TOUTES les pages du site (produits, index, panier.html)
 * avant </body> : <script src="cart.js"></script>
 */

const CART_KEY = 'monPanier';

// Récupère le panier stocké (tableau d'objets {id, nom, prix, image, quantite})
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

// Sauvegarde le panier et met à jour tous les badges affichés sur la page
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadges();
}

// Ajoute un produit (ou augmente sa quantité s'il existe déjà)
function addToCart(product) {
  const cart = getCart();
  const existant = cart.find(item => item.id === product.id);
  if (existant) {
    existant.quantite += product.quantite;
  } else {
    cart.push(product);
  }
  saveCart(cart);
}

// Modifie la quantité d'un article (supprime si <= 0)
function updateCartQuantity(id, quantite) {
  let cart = getCart();
  if (quantite <= 0) {
    cart = cart.filter(item => item.id !== id);
  } else {
    const item = cart.find(item => item.id === id);
    if (item) item.quantite = quantite;
  }
  saveCart(cart);
}

// Supprime un article du panier
function removeFromCart(id) {
  const cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
}

// Vide entièrement le panier
function clearCart() {
  saveCart([]);
}

// Nombre total d'articles (toutes quantités confondues)
function getCartCount() {
  return getCart().reduce((total, item) => total + item.quantite, 0);
}

// Montant total du panier
function getCartTotal() {
  return getCart().reduce((total, item) => total + item.prix * item.quantite, 0);
}

// Met à jour tous les éléments portant la classe .cart-badge avec le nombre d'articles
function updateCartBadges() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

document.addEventListener('DOMContentLoaded', updateCartBadges);