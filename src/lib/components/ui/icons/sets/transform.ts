// Path transform for scene composition: uniform scale + translate applied to
// SVG path data, so one silhouette library can be framed, shrunk, or shadowed
// per set without redrawing. Handles the full command grammar the icon
// geometry uses (absolute + relative, implicit repeats, arcs). Uniform scale
// only — arcs stay valid because rx/ry scale together.

const ARITY: Record<string, number> = {
	M: 2, L: 2, T: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, A: 7, Z: 0
};

const NUM = /-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/gi;

const fmt = (n: number) => {
	const r = Math.round(n * 100) / 100;
	return Object.is(r, -0) ? '0' : String(r);
};

/** Apply x' = s·x + dx, y' = s·y + dy to a path's coordinates. */
export function transformPath(d: string, s: number, dx: number, dy: number): string {
	const out: string[] = [];
	const re = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(d)) !== null) {
		const cmd = m[1];
		const abs = cmd === cmd.toUpperCase();
		const arity = ARITY[cmd.toUpperCase()];
		const nums = (m[2].match(NUM) ?? []).map(Number);
		if (arity === 0) {
			out.push(cmd);
			continue;
		}
		const groups: string[] = [];
		for (let i = 0; i + arity <= nums.length; i += arity) {
			const g = nums.slice(i, i + arity);
			let t: number[];
			switch (cmd.toUpperCase()) {
				case 'H':
					t = [abs ? g[0] * s + dx : g[0] * s];
					break;
				case 'V':
					t = [abs ? g[0] * s + dy : g[0] * s];
					break;
				case 'A':
					// rx ry rot large-arc sweep x y
					t = [
						g[0] * s,
						g[1] * s,
						g[2],
						g[3],
						g[4],
						abs ? g[5] * s + dx : g[5] * s,
						abs ? g[6] * s + dy : g[6] * s
					];
					break;
				default: {
					// Pure coordinate pairs (M/L/T/C/S/Q).
					t = g.map((v, j) => (abs ? (j % 2 === 0 ? v * s + dx : v * s + dy) : v * s));
				}
			}
			groups.push(t.map(fmt).join(' '));
		}
		out.push(cmd + groups.join(' '));
	}
	return out.join('');
}

/** Darken (f < 1) or lighten-toward-white (f > 1 is invalid — use `tint`). */
export const shade = (hex: string, f: number): string => {
	const n = parseInt(hex.slice(1), 16);
	const c = (v: number) => Math.round(Math.min(255, Math.max(0, v * f)));
	return (
		'#' +
		[c(n >> 16), c((n >> 8) & 255), c(n & 255)]
			.map((v) => v.toString(16).padStart(2, '0'))
			.join('')
	);
};

/** Mix a colour toward white by t (0..1). */
export const tint = (hex: string, t: number): string => {
	const n = parseInt(hex.slice(1), 16);
	const c = (v: number) => Math.round(v + (255 - v) * t);
	return (
		'#' +
		[c(n >> 16), c((n >> 8) & 255), c(n & 255)]
			.map((v) => v.toString(16).padStart(2, '0'))
			.join('')
	);
};
