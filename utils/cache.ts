import CachedItem from "@/types/cache";

const createCache = <K, V>(maxCacheSize: number, expirationTime: number) => {
  const cacheMap = new Map<K, CachedItem<V>>();

  const has = (key: K): boolean => {
    if (!cacheMap.has(key)) return false;

    const cachedItem = cacheMap.get(key)!;
    const currentTime = Date.now();

    if (currentTime - cachedItem.timestamp > expirationTime) {
      cacheMap.delete(key); // Suppression si expiré
      return false;
    }

    return true;
  };

  const get = (key: K): V | undefined => {
    return has(key) ? cacheMap.get(key)!.value : undefined;
  };

  const set = (key: K, value: V): void => {
    if (cacheMap.size >= maxCacheSize) {
      const firstEntry = cacheMap.keys().next();
      if (!firstEntry.done) {
        cacheMap.delete(firstEntry.value);
      }
    }

    cacheMap.set(key, { value, timestamp: Date.now() });
  };

  const remove = (key: K): void => {
    cacheMap.delete(key);
  };

  const clear = (): void => {
    cacheMap.clear();
  };

  return {
    has,
    get,
    set,
    remove,
    clear,
  };
};

export default createCache;
