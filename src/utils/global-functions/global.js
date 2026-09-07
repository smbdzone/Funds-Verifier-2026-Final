import axios from "axios";
import DOMPurify from "dompurify";
const formatDateTime = (dateInput, locale = "en-US") => {
  const date = dateInput ? new Date(dateInput) : null;
  const isValidDate =
    date instanceof Date && !Number.isNaN(date.getTime());

  if (!isValidDate) {
    return { formattedDate: "--", formattedTime: "--" };
  }

  // Format date as 'MMM dd-yyyy'
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short", // Full month name
    day: "numeric", // Day without leading zero
    year: "numeric", // Full year
  });

  // Format time as 'hh:mm AM/PM'
  const formattedTime = date.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return { formattedDate, formattedTime };
};

function formatNumberWithCommas(input) {
  // Convert input to a number if it’s a string
  const number = typeof input === "string" ? Number(input) : input;

  // Check if the conversion is valid (to avoid NaN for non-numeric strings)
  if (isNaN(number)) {
    return "";
  }

  return number?.toLocaleString("en-US");
}

const generateTimeOptions = () => {
  const times = []
  const appendPeriod = (period, hours) => {
    hours.forEach((hour) => {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour < 10 ? `0${hour}` : String(hour)
        const formattedMinute = minute < 10 ? `0${minute}` : String(minute)
        times.push(`${formattedHour}:${formattedMinute} ${period}`)
      }
    })
  }

  appendPeriod('AM', [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  appendPeriod('PM', [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])

  return times
}

const getTomorrowDate = () => {
  const today = new Date();
  let tomorrow = new Date(today);

  do {
    tomorrow.setDate(tomorrow.getDate() + 1);
  } while (tomorrow.getDay() === 0 || tomorrow.getDay() === 6);

  return tomorrow;
};

const getTodayDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// Disable past dates but allow next weekend
const disablePastDates = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to start of the day for comparison

  const isPastDate = date < today;
  return isPastDate; // Only disable past dates
};

const disableFutureDates = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to start of the day for comparison

  const isFutureDate = date > today; // Check if the date is in the future
  return isFutureDate; // Only disable future dates
};

// Replace with your API key
const API_KEY = "90dddd58ac9fa883ba6f2753";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/USD/AED`;

async function convertUsdToAed(amountInUsd) {
  try {
    // Fetch exchange rate from API
    const response = await axios.get(BASE_URL);
    const exchangeRate = response.data.conversion_rate;

    // Convert the amount
    const amountInAed = amountInUsd * exchangeRate;

    return amountInAed;
  } catch (error) {
    console.error("Error fetching exchange rate:", error.message);
    console.log("Could not fetch exchange rate. Please try again.");
  }
}

const convertUsdToUsdt = async (usdAmount) => {
  const API_KEY = "cur_live_GJg9TFJ6JVYwpEJcBkFnXf45d40AQHQPu0yXHXsO"; // Replace with your actual API key
  const API_URL = `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}&currencies=USDT&base_currency=USD`;

  try {
    // Fetch the conversion rate
    const response = await axios.get(API_URL);
    // Extract USDT rate
    if (!response.data || !response.data.data || !response.data.data.USDT) {
      throw new Error("USDT data not found in API response.");
    }
    // Extract USDT rate
    const usdtRate = response.data.data.USDT.value;

    // Convert USD to USDT
    const usdtAmount = usdAmount * usdtRate;

    return usdtAmount;
  } catch (error) {
    console.error("Error fetching conversion rate:", error.message);
    throw new Error("Unable to fetch conversion rate.");
  }
};

const buildQueryString = (params) => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([key, value]) => value !== undefined && value !== ""
    )
  );
  return new URLSearchParams(filteredParams).toString();
};

function formatDate(inputDate) {
  const date = new Date(inputDate);

  // Format the day with a suffix
  const day = date.getDate();
  const daySuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return `${month} ${day}${daySuffix(day)}, ${year}`;
}

const sanitizeHTML = (html) => {
  if (!html) return "";

  return DOMPurify.sanitize(html, {
    FORBID_TAGS: [
      "script",
      "form",
      "input",
      "button",
      "select",
      "textarea",
      "iframe",
      "object",
      "embed",
      "meta",
    ],
    FORBID_ATTR: [
      "onerror",
      "onclick",
      "onload",
      "onmouseover",
      "onmouseout",
      "onmousedown",
      "onmouseup",
      "onmousemove",
      "onfocus",
      "onblur",
      "onchange",
      "onsubmit",
      "onreset",
      "onselect",
      "onunload",
      "onabort",
      "onkeydown",
      "onkeypress",
      "onkeyup",
      "ondblclick",
      "oncontextmenu",
      "ondrag",
      "ondragend",
      "ondragenter",
      "ondragleave",
      "ondragover",
      "ondragstart",
      "ondrop",
      "oninput",
      "oninvalid",
      "onscroll",
      "ontouchstart",
      "ontouchend",
      "ontouchmove",
      "ontouchcancel",
    ],
  });
};

const formatColorLabel = (color) => {
  if (!color) return ''
  return String(color).replace(/([a-z])([A-Z])/g, '$1 $2').trim()
}

const formatColorList = (colors) => {
  if (!colors) return ''
  const list = Array.isArray(colors) ? colors : [colors]
  return list
    .filter((c) => c != null && String(c).trim() !== '')
    .map(formatColorLabel)
    .join(', ')
}

const getProfileImageSrc = (profileImage) => {
  const trimmed = typeof profileImage === 'string' ? profileImage.trim() : ''
  return trimmed || '/assets/images/dummy-profile.png'
}

export {
  convertUsdToAed,
  convertUsdToUsdt,
  buildQueryString,
  formatNumberWithCommas,
  generateTimeOptions,
  getTomorrowDate,
  getTodayDate,
  disablePastDates,
  formatDateTime,
  disableFutureDates,
  formatDate,
  sanitizeHTML,
  formatColorList,
  getProfileImageSrc,
};
