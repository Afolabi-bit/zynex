function isValidUrl(value: string) {
  const trimmedValue = value.trim();

  // Check if URL is empty
  if (trimmedValue === "") {
    return { validity: false, message: "URL cannot be empty" };
  }

  // Explicit protocol check before parsing
  const hasHttpProtocol = trimmedValue.startsWith("http://");
  const hasHttpsProtocol = trimmedValue.startsWith("https://");

  if (!hasHttpProtocol && !hasHttpsProtocol) {
    if (!trimmedValue.includes("://")) {
      return {
        validity: false,
        message: "URL must start with http:// or https://.",
      };
    }

    return {
      validity: false,
      message: "Only HTTP and HTTPS protocols are supported",
    };
  }

  // Validate URL structure
  try {
    const url = new URL(trimmedValue);

    // Double-check protocol (redundant but safe)
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return {
        validity: false,
        message: "Only HTTP and HTTPS protocols are supported",
      };
    }

    // Check if hostname exists
    if (!url.hostname || url.hostname.length === 0) {
      return {
        validity: false,
        message: "URL must include a valid domain name",
      };
    }

    return { validity: true, message: "" };
  } catch (error) {
    return {
      validity: false,
      message:
        "Invalid URL format. Please enter a valid URL (e.g., https://example.com)",
    };
  }
}

export default isValidUrl;
