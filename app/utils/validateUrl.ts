function isValidUrl(value: string) {
  if (value.trim() === "")
    return { validity: false, message: "URL cannot be empty" };
  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return { validity: true, message: "" };
    } else {
      return { validity: false, message: "Please enter a valid URL" };
    }
  } catch {
    return { validity: false, message: "Please enter a valid URL" };
  }
}

export default isValidUrl;
