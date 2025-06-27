import type { MetadataRoute } from 'next'

const baseUrl = 'http://ai-agent-playground-demo.vercel.app/';
const baseImage = 'https://ai-agent-playground-demo.vercel.app/logo.png';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Helper to escape & in URLs for XML
    function escapeXmlUrl(url: string) {
        return url.replace(/&/g, '&amp;');
    }

    const staticRoutes = [
        {
            url: escapeXmlUrl(`${baseUrl}`),
            lastModified: new Date(),
            priority: 1,
            images: [escapeXmlUrl(baseImage)]
        },
        {
            url: escapeXmlUrl(`${baseUrl}settings`),
            lastModified: new Date(),
            priority: 1,
            images: [escapeXmlUrl(baseImage)]
        },
        {
            url: escapeXmlUrl(`${baseUrl}rest`),
            lastModified: new Date(),
            priority: 1,
            images: [escapeXmlUrl(baseImage)]
        },
        {
            url: escapeXmlUrl(`${baseUrl}webhook`),
            lastModified: new Date(),
            priority: 1,
            images: [escapeXmlUrl(baseImage)]
        }
    ];

    return staticRoutes;
}