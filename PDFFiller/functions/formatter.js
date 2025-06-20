
const formatDate = (date) => {
  const dateObj = new Date(date);

  const formatted = dateObj.toLocaleDateString("en-GB",
      {day: "2-digit", month: "short", year: "numeric"});

  return formatted;
};

module.exports = {formatDate};
