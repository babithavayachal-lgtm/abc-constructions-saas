/* =========================================
   ABC Constructions — Firestore Integration
   Syncs AppData with Firebase Firestore
   Provides real-time persistence across devices
   ========================================= */

const FirestoreSync = {
  initialized: false,
  listeners: {},

  // Initialize Firestore sync - load data from Firestore into AppData
  async init() {
    if (this.initialized) return;
    if (!window.firebaseDb) {
      console.warn('Firebase not initialized yet');
      return;
    }

    this.initialized = true;

    // Load all collections from Firestore
    await this.loadCollection('interestForms');
    await this.loadCollection('projects');
    await this.loadCollection('staff');
    await this.loadCollection('permits');
    await this.loadCollection('notifications');

    // Set up real-time listeners for live updates
    this.startRealtimeListeners();

    console.log('[FirestoreSync] Initialized and synced with Firestore');
  },

  // Load a collection from Firestore into AppData
  async loadCollection(collectionName) {
    try {
      const data = await window.firestoreHelpers.getAll(collectionName);
      if (data && data.length > 0) {
        // Replace AppData array contents with Firestore data
        AppData[collectionName] = data.map((item) => {
          // Convert Firestore timestamps to ISO strings
          const cleaned = { ...item };
          if (cleaned.createdAt && cleaned.createdAt.toDate) {
            cleaned.createdAt = cleaned.createdAt.toDate().toISOString();
          }
          if (cleaned.submittedAt && cleaned.submittedAt.toDate) {
            cleaned.submittedAt = cleaned.submittedAt.toDate().toISOString();
          }
          if (cleaned.approvedAt && cleaned.approvedAt.toDate) {
            cleaned.approvedAt = cleaned.approvedAt.toDate().toISOString();
          }
          if (cleaned.deniedAt && cleaned.deniedAt.toDate) {
            cleaned.deniedAt = cleaned.deniedAt.toDate().toISOString();
          }
          if (cleaned.sentAt && cleaned.sentAt.toDate) {
            cleaned.sentAt = cleaned.sentAt.toDate().toISOString();
          }
          if (cleaned.hireDate && typeof cleaned.hireDate === 'string') {
            // Keep hireDate as string
          }
          return cleaned;
        });
        console.log(`[FirestoreSync] Loaded ${data.length} items from ${collectionName}`);
      } else if (AppData[collectionName] && AppData[collectionName].length > 0) {
        console.log(`[FirestoreSync] Seeding initial data for ${collectionName}...`);
        await this.saveCollection(collectionName);
      }
    } catch (err) {
      console.error(`[FirestoreSync] Failed to load ${collectionName}:`, err);
    }
  },

  // Save a single document to Firestore
  async saveDoc(collectionName, id, data) {
    try {
      await window.firestoreHelpers.set(collectionName, id, data);
    } catch (err) {
      console.error(`[FirestoreSync] Failed to save ${collectionName}/${id}:`, err);
    }
  },

  // Save entire collection to Firestore
  async saveCollection(collectionName) {
    try {
      const data = AppData[collectionName];
      if (!data || !Array.isArray(data)) return;

      for (const item of data) {
        const id = item.id;
        const cleanData = { ...item };
        // Remove id from data (it's the document key)
        delete cleanData.id;
        await window.firestoreHelpers.set(collectionName, id, cleanData);
      }
    } catch (err) {
      console.error(`[FirestoreSync] Failed to save collection ${collectionName}:`, err);
    }
  },

  // Add a new document to Firestore
  async addDoc(collectionName, data) {
    try {
      const id = await window.firestoreHelpers.add(collectionName, data);
      return id;
    } catch (err) {
      console.error(`[FirestoreSync] Failed to add doc to ${collectionName}:`, err);
      throw err;
    }
  },

  // Delete a document from Firestore
  async deleteDoc(collectionName, id) {
    try {
      await window.firestoreHelpers.delete(collectionName, id);
    } catch (err) {
      console.error(`[FirestoreSync] Failed to delete ${collectionName}/${id}:`, err);
    }
  },

  // Start real-time listeners for all collections
  startRealtimeListeners() {
    const collections = ['interestForms', 'projects', 'staff', 'permits', 'notifications'];

    collections.forEach((collectionName) => {
      this.listeners[collectionName] = window.firestoreHelpers.onSnapshot(
        collectionName,
        (data) => {
          // Clean Firestore timestamps
          const cleaned = data.map((item) => {
            const c = { ...item };
            if (c.createdAt && c.createdAt.toDate) c.createdAt = c.createdAt.toDate().toISOString();
            if (c.submittedAt && c.submittedAt.toDate) c.submittedAt = c.submittedAt.toDate().toISOString();
            if (c.approvedAt && c.approvedAt.toDate) c.approvedAt = c.approvedAt.toDate().toISOString();
            if (c.deniedAt && c.deniedAt.toDate) c.deniedAt = c.deniedAt.toDate().toISOString();
            if (c.sentAt && c.sentAt.toDate) c.sentAt = c.sentAt.toDate().toISOString();
            return c;
          });

          // Update AppData in place if data exists
          if (cleaned.length > 0) {
            AppData[collectionName] = cleaned;
          }

          // Re-render current page if it's affected
          if (App && App.currentPage) {
            // Only re-render if we're on a page that uses this collection
            const pageCollections = {
              'interest-forms': ['interestForms'],
              'proposals': ['projects'],
              'payments': ['projects'],
              'dashboard': ['projects', 'interestForms', 'permits'],
              'staff': ['staff'],
              'customer-portal': ['interestForms'],
              'jobs': ['projects'],
              'completed': ['projects'],
              'permits': ['permits'],
              'notifications': ['notifications'],
              'scheduling': ['projects'],
              'change-orders': ['projects'],
              'crew-dispatch': ['projects'],
              'work-closure': ['projects'],
              'maintenance-guide': ['projects'],
              'inventory': [],
              'sales': [],
              'settings': [],
            };
            const relevant = pageCollections[App.currentPage] || [];
            if (relevant.includes(collectionName)) {
              App.renderPage(App.currentPage);
            }
          }
        }
      );
    });
  },

  // Stop all real-time listeners
  stopListeners() {
    Object.values(this.listeners).forEach((unsubscribe) => {
      if (typeof unsubscribe === 'function') unsubscribe();
    });
    this.listeners = {};
  },
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  // Wait a moment for Firebase to initialize
  await new Promise((resolve) => setTimeout(resolve, 500));
  await FirestoreSync.init();
});
