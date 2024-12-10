export async function saveToIndexedDB<T>(key: string, value: T): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("TableStateDB", 1); // Open database
  
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("TableState")) {
          db.createObjectStore("TableState"); // Create object store if not present
        }
      };
  
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction("TableState", "readwrite");
        const store = transaction.objectStore("TableState");
  
        const putRequest = store.put(value, key);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = (err) => reject(err);
  
        transaction.oncomplete = () => db.close(); // Close the database connection
      };
  
      request.onerror = (err) => reject(err);
    });
  }
  
  export async function getFromIndexedDB<T>(key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("TableStateDB", 1); // Open database
  
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("TableState")) {
          db.createObjectStore("TableState"); // Ensure object store exists
        }
      };
  
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction("TableState", "readonly");
        const store = transaction.objectStore("TableState");
  
        const getRequest = store.get(key);
        getRequest.onsuccess = () => {
          resolve(getRequest.result as T | null);
          db.close();
        };
  
        getRequest.onerror = (err) => reject(err);
      };
  
      request.onerror = (err) => reject(err);
    });
  }
  