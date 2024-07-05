const htmlElement = document.querySelector("html");
const ModeKey = "color-scheme-override";
const ColorScheme = {
  Light: "light",
  Dark: "dark",
};

let userOverride = window.localStorage.getItem(ModeKey);
let systemPreferred = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? ColorScheme.Dark
  : ColorScheme.Light;
let currentMode = systemPreferred;

export function forceLight() {
  htmlElement.classList.remove(ColorScheme.Dark);
  htmlElement.classList.add(ColorScheme.Light);
  currentMode = ColorScheme.Light;
  if (currentMode === systemPreferred) {
    window.localStorage.removeItem(ModeKey);
    userOverride = null;
  } else {
    window.localStorage.setItem(ModeKey, ColorScheme.Light);
    userOverride = ColorScheme.Light;
  }
  window.dispatchEvent(
    new CustomEvent("color-scheme-change", { detail: ColorScheme.Light })
  );
}

export function forceDark() {
  htmlElement.classList.remove(ColorScheme.Light);
  htmlElement.classList.add(ColorScheme.Dark);
  currentMode = ColorScheme.Dark;
  if (currentMode === systemPreferred) {
    window.localStorage.removeItem(ModeKey);
    userOverride = null;
  } else {
    window.localStorage.setItem(ModeKey, ColorScheme.Dark);
    userOverride = ColorScheme.Dark;
  }
  window.dispatchEvent(
    new CustomEvent("color-scheme-change", { detail: ColorScheme.Dark })
  );
}

export function toggleColorScheme() {
  currentMode === ColorScheme.Light ? forceDark() : forceLight();
}

export function initColorScheme() {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      systemPreferred = event.matches ? ColorScheme.Dark : ColorScheme.Light;
      initColorScheme();
    });

  setTimeout(() => {
    document.documentElement.style.setProperty(
      "--color-scheme-transition-duration",
      "150ms"
    );
  }, 100);

  Object.defineProperty(window, "currentColorScheme", {
    get: () => currentMode,
    set: () => console.error("Protected Property, Cannot Set"),
  });

  if (userOverride === ColorScheme.Dark) {
    forceDark();
  } else if (userOverride === ColorScheme.Light) {
    forceLight();
  } else if (systemPreferred === ColorScheme.Dark) {
    forceDark();
  } else {
    forceLight();
  }
}

(window as any).colorScheme = {
  toggle: toggleColorScheme,
  forceLight,
  forceDark,
};
