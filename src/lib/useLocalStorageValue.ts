import { useLocalStorage } from 'atomhooks';
import { useEffect } from 'react';

export enum THEME {
  LIGHT = "light",
  DARK = "dark",
}

export const LOCAL_STORAGE_CONFIG = [{
  key: "calculation",
  defaultValue: 0
}, {
  key: "note",
  defaultValue: "",
}, {
  key: "flag",
  defaultValue: false
}, {
  key: "theme",
  defaultValue: THEME.LIGHT
}];

// Helper to get config by key
function getConfig(key: string) {
  return LOCAL_STORAGE_CONFIG.find(cfg => cfg.key === key);
}

// Your existing hooks
export function useCalculation() {
  const config = getConfig('calculation');
  return useLocalStorage<number>('calculation', config ? (config.defaultValue as number) : 0);
}

export function useNote() {
  const config = getConfig('note');
  return useLocalStorage<string>('note', config ? (config.defaultValue as string) : "");
}

export function useFlag() {
  const config = getConfig('flag');
  return useLocalStorage<boolean>('flag', config ? (config.defaultValue as boolean) : false);
}

export function useTheme() {
  const config = getConfig('theme');
  const [theme, setTheme] = useLocalStorage<THEME>('theme', config ? (config.defaultValue as THEME) : THEME.LIGHT);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === THEME.DARK) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  return [theme, setTheme] as const;
}
