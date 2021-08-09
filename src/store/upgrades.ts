export const upgrades = {
  '0.2.8': {
    rchainInfos: (db: any, ri: any) => {
      console.warn(
        `[DB upgrade](from <0.2.8 to 0.2.8+) rchainInfos.info.rchainNetwork and .namePrice for blockchain ${ri.chainId} is absent, will set it to "unknown" and 1500000000`
      );

      let newInfo = {
        ...ri.info,
        rchainNetwork: 'unknown',
        namePrice: 1500000000,
      };
      delete newInfo.rchainNamesRegistryUriEntry;
      console.log('newInfo', newInfo);

      const riAfterUpgrade = {
        ...ri,
        info: newInfo,
      };
      const tx = db.transaction('rchainInfos', 'readwrite');
      const objectStore = tx.objectStore('rchainInfos');
      objectStore.put(riAfterUpgrade);
      console.warn(
        `[DB upgrade] rchainInfos.info.rchainNetwork and .namePrice for blockchain ${ri.chainId} updated in DB`
      );
      return riAfterUpgrade;
    },
  },
  '0.2.9': {
    ui: (db: any, ui: any) => {
      console.warn(`[DB upgrade](from <0.2.9 to 0.2.9+) ui.language is absent, will set it to "en"`);

      let newUi = {
        ...ui,
        language: 'en',
      };
      console.log('newUi', newUi);

      const tx = db.transaction('ui', 'readwrite');
      const objectStore = tx.objectStore('ui');
      objectStore.put(newUi, 0);
      console.warn(`[DB upgrade] ui updated in DB`);
      return newUi;
    },
    tabs: (db: any, tabs: any) => {
      console.warn(`[DB upgrade](from <0.2.9 to 0.2.9+) tabs[n].muted is absent, will set it to false`);

      const newTabs = tabs.map((t: any) => {
        return {
          ...t,
          muted: false,
        };
      });

      const tx = db.transaction('tabs', 'readwrite');
      const objectStore = tx.objectStore('tabs');
      newTabs.forEach((t: any) => {
        objectStore.put(t);
      });
      console.warn(`[DB upgrade] tabs updated in DB`);
      return newTabs;
    },
  },
};
