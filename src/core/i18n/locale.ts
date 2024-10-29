"use client";

import { defaultLocale } from "./config";
import type { Locale } from "./types";

const COOKIE_NAME = "NEXT_LOCALE";

export const getLocale = (): string => {
  if (typeof window === 'undefined') return defaultLocale;
  return localStorage.getItem(COOKIE_NAME) || defaultLocale;
};

export const setLocale = (locale?: string): void => {
  localStorage.setItem(COOKIE_NAME, locale as Locale || defaultLocale);
};
