import React from 'react';

type Props = {
  url: string;
  mimeType?: string;
  alt?: string;
  className?: string;
};

const WHITELIST = [
  'youtube.com',
  'youtu.be',
  'vimeo.com',
  'imgur.com',
  'i.imgur.com',
];

function getHostname(u: string) {
  try {
    return new URL(u).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function isImageUrl(u: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(u);
}

function extractYouTubeEmbed(u: string) {
  try {
    const url = new URL(u);
    if (url.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${url.pathname.slice(1)}`;
    if (url.searchParams.has('v')) return `https://www.youtube.com/embed/${url.searchParams.get('v')}`;
    if (url.pathname.startsWith('/embed/')) return u;
    return u;
  } catch {
    return u;
  }
}

const FragmentViewer: React.FC<Props> = ({ url, mimeType, alt, className }) => {
  const hostname = getHostname(url);
  const allowed = WHITELIST.some((d) => hostname.endsWith(d));

  if (!allowed) {
    return (
      <div className={className}>
        <p>Fonte não suportada para embed: {hostname || 'URL inválida'}</p>
        <p>Se necessário, forneça um link de visualização compatível.</p>
      </div>
    );
  }

  // Image
  if (isImageUrl(url) || (mimeType && mimeType.startsWith('image/')) || hostname.endsWith('imgur.com')) {
    return (
      <img
        src={url}
        alt={alt || 'imagem'}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        className={className}
      />
    );
  }

  // YouTube
  if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
    const embed = extractYouTubeEmbed(url);
    return (
      <div className={className}>
        <iframe
          src={embed}
          title="YouTube video"
          width="100%"
          height="100%"
          className="w-full h-full"
          frameBorder="0"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Vimeo
  if (hostname.includes('vimeo.com')) {
    const id = url.split('/').pop() || url;
    const embed = `https://player.vimeo.com/video/${id}`;
    return (
      <div className={className}>
        <iframe
          src={embed}
          title="Vimeo video"
          width="560"
          height="315"
          frameBorder="0"
          sandbox="allow-same-origin allow-forms allow-popups"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Fallback: attempt generic iframe embed
  return (
    <div className={className}>
      <iframe
        src={url}
        title="embedded content"
        width="100%"
        height={400}
        frameBorder="0"
        sandbox="allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
};

export default FragmentViewer;
