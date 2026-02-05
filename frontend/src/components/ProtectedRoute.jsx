import React from "react";

export default function ProtectedRoute({
  children,
  isAllowed,
  fallback = null,
}) {
  return isAllowed ? children : fallback;
}
