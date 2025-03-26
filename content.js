(() => {
  // 初期設定で非表示にする
  chrome.storage.sync.get("hideAddress", ({ hideAddress }) => {
    if (hideAddress === undefined) {
      // 初回インストール時のデフォルト設定（true = 非表示）
      chrome.storage.sync.set({ hideAddress: true });
      hideAddress = true;
    }

    if (hideAddress) {
      const style = document.createElement("style");
      style.id = "amazon-address-protection-style";
      style.textContent = `
        #nav-global-location-popover-link {
          display: none !important;
        }
      `;
      document.documentElement.insertBefore(style, document.head);
    }
  });
})();
