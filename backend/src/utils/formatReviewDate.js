const REVIEW_DISPLAY_DATES = [
  "2 days ago",
  "5 days ago",
  "1 week ago",
  "1 week ago",
  "2 weeks ago",
  "3 weeks ago",
  "1 month ago",
  "1 month ago",
  "2 months ago",
];

function getReviewDisplayDate(index) {
  return REVIEW_DISPLAY_DATES[index % REVIEW_DISPLAY_DATES.length];
}

module.exports = {
  getReviewDisplayDate,
};
