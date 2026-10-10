import { spawn } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME_PATH = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE_URL = "http://localhost:8080";
const OUTPUT_DIR = "screenshots";

mkdirSync(OUTPUT_DIR, { recursive: true });

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.msgId = 1;
    this.callbacks = new Map();
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && this.callbacks.has(data.id)) {
        const { resolve, reject } = this.callbacks.get(data.id);
        this.callbacks.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
  }

  async ready() {
    if (this.ws.readyState === WebSocket.OPEN) return;
    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
    });
  }

  send(method, params = {}) {
    const id = this.msgId++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function capture() {
  const tempDir = mkdtempSync(join(tmpdir(), "chrome-ss-"));
  const chrome = spawn(CHROME_PATH, [
    "--headless=new",
    "--remote-debugging-port=9222",
    "--disable-gpu",
    `--user-data-dir=${tempDir}`,
    "--no-first-run",
    "about:blank",
  ]);

  await sleep(1500);

  const listRes = await fetch("http://localhost:9222/json/list");
  const list = await listRes.json();
  const pageTarget = list.find((t) => t.type === "page") || list[0];
  if (!pageTarget) throw new Error("No page target found in Chrome");

  const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await cdp.ready();
  await cdp.send("Page.enable");
  await cdp.send("DOM.enable");
  await cdp.send("Runtime.enable");

  // Helper to capture a specific element or viewport
  async function takeShot(filename, { width, height, selector, deviceScale = 1 }) {
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: deviceScale,
      mobile: width < 768,
    });

    if (selector) {
      await cdp.send("Runtime.evaluate", {
        expression: `
          const el = document.querySelector("${selector}");
          if (el) {
            el.scrollIntoView({ block: "start", inline: "nearest" });
          }
        `,
      });
      await sleep(600);
    } else {
      await cdp.send("Runtime.evaluate", {
        expression: `window.scrollTo(0, 0);`,
      });
      await sleep(600);
    }

    // Force animations into stable visible state for crystal clear render
    await cdp.send("Runtime.evaluate", {
      expression: `
        document.querySelectorAll(".reveal").forEach(el => el.classList.add("is-revealed"));
      `,
    });
    await sleep(200);

    const { data } = await cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });

    const buf = Buffer.from(data, "base64");
    writeFileSync(join(OUTPUT_DIR, filename), buf);
    console.log(`Saved ${filename} (${buf.length} bytes, ${width}x${height})`);
  }

  // 1. Live view (dev server with .env GITHUB_TOKEN)
  await cdp.send("Page.navigate", { url: BASE_URL });
  await sleep(2000);

  // Desktop (1440x900)
  await takeShot("hero-1440.png", { width: 1440, height: 900, selector: "#top" });
  await takeShot("work-1440.png", { width: 1440, height: 1100, selector: "#work" });
  await takeShot("open-source-live-1440.png", {
    width: 1440,
    height: 950,
    selector: "#open-source",
  });
  await takeShot("lab-1440.png", { width: 1440, height: 900, selector: "#lab" });

  // Mobile (390x844)
  await takeShot("hero-390.png", { width: 390, height: 844, selector: "#top" });
  await takeShot("work-390.png", { width: 390, height: 900, selector: "#work" });
  await takeShot("open-source-live-390.png", { width: 390, height: 900, selector: "#open-source" });
  await takeShot("lab-390.png", { width: 390, height: 900, selector: "#lab" });

  cdp.close();
  chrome.kill();
  console.log("Initial live screenshots captured successfully.");
}

capture().catch((e) => {
  console.error("Capture failed:", e);
  process.exit(1);
});
