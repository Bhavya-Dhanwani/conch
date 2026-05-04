"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import Logo from "@/shared/components/Logo/Logo";
import styles from "./BuilderInterface.module.css";

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

const readApiResponse = async (response) => {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {
      message: text || "Unexpected server response.",
    };
  }
};

const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${backendBaseUrl}${path}`, {
    credentials: "include",
    ...options,
    headers: options.body instanceof FormData
      ? options.headers
      : {
          "Content-Type": "application/json",
          ...options.headers,
        },
  });
  const data = await readApiResponse(response);

  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed.");
  }

  return data;
};

const makeSessionId = () => {
  if (typeof window === "undefined") return "builder-session";

  const existing = window.localStorage.getItem("conch_ecommerce_session");
  if (existing) return existing;

  const next = `session_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem("conch_ecommerce_session", next);
  return next;
};

const draftToProductPayloads = (draft) => {
  const firstPage = draft.pages?.[0] || fallbackDraft.pages[0];
  const sections = firstPage.sections?.length ? firstPage.sections : fallbackDraft.pages[0].sections;

  return sections
    .flatMap((section, sectionIndex) =>
      (section.items?.length ? section.items : [section.title]).slice(0, 4).map((item, itemIndex) => ({
        name: item,
        description: section.text,
        price: 79 + (sectionIndex * 4 + itemIndex) * 35,
        category: section.title,
        inventory: 50,
        currency: "INR",
        tags: [section.eyebrow || "Featured", section.title],
      })),
    )
    .slice(0, 12);
};

const fallbackDraft = {
  brand: "Conch Market",
  palette: ["#f8fafc", "#2563eb", "#111827"],
  logoUrl: "",
  navigation: ["Home", "Catalog", "About", "Contact"],
  pages: [
    {
      id: "home",
      label: "Home",
      headline: "A polished storefront generated from your prompt",
      subheadline: "Describe the niche, offer, pages, and tone. CONCH turns it into a complete ecommerce-style site draft.",
      primaryAction: "Shop collection",
      secondaryAction: "View details",
      sections: [
        {
          title: "Signature Collection",
          eyebrow: "Featured",
          text: "A flexible product or service collection adapted to the business niche.",
          items: ["Best seller", "Premium package", "Custom option"],
        },
        {
          title: "New Arrivals",
          eyebrow: "Catalog",
          text: "Fresh cards for offers, appointments, listings, products, or packages.",
          items: ["Quick booking", "Local favorite", "Limited slot"],
        },
      ],
    },
    {
      id: "services",
      label: "Services",
      headline: "Services built around the customer journey",
      subheadline: "A dedicated page with offer details, benefits, and conversion sections.",
      primaryAction: "Book now",
      secondaryAction: "See pricing",
      sections: [
        {
          title: "Packages",
          eyebrow: "Services",
          text: "Clear packages with outcomes, fit, and next steps.",
          items: ["Starter", "Signature", "Custom"],
        },
      ],
    },
    {
      id: "contact",
      label: "Contact",
      headline: "Turn visitors into leads",
      subheadline: "A simple final page with contact details, location, and inquiry path.",
      primaryAction: "Send inquiry",
      secondaryAction: "Call now",
      sections: [
        {
          title: "Inquiry",
          eyebrow: "Contact",
          text: "A simple conversion area that helps visitors reach out quickly.",
          items: ["Name", "Email", "Project details"],
        },
      ],
    },
  ],
};

function Icon({ type }) {
  const paths = {
    plus: "M10 4v12M4 10h12",
    user: "M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-6 6a6 6 0 0 1 12 0",
    refresh: "M15 6a6 6 0 1 0 1 5m-1-5V3h3",
    send: "M4 10h10m0 0-4-4m4 4-4 4",
  };

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={styles.icon}>
      <path d={paths[type]} />
    </svg>
  );
}

export default function BuilderInterface() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [buildMode, setBuildMode] = useState("Instant");
  const [draft, setDraft] = useState(null);
  const [activePageId, setActivePageId] = useState("home");
  const [logoUrl, setLogoUrl] = useState("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [ecommerceStore, setEcommerceStore] = useState(null);
  const [ecommerceProducts, setEcommerceProducts] = useState([]);
  const [ecommerceStatus, setEcommerceStatus] = useState("");
  const fileInputRef = useRef(null);

  const hasConversation = messages.length > 0 || isGenerating;

  const linkDraftToEcommerceStore = async (nextDraft) => {
    setEcommerceStatus("Linking ecommerce backend...");

    try {
      const storeData = await apiRequest("/api/ecommerce/stores", {
        method: "POST",
        body: JSON.stringify({
          name: nextDraft.brand || "Conch Store",
          slug: `${nextDraft.brand || "conch-store"}-${Date.now()}`,
          description: nextDraft.pages?.[0]?.subheadline || "Generated ecommerce store",
          logoUrl: nextDraft.logoUrl || logoUrl,
          theme: {
            background: nextDraft.palette?.[0],
            accent: nextDraft.palette?.[1],
            ink: nextDraft.palette?.[2],
          },
        }),
      });
      const store = storeData.store;
      const productPayloads = draftToProductPayloads(nextDraft);
      const products = [];

      for (const productPayload of productPayloads) {
        const productData = await apiRequest(`/api/ecommerce/stores/${store._id}/products`, {
          method: "POST",
          body: JSON.stringify(productPayload),
        });
        products.push(productData.product);
      }

      setEcommerceStore(store);
      setEcommerceProducts(products);
      setEcommerceStatus("Backend store linked");

      return { store, products };
    } catch (error) {
      setEcommerceStore(null);
      setEcommerceProducts([]);
      setEcommerceStatus(
        error.message?.toLowerCase().includes("login")
          ? "Preview is local. Login to save products, cart, customers, and favourites."
          : error.message || "Ecommerce backend link failed.",
      );

      return null;
    }
  };

  const uploadLogo = async (file) => {
    if (!file || isUploadingLogo) return;

    setIsUploadingLogo(true);
    const formData = new FormData();
    formData.append("logo", file);

    try {
      const response = await fetch(`${backendBaseUrl}/api/builder/logo`, {
        method: "POST",
        body: formData,
      });
      const data = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(data.error || data.message || "Logo upload failed.");
      }

      setLogoUrl(data.logoUrl);
      setMessages((current) => [
        ...current,
        {
          id: Date.now(),
          role: "ai",
          text: "Logo uploaded and attached to the next generated website.",
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: Date.now(),
          role: "ai",
          text: error.message,
        },
      ]);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const submitPrompt = async () => {
    const nextPrompt = prompt.trim();

    if (!nextPrompt || isGenerating) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        role: "user",
        text: nextPrompt,
      },
    ]);
    setPrompt("");
    setIsGenerating(true);

    try {
      const response = await fetch(`${backendBaseUrl}/api/builder/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: nextPrompt,
          mode: buildMode,
          logoUrl,
        }),
      });
      const data = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(data.error || data.message || "Website generation failed.");
      }

      const nextDraft = data.draft || fallbackDraft;

      setDraft(nextDraft);
      setActivePageId(nextDraft.pages?.[0]?.id || "home");
      const ecommerceLink = await linkDraftToEcommerceStore(nextDraft);
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "ai",
          text: ecommerceLink
            ? "Generated the ecommerce site and linked it to a backend store."
            : data.source === "gemini"
              ? "Generated the ecommerce site. Login to persist store data."
              : "Generated a local ecommerce draft. Add GEMINI_API_KEY and login to persist it.",
        },
      ]);
    } catch (error) {
      setDraft(fallbackDraft);
      setEcommerceStore(null);
      setEcommerceProducts([]);
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "ai",
          text: error.message || "I could not reach the generator, so I prepared a clean local draft instead.",
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className={styles.shell}>
      <div className={styles.topActions} aria-label="Workspace actions">
        <button type="button" aria-label="Invite teammate">
          <Icon type="user" />
        </button>
        <button type="button" aria-label="Regenerate workspace">
          <Icon type="refresh" />
        </button>
      </div>

      <section className={`${styles.centerStage} ${hasConversation ? styles.activeStage : ""}`}>
        <div className={styles.identity}>
          <Logo compact className={styles.identityLogo} />
          <span>CONCH</span>
        </div>

        <h1>{hasConversation ? "Building your site." : "What shall we build today?"}</h1>

        {hasConversation ? (
          <div className={styles.conversation} aria-live="polite">
            {messages.map((message) => (
              <article
                className={`${styles.message} ${
                  message.role === "user" ? styles.userMessage : styles.aiMessage
                }`}
                key={message.id}
              >
                {message.text}
              </article>
            ))}

            {isGenerating ? (
              <div className={`${styles.message} ${styles.aiMessage} ${styles.typing}`}>
                <span />
                <span />
                <span />
              </div>
            ) : null}
          </div>
        ) : null}

        <form
          className={styles.inputBar}
          onSubmit={(event) => {
            event.preventDefault();
            submitPrompt();
          }}
        >
          <button
            className={styles.softIconButton}
            type="button"
            aria-label="Upload logo"
            onClick={() => fileInputRef.current?.click()}
          >
            <Icon type="plus" />
          </button>
          <input
            ref={fileInputRef}
            className={styles.fileInput}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(event) => uploadLogo(event.target.files?.[0])}
          />

          <input
            aria-label="Describe the website you want to build"
            placeholder="Describe the website you want to build..."
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />

          <label className={styles.modeSelect}>
            <span className={styles.srOnly}>Build mode</span>
            <select value={buildMode} onChange={(event) => setBuildMode(event.target.value)}>
              <option>Instant</option>
              <option>Deep</option>
            </select>
          </label>

          <button className={styles.buildButton} type="submit" disabled={isGenerating}>
            {isGenerating ? "Building" : isUploadingLogo ? "Uploading" : "Build"}
            <Icon type="send" />
          </button>
        </form>

        {logoUrl ? (
          <div className={styles.logoStatus}>
            <Image src={logoUrl} alt="Uploaded logo preview" width={26} height={26} unoptimized />
            <span>Logo attached</span>
          </div>
        ) : null}

        {draft ? (
          <div className={styles.generatedPreview}>
            <div>
              <p>Live draft</p>
              <strong>{draft.brand}</strong>
              {ecommerceStatus ? <span>{ecommerceStatus}</span> : null}
            </div>
            <div className={styles.sectionPills}>
              {(draft.pages || []).slice(0, 4).map((page) => (
                <span key={page.id || page.label}>{page.label}</span>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {draft ? (
        <GeneratedSitePreview
          activePageId={activePageId}
          draft={draft}
          ecommerceProducts={ecommerceProducts}
          ecommerceStore={ecommerceStore}
          onPageChange={setActivePageId}
        />
      ) : null}
    </main>
  );
}

function GeneratedSitePreview({ activePageId, draft, ecommerceProducts, ecommerceStore, onPageChange }) {
  const palette = draft.palette?.length >= 3 ? draft.palette : fallbackDraft.palette;
  const pages = draft.pages?.length ? draft.pages : fallbackDraft.pages;
  const activePage = pages.find((page) => page.id === activePageId) || pages[0];
  const sections = activePage.sections?.length ? activePage.sections : fallbackDraft.pages[0].sections;
  const [cartItems, setCartItems] = useState({});
  const [favoriteItems, setFavoriteItems] = useState({});
  const [productImages, setProductImages] = useState({});
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [sessionId] = useState(makeSessionId);
  const [syncStatus, setSyncStatus] = useState("");
  const generatedCatalogItems = sections.flatMap((section, sectionIndex) =>
    (section.items?.length ? section.items : [section.title]).slice(0, 4).map((item, itemIndex) => ({
      id: `${section.title}-${item}`,
      productId: "",
      title: item,
      eyebrow: section.eyebrow || "Featured",
      description: section.text,
      sectionTitle: section.title,
      index: sectionIndex * 4 + itemIndex,
      price: 79 + (sectionIndex * 4 + itemIndex) * 35,
      imageUrl: "",
    })),
  );
  const backendCatalogItems = ecommerceProducts.map((product, index) => ({
    id: product._id,
    productId: product._id,
    title: product.name,
    eyebrow: product.tags?.[0] || "Product",
    description: product.description,
    sectionTitle: product.category,
    index,
    price: product.price,
    imageUrl: product.images?.[0]?.url || "",
  }));
  const catalogItems = backendCatalogItems.length ? backendCatalogItems : generatedCatalogItems;
  const featuredItems = catalogItems.length ? catalogItems.slice(0, 6) : [];
  const cartEntries = featuredItems
    .filter((item) => cartItems[item.id])
    .map((item) => ({
      ...item,
      quantity: cartItems[item.id],
      total: cartItems[item.id] * item.price,
    }));
  const cartCount = cartEntries.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartEntries.reduce((total, item) => total + item.total, 0);
  const backendEnabled = Boolean(ecommerceStore?._id && sessionId);

  const syncCartFromBackend = (cart) => {
    const nextItems = {};

    (cart?.items || []).forEach((entry) => {
      const productId = entry.product?._id || entry.product;
      if (productId) nextItems[productId] = entry.quantity;
    });

    setCartItems(nextItems);
  };

  const addToCart = async (item) => {
    setCartItems((current) => ({
      ...current,
      [item.id]: (current[item.id] || 0) + 1,
    }));

    if (!backendEnabled || !item.productId) return;

    try {
      setSyncStatus("Saving cart...");
      const data = await apiRequest(`/api/ecommerce/public/stores/${ecommerceStore._id}/cart/items`, {
        method: "POST",
        body: JSON.stringify({
          sessionId,
          productId: item.productId,
          quantity: 1,
        }),
      });
      syncCartFromBackend(data.cart);
      setSyncStatus("Cart saved");
    } catch (error) {
      setSyncStatus(error.message || "Cart sync failed");
    }
  };

  const updateCartQuantity = async (item, quantity) => {
    setCartItems((current) => {
      const next = { ...current };
      if (quantity <= 0) {
        delete next[item.id];
      } else {
        next[item.id] = quantity;
      }

      return next;
    });

    if (!backendEnabled || !item.productId) return;

    try {
      setSyncStatus("Saving cart...");
      const data = await apiRequest(`/api/ecommerce/public/stores/${ecommerceStore._id}/cart/items`, {
        method: "PATCH",
        body: JSON.stringify({
          sessionId,
          productId: item.productId,
          quantity,
        }),
      });
      syncCartFromBackend(data.cart);
      setSyncStatus("Cart saved");
    } catch (error) {
      setSyncStatus(error.message || "Cart sync failed");
    }
  };

  const toggleFavourite = async (item) => {
    setFavoriteItems((current) => ({
      ...current,
      [item.id]: !current[item.id],
    }));

    if (!backendEnabled || !item.productId) return;

    try {
      setSyncStatus("Saving favourite...");
      const data = await apiRequest(`/api/ecommerce/public/stores/${ecommerceStore._id}/favourites/toggle`, {
        method: "POST",
        body: JSON.stringify({
          sessionId,
          productId: item.productId,
        }),
      });
      const nextFavourites = {};
      (data.favourites?.products || []).forEach((product) => {
        const productId = product._id || product;
        nextFavourites[productId] = true;
      });
      setFavoriteItems(nextFavourites);
      setSyncStatus("Favourite saved");
    } catch (error) {
      setSyncStatus(error.message || "Favourite sync failed");
    }
  };

  const uploadProductPreview = async (item, file) => {
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setProductImages((current) => ({
      ...current,
      [item.id]: imageUrl,
    }));

    if (!ecommerceStore?._id || !item.productId) return;

    try {
      setSyncStatus("Uploading image...");
      const formData = new FormData();
      formData.append("image", file);
      const imageData = await apiRequest(`/api/ecommerce/stores/${ecommerceStore._id}/products/images`, {
        method: "POST",
        body: formData,
      });
      await apiRequest(`/api/ecommerce/stores/${ecommerceStore._id}/products/${item.productId}`, {
        method: "PATCH",
        body: JSON.stringify({
          images: [
            {
              url: imageData.image.url,
              publicId: imageData.image.publicId,
              alt: item.title,
            },
          ],
        }),
      });
      setProductImages((current) => ({
        ...current,
        [item.id]: imageData.image.url,
      }));
      setSyncStatus("Image saved");
    } catch (error) {
      setSyncStatus(error.message || "Image upload failed");
    }
  };

  const saveCustomer = async (event) => {
    event.preventDefault();

    if (!backendEnabled) {
      setSyncStatus("Login and generate a linked store to save customer data.");
      return;
    }

    try {
      setSyncStatus("Saving customer...");
      await apiRequest(`/api/ecommerce/public/stores/${ecommerceStore._id}/customers`, {
        method: "POST",
        body: JSON.stringify({
          sessionId,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: {
            line1: customer.address,
          },
        }),
      });
      setSyncStatus("Customer saved");
    } catch (error) {
      setSyncStatus(error.message || "Customer sync failed");
    }
  };

  return (
    <section
      className={styles.storefrontPreview}
      style={{
        "--draft-bg": palette[0],
        "--draft-accent": palette[1],
        "--draft-ink": palette[2],
      }}
      aria-label="Generated website UI preview"
    >
      <header className={styles.storeNav}>
        <div className={styles.storeBrand}>
          <span className={styles.storeLogo}>
            {draft.logoUrl ? (
              <Image src={draft.logoUrl} alt={`${draft.brand} logo`} width={36} height={36} unoptimized />
            ) : (
              draft.brand?.slice(0, 1) || "C"
            )}
          </span>
          <strong>{draft.brand}</strong>
        </div>

        <nav aria-label="Generated pages">
          {pages.slice(0, 5).map((page) => (
            <button
              className={activePage.id === page.id ? styles.activeGeneratedPage : ""}
              key={page.id}
              type="button"
              onClick={() => onPageChange(page.id)}
            >
              {page.label}
            </button>
          ))}
        </nav>

        <div className={styles.storeTools}>
          <span>Search catalog</span>
          <button type="button">Cart {cartCount}</button>
        </div>
      </header>

      <div className={styles.storeHero} id="generated-preview">
        <div className={styles.storeHeroCopy}>
          <p>{activePage.label} collection</p>
          <h2>{activePage.headline}</h2>
          <span>{activePage.subheadline}</span>
          <div className={styles.storeActions}>
            <a href="#generated-sections">{activePage.primaryAction}</a>
            <a href="#generated-sections">{activePage.secondaryAction}</a>
          </div>
        </div>

        <aside className={styles.storeHeroVisual} aria-label="Generated storefront visuals">
          <div className={styles.featuredProduct}>
            <small>{featuredItems[0]?.eyebrow || "Featured"}</small>
            <strong>{featuredItems[0]?.title || "Signature offer"}</strong>
            <span>{featuredItems[0]?.sectionTitle || "Collection"}</span>
          </div>
          <div className={styles.miniProduct}>
            <span />
            <strong>{featuredItems[1]?.title || "New pick"}</strong>
          </div>
          <div className={styles.miniProduct}>
            <span />
            <strong>{featuredItems[2]?.title || "Popular"}</strong>
          </div>
        </aside>
      </div>

      <div className={styles.categoryRail} aria-label="Generated categories">
        {sections.slice(0, 5).map((section) => (
          <button key={section.title} type="button">
            <span>{section.eyebrow}</span>
            {section.title}
          </button>
        ))}
      </div>

      <div className={styles.catalogHeader}>
        <div>
          <p>Curated for this niche</p>
          <h3>{activePage.label} catalog</h3>
        </div>
        <span>{ecommerceStore?._id ? "Backend linked" : "Local preview"} · {featuredItems.length} cards</span>
      </div>

      <div className={styles.productGrid} id="generated-sections">
        {featuredItems.map((item) => (
          <article key={item.id}>
            <div className={styles.productMedia}>
              {productImages[item.id] || item.imageUrl ? (
                <Image
                  src={productImages[item.id] || item.imageUrl}
                  alt={`${item.title} preview`}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  unoptimized
                />
              ) : (
                <span>{String(item.index + 1).padStart(2, "0")}</span>
              )}
            </div>
            <small>{item.eyebrow}</small>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            <div className={styles.productMeta}>
              <strong>INR {item.price}</strong>
              <span>{item.sectionTitle}</span>
            </div>
            <div className={styles.productActions}>
              <button type="button" onClick={() => toggleFavourite(item)}>
                {favoriteItems[item.id] ? "Saved" : "Save"}
              </button>
              <label>
                Image
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={(event) => uploadProductPreview(item, event.target.files?.[0])}
                />
              </label>
              {cartItems[item.id] ? (
                <div className={styles.quantityControl}>
                  <button type="button" onClick={() => updateCartQuantity(item, cartItems[item.id] - 1)}>
                    -
                  </button>
                  <span>{cartItems[item.id]}</span>
                  <button type="button" onClick={() => updateCartQuantity(item, cartItems[item.id] + 1)}>
                    +
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => addToCart(item)}>
                  Add
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className={styles.commercePanels}>
        <section className={styles.customerPanel}>
          <div>
            <small>Customer data</small>
            <h3>Buyer details</h3>
            <p>Fields match the backend customer model for this store.</p>
          </div>
          <form onSubmit={saveCustomer}>
            <input aria-label="Customer name" placeholder="Customer name" value={customer.name} onChange={(event) => setCustomer((current) => ({ ...current, name: event.target.value }))} />
            <input aria-label="Customer email" placeholder="Email" value={customer.email} onChange={(event) => setCustomer((current) => ({ ...current, email: event.target.value }))} />
            <input aria-label="Customer phone" placeholder="Phone" value={customer.phone} onChange={(event) => setCustomer((current) => ({ ...current, phone: event.target.value }))} />
            <input aria-label="Delivery address" placeholder="Delivery address" value={customer.address} onChange={(event) => setCustomer((current) => ({ ...current, address: event.target.value }))} />
            <button type="submit">Save customer</button>
          </form>
        </section>

        <section className={styles.cartPanel}>
          <div>
            <small>Cart and favourites</small>
            <h3>Store cart</h3>
          </div>
          {cartEntries.length ? (
            <ul>
              {cartEntries.map((item) => (
                <li key={`${item.id}-cart`}>
                  <span>{item.title}</span>
                  <strong>{item.quantity} x INR {item.price}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p>Add catalog cards to preview the cart state.</p>
          )}
          <div className={styles.cartTotal}>
            <span>{syncStatus || `${Object.values(favoriteItems).filter(Boolean).length} saved`}</span>
            <strong>INR {cartTotal}</strong>
          </div>
        </section>
      </div>

      <div className={styles.storeContentBand}>
        {sections.slice(0, 3).map((section) => (
          <article key={`${section.title}-detail`}>
            <small>{section.eyebrow}</small>
            <h3>{section.title}</h3>
            <p>{section.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
