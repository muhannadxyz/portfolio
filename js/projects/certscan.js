// CertScan Project Data

window.CertScanProject = {
  slug: 'certscan',
  name: 'CertScan',
  title: 'CertScan',
  company: 'PKI & Trust Infrastructure',
  logo: '🔒',
  icon: '🔒',
  thumb: 'images/certscan.png',
  tagline: "Check a domain's SSL/TLS certificate health using Certificate Transparency data.",
  description: "CertScan is a certificate risk scanner that checks any domain's SSL/TLS certificate health using Certificate Transparency data from crt.sh. Enter a domain and it surfaces the certificate's common name, issuer, issue and expiry dates, and days remaining, then classifies the domain's risk level so you know at a glance whether a certificate needs attention. It also pulls a full subdomain inventory discovered through Certificate Transparency logs, each with one-click copy and a direct link, useful for mapping out an organization's exposed surface. Built while starting a PKI-focused internship at Keyfactor, as a way to get hands-on with how certificate transparency and trust infrastructure actually work.",
  overview: "A certificate risk scanner that checks a domain's SSL/TLS health via Certificate Transparency data: issuer, expiry, days remaining, risk classification, and a full subdomain inventory pulled from crt.sh.",
  role: 'Full-Stack Development',
  link: 'https://cert-scanner.vercel.app/',
  links: [
    { label: 'Visit site', url: 'https://cert-scanner.vercel.app/' }
  ],
  stack: [
    'JavaScript',
    'Next.js',
    'Certificate Transparency (crt.sh)',
    'SSL/TLS',
    'PKI',
    'Risk Scoring',
    'Vercel'
  ],
  highlights: [
    "Scans any domain's SSL/TLS certificate via Certificate Transparency data from crt.sh, surfacing issuer, issue/expiry dates, and days remaining.",
    'Classifies certificate risk so expiring, expired, or self-signed certificates are visible at a glance.',
    'Pulls a full subdomain inventory from Certificate Transparency logs, each with one-click copy and a direct link.'
  ],
  gallery: ['images/certscan.png', 'images/certscan-landing.png']
};
