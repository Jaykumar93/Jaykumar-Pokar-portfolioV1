const KEY = "jp-theme";

export function isDark(): boolean {
  const t = document.documentElement.getAttribute("data-theme");
  return t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function toggleTheme(): void {
  const next = isDark() ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* storage unavailable: the choice just won't persist */
  }
  window.dispatchEvent(new Event("jp-theme"));
}

export function subscribeTheme(callback: () => void): () => void {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", callback);
  window.addEventListener("jp-theme", callback);
  return () => {
    mq.removeEventListener("change", callback);
    window.removeEventListener("jp-theme", callback);
  };
}

export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem('${KEY}');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}document.documentElement.setAttribute('data-loading','');setTimeout(function(){document.documentElement.removeAttribute('data-loading')},7000);`;
