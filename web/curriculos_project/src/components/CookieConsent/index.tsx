import { useState } from 'react';
import {
  CookieActions,
  CookieBanner,
  CookieButton,
  CookieContent,
  CookieText,
  CookieTitle,
} from './styles';

const COOKIE_CONSENT_STORAGE_KEY = 'cookie_consent';
const COOKIE_CONSENT_VERSION = '2026-08-19';

type ConsentChoice = 'accepted' | 'rejected';

function getStoredConsent() {
  try {
    return localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(() => {
    const storedConsent = getStoredConsent();
    return storedConsent !== `${COOKIE_CONSENT_VERSION}:accepted`
      && storedConsent !== `${COOKIE_CONSENT_VERSION}:rejected`;
  });

  function saveChoice(choice: ConsentChoice) {
    try {
      localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, `${COOKIE_CONSENT_VERSION}:${choice}`);
    } catch {
      // The banner can still be dismissed if browser storage is unavailable.
    }

    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <CookieBanner role="region" aria-label="Consentimento de cookies">
      <CookieContent>
        <CookieTitle>Cookies essenciais</CookieTitle>
        <CookieText>
          Usamos cookies de sessão para manter seu acesso seguro e permitir o login.
          Não usamos cookies de publicidade ou rastreamento.
          Se você recusar, as áreas que exigem autenticação poderão não funcionar.
        </CookieText>
      </CookieContent>

      <CookieActions>
        <CookieButton type="button" $secondary onClick={() => saveChoice('rejected')}>
          Recusar
        </CookieButton>
        <CookieButton type="button" onClick={() => saveChoice('accepted')}>
          Aceitar cookies
        </CookieButton>
      </CookieActions>
    </CookieBanner>
  );
}
