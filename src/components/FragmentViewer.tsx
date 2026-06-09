import React from 'react';

type Props = {
  url: string;
  mimeType?: string;
  alt?: string;
  className?: string;
};

const TRUSTED_EMBED_HOSTS = [
  'youtube.com',
  'youtu.be',
  'vimeo.com',
];

const TRUSTED_IMAGE_HOSTS = [
  'images.unsplash.com',
  'i.imgur.com',
  'imgur.com',
  'drive.google.com',
  'dl.dropboxusercontent.com',
  'dropbox.com',
  'images.pexels.com',
  'cdn.pixabay.com',
  'res.cloudinary.com',
  'lh3.googleusercontent.com',
  'blogger.googleusercontent.com',
  'raw.githubusercontent.com',
];

const IMAGE_EXTENSION_PATTERN = /\.(avif|bmp|gif|jpe?g|png|svg|webp)(?:$|[?#])/i;

function getHostname(u: string) {
  try {
    return new URL(u).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function hostMatches(hostname: string, domains: string[]) {
  return domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

function isImageUrl(u: string) {
  try {
    const url = new URL(u);
    const formatHint = url.searchParams.get('fm')
      ?? url.searchParams.get('format')
      ?? url.searchParams.get('type')
      ?? url.searchParams.get('content-type')
      ?? url.searchParams.get('content_type');

    return IMAGE_EXTENSION_PATTERN.test(`${url.pathname}${url.search}${url.hash}`)
      || Boolean(formatHint?.toLowerCase().startsWith('image/'))
      || /^(avif|bmp|gif|jpe?g|png|svg|webp)$/i.test(formatHint ?? '');
  } catch {
    return IMAGE_EXTENSION_PATTERN.test(u);
  }
}

function normalizeImageUrl(u: string) {
  try {
    const url = new URL(u);
    const hostname = url.hostname.replace(/^www\./, '');

    if (!['http:', 'https:'].includes(url.protocol)) return null;

    if (hostname === 'github.com' && url.pathname.includes('/blob/')) {
      const parts = url.pathname.split('/').filter(Boolean);
      const blobIndex = parts.indexOf('blob');
      if (parts.length > blobIndex + 2) {
        const [owner, repo] = parts;
        const ref = parts[blobIndex + 1];
        const path = parts.slice(blobIndex + 2).join('/');
        return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`;
      }
    }

    if (hostname === 'imgur.com' || hostname === 'm.imgur.com') {
      const [firstPathPart] = url.pathname.split('/').filter(Boolean);
      const isGalleryOrAlbum = url.pathname.startsWith('/a/') || url.pathname.startsWith('/gallery/');
      if (firstPathPart && !isGalleryOrAlbum) {
        const imageId = firstPathPart.replace(/\.(avif|bmp|gif|jpe?g|png|svg|webp)$/i, '');
        return `https://i.imgur.com/${imageId}.jpg`;
      }
    }

    if (hostname === 'drive.google.com') {
      const fileId = url.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ?? url.searchParams.get('id');
      if (fileId) return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }

    if (hostname === 'dropbox.com') {
      url.hostname = 'dl.dropboxusercontent.com';
      url.search = '';
      return url.toString();
    }

    if (isImageUrl(url.toString()) || hostMatches(hostname, TRUSTED_IMAGE_HOSTS)) return url.toString();

    return null;
  } catch {
    return null;
  }
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
  const imageUrl = normalizeImageUrl(url);
  const isImage = Boolean(imageUrl) || Boolean(mimeType?.startsWith('image/'));
  const allowedEmbed = hostMatches(hostname, TRUSTED_EMBED_HOSTS);

  if (!isImage && !allowedEmbed) {
    return (
      <div className={className}>
        <p>Fonte nao suportada para embed: {hostname || 'URL invalida'}</p>
        <p>Use uma imagem publica direta ou um link compativel de YouTube/Vimeo.</p>
      </div>
    );
  }

  if (isImage) {
    return (
      <img
        src={imageUrl ?? url}
        alt={alt || 'imagem'}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        className={className}
      />
    );
  }

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

  return null;
};

export default FragmentViewer;
