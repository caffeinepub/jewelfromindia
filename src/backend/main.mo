import Text "mo:core/Text";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Bool "mo:core/Bool";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import OutCall "http-outcalls/outcall";
import Stripe "stripe/stripe";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Runtime "mo:core/Runtime";

actor {
  // Types
  public type ProductCategory = {
    #rings;
    #necklaces;
    #earrings;
    #bangles;
    #bridalSets;
    #traditional;
  };

  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    category : ProductCategory;
    metalType : Text;
    gemstone : Text;
    price : Nat;
    weight : Float;
    craftsmanshipNotes : Text;
    hallmarkCertified : Bool;
    images : [Text];
    stockQuantity : Nat;
    popularityScore : Nat;
  };

  public type Review = {
    productId : Nat;
    user : Principal;
    rating : Nat;
    comment : Text;
  };

  public type OrderStatus = { #pending; #shipped; #delivered; #cancelled };

  public type Order = {
    id : Nat;
    user : Principal;
    items : [Nat];
    totalAmount : Nat;
    status : OrderStatus;
    timestamp : Int;
  };

  public type CustomJewelleryRequest = {
    user : Principal;
    metal : Text;
    gemstone : Text;
    style : Text;
    budget : Nat;
    notes : Text;
    timestamp : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };

    public func compareByPopularity(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(
        product1.popularityScore,
        product2.popularityScore,
      );
    };

    public func compareByPrice(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.price, product2.price);
    };
  };

  var nextProductId = 1;
  var nextOrderId = 1;

  let products = Map.empty<Nat, Product>();
  let reviews = Map.empty<Nat, List.List<Review>>();
  let wishlists = Map.empty<Principal, List.List<Nat>>();
  let shoppingCarts = Map.empty<Principal, List.List<Nat>>();
  let orders = Map.empty<Nat, Order>();
  let customRequests = Map.empty<Int, CustomJewelleryRequest>();

  // Authorization and User Management
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Stripe configuration
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Catalog
  public shared ({ caller }) func addProduct(product : Product) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    let newProduct = {
      product with
      id = nextProductId;
      popularityScore = 0;
    };
    products.add(nextProductId, newProduct);
    nextProductId += 1;
    newProduct.id;
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    products.remove(productId);
  };

  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func filterByCategory(category : ProductCategory) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        product.category == category;
      }
    );
  };

  public query ({ caller }) func filterByMetalType(metalType : Text) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        product.metalType.contains(#text metalType);
      }
    );
  };

  public query ({ caller }) func filterByGemstone(gemstone : Text) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        product.gemstone.contains(#text gemstone);
      }
    );
  };

  public query ({ caller }) func filterByPriceRange(minPrice : Nat, maxPrice : Nat) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        product.price >= minPrice and product.price <= maxPrice
      }
    );
  };

  public query ({ caller }) func sortByPopularity() : async [Product] {
    products.values().toArray().sort(Product.compareByPopularity);
  };

  // Reviews
  public shared ({ caller }) func addReview(review : Review) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add reviews");
    };

    let productExists = products.containsKey(review.productId);
    if (not productExists) {
      Runtime.trap("Product does not exist");
    };

    let existingReviews = switch (reviews.get(review.productId)) {
      case (null) {
        let newList = List.empty<Review>();
        newList.add(review);
        reviews.add(review.productId, newList);
        return;
      };
      case (?list) { list };
    };
    existingReviews.add(review);
  };

  public query ({ caller }) func getReviews(productId : Nat) : async [Review] {
    switch (reviews.get(productId)) {
      case (null) { [] };
      case (?reviews) { reviews.toArray() };
    };
  };

  // Wishlist
  public shared ({ caller }) func addToWishlist(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage wishlists");
    };

    if (not products.containsKey(productId)) {
      Runtime.trap("Product does not exist");
    };

    let existingWishlist = switch (wishlists.get(caller)) {
      case (null) {
        let newList = List.empty<Nat>();
        newList.add(productId);
        wishlists.add(caller, newList);
        return;
      };
      case (?list) { list };
    };

    if (existingWishlist.any(func(id) { id == productId })) {
      Runtime.trap("Product already in wishlist");
    };

    existingWishlist.add(productId);
  };

  public shared ({ caller }) func removeFromWishlist(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage wishlists");
    };

    switch (wishlists.get(caller)) {
      case (null) { return };
      case (?wishlist) {
        let filteredWishlist = wishlist.filter(
          func(id) { id != productId }
        );
        wishlists.add(caller, filteredWishlist);
      };
    };
  };

  public query ({ caller }) func getWishlist() : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access wishlists");
    };

    switch (wishlists.get(caller)) {
      case (null) { [] };
      case (?wishlist) { wishlist.toArray() };
    };
  };

  // Shopping Cart
  public shared ({ caller }) func addToCart(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage shopping carts");
    };

    if (not products.containsKey(productId)) {
      Runtime.trap("Product does not exist");
    };

    let cart = switch (shoppingCarts.get(caller)) {
      case (null) { List.empty<Nat>() };
      case (?cart) { cart };
    };
    cart.add(productId);
    shoppingCarts.add(caller, cart);
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage shopping carts");
    };

    switch (shoppingCarts.get(caller)) {
      case (null) { return };
      case (?cart) {
        let filteredCart = cart.filter(
          func(id) { id != productId }
        );
        shoppingCarts.add(caller, filteredCart);
      };
    };
  };

  public query ({ caller }) func getCart() : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access shopping carts");
    };

    switch (shoppingCarts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart.toArray() };
    };
  };

  // Orders
  public shared ({ caller }) func createOrder() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };

    let cart = switch (shoppingCarts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?cart) { cart.toArray() };
    };

    let totalAmount = cart.foldLeft(
      0,
      func(acc, id) {
        switch (products.get(id)) {
          case (null) { acc };
          case (?product) { acc + product.price };
        };
      },
    );

    let order = {
      id = nextOrderId;
      user = caller;
      items = cart;
      totalAmount;
      status = #pending;
      timestamp = Time.now();
    };

    orders.add(nextOrderId, order);
    nextOrderId += 1;
    shoppingCarts.remove(caller);
    order.id;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update orders");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        let updatedOrder = {
          order with
          status;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getOrderHistory() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access order history");
    };

    orders.values().toArray().filter(
      func(order) {
        order.user == caller;
      }
    );
  };

  public shared ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };

    orders.values().toArray();
  };

  // Custom Jewellery Requests
  public shared ({ caller }) func submitCustomRequest(request : CustomJewelleryRequest) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit custom requests");
    };

    let timestamp = Time.now();
    let newRequest = {
      request with timestamp;
    };
    customRequests.add(timestamp, newRequest);
  };

  // Stripe Integration
  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfig := ?config;
  };

  public query ({ caller }) func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };

    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?config) {
        await Stripe.createCheckoutSession(config, caller, items, successUrl, cancelUrl, transform);
      };
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check session status");
    };

    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe not configured") };
      case (?config) {
        await Stripe.getSessionStatus(config, sessionId, transform);
      };
    };
  };

};
