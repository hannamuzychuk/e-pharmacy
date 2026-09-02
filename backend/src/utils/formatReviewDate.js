const REVIEW_DISPLAY_DATES = [
  "2 days ago",
  "5 days ago",
  "1 week ago",
  "2 weeks ago",
  "3 weeks ago",
  "1 month ago",
  "2 months ago",
  "3 months ago",
];

function hashString(value) {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function seededRandom(seed) {
  let state = seed >>> 0;

  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function seededShuffle(items, seed) {
  const result = [...items];
  const random = seededRandom(seed);

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function getReviewDisplayDate(index) {
  return REVIEW_DISPLAY_DATES[index % REVIEW_DISPLAY_DATES.length];
}

function pickReviewsForProduct(_sharedReviews, product) {
  const productId = String(product._id);
  const seed = hashString(productId);
  const name = product.name || "this medicine";

  const templates = [
    {
      author: "Olena Koval",
      text: `${name} worked well for me. Delivery was fast and the packaging was intact.`,
    },
    {
      author: "Andriy Melnyk",
      text: `I ordered ${name} for my family. Quality matches the description and price is fair.`,
    },
    {
      author: "Iryna Bondar",
      text: `Good experience with ${name}. Clear instructions and no issues after use.`,
    },
    {
      author: "Dmytro Shevchenko",
      text: `${name} is now in our home kit. Reliable product, will buy again.`,
    },
    {
      author: "Kateryna Hnatyuk",
      text: `Satisfied with ${name}. Easy to find in the catalog and arrived on time.`,
    },
  ];

  const shuffled = seededShuffle(templates, seed);
  const count = 3 + (seed % 2);

  const ratings = [4, 4.5, 5];

  return shuffled.slice(0, count).map((item, index) => ({
    id: `${productId}-review-${index}`,
    author: item.author,
    date: getReviewDisplayDate((seed + index * 3) % REVIEW_DISPLAY_DATES.length),
    text: item.text,
    rating: ratings[(seed + index * 7) % ratings.length],
  }));
}

module.exports = {
  getReviewDisplayDate,
  pickReviewsForProduct,
};
