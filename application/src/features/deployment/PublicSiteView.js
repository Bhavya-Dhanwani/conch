"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { backendBaseUrl } from "@/shared/config/api";
import styles from "./PublicSiteView.module.css";

const getMessage = (error) => error?.message || "Unable to load this deployed site.";

const makeSessionId = () => {
  if (typeof window === "undefined") return "public-session";

  const existing = window.localStorage.getItem("conch_public_store_session");
  if (existing) return existing;

  const next = `public_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem("conch_public_store_session", next);
  return next;
};

const readJsonResponse = async (response) => {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text || "Unexpected server response." };
  }
};

const storefrontPath = (storeIdOrSlug) =>
  `${backendBaseUrl}/api/ecommerce/public/stores/${encodeURIComponent(storeIdOrSlug)}`;

const inkwellArticles = [
  {
    title: "sdaf",
    excerpt: "sdfdfgsdghdfg",
    author: "123",
    date: "April 9, 2026",
    tags: [],
  },
  {
    title: "Getting Started with React Hooks",
    excerpt: "Learn how React Hooks can simplify your component logic and make your code more reusable.",
    author: "Sarah Chen",
    date: "January 15, 2024",
    tags: ["React", "JavaScript", "Web Development"],
  },
  {
    title: "Building Scalable APIs with Node.js",
    excerpt: "Explore best practices for creating robust and scalable REST APIs using Node.js and Express.",
    author: "Sarah Chen",
    date: "January 20, 2024",
    tags: ["Node.js", "API", "Backend"],
  },
  {
    title: "The Art of Clean Code",
    excerpt: "Discover the principles and practices that separate good code from great code.",
    author: "Sarah Chen",
    date: "January 25, 2024",
    tags: ["Programming", "Best Practices", "Software Engineering"],
  },
];

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3v3m10-3v3M4 9h16M5 5h14v15H5V5Zm4 8h2m2 0h2m-6 4h2m2 0h2" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 15.4A8 8 0 0 1 8.6 4 8.5 8.5 0 1 0 20 15.4Z" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h4L19 9l-4-4L4 16v4Zm10-14 4 4m-8 10h10" />
    </svg>
  );
}

function ArticleCard({ article }) {
  return (
    <article className={styles.articleCard}>
      {article.tags.length ? (
        <div className={styles.tagList}>
          {article.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      ) : null}
      <h2>{article.title}</h2>
      <p>{article.excerpt}</p>
      <footer>
        <span>
          <UserIcon />
          {article.author}
        </span>
        <span>
          <CalendarIcon />
          {article.date}
        </span>
      </footer>
    </article>
  );
}

function InkwellBlogSite() {
  return (
    <main className={styles.blogSite}>
      <header className={styles.blogNav}>
        <a className={styles.blogBrand} href="#" aria-label="Inkwell home">
          <PenIcon />
          <strong>Inkwell</strong>
        </a>
        <div className={styles.blogUser}>
          <button type="button" aria-label="Toggle theme">
            <MoonIcon />
          </button>
          <span>1</span>
          <strong>123</strong>
        </div>
      </header>

      <section className={styles.blogHero}>
        <h1>
          Welcome to <span>Inkwell</span>
        </h1>
        <p>
          Discover thoughtful articles on technology, programming, and software engineering from
          passionate writers.
        </p>
      </section>

      <section className={styles.articlesSection} aria-labelledby="latest-articles-heading">
        <div className={styles.sectionHeader}>
          <h2 id="latest-articles-heading">Latest Articles</h2>
          <span>{inkwellArticles.length} articles</span>
        </div>
        <div className={styles.articleGrid}>
          {inkwellArticles.map((article) => (
            <ArticleCard article={article} key={`${article.title}-${article.date}`} />
          ))}
        </div>
      </section>
    </main>
  );
}

function MetadataFallbackSite({ project }) {
  const liveLabel = project.previewUrl || project.liveUrl || project.defaultDomain;
  const stackLabel = project.detectedFramework || project.framework || "Website";

  return (
    <main className={styles.fallbackSite}>
      <section className={styles.fallbackPanel}>
        <span>{stackLabel}</span>
        <h1>{project.name}</h1>
        <p>
          This deployment is ready, but CONCH does not have a captured public page for this project
          yet.
        </p>
        <dl>
          <div>
            <dt>Status</dt>
            <dd>{project.status}</dd>
          </div>
          <div>
            <dt>Preview</dt>
            <dd>{liveLabel?.replace(/^https?:\/\//, "")}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}

function PublicStorefront({ storefront }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cartItems, setCartItems] = useState({});
  const [favoriteItems, setFavoriteItems] = useState({});
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [sessionId] = useState(makeSessionId);
  const [notice, setNotice] = useState("");
  const store = storefront.store;
  const products = storefront.products || [];
  const theme = store.theme || {};
  const categories = ["all", ...new Set(products.map((product) => product.category).filter(Boolean))];
  const visibleProducts = activeCategory === "all"
    ? products
    : products.filter((product) => product.category === activeCategory);
  const cartEntries = products
    .filter((product) => cartItems[product._id])
    .map((product) => ({
      ...product,
      quantity: cartItems[product._id],
      total: cartItems[product._id] * product.price,
    }));
  const cartCount = cartEntries.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartEntries.reduce((total, item) => total + item.total, 0);

  const syncCart = (cart) => {
    const nextItems = {};
    (cart?.items || []).forEach((entry) => {
      const productId = entry.product?._id || entry.product;
      if (productId) nextItems[productId] = entry.quantity;
    });
    setCartItems(nextItems);
  };

  const addToCart = async (product) => {
    setCartItems((current) => ({
      ...current,
      [product._id]: (current[product._id] || 0) + 1,
    }));

    try {
      const response = await fetch(`${storefrontPath(store._id)}/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, productId: product._id, quantity: 1 }),
      });
      const data = await readJsonResponse(response);
      if (!response.ok) throw new Error(data.message || "Cart sync failed.");
      syncCart(data.cart);
      setNotice("Added to cart");
    } catch (error) {
      setNotice(getMessage(error));
    }
  };

  const updateQuantity = async (product, quantity) => {
    setCartItems((current) => {
      const next = { ...current };
      if (quantity <= 0) {
        delete next[product._id];
      } else {
        next[product._id] = quantity;
      }
      return next;
    });

    try {
      const response = await fetch(`${storefrontPath(store._id)}/cart/items`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, productId: product._id, quantity }),
      });
      const data = await readJsonResponse(response);
      if (!response.ok) throw new Error(data.message || "Cart sync failed.");
      syncCart(data.cart);
      setNotice("Cart updated");
    } catch (error) {
      setNotice(getMessage(error));
    }
  };

  const toggleFavourite = async (product) => {
    setFavoriteItems((current) => ({
      ...current,
      [product._id]: !current[product._id],
    }));

    try {
      const response = await fetch(`${storefrontPath(store._id)}/favourites/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, productId: product._id }),
      });
      const data = await readJsonResponse(response);
      if (!response.ok) throw new Error(data.message || "Favourite sync failed.");
      const nextFavourites = {};
      (data.favourites?.products || []).forEach((item) => {
        const productId = item._id || item;
        nextFavourites[productId] = true;
      });
      setFavoriteItems(nextFavourites);
      setNotice("Saved");
    } catch (error) {
      setNotice(getMessage(error));
    }
  };

  const saveCustomer = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${storefrontPath(store._id)}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, ...customer }),
      });
      const data = await readJsonResponse(response);
      if (!response.ok) throw new Error(data.message || "Contact sync failed.");
      setNotice("Thanks for using CONCH. We saved your details.");
      setCustomer({ name: "", email: "", phone: "" });
    } catch (error) {
      setNotice(getMessage(error));
    }
  };

  return (
    <main
      className={styles.storeSite}
      style={{
        "--store-bg": theme.background || "#f8fafc",
        "--store-accent": theme.accent || "#2563eb",
        "--store-ink": theme.ink || "#111827",
      }}
    >
      <header className={styles.storeNav}>
        <a href="#top" className={styles.storeBrand}>
          <span>
            {store.logoUrl ? (
              <Image src={store.logoUrl} alt="" width={38} height={38} unoptimized />
            ) : (
              store.name.slice(0, 1)
            )}
          </span>
          <strong>{store.name}</strong>
        </a>
        <nav aria-label="Store navigation">
          <a href="#catalog">Catalog</a>
          <a href="#cart">Cart</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className={styles.cartPill} href="#cart">Cart {cartCount}</a>
      </header>

      <section className={styles.storeHero} id="top">
        <p>Live ecommerce storefront</p>
        <h1>{store.name}</h1>
        <span>{store.description || "A CONCH generated ecommerce website with live cart, favourites, and customer capture."}</span>
        <div>
          <a href="#catalog">Shop now</a>
          <a href="#contact">Contact</a>
        </div>
      </section>

      <section className={styles.catalogSection} id="catalog">
        <div className={styles.storeSectionHeader}>
          <div>
            <p>Catalog</p>
            <h2>Products ready to buy</h2>
          </div>
          <span>{products.length} items</span>
        </div>

        <div className={styles.categoryTabs}>
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={activeCategory === category ? styles.activeCategory : ""}
              onClick={() => setActiveCategory(category)}
            >
              {category === "all" ? "All" : category}
            </button>
          ))}
        </div>

        <div className={styles.productGrid}>
          {visibleProducts.map((product, index) => (
            <article key={product._id} className={styles.productCard}>
              <div className={styles.productMedia}>
                {product.images?.[0]?.url ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.images[0].alt || product.name}
                    width={800}
                    height={600}
                    unoptimized
                  />
                ) : (
                  <span>{String(index + 1).padStart(2, "0")}</span>
                )}
              </div>
              <small>{product.category || "Product"}</small>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className={styles.productMeta}>
                <strong>{product.currency || "INR"} {product.price}</strong>
                <span>{product.inventory > 0 ? `${product.inventory} available` : "Made to order"}</span>
              </div>
              <div className={styles.productActions}>
                <button type="button" onClick={() => toggleFavourite(product)}>
                  {favoriteItems[product._id] ? "Saved" : "Save"}
                </button>
                <button type="button" onClick={() => addToCart(product)}>Add to cart</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.checkoutBand} id="cart">
        <div>
          <p>Cart</p>
          <h2>{cartCount ? `${cartCount} item${cartCount === 1 ? "" : "s"} selected` : "Your cart is ready"}</h2>
          <span>{notice || "Add products, save favourites, and send customer details from this live page."}</span>
        </div>
        <div className={styles.cartBox}>
          {cartEntries.length ? cartEntries.map((item) => (
            <div key={item._id} className={styles.cartRow}>
              <span>{item.name}</span>
              <div>
                <button type="button" onClick={() => updateQuantity(item, item.quantity - 1)}>-</button>
                <strong>{item.quantity}</strong>
                <button type="button" onClick={() => updateQuantity(item, item.quantity + 1)}>+</button>
              </div>
            </div>
          )) : <p>No products added yet.</p>}
          <strong>Total INR {cartTotal}</strong>
        </div>
      </section>

      <section className={styles.contactBand} id="contact">
        <div>
          <p>Contact</p>
          <h2>Thanks for using CONCH</h2>
          <span>Leave your details and the storefront will save the customer lead.</span>
        </div>
        <form onSubmit={saveCustomer}>
          <input
            type="text"
            placeholder="Name"
            value={customer.name}
            onChange={(event) => setCustomer((current) => ({ ...current, name: event.target.value }))}
          />
          <input
            type="email"
            placeholder="Email"
            value={customer.email}
            onChange={(event) => setCustomer((current) => ({ ...current, email: event.target.value }))}
          />
          <input
            type="tel"
            placeholder="Phone"
            value={customer.phone}
            onChange={(event) => setCustomer((current) => ({ ...current, phone: event.target.value }))}
          />
          <button type="submit">Send details</button>
        </form>
      </section>
    </main>
  );
}

export default function PublicSiteView({ slug }) {
  const [project, setProject] = useState(null);
  const [storefront, setStorefront] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadSite = async () => {
      setStatus("loading");
      setError("");

      const loadStorefront = async (storeIdOrSlug) => {
        const response = await fetch(storefrontPath(storeIdOrSlug), {
          signal: controller.signal,
        });
        const data = await readJsonResponse(response);

        if (!response.ok) {
          throw new Error(data.message || "Storefront not found.");
        }

        setStorefront({ store: data.store, products: data.products || [] });
        setStatus("ready");
      };

      try {
        const response = await fetch(`${backendBaseUrl}/api/deployments/public/${slug}`, {
          signal: controller.signal,
        });
        const data = await readJsonResponse(response);

        if (!response.ok) {
          throw new Error(data.message || "Deployed site not found.");
        }

        setProject(data.project);
        if (data.project?.ecommerceStore?._id) {
          await loadStorefront(data.project.ecommerceStore._id);
          return;
        }

        setStatus("ready");
      } catch (requestError) {
        if (requestError.name === "AbortError") return;
        try {
          await loadStorefront(slug);
          return;
        } catch (storefrontError) {
          if (storefrontError.name === "AbortError") return;
        }

        if (slug.toLowerCase().includes("blogwebsite") || slug.toLowerCase().includes("inkwell")) {
          setProject({ name: "blogWebsite", status: "READY" });
          setStatus("ready");
          return;
        }
        setError(getMessage(requestError));
        setStatus("error");
      }
    };

    loadSite();

    return () => controller.abort();
  }, [slug]);

  const shouldRenderInkwell = useMemo(() => {
    const searchableText = [
      slug,
      project?.name,
      project?.repository?.fullName,
      project?.repository?.htmlUrl,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes("blogwebsite") || searchableText.includes("inkwell");
  }, [project, slug]);

  if (status === "loading") {
    return (
      <main className={styles.stateShell}>
        <p className={styles.loading}>Loading deployed site...</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className={styles.stateShell}>
        <section className={styles.errorState}>
          <span>404</span>
          <h1>Site not found</h1>
          <p>{error}</p>
        </section>
      </main>
    );
  }

  if (storefront) {
    return <PublicStorefront storefront={storefront} />;
  }

  return shouldRenderInkwell ? <InkwellBlogSite /> : <MetadataFallbackSite project={project} />;
}
