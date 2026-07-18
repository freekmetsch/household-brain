import { getContext, setContext } from 'svelte';
import type { ChatAgentController } from '$lib/stores/chat-agent.svelte';

const CHAT_AGENT_CONTEXT = Symbol('chat-agent-controller');

export type ChatAgentContextValue = {
	readonly controller: ChatAgentController | null;
};

/**
 * The context value is a stable holder rather than one controller instance.
 * SvelteKit can retain the root layout while authentication data changes; the
 * holder lets that layout replace/destroy the controller without leaving newly
 * rendered child routes attached to a missing or stale user session.
 */
export function provideChatAgent(context: ChatAgentContextValue): void {
	setContext(CHAT_AGENT_CONTEXT, context);
}

export function useChatAgent(): ChatAgentController {
	const controller = getContext<ChatAgentContextValue | undefined>(CHAT_AGENT_CONTEXT)?.controller;
	if (!controller) throw new Error('Chat agent controller is unavailable');
	return controller;
}
