# Sécurité email (DNS) — SPF / DKIM / DMARC

Ce dépôt ne peut pas corriger SPF, DKIM ou DMARC via du code Next.js/Vercel.

- SPF, DKIM et DMARC se configurent dans la zone DNS du **domaine officiel** (ex: `chantierpro.com`).
- Sur un sous-domaine `*.vercel.app`, la configuration DNS ne dépend pas de ce repo.

## À faire quand le domaine officiel sera connecté

- SPF (TXT) : autoriser les serveurs d’envoi (selon le fournisseur email).
- DKIM (TXT) : ajouter les enregistrements DKIM fournis par le fournisseur email / Resend.
- DMARC (TXT) : définir une politique de contrôle (p=none/quarantine/reject) et une adresse de reporting.

## Remarque

Ces changements ne doivent pas impacter le code ni les variables d’environnement d’envoi d’emails.
