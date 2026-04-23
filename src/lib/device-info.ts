/**
 * Captura metadados do dispositivo/navegador no momento de uma ação crítica
 * (ex: criação de ordem). Usado para trilha de auditoria.
 *
 * IP é capturado server-side (request headers), não daqui.
 */
import type { AuditMeta } from "./domain/types";

function detectBrowser(ua: string): string {
  if (/Edg\//.test(ua)) return "Edge";
  if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua) && !/Chrome/.test(ua)) return "Safari";
  if (/OPR\//.test(ua)) return "Opera";
  return "Outro";
}

function detectOS(ua: string): string {
  if (/Windows NT 10/.test(ua)) return "Windows 10/11";
  if (/Windows NT/.test(ua)) return "Windows";
  if (/Mac OS X/.test(ua)) return "macOS";
  if (/Android/.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Desconhecido";
}

function detectDevice(ua: string): string {
  if (/iPad/.test(ua)) return "Tablet (iPad)";
  if (/Android/.test(ua) && /Mobile/.test(ua)) return "Mobile (Android)";
  if (/Android/.test(ua)) return "Tablet (Android)";
  if (/iPhone/.test(ua)) return "Mobile (iPhone)";
  if (/Mobile/.test(ua)) return "Mobile";
  return "Desktop";
}

/** Coleta metadados client-side. IP deve ser preenchido server-side. */
export function collectClientAuditMeta(): Omit<AuditMeta, "ip"> {
  if (typeof navigator === "undefined") {
    return { user_agent: null, os: null, browser: null, device: null };
  }
  const ua = navigator.userAgent;
  return {
    user_agent: ua,
    os: detectOS(ua),
    browser: detectBrowser(ua),
    device: detectDevice(ua),
  };
}
