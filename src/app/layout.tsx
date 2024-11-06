import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { env } from '@/core/config/env';
import { Root } from '@/components/Root/Root';
import { interTight, spaceGrotesk } from '@/lib/fonts'

import '@telegram-apps/telegram-ui/dist/styles.css';
import 'normalize.css/normalize.css';
import './_assets/globals.css';

export const metadata: Metadata = {
  title: '[burn event] Sense x Guardians',
  description: 'Sense x Guardians burn event', 
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  other: {
    'next-loading': 'disable'
  }
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={`${interTight.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="preconnect" href="https://tonapi.io" />
        <link rel="preconnect" href="https://cache.tonapi.io" />
        <link rel="preconnect" href="https://sense.mypinata.cloud" />
        
        <link rel="dns-prefetch" href="https://tonapi.io" />
        <link rel="dns-prefetch" href="https://cache.tonapi.io" />
        <link rel="dns-prefetch" href="https://sense.mypinata.cloud" />
      </head>
      <body>
        <Root>
          {children}
        </Root>
      </body>
    </html>
  );
}
