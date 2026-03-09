<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Button from '$lib/components/ui/button/index.js';
	import * as Badge from '$lib/components/ui/badge/index.js';

	import { useSidebar } from '$lib/components/ui/sidebar';
	import { authClient } from '$lib/auth-client';
	import { toast } from 'svelte-sonner';
	import {
		MonitorIcon,
		SmartphoneIcon,
		TabletSmartphoneIcon,
		TvIcon,
		WatchIcon,
		GlobeIcon,
		RefreshCwIcon
	} from '@lucide/svelte';
	import { UAParser } from 'ua-parser-js';

	let { open = $bindable() }: { open: boolean } = $props();

	const sidebar = useSidebar();

	type SessionItem = {
		id?: string;
		token?: string;
		createdAt?: number | string | Date;
		updatedAt?: number | string | Date;
		expiresAt?: number | string | Date;
		ipAddress?: string | null;
		userAgent?: string | null;
	};

	type ParsedSession = SessionItem & {
		parsed: {
			browser: string;
			os: string;
			deviceType: string | undefined;
			deviceLabel: string;
		};
	};

	let sessions = $state<ParsedSession[]>([]);
	let loading = $state(false);
	let loadedOnce = $state(false);
	let revoking = $state<Record<string, boolean>>({});
	let revokeConfirmOpen = $state(false);
	let pendingSession = $state<ParsedSession | null>(null);
	let currentSessionToken = $state<string | null>(null);

	function parseSession(session: SessionItem): ParsedSession {
		const ua = new UAParser(session.userAgent ?? '');
		const browser = ua.getBrowser();
		const os = ua.getOS();
		const device = ua.getDevice();

		const browserStr = [browser.name, browser.major].filter(Boolean).join(' ');
		const osStr = [os.name, os.version].filter(Boolean).join(' ');

		let deviceLabel = 'Unknown device';
		if (browserStr && osStr) {
			deviceLabel = `${browserStr} on ${osStr}`;
		} else if (browserStr) {
			deviceLabel = browserStr;
		} else if (osStr) {
			deviceLabel = osStr;
		}

		return {
			...session,
			parsed: {
				browser: browserStr,
				os: osStr,
				deviceType: device.type,
				deviceLabel
			}
		};
	}

	async function loadSessions() {
		loading = true;
		try {
			const [
				{ data: sessionsData, error: sessionsError },
				{ data: currentSessionData, error: currentSessionError }
			] = await Promise.all([authClient.listSessions(), authClient.getSession()]);

			if (sessionsError) throw sessionsError;
			if (currentSessionError) throw currentSessionError;

			const raw = (sessionsData ?? []) as SessionItem[];
			sessions = raw.map(parseSession);
			currentSessionToken = currentSessionData?.session?.token ?? null;
			loadedOnce = true;
		} catch (err) {
			toast.error('Failed to load sessions');
			console.error(err);
		} finally {
			loading = false;
		}
	}

	function isCurrentSession(session: ParsedSession) {
		return !!session.token && !!currentSessionToken && session.token === currentSessionToken;
	}

	function requestRevokeSession(session: ParsedSession) {
		if (isCurrentSession(session)) return;
		pendingSession = session;
		revokeConfirmOpen = true;
	}

	async function confirmRevokeSession() {
		const session = pendingSession;
		if (!session) return;

		const id = session.id ?? session.token;
		if (!id) {
			revokeConfirmOpen = false;
			pendingSession = null;
			return;
		}

		revoking = { ...revoking, [id]: true };

		if (!session.token) {
			revoking = { ...revoking, [id]: false };
			toast.error('Cannot revoke session without token');
			revokeConfirmOpen = false;
			pendingSession = null;
			return;
		}

		try {
			await toast.promise(
				authClient
					.revokeSession({
						token: session.token
					})
					.then(({ error }) => {
						if (error) throw error;
						sessions = sessions.filter((s) => (s.id ?? s.token) !== id);
					}),
				{
					loading: 'Revoking session...',
					success: 'Session revoked',
					error: 'Failed to revoke session'
				}
			);
		} catch (err) {
			console.error(err);
		} finally {
			revoking = { ...revoking, [id]: false };
			revokeConfirmOpen = false;
			pendingSession = null;
		}
	}

	function formatDate(value: SessionItem['createdAt']) {
		if (!value) return 'Unknown';
		const date =
			value instanceof Date ? value : new Date(typeof value === 'string' ? value : Number(value));
		if (Number.isNaN(date.getTime())) return 'Unknown';
		return new Intl.DateTimeFormat(undefined, {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	}

	function getDeviceIcon(deviceType: string | undefined) {
		switch (deviceType) {
			case 'mobile':
				return SmartphoneIcon;
			case 'tablet':
				return TabletSmartphoneIcon;
			case 'smarttv':
				return TvIcon;
			case 'wearable':
				return WatchIcon;
			case 'console':
			case 'embedded':
				return GlobeIcon;
			default:
				return MonitorIcon;
		}
	}

	$effect(() => {
		if (open && !loadedOnce) {
			void loadSessions();
		}
	});
</script>

{#snippet SessionList()}
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<p class="text-xs text-muted-foreground">Devices signed in to your account.</p>
			<Button.Root
				variant="ghost"
				size="icon"
				class="size-7"
				onclick={() => void loadSessions()}
				disabled={loading}
			>
				<RefreshCwIcon class="size-3.5 {loading ? 'animate-spin' : ''}" />
			</Button.Root>
		</div>

		{#if loading && sessions.length === 0}
			<div class="py-8 text-center text-sm text-muted-foreground">Loading sessions…</div>
		{:else if sessions.length === 0}
			<div class="py-8 text-center text-sm text-muted-foreground">No sessions found.</div>
		{:else}
			<div class="space-y-1">
				{#each sessions as session ((session.id ?? session.token) || Math.random())}
					{@const isCurrent = isCurrentSession(session)}
					{@const DeviceIcon = getDeviceIcon(session.parsed.deviceType)}
					{@const sessionId = session.id ?? session.token ?? ''}
					<div
						class="group flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors {isCurrent
							? 'border-primary/20 bg-primary/5'
							: 'hover:bg-muted/50'}"
					>
						<div class="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
							<DeviceIcon class="size-4 text-muted-foreground" />
						</div>

						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-2">
								<span class="truncate text-sm font-medium">
									{session.parsed.deviceLabel}
								</span>
								{#if isCurrent}
									<Badge.Badge variant="secondary" class="shrink-0 px-1.5 py-0 text-[10px]"
										>This device</Badge.Badge
									>
								{/if}
							</div>
							<div class="flex items-center gap-1.5 text-xs text-muted-foreground">
								<span>{session.ipAddress || 'Unknown IP'}</span>
								<span>·</span>
								<span>{formatDate(session.createdAt)}</span>
							</div>
						</div>

						{#if !isCurrent}
							<Button.Root
								variant="destructive"
								size="sm"
								disabled={revoking[sessionId]}
								onclick={() => requestRevokeSession(session)}
							>
								{revoking[sessionId] ? 'Revoking…' : 'Revoke'}
							</Button.Root>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/snippet}

{#if sidebar.isMobile}
	<Drawer.Root bind:open>
		<Drawer.Content>
			<Drawer.Header>
				<Drawer.Title>Sessions</Drawer.Title>
				<Drawer.Description class="sr-only">Manage your active sessions.</Drawer.Description>
			</Drawer.Header>
			<div class="px-4 pb-4">
				{@render SessionList()}
			</div>
		</Drawer.Content>
	</Drawer.Root>
{:else}
	<Dialog.Root bind:open>
		<Dialog.Content class="sm:max-w-lg">
			<Dialog.Header>
				<Dialog.Title>Sessions</Dialog.Title>
				<Dialog.Description class="sr-only">Manage your active sessions.</Dialog.Description>
			</Dialog.Header>
			{@render SessionList()}
		</Dialog.Content>
	</Dialog.Root>
{/if}

<AlertDialog.Root bind:open={revokeConfirmOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Revoke session?</AlertDialog.Title>
			<AlertDialog.Description>
				This will immediately sign out this session.
				{#if pendingSession}
					{@const DeviceIcon = getDeviceIcon(pendingSession.parsed.deviceType)}
					<span
						class="mt-2 flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm text-foreground"
					>
						<DeviceIcon class="size-4 shrink-0 text-muted-foreground" />
						<span class="min-w-0">
							<span class="block truncate font-medium">{pendingSession.parsed.deviceLabel}</span>
							<span class="block text-xs text-muted-foreground"
								>{pendingSession.ipAddress || 'Unknown IP'}</span
							>
						</span>
					</span>
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={() => void confirmRevokeSession()}>Revoke</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
