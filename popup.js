document.addEventListener("DOMContentLoaded", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab?.id) {
    // 現在のURLのホスト名を取得
    const url = new URL(tab.url);
    const hostname = url.hostname;

    // TLDを抽出
    const tld = getTLD(hostname);

    if (tld === false) {
      // Amazon以外のサイトの場合、ポップアップ内の要素を削除しメッセージを表示
      document.body.innerHTML = ''; // ポップアップ内の全要素を削除
      const message = document.createElement('div');
      message.textContent = 'Please open the popup on Amazon.';
      document.body.appendChild(message);
      return;
    }

    // TLDを指定した要素に設定
    const tldElement = document.getElementById("amazon-tld");
    if (tldElement) {
      tldElement.textContent = tld;
    }

    // 現在の設定を取得
    chrome.storage.sync.get("hideAddress", ({ hideAddress }) => {
      if (hideAddress === undefined) {
        // 初回インストール時のデフォルト設定（true = 非表示）
        chrome.storage.sync.set({ hideAddress: true });
        hideAddress = true;
      }

      // チェックボックスの状態を設定
      const checkbox = document.getElementById("toggle-checkbox");
      checkbox.checked = hideAddress;

      // チェックボックスの変更をリスン
      checkbox.addEventListener("change", async (event) => {
        const newValue = event.target.checked;

        // 設定を保存
        await chrome.storage.sync.set({ hideAddress: newValue });

        // ページをリロード
        chrome.tabs.reload(tab.id);
      });
    });
  }
});

// ホスト名からTLDを抽出する関数
function getTLD(hostname) {
  const parts = hostname.split('.');
  if (parts[0] !== "www" || parts[1] !== "amazon") return false;
  const len = parts.length;

  // `co.jp` などの複合TLDに対応する
  if (len > 1 && (parts[len - 2] === "co" || parts[len - 2] === "com")) {
    return '.' + parts[len - 2] + '.' + parts[len - 1];
  }

  // `.com` の場合は空文字を返す
  if (parts[len - 1] === "com") {
    return '';
  }

  return '.' + parts[len - 1];
}
