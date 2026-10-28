
const quotes = [
    {
        text: "Small steps every day lead to extraordinary places.",
        author: "QuoteAura",
        category: "Growth"
    },
    {
        text: "You do not have to see the whole staircase, just take the first step.",
        author: "Martin Luther King Jr.",
        category: "Courage"
    },
    {
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain",
        category: "Motivation"
    },
    {
        text: "It always seems impossible until it is done.",
        author: "Nelson Mandela",
        category: "Courage"
    },
    {
        text: "Believe you can and you are halfway there.",
        author: "Theodore Roosevelt",
        category: "Confidence"
    },
    {
        text: "Your future is created by what you do today, not tomorrow.",
        author: "Robert Kiyosaki",
        category: "Growth"
    },
    {
        text: "Great things are done by a series of small things brought together.",
        author: "Vincent van Gogh",
        category: "Creativity"
    },
    {
        text: "Nothing will work unless you do.",
        author: "Maya Angelou",
        category: "Motivation"
    },
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        category: "Passion"
    },
    {
        text: "You are never too old to set another goal or dream a new dream.",
        author: "C. S. Lewis",
        category: "Dreams"
    },
    {
        text: "Do what you can, with what you have, where you are.",
        author: "Theodore Roosevelt",
        category: "Action"
    },
    {
        text: "Happiness depends upon ourselves.",
        author: "Aristotle",
        category: "Happiness"
    },
    {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
        category: "Resilience"
    },
    {
        text: "The journey of a thousand miles begins with one step.",
        author: "Lao Tzu",
        category: "Growth"
    },
    {
        text: "What you think, you become. What you feel, you attract. What you imagine, you create.",
        author: "Often attributed to Buddha",
        category: "Mindset"
    }
];

const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const quoteCategory = document.getElementById("quoteCategory");
const quoteNumber = document.getElementById("quoteNumber");
const authorAvatar = document.getElementById("authorAvatar");

const newQuoteBtn = document.getElementById("newQuoteBtn");
const favoriteBtn = document.getElementById("favoriteBtn");
const copyBtn = document.getElementById("copyBtn");

const favoritesToggle = document.getElementById("favoritesToggle");
const favoriteCount = document.getElementById("favoriteCount");
const favoritesPanel = document.getElementById("favoritesPanel");
const favoritesList = document.getElementById("favoritesList");
const closeFavorites = document.getElementById("closeFavorites");
const toast = document.getElementById("toast");

let currentQuoteIndex = 0;
let previousQuoteIndex = -1;
let toastTimer;

function getSavedFavorites() {
    try {
        const saved = JSON.parse(localStorage.getItem("quoteAuraFavorites"));
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        return [];
    }
}

let favorites = getSavedFavorites();

function saveFavorites() {
    try {
        localStorage.setItem("quoteAuraFavorites", JSON.stringify(favorites));
    } catch (error) {
        showToast("Unable to save favourites in this browser.");
    }
}

function showToast(message) {
    toast.textContent = message;
    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.textContent = "";
    }, 2400);
}

function displayQuote(index) {
    const quote = quotes[index];

    quoteText.classList.add("changing");

    setTimeout(() => {
        quoteText.textContent = "“" + quote.text + "”";
        quoteAuthor.textContent = quote.author;
        quoteCategory.textContent = quote.category;
        quoteNumber.textContent = "NOTE NO. " + String(index + 1).padStart(3, "0");
        authorAvatar.textContent = quote.author.charAt(0).toUpperCase();

        quoteText.classList.remove("changing");
        updateFavoriteButton();
    }, 180);
}

function showNewQuote() {
    let nextIndex = currentQuoteIndex;

    if (quotes.length > 1) {
        while (nextIndex === currentQuoteIndex) {
            nextIndex = Math.floor(Math.random() * quotes.length);
        }
    }

    previousQuoteIndex = currentQuoteIndex;
    currentQuoteIndex = nextIndex;

    displayQuote(currentQuoteIndex);
}

function isFavorite(quote) {
    return favorites.some(item =>
        item.text === quote.text && item.author === quote.author
    );
}

function updateFavoriteButton() {
    const quote = quotes[currentQuoteIndex];
    const saved = isFavorite(quote);

    favoriteBtn.textContent = saved ? "♥" : "♡";
    favoriteBtn.classList.toggle("active", saved);
    favoriteBtn.setAttribute(
        "aria-label",
        saved ? "Remove from favourites" : "Add to favourites"
    );

    favoriteCount.textContent = favorites.length;
}

function toggleFavorite() {
    const quote = quotes[currentQuoteIndex];

    if (isFavorite(quote)) {
        favorites = favorites.filter(item =>
            !(item.text === quote.text && item.author === quote.author)
        );
        showToast("Removed from your favourites.");
    } else {
        favorites.push(quote);
        showToast("Saved to your favourites.");
    }

    saveFavorites();
    updateFavoriteButton();
    renderFavorites();
}

async function copyQuote() {
    const quote = quotes[currentQuoteIndex];
    const textToCopy = `“${quote.text}” — ${quote.author}`;

    try {
        await navigator.clipboard.writeText(textToCopy);
        showToast("Quote copied to clipboard!");
    } catch (error) {
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = textToCopy;
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";

        document.body.appendChild(temporaryInput);
        temporaryInput.select();

        try {
            const copied = document.execCommand("copy");
            showToast(
                copied
                    ? "Quote copied to clipboard!"
                    : "Copy not available. Please select the quote manually."
            );
        } catch (copyError) {
            showToast("Copy not available. Please select the quote manually.");
        } finally {
            temporaryInput.remove();
        }
    }
}

function renderFavorites() {
    favoritesList.replaceChildren();
    favoriteCount.textContent = favorites.length;

    if (favorites.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-message";
        empty.textContent = "No saved quotes yet. Tap the heart on a quote you love.";
        favoritesList.appendChild(empty);
        return;
    }

    favorites.forEach(quote => {
        const item = document.createElement("article");
        item.className = "favorite-item";

        const text = document.createElement("p");
        text.textContent = "“" + quote.text + "”";

        const author = document.createElement("span");
        author.textContent = "— " + quote.author + " · " + quote.category;

        item.append(text, author);
        favoritesList.appendChild(item);
    });
}

newQuoteBtn.addEventListener("click", showNewQuote);
favoriteBtn.addEventListener("click", toggleFavorite);
copyBtn.addEventListener("click", copyQuote);

favoritesToggle.addEventListener("click", () => {
    favoritesPanel.hidden = !favoritesPanel.hidden;

    if (!favoritesPanel.hidden) {
        renderFavorites();
        favoritesPanel.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }
});

closeFavorites.addEventListener("click", () => {
    favoritesPanel.hidden = true;
});

displayQuote(currentQuoteIndex);
renderFavorites();
