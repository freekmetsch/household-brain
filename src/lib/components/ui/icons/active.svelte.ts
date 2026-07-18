// Active icon set — a tiny rune store so every <Icon> (and the Spinner's pot)
// re-renders the moment a different set is applied from /design/icons. The
// choice persists per-device in localStorage; SSR renders the default set and
// the client corrects on hydration (icon geometry only, layout is identical).

import { browser } from '$app/environment';
import { DEFAULT_ICON_SET, ICON_SETS, isIconSetId, type IconSetId } from './sets';

const STORAGE_KEY = 'kb.iconSet';

function initial(): IconSetId {
	if (browser) {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (isIconSetId(stored)) return stored;
	}
	return DEFAULT_ICON_SET;
}

let current = $state<IconSetId>(initial());

export const iconSet = {
	get id(): IconSetId {
		return current;
	},
	get icons() {
		return ICON_SETS[current].icons;
	},
	set(id: IconSetId) {
		current = id;
		if (browser) localStorage.setItem(STORAGE_KEY, id);
	}
};
