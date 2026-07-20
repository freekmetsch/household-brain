export type RecipeSourceLink = { href: string; host: string };

export function parseRecipeSource(sourceUrl: string | null | undefined): RecipeSourceLink | null {
	if (!sourceUrl) return null;
	try {
		const url = new URL(sourceUrl);
		if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
		return { href: url.href, host: url.hostname.replace(/^www\./, '') };
	} catch {
		return null;
	}
}
