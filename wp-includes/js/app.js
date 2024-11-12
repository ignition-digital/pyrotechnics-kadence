async function fetchAllProducts() {
  const cacheName = "product-cache";
  const version = 1.3;
  const inventoryProductsUrl = `data/inventory.json?v=${version}`;

  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(inventoryProductsUrl);

  if (cachedResponse) {
    return cachedResponse.json();
  } else {
    const networkResponse = await fetchProductsFromJsonFile(
      inventoryProductsUrl
    );
    cache.put(
      inventoryProductsUrl,
      new Response(JSON.stringify(networkResponse))
    );
    return networkResponse;
  }
}

function fetchProductsFromJsonFile(jsonFileUrl) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", jsonFileUrl, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const products = JSON.parse(xhr.responseText);
          resolve(products);
        } else {
          reject(new Error("Error fetching products: " + xhr.status));
        }
      }
    };
    xhr.send();
  });
}

function renderProductList(products) {
  const productContainer = document.getElementById("pp-image-gallery-38bff30");
  productContainer.innerHTML = "";
  products.forEach(function (product) {
    var productHTML = generateProductHTML(product);
    productContainer.innerHTML += productHTML;
  });

  // Trigger reflow to ensure styles are applied
  // productContainer.offsetHeight;
}

function generateProductHTML(product) {
  const defaultImage =
    "https://public-110924.s3.ap-southeast-1.amazonaws.com/images/product-placeholder2.webp";
  const imageUrl = product.image_url || defaultImage;
  const savedLanguage = localStorage.getItem("selectedLanguage");
  let productName = savedLanguage === "zh" ? product.chinese : product.english;

  var html = `
    <a href="product.html?id=${product.id}#specs">
      <div class="pp-grid-item-wrap ${product.group}" data-item-id="${product.id}">
        <div class="pp-grid-item pp-image">
          <div class="pp-image-gallery-thumbnail-wrap pp-ins-filter-hover pp-gallery-tilt">
            <div class="pp-ins-filter-target pp-image-gallery-thumbnail">
<img
  decoding="async"
  class="pp-gallery-slide-image"
  src="${defaultImage}" 
  srcset="${imageUrl} 1x, ${imageUrl} 2x" 
  alt=""
  data-no-lazy="1"
  loading="lazy"
  />
            </div>
            <div class="pp-image-overlay pp-media-overlay"></div>
            <div class="pp-gallery-image-content pp-media-content"></div>
            <div class="pp-gallery-image-content">
              <div class="pp-gallery-image-caption">${productName}</div>
            </div>
          </div>
        </div>
      </div>
    </a>
  `;

  return html;
}

function handleLanguageOnChange(selectId) {
  const languageSelect = document.getElementById(selectId);
  const selectedLanguage = languageSelect.value;
  localStorage.setItem("selectedLanguage", selectedLanguage);
  fetchTranslation(selectedLanguage);
  document.getElementById("desktopLanguageSelect").value = languageSelect.value;
  document.getElementById("mobileLanguageSelect").value = languageSelect.value;
  const currentPath = window.location.pathname;

  if (
    currentPath.includes("product") ||
    currentPath.includes("our-fireworks")
  ) {
    window.location.reload();
  }
}

function fetchTranslation(language) {
  fetch(`i18n/${language}.json`)
    .then((response) => response.json())
    .then((translation) => {
      applyTranslation(translation);
    });
}

function applyTranslation(translation) {
  const elementsToTranslate = document.querySelectorAll("[data-translate]");
  elementsToTranslate.forEach((element) => {
    const translationKey = element.getAttribute("data-translate");
    const translationValue = getTranslationValue(translationKey, translation);
    if (translationValue) {
      if (translationKey === "search.placeholder") {
        element.setAttribute("placeholder", translationValue);
      } else {
        element.textContent = translationValue;
      }
    }
  });
}

function getTranslationValue(key, translationData) {
  const keys = key.split(".");
  let value = translationData;

  keys.forEach((nestedKey) => {
    value = value[nestedKey];
  });

  return value;
}

function adjustHrefs() {
  const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  document.querySelectorAll("a[href$='.html']").forEach((link) => {
    if (!isLocal) {
      link.href = link.href.replace(".html", "");
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  adjustHrefs();
  document.getElementById("footerYear").textContent = new Date().getFullYear();
  const languageSelect = document.getElementById("desktopLanguageSelect");
  const languageSelect2 = document.getElementById("mobileLanguageSelect");
  const savedLanguage = localStorage.getItem("selectedLanguage");

  if (savedLanguage) {
    if (languageSelect) {
      languageSelect.value = savedLanguage;
      languageSelect2.value = savedLanguage;
    }

    fetchTranslation(savedLanguage);
  } else {
    languageSelect.value = "en";
    languageSelect2.value = "zh";
    localStorage.setItem("selectedLanguage", "en");
    window.location.reload();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;
  const menuItems = document.querySelectorAll("#primary-menu li");

  for (let menuItem of menuItems) {
    const link = menuItem.querySelector("a");
    if (
      link &&
      (currentPath.includes(link.getAttribute("href")) ||
        link.getAttribute("href").includes(currentPath))
    ) {
      menuItem.classList.add("current-menu-item");
      break;
    }
  }
});
