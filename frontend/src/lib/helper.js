import toast from "react-hot-toast";

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const copyToClipboard = (url) => {
  navigator.clipboard.writeText(url);
  toast.success("URL copied to clipboard!");
};
